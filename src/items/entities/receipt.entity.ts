import { Entity, Column, OneToMany } from "typeorm";
import { ReceiptItem } from "./receipt-item.entity";

@Entity()
export class Receipt {
  @Column()
  id!: string;

  @Column()
  retailer!: string;

  @Column()
  purchaseDate!: string;

  @Column()
  purchaseTime!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  total!: string;

  @OneToMany(() => ReceiptItem, (item) => item.receipt, { cascade: true })
  items!: ReceiptItem[];
}
