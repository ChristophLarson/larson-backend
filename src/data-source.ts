import { DataSource } from "typeorm";
import { Receipt } from "./items/entities/receipt.entity";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: ":memory:",
  synchronize: true,
  logging: false,
  entities: [Receipt],
});
