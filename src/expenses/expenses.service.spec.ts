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

  const mockExpense = {
    _id: 'expense123',
    category: 'Groceries',
    productName: 'Apples',
    quantity: 5,
    price: 1.99,
    totalPrice: 9.95,
    user: 'user123',
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

  beforeEach(async () => {
    const expenseModel = {
      create: jest.fn(),
      find: jest.fn(),
      populate: jest.fn(),
      findByIdAndUpdate: jest.fn(),
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
      mockExpenseModel.create = jest.fn().mockResolvedValue(mockExpense);
      mockUsersService.addExpenseId.mockResolvedValue(undefined);

      const result = await service.create('user123', mockCreateExpenseDto);

      expect(result).toEqual(mockExpense);
      expect(mockUsersService.findOne).toHaveBeenCalledWith('user123');
      expect(mockExpenseModel.create).toHaveBeenCalledWith({
        ...mockCreateExpenseDto,
        user: mockUser._id,
      });
      expect(mockUsersService.addExpenseId).toHaveBeenCalledWith(
        mockUser._id,
        mockExpense._id,
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

    it('should calculate total price correctly', async () => {
      const dtoWithoutTotal: CreateExpenseDto = {
        category: 'Groceries',
        productName: 'Bananas',
        quantity: 3,
        price: 2.5,
        totalPrice: 7.5,
      };

      mockUsersService.findOne.mockResolvedValue(mockUser);
      mockExpenseModel.create = jest.fn().mockResolvedValue({
        ...mockExpense,
        ...dtoWithoutTotal,
      });

      const result = await service.create('user123', dtoWithoutTotal);

      expect(result.totalPrice).toBe(
        dtoWithoutTotal.quantity * dtoWithoutTotal.price,
      );
    });
  });

  describe('findAll', () => {
    it('should return all expenses with populated user data', async () => {
      const mockPopulatedExpenses = [{ ...mockExpense, user: mockUser }];
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
    it('should update an expense with partial data', async () => {
      const expenseId = 'expense123';
      const partialUpdate: Partial<UpdateExpenseDto> = {
        _id: 'expense123',
        category: 'Food & Beverages',
        productName: 'Organic Apples',
        quantity: 3,
        price: 2.49,
        totalPrice: 7.47,
        user: 'user123',
      };

      const updatedExpense = {
        ...mockExpense,
        ...partialUpdate,
      };

      mockExpenseModel.findByIdAndUpdate = jest
        .fn()
        .mockResolvedValue(updatedExpense);

      const result = await service.update(1, partialUpdate);

      expect(result).toEqual(updatedExpense);
      expect(mockExpenseModel.findByIdAndUpdate).toHaveBeenCalledWith(
        expenseId,
        partialUpdate,
        { new: true },
      );
    });

    it('should update an expense with full data', async () => {
      const expenseId = 'expense123';
      const updatedExpense = {
        ...mockExpense,
        ...mockUpdateExpenseDto,
      };

      mockExpenseModel.findByIdAndUpdate = jest
        .fn()
        .mockResolvedValue(updatedExpense);

      const result = await service.update(1, mockUpdateExpenseDto);

      expect(result).toEqual(updatedExpense);
      expect(mockExpenseModel.findByIdAndUpdate).toHaveBeenCalledWith(
        expenseId,
        mockUpdateExpenseDto,
        { new: true },
      );
    });
  });

  describe('remove', () => {
    it('should return a string with the expense id', () => {
      const result = service.remove(1);
      expect(result).toBe('This action removes a #1 post');
    });
  });
});
