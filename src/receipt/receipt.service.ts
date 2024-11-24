import { Injectable } from '@nestjs/common';
import { Receipt } from './entities/receipt.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ReceiptItem } from './entities/receipt-item.entity';

@Injectable()
export class ReceiptService {
  constructor(
    @InjectRepository(Receipt)
    private readonly receiptRepository: Repository<Receipt>,
  ) {}
  /*
    Takes a receipt object and returns the id of a receipt
  */
  async processReceipt(receipt: Receipt): Promise<string> {
    const id = uuidv4();
    receipt.id = id;
    await this.receiptRepository.save(receipt);
    return id;
  }

  /*
    Takes the alphanumeric string id of a receipt and calculates its points
  */
  async calculatePoints(id: string): Promise<number> {
    const receipt: Receipt | null = await this.receiptRepository.findOne({
      where:
      {id: id},
      relations: ['items'],
    });

    if(!receipt) {
      throw new Error(`Receipt with id ${id} not found.`);
    }
    let points = 0;

    points += this.calculatePointsFromRetailer(receipt.retailer);
    points += this.calculatePointsFromTotal(receipt.total);
    points += this.calculatePointsFromItemCount(receipt.items);
    points += this.calculatePointsFromDescriptions(receipt.items);
    points += this.calculatePointsFromDate(receipt.purchaseDate);
    points += this.calculatePointsFromPurchaseTime(receipt.purchaseTime);


    return points;
  }

  calculatePointsFromRetailer(retailer: string): number {
    const retailerAlphaNum = retailer.replace(/[^\dA-Z]+/gi,"");
    return retailerAlphaNum.length;
  }

  calculatePointsFromTotal(total: string): number {
    let points = 0;

    if(total) {

      const splitTotal = total.split(".");
      // If total is well-formed, the split should produce an array of size 2--dolars and cents
      if(splitTotal.length == 2) {
        
        if(splitTotal[1] == "00") {
          points += 50; // Add fifty pts for having no cents
        }
        
        switch (splitTotal[1]) {
          /*
          Add 25 pts for being multiple of .25. Could have included the .00 check above,
          but separating them may make future changes easier
          */
          case "00":
          case "25":
          case "50":
          case "75":
          points += 25;
          break;
        }
      } else {
        throw new Error('Receipt total amount format is invalid.');
      }
        return points;
    } else {
      throw new Error('Receipt total must be non-null.');
    }
  }

  calculatePointsFromItemCount(items: ReceiptItem[]): number {
    if(items && items?.length > 0) {
      let points = 0;

      // Add five points for every two items on the receipt
      points += 5 * Math.floor(items.length / 2);
      return points;
    } else {
      throw new Error('Receipt items list is null or empty.');
    }
  }

  calculatePointsFromDescriptions(items: ReceiptItem[]): number {

    if(items && items?.length > 0) {

      let points = 0;
      items.forEach( item => {
        /*
        If the trimmed length of the item description is a multiple of 3, 
        multiply the price by 0.2 and round up to the nearest integer. 
        The result is the number of points earned.
        */
        if((item.shortDescription.trim().length % 3) === 0) {
          points += Math.ceil(this.convertNumStringToNum(item.price) * 0.2);
        }
      });
      return points;
    } else {
      throw new Error('Receipt items list is null or empty.');
    }
  }

  calculatePointsFromDate(date: string): number {
    // Check if date is in format YYYY-MM-DD
    if (!isNaN(Date.parse(date))) {

      /*
        6 points if the day in the purchase date is odd.
      */
      const purchaseDate: number = this.convertNumStringToNum(date.slice(-2), false);
      if (purchaseDate % 2 !== 0) {
        return 6;
      } else {
        return 0;
      }
    } else {
      throw new Error('Receipt date format is invalid.');
    }
  }

  calculatePointsFromPurchaseTime(time: string): number {
    // A valid time string should have two sets of two chars, separated by a colon
    if(time) {
      const timeValidator = time.split(":");
      if(timeValidator.length === 2
        && timeValidator[0].length === 2 
        && timeValidator[1].length === 2) {

          const cleanedTime: number = this.convertNumStringToNum(time, false);
      
          // 10 points if purchase time is after 2PM and before 4PM
          if(cleanedTime > 1400 && cleanedTime < 1600) {
            return 10;
          } else {
            
            return 0;
          }
        } else {
          throw new Error('Receipt time format is invalid.')
        }
    } else {
      throw new Error('Receipt time format is null or undefined.');
    }
  }


  // A helper function to convert a string with two decimal points to type number
  convertNumStringToNum(numString: string, isDollar = true): number {
    // Remove non-numeric characters
    const cleanedString = numString.replace(/[\$,\s:]/g, "");

    let number = 0;
    if(isDollar) {
      number = parseFloat(cleanedString);
    } else {
      number = parseInt(cleanedString);
    }
    

    if (isNaN(number)) {
      throw new Error('Invalid dollar amount format.');
    }
    return number;
  }
}
