import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Post } from '../posts/schema/post.schema';
import { Expense } from '../expenses/schema/expense.schema';
import { BadRequestException, BadGatewayException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userModel: Model<User>;
  let postModel: Model<Post>;
  let expenseModel: Model<Expense>;

  const mockCreateUserDto = {
    firstName: 'nino',
    lastName: 'Kharazishvili',
    age: 25,
    email: 'nino@example.com',
    phoneNumber: '598453385',
    gender: 'female',
  };

  const mockUpdateUserDto = {
    firstName: 'nino',
    lastName: 'Kharazishvili',
    age: 26,
    phoneNumber: '598453385',
    gender: 'female',
  };

  const mockUser = {
    _id: 'user123',
    ...mockCreateUserDto,
    posts: [],
    expenses: [],
    populate: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            findById: jest.fn(),
            findByIdAndUpdate: jest.fn(),
            findByIdAndDelete: jest.fn(),
            deleteMany: jest.fn(),
            countDocuments: jest.fn(),
            insertMany: jest.fn(),
          },
        },
        {
          provide: getModelToken(Post.name),
          useValue: {
            deleteMany: jest.fn(),
          },
        },
        {
          provide: getModelToken(Expense.name),
          useValue: {
            deleteMany: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userModel = module.get<Model<User>>(getModelToken(User.name));
    postModel = module.get<Model<Post>>(getModelToken(Post.name));
    expenseModel = module.get<Model<Expense>>(getModelToken(Expense.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(userModel, 'create').mockResolvedValueOnce(mockUser as any);

      const result = await service.create(mockCreateUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException if user already exists', async () => {
      jest.spyOn(userModel, 'findOne').mockResolvedValueOnce(mockUser as any);

      await expect(service.create(mockCreateUserDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated users', async () => {
      const mockFind = {
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockResolvedValue([mockUser]),
      };
      jest.spyOn(userModel, 'find').mockReturnValue(mockFind as any);

      const result = await service.findAll({ page: 1, take: 10 });
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      jest.spyOn(userModel, 'findById').mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockUser),
      } as any);

      const result = await service.findOne('64a4c4a0b0a3a3a3a3a3a3a3');
      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException for invalid id', async () => {
      await expect(service.findOne('invalid-id')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      jest.spyOn(userModel, 'findByIdAndUpdate').mockResolvedValueOnce({
        ...mockUser,
        age: 26,
      } as any);

      const result = await service.update(
        '64a4c4a0b0a3a3a3a3a3a3a3',
        mockUpdateUserDto,
      );
      expect(result.data.age).toBe(26);
    });

    it('should throw BadGatewayException for invalid id', async () => {
      await expect(
        service.update('invalid-id', mockUpdateUserDto),
      ).rejects.toThrow(BadGatewayException);
    });
  });

  describe('remove', () => {
    it('should remove a user and associated posts and expenses', async () => {
      const mockUserWithRefs = {
        ...mockUser,
        posts: ['post123'],
        expenses: ['expense123'],
      };

      jest
        .spyOn(userModel, 'findById')
        .mockResolvedValueOnce(mockUserWithRefs as any);
      jest
        .spyOn(userModel, 'findByIdAndDelete')
        .mockResolvedValueOnce(mockUserWithRefs as any);
      jest.spyOn(postModel, 'deleteMany').mockResolvedValueOnce({} as any);
      jest.spyOn(expenseModel, 'deleteMany').mockResolvedValueOnce({} as any);

      const result = await service.remove('64a4c4a0b0a3a3a3a3a3a3a3');
      expect(result.message).toBe('user deleted successfully');
      expect(result.data).toEqual(mockUserWithRefs);
    });

    it('should throw BadGatewayException for invalid id', async () => {
      await expect(service.remove('invalid-id')).rejects.toThrow(
        BadGatewayException,
      );
    });
  });

  describe('addPostId', () => {
    it('should add a post id to user posts array', async () => {
      const mockUserBeforeUpdate = { ...mockUser, posts: [] };
      const mockUserAfterUpdate = { ...mockUser, posts: ['post123'] };

      jest
        .spyOn(userModel, 'findById')
        .mockResolvedValueOnce(mockUserBeforeUpdate as any);
      jest
        .spyOn(userModel, 'findByIdAndUpdate')
        .mockResolvedValueOnce(mockUserAfterUpdate as any);

      const result = await service.addPostId(
        '64a4c4a0b0a3a3a3a3a3a3a3',
        'post123',
      );
      expect(result.posts).toContain('post123');
    });

    it('should throw BadRequestException if user not found', async () => {
      jest.spyOn(userModel, 'findById').mockResolvedValueOnce(null);

      await expect(
        service.addPostId('64a4c4a0b0a3a3a3a3a3a3a3', 'post123'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('addExpenseId', () => {
    it('should add an expense id to user expenses array', async () => {
      const mockUserBeforeUpdate = { ...mockUser, expenses: [] };
      const mockUserAfterUpdate = { ...mockUser, expenses: ['expense123'] };

      jest
        .spyOn(userModel, 'findById')
        .mockResolvedValueOnce(mockUserBeforeUpdate as any);
      jest
        .spyOn(userModel, 'findByIdAndUpdate')
        .mockResolvedValueOnce(mockUserAfterUpdate as any);

      const result = await service.addExpenseId(
        '64a4c4a0b0a3a3a3a3a3a3a3',
        'expense123',
      );
      expect(result.expenses).toContain('expense123');
    });

    it('should throw BadRequestException if user not found', async () => {
      jest.spyOn(userModel, 'findById').mockResolvedValueOnce(null);

      await expect(
        service.addExpenseId('64a4c4a0b0a3a3a3a3a3a3a3', 'expense123'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getUsersByAge', () => {
    it('should find users by age range', async () => {
      const mockUsers = [mockUser];
      const mockQuery = {
        limit: jest.fn().mockResolvedValue(mockUsers),
      };
      jest.spyOn(userModel, 'find').mockReturnValue(mockQuery as any);

      const result = await service.getUsersByAge(25, {
        ageFrom: 20,
        ageTo: 30,
      });

      expect(userModel.find).toHaveBeenCalledWith({
        age: { $gte: 20, $lte: 30 },
      });
      expect(mockQuery.limit).toHaveBeenCalledWith(100);
      expect(result).toEqual(mockUsers);
    });

    it('should find users by exact age when no range is specified', async () => {
      const mockUsers = [mockUser];
      const mockQuery = {
        limit: jest.fn().mockResolvedValue(mockUsers),
      };
      jest.spyOn(userModel, 'find').mockReturnValue(mockQuery as any);

      const result = await service.getUsersByAge(25, {
        ageFrom: null,
        ageTo: null,
      });

      expect(userModel.find).toHaveBeenCalledWith({ age: 25 });
      expect(mockQuery.limit).toHaveBeenCalledWith(100);
      expect(result).toEqual(mockUsers);
    });
  });
});
