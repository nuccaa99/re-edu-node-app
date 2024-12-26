import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { User } from './schema/user.schema';
import { IUser } from './user.interface';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) throw new BadRequestException('user already exists');

    const user = await this.userModel.create(createUserDto);
    return user;
  }

  findAll() {
    return this.userModel.find();
  }

  async findOne(id: string): Promise<IUser | {}> {
    if (!isValidObjectId(id))
      throw new BadRequestException('not valid id was provided');
    const user = (await this.userModel.findById(id)).populate({
      path: 'expenses',
      select: '-user',
    });
    return user || {};
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(id))
      throw new BadGatewayException('not valid id was provided');
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      { new: true },
    );
    return { message: 'user updated successfully', data: updatedUser };
  }

  async remove(id: string) {
    if (!isValidObjectId(id))
      throw new BadGatewayException('not valid id was provided');
    const user = await this.userModel.findByIdAndDelete(id);
    return { message: 'user deleted successfully', data: user };
  }

  async addExpenseId(userId, expenseId) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new BadRequestException('user not found');
    const expenses = user.expenses;
    expenses.push(expenseId);
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { ...user, expenses },
      {
        new: true,
      },
    );
    return updatedUser;
  }
}
