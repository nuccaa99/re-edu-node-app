import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesService } from './expenses.service';

@ApiTags('Expenses')
@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiResponse({ status: 201, description: 'Expense successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Req() request, @Body() createExpenseDto: CreateExpenseDto) {
    const userId = request.userId || null; // If userId isn't required, make it optional
    return this.expensesService.create(userId, createExpenseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all expenses' })
  @ApiResponse({ status: 200, description: 'List of all expenses.' })
  findAll() {
    return this.expensesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense details.' })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense successfully updated.' })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(+id, updateExpenseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an expense by ID' })
  @ApiResponse({ status: 200, description: 'Expense successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Expense not found.' })
  remove(@Param('id') id: string) {
    return this.expensesService.remove(+id);
  }
}
