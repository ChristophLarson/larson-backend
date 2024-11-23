import { Injectable } from '@nestjs/common';
import { Receipt } from './entities/receipt.entity';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  process(receipt: Receipt): string {
    return "test";
  }
}
