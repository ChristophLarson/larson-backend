import { Test, TestingModule } from '@nestjs/testing';
import { ReceiptService } from './receipt.service';
import { Receipt } from './entities/receipt.entity';
import { ReceiptItem } from './entities/receipt-item.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('ReceiptService', () => {
  let service: ReceiptService;
  let receiptRepository: Repository<Receipt>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReceiptService,
        {
          provide: getRepositoryToken(Receipt),
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ReceiptService>(ReceiptService);
    receiptRepository = module.get<Repository<Receipt>>(getRepositoryToken(Receipt));
  });

  describe('calculatePoints', () => {
    it('should return the correct points for a valid receipt', async () => {
      const receipt: Receipt = {
        id: '1234',
        retailer: 'Target',
        purchaseDate: '2022-01-01',
        purchaseTime: '13:01',
        total: '35.35',
        items: [
          { id: 1, shortDescription: 'Mountain Dew 12PK', price: '6.49', receipt: {} as any},
          { id: 2, shortDescription: 'Emils Cheese Pizza', price: '12.25', receipt: {} as any },
        ],
      };

      jest.spyOn(receiptRepository, 'findOne').mockResolvedValue(receipt as any);

      const result = await service.calculatePoints('1234');
      expect(result).toBe(20); // Earns 20 points
    });

    it('should throw error when receipt not found', async () => {
      jest.spyOn(receiptRepository, 'findOne').mockResolvedValue(null);

      await expect(service.calculatePoints('invalid-id')).rejects.toThrowError('Receipt with id invalid-id not found.');
    });
  });

  describe('calculatePointsFromRetailer', () => {
    it('should return correct points based on retailer name', () => {
      const points = service.calculatePointsFromRetailer(' Ta rg et ');
      expect(points).toBe(6); // "Target" -> trimmed length of "Target" is 6
    });

    it('should handle empty retailer name gracefully', () => {
      const points = service.calculatePointsFromRetailer('');
      expect(points).toBe(0); // Empty retailer name -> no points
    });
  });

  describe('calculatePointsFromTotal', () => {
    it('should calculate points for valid total', () => {
      const points = service.calculatePointsFromTotal('35.35');
      expect(points).toBe(0); // "35.35" not  multiple of 0.25
    });

    it('should give 50 points if total is .00', () => {
      const points = service.calculatePointsFromTotal('20.00');
      expect(points).toBe(75); // No cents should give 50 points; multiple of .25 AND ends in .00
    });

    it('should give 25 points if total is .25', () => {
      const points = service.calculatePointsFromTotal('20.25');
      expect(points).toBe(25); // "20.25" -> multiple of 0.25
    });

    it('should throw error for invalid total format', () => {
      expect(() => service.calculatePointsFromTotal('invalid')).toThrowError('Receipt total amount format is invalid.');
    });

    
  });

  describe('calculatePointsFromItemCount', () => {
    it('should calculate points for single item count', () => {
      const items: ReceiptItem[] = [
        { id: 1, shortDescription: 'item1', price: '10', receipt: {} as any },
      ];
      const points = service.calculatePointsFromItemCount(items);
      expect(points).toBe(0); // 1 item -> 0 points
    });

    it('should calculate points for odd item count', () => {
      const items: ReceiptItem[] = [
        { id: 1, shortDescription: 'item1', price: '10', receipt: {} as any },
        { id: 1, shortDescription: 'item2', price: '15', receipt: {} as any },
        { id: 1, shortDescription: 'item2', price: '15', receipt: {} as any },
      ];
      const points = service.calculatePointsFromItemCount(items);
      expect(points).toBe(5); // 3 items -> 5 points
    });

    it('should calculate points for even item count', () => {
      const items: ReceiptItem[] = [
        { id: 1, shortDescription: 'item1', price: '10', receipt: {} as any },
        { id: 1, shortDescription: 'item2', price: '15', receipt: {} as any },
      ];
      const points = service.calculatePointsFromItemCount(items);
      expect(points).toBe(5); // 2 items -> 5 points
    });

    it('should throw error for empty items list', () => {
      expect(() => service.calculatePointsFromItemCount([])).toThrowError('Receipt items list is null or empty.');
    });
  });

  describe('calculatePointsFromDate', () => {
    it('should calculate points for an odd date', () => {
      const points = service.calculatePointsFromDate('2022-01-01');
      expect(points).toBe(6); // 1st of January is an odd day
    });

    it('should return 0 points for even date', () => {
      const points = service.calculatePointsFromDate('2022-01-02');
      expect(points).toBe(0); // 2nd of January is an even day
    });

    it('should throw error for invalid date format', () => {
      expect(() => service.calculatePointsFromDate('invalid')).toThrowError('Receipt date format is invalid.');
    });
  });

  describe('calculatePointsFromPurchaseTime', () => {
    it('should return 10 points for a time between 2PM and 4PM', () => {
      const points = service.calculatePointsFromPurchaseTime('15:00');
      expect(points).toBe(10); // Time is 3:00 PM (between 2 PM and 4 PM)
    });

    it('should return 0 points for a time outside the 2PM-4PM range', () => {
      const points = service.calculatePointsFromPurchaseTime('12:00');
      expect(points).toBe(0); // Time is 12:00 PM
    });

    it('should throw error for invalid time format', () => {
      expect(() => service.calculatePointsFromPurchaseTime('1:00')).toThrowError('Receipt time format is invalid.');
    });
  });

  describe('convertNumStringToNum', () => {
    it('should correctly convert dollar string to number', () => {
      const result = service.convertNumStringToNum('$12.99');
      expect(result).toBe(12.99);
    });

    it('should throw error for invalid format', () => {
      expect(() => service.convertNumStringToNum('invalid')).toThrowError('Invalid dollar amount format.');
    });
  });
});
