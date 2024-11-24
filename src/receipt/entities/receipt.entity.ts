import { Entity, Column, OneToMany, PrimaryColumn } from "typeorm";
import { ReceiptItem } from "./receipt-item.entity";

@Entity()
export class Receipt {
  @PrimaryColumn()
  id!: string;

  @Column()
  retailer!: string;

  @Column()
  purchaseDate!: string;

  @Column()
  purchaseTime!: string;

  @Column()
  total!: string;

  @OneToMany(() => ReceiptItem, (item) => item.receipt, { cascade: true })
  items!: ReceiptItem[];
}
