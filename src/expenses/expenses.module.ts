import { Module } from '@nestjs/common';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Expense, ExpenseSchema } from './schema/expense.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Expense.name, schema: ExpenseSchema }]),
    UsersModule,
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService],
})
export class ExpensesModule {}
