import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { UsersService } from '../users/users.service';
import { InjectModel } from '@nestjs/mongoose';
import { Expense } from './schema/expense.schema';
import { Model } from 'mongoose';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
    private UsersService: UsersService,
  ) {}

  async create(userId: string, createExpenseDto: CreateExpenseDto) {
    const user = await this.UsersService.findOne(userId);
    if (!Object.keys(user).length)
      throw new BadRequestException('user not found');
    if ('_id' in user) {
      const expense = await this.expenseModel.create({
        ...createExpenseDto,
        user: user._id,
      });
      await this.UsersService.addExpenseId(user._id, expense._id);
      return expense;
    }
  }

  findAll() {
    return this.expenseModel.find().populate('user');
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    return updateExpenseDto;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
