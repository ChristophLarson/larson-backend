import { AppDataSource } from "./data-source";
import { DataSource } from "typeorm";
import { NestFactory } from '@nestjs/core';
import { AppModule } from "./app.module";
import { Receipt } from "./receipt/entities/receipt.entity";
import { ReceiptItem } from "./receipt/entities/receipt-item.entity";

export async function seedDatabase() {

  const app = await NestFactory.create(AppModule);

  const dataSource = app.get(DataSource);

  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const receiptRepository = AppDataSource.getRepository(Receipt);

  // Create the first Receipt (Target)
  const receipt1 = new Receipt();
  receipt1.retailer = "Target";
  receipt1.purchaseDate = "2022-01-01";
  receipt1.purchaseTime = "13:01";
  receipt1.total = "35.35";

  receipt1.items = [
    { shortDescription: "Mountain Dew 12PK", price: "6.49" },
    { shortDescription: "Emils Cheese Pizza", price: "12.25" },
    { shortDescription: "Knorr Creamy Chicken", price: "1.26" },
    { shortDescription: "Doritos Nacho Cheese", price: "3.35" },
    { shortDescription: "Klarbrunn 12-PK 12 FL OZ", price: "12.00" },
  ].map((itemData) => Object.assign(new ReceiptItem(), itemData));

  // Create the second Receipt (M&M Corner Market)
  const receipt2 = new Receipt();
  receipt2.retailer = "M&M Corner Market";
  receipt2.purchaseDate = "2022-03-20";
  receipt2.purchaseTime = "14:33";
  receipt2.total = "9.00";

  receipt2.items = [
    { shortDescription: "Gatorade", price: "2.25" },
    { shortDescription: "Gatorade", price: "2.25" },
    { shortDescription: "Gatorade", price: "2.25" },
    { shortDescription: "Gatorade", price: "2.25" },
  ].map((itemData) => Object.assign(new ReceiptItem(), itemData));

  // Save the Receipts and Items (cascade saves items automatically)
  await receiptRepository.save([receipt1, receipt2]);

  console.log("Database seeded");
}
