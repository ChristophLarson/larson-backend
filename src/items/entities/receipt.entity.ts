
import { Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Receipt {
  @Column()
  id: string;

  @Column()
  retailer: string;

  @Column()
  purchaseDate: string;

  @Column()
  purchaseTime: string;

  @Column()
  total: string;
}
