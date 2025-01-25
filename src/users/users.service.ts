import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { User } from './schema/user.schema';
import { IUser } from './user.interface';
import { QueryParamsDto } from './dto/queryParams.dto';
import { faker } from '@faker-js/faker';
import { QueryParamsAgeDto } from './dto/queryParamsAge.dto';
import { Post } from '../posts/schema/post.schema';
import { Expense } from '../expenses/schema/expense.schema';
import { AwsS3Service } from 'src/aws-s3/aws-s3.service';
@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    private awsS3Service: AwsS3Service,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Expense.name) private expenseModel: Model<Expense>,
  ) {}

  async onModuleInit() {
    const users = await this.userModel.countDocuments();
    if (users === 0) {
      const users = [];
      for (let i = 0; i < 30_000; i++) {
        const user = {
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          age: faker.number.int({ min: 18, max: 99 }),
          email: faker.internet.email(),
          phoneNumber: faker.phone.number(),
          gender: faker.person.gender(),
        };
        users.push(user);
      }
      await this.userModel.insertMany(users);
    }
  }

  async createUser(body) {
    const existUser = await this.userModel.findOne({
      email: body.email,
    });
    if (existUser) throw new BadGatewayException('user already exists');
    const user = await this.userModel.create(body);
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) throw new BadRequestException('user already exists');

    const user = await this.userModel.create(createUserDto);
    return user;
  }

  findAll(queryParams: QueryParamsDto) {
    const { page, take } = queryParams;
    const limit = Math.min(take, 50);
    return this.userModel
      .find()
      .skip((page - 1) * take)
      .limit(page * limit);
  }

  async getUsersQuantity() {
    const count = await this.userModel.countDocuments();
    return count;
  }

  async getUsersByAge(age: number, query: QueryParamsAgeDto) {
    const { ageFrom, ageTo } = query;
    const filter =
      ageFrom && ageTo ? { age: { $gte: ageFrom, $lte: ageTo } } : { age };

    return this.userModel.find(filter).limit(100);
  }

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).select('+password');
    return user;
  }

  async findOne(id: string): Promise<IUser | object> {
    if (!isValidObjectId(id))
      throw new BadRequestException('not valid id was provided');
    const user = (await this.userModel.findById(id)).populate([
      {
        path: 'expenses',
        select: '-user',
      },
      {
        path: 'posts',
        select: '-user',
      },
    ]);
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
    const user = await this.userModel.findById(id);
    const deletedUser = await this.userModel.findByIdAndDelete(id);
    const { posts, expenses } = user;
    if (posts?.length) {
      await this.postModel.deleteMany({ _id: { $in: posts } });
    }
    if (expenses?.length) {
      await this.expenseModel.deleteMany({ _id: { $in: expenses } });
    }
    return { message: 'user deleted successfully', data: deletedUser };
  }

  async removeall() {
    const user = await this.userModel.deleteMany();
    return user;
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

  async addPostId(userId, postId) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new BadRequestException('user not found');
    const posts = user.posts;
    posts.push(postId);
    const updatedUser = await this.userModel.findByIdAndUpdate(
      userId,
      { ...user, posts },
      {
        new: true,
      },
    );
    return updatedUser;
  }

  uploadImage(filePath, file) {
    return this.awsS3Service.uploadImage(filePath, file);
  }

  getImage(fileId) {
    return this.awsS3Service.getImageByFileId(fileId);
  }

  deleteImage(fileId) {
    return this.awsS3Service.deleteImageByFileId(fileId);
  }
}
