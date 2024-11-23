import { DataSource } from "typeorm";
import { Receipt } from "./receipt/entities/receipt.entity";
import { ReceiptItem } from "./receipt/entities/receipt-item.entity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  synchronize: true,
  logging: false,
  entities: [Receipt, ReceiptItem],
});
