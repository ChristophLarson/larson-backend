import { AppDataSource } from "./data-source";
import { Receipt } from "./items/entities/receipt.entity";

export async function seedDatabase() {
  // Initialize the data source (connect to the database)
  await AppDataSource.initialize();

  const receiptRepository = AppDataSource.getRepository(Receipt);

  // Create the Receipt
  const receipt = new Receipt();
  receipt.retailer = "Target";
  receipt.purchaseDate = "2022-01-01";
  receipt.purchaseTime = "13:01";
  receipt.total = "35.35";

  // Create Receipt Items
  const items = [
    { shortDescription: "Mountain Dew 12PK", price: "6.49" },
    { shortDescription: "Emils Cheese Pizza", price: "12.25" },
    { shortDescription: "Knorr Creamy Chicken", price: "1.26" },
    { shortDescription: "Doritos Nacho Cheese", price: "3.35" },
    { shortDescription: "   Klarbrunn 12-PK 12 FL OZ  ", price: "12.00" },
  ];

  receipt.items = items.map((itemData) => {
    const item = new ReceiptItem();
    item.shortDescription = itemData.shortDescription.trim();
    item.price = itemData.price;
    return item;
  });

  await receiptRepository.save(receipt);

  console.log("Database seeded with sample receipt!");
}
