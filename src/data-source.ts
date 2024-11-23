import { DataSource } from "typeorm";
import { Receipt } from "./receipt/entities/receipt.entity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  synchronize: true,
  logging: false,
  entities: [Receipt],
});
