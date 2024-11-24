import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ReceiptService } from './receipt.service';

@Controller('receipt')
export class ReceiptController {
  private receipt: Record<string, any> = {};
  constructor(private readonly receiptService: ReceiptService) {}

  @Post('/process')
  async processReceipt(@Body() receipt: any) {
    const id = await this.receiptService.processReceipt(receipt);
    return { id };
  }

  @Get('/:id/points')
  async getPoints(@Param('id') id: string): Promise<{points: number}> {
    try {
      const points = await this.receiptService.calculatePoints(id);
      return { points };
    } catch (error) {
      throw new Error(`Error calculating points: ${error}`);
    }
  }
}
