/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesService } from './expenses.service';
import { UsersService } from '../users/users.service';
import { getModelToken } from '@nestjs/mongoose';
import { Expense } from './schema/expense.schema';
import { Model } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let mockExpenseModel: Model<Expense>;
  let mockUsersService: jest.Mocked<UsersService>;

  const mockUser = {
    _id: 'user123',
    name: 'Test User',
    expenses: [],
  };

  const mockCreateExpenseDto: CreateExpenseDto = {
    category: 'Groceries',
    productName: 'Apples',
    quantity: 5,
    price: 1.99,
    totalPrice: 9.95,
  };

  const mockUpdateExpenseDto: UpdateExpenseDto = {
    category: 'Food & Beverages',
    productName: 'Organic Apples',
    quantity: 3,
    price: 2.49,
    totalPrice: 7.47,
  };

  const mockExpenseDocument = {
    _id: 'expense123',
    ...mockCreateExpenseDto,
    user: 'user123',
  };

  beforeEach(async () => {
    const expenseModel = {
      create: jest.fn(),
      find: jest.fn(),
      populate: jest.fn(),
    };

    const usersService = {
      findOne: jest.fn(),
      addExpenseId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: getModelToken(Expense.name),
          useValue: expenseModel,
        },
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    mockExpenseModel = module.get<Model<Expense>>(getModelToken(Expense.name));
    mockUsersService = module.get<UsersService>(
      UsersService,
    ) as jest.Mocked<UsersService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should successfully create an expense', async () => {
      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockExpenseModel.create = jest
        .fn()
        .mockResolvedValue(mockExpenseDocument);
      mockUsersService.addExpenseId.mockResolvedValue(undefined);

      const result = await service.create('user123', mockCreateExpenseDto);

      expect(result).toEqual(mockExpenseDocument);
      expect(mockUsersService.findOne).toHaveBeenCalledWith('user123');
      expect(mockExpenseModel.create).toHaveBeenCalledWith({
        ...mockCreateExpenseDto,
        user: mockUser._id,
      });
      expect(mockUsersService.addExpenseId).toHaveBeenCalledWith(
        mockUser._id,
        mockExpenseDocument._id,
      );
    });

    it('should throw BadRequestException when user not found', async () => {
      mockUsersService.findOne.mockResolvedValue({});

      await expect(
        service.create('nonexistent', mockCreateExpenseDto),
      ).rejects.toThrow(BadRequestException);
      expect(mockExpenseModel.create).not.toHaveBeenCalled();
    });

    it('should handle invalid user object', async () => {
      mockUsersService.findOne.mockResolvedValue({ name: 'Invalid User' });

      const result = await service.create('user123', mockCreateExpenseDto);

      expect(result).toBeUndefined();
      expect(mockExpenseModel.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all expenses with populated user data', async () => {
      const mockPopulatedExpenses = [
        { ...mockExpenseDocument, user: mockUser },
      ];
      mockExpenseModel.find = jest.fn().mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockPopulatedExpenses),
      });

      const result = await service.findAll();

      expect(result).toEqual(mockPopulatedExpenses);
      expect(mockExpenseModel.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a string with the expense id', () => {
      const result = service.findOne(1);
      expect(result).toBe('This action returns a #1 post');
    });
  });

  describe('update', () => {
    it('should return the update DTO', () => {
      const id = 1;
      const updateDto: UpdateExpenseDto = {
        category: 'Updated Category',
        productName: 'Updated Product',
        quantity: 2,
        price: 4,
        totalPrice: 8,
      };

      const result = service.update(id, updateDto);

      expect(result).toEqual(updateDto);
    });

    it('should return partial update DTO', () => {
      const id = 1;
      const partialUpdateDto: Partial<UpdateExpenseDto> = {
        quantity: 2,
        price: 4,
        totalPrice: 8,
      };

      const result = service.update(id, partialUpdateDto);
      expect(result).toEqual(partialUpdateDto);
    });
  });

  describe('remove', () => {
    it('should return a string with the expense id', () => {
      const result = service.remove(1);
      expect(result).toBe('This action removes a #1 post');
    });
  });
});
