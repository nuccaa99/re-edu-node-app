import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { Post, PostSchema } from 'src/posts/schema/post.schema';
import { Expense, ExpenseSchema } from 'src/expenses/schema/expense.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }]),
    UsersModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
