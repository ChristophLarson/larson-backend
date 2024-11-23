import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReceiptModule } from './receipt/receipt.module';
import { Receipt } from './receipt/entities/receipt.entity';
import { ReceiptItem } from './receipt/entities/receipt-item.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: 'sqlite',
        database: 'data/db.sqlite',
        entities: [Receipt, ReceiptItem],
        synchronize: true,
    }),
    ReceiptModule,
  ],
})
export class AppModule {}
