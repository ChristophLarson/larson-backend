import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Receipt } from "./receipt.entity";

@Entity()
export class ReceiptItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  shortDescription!: string;

  @Column("decimal", { precision: 10, scale: 2 }) // Store prices as decimals
  price!: string;

  @ManyToOne(() => Receipt, (receipt) => receipt.items, { onDelete: "CASCADE" })
  receipt!: Receipt;
}
