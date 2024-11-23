import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Receipt } from "./entities/receipt.entity";
import { ReceiptItem } from "./entities/receipt-item.entity";
import { ReceiptService } from "./receipt.service";
import { ReceiptController } from "./receipt.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([Receipt, ReceiptItem])
  ],
  providers: [ReceiptService],
  controllers: [ReceiptController],
})
export class ReceiptModule {}
