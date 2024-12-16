import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  Put,
} from '@nestjs/common';

import { ExpensesService } from './expenses.service';

@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Get()
  getExpenses() {
    return this.expensesService.getAllExpenses();
  }
  @Get(':id')
  getExpenseById(@Param() params) {
    return this.expensesService.getExpenseById(Number(params.id));
  }
  @Post()
  addExpense(@Body() body) {
    return this.expensesService.addExpense(body);
  }

  @Delete(':id')
  deleteExpense(@Param() params) {
    return this.expensesService.deleteExpense(Number(params.id));
  }

  @Put(':id')
  updateExpense(@Param() params, @Body() body) {
    return this.expensesService.updateExpense(Number(params.id), body);
  }
}
