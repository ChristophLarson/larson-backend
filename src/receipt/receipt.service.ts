import { Injectable } from '@nestjs/common';
import { Receipt } from './entities/receipt.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ReceiptService {

  /*
    Takes a receipt object and returns the id of a receipt
  */
  processReceipt(receipt: Receipt): string {
    return "test";
  }

  /*
    Takes the alphanumeric string id of a receipt and calculates its points
  */
  calculatePoints(id: string): number {
    return 123;
  }
}
