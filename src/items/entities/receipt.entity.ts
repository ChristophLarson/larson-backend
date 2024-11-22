
export class ReceiptItem {
    /**
     * Description of purchased item.
     */
    shortDescription: string;
  
    /**
     * Price of the item as a string.
     */
    price: string;
  
    constructor(shortDescription: string, price: string) {
      this.shortDescription = shortDescription.trim();
      this.price = price;
    }
  }
  export class Receipt {
    /**
     * The retailer
     */
    retailer: string;
  
    /**
     * Date of the purchase in YYYY-MM-DD format
     */
    purchaseDate: string;
  
    /**
     * Time of the purchase in HH:mm format.
     */
    purchaseTime: string;
  
    /**
     * List of purchased items.
     */
    items: ReceiptItem[];
  
    /**
     * Total amount of the purchase as a string.
     */
    total: string;
  
    constructor(
      retailer: string,
      purchaseDate: string,
      purchaseTime: string,
      items: ReceiptItem[],
      total: string
    ) {
      this.retailer = retailer;
      this.purchaseDate = purchaseDate;
      this.purchaseTime = purchaseTime;
      this.items = items;
      this.total = total;
    }
  }
  