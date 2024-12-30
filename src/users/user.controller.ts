import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Param,
  Patch,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryParamsDto } from './dto/queryParams.dto';
import { QueryParamsAgeDto } from './dto/queryParamsAge.dto';
import { IsAdminGuard } from 'src/guards/idAdmin.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Query() queryParams: QueryParamsDto) {
    return this.usersService.findAll(queryParams);
  }

  @Get('countUsers')
  getUsersQuantity() {
    return this.usersService.getUsersQuantity();
  }

  @Get('age/range')
  getUsersByAgeRange(@Query() query: QueryParamsAgeDto) {
    return this.usersService.getUsersByAge(null, query);
  }

  @Get('age/:age')
  getUsersByAge(
    @Param('age', ParseIntPipe) age: number,
    @Query() query: QueryParamsAgeDto,
  ) {
    return this.usersService.getUsersByAge(age, query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(IsAdminGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Delete()
  removeall() {
    return this.usersService.removeall();
  }
}
