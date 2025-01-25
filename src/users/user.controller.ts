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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryParamsDto } from './dto/queryParams.dto';
import { QueryParamsAgeDto } from './dto/queryParamsAge.dto';
import { IsAdminGuard } from 'src/guards/idAdmin.guard';
// import { AuthGuard } from 'src/posts/auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all users' })
  @ApiQuery({
    name: 'queryParams',
    required: false,
    description: 'Optional query parameters for filtering users',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved successfully.',
  })
  findAll(@Query() queryParams: QueryParamsDto) {
    return this.usersService.findAll(queryParams);
  }

  @Get('countUsers')
  @ApiOperation({ summary: 'Retrieve the total number of users' })
  @ApiResponse({
    status: 200,
    description: 'User count retrieved successfully.',
  })
  getUsersQuantity() {
    return this.usersService.getUsersQuantity();
  }

  @Get('age/range')
  @ApiOperation({ summary: 'Retrieve users within a specific age range' })
  @ApiResponse({
    status: 200,
    description: 'Users within the age range retrieved successfully.',
  })
  getUsersByAgeRange(@Query() query: QueryParamsAgeDto) {
    return this.usersService.getUsersByAge(null, query);
  }

  @Get('age/:age')
  @ApiOperation({ summary: 'Retrieve users by a specific age' })
  @ApiResponse({
    status: 200,
    description: 'Users with the specified age retrieved successfully.',
  })
  @ApiResponse({ status: 400, description: 'Invalid age parameter.' })
  getUsersByAge(
    @Param('age', ParseIntPipe) age: number,
    @Query() query: QueryParamsAgeDto,
  ) {
    return this.usersService.getUsersByAge(age, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user with the specified ID retrieved successfully.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findOne(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully updated.',
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(IsAdminGuard)
  @ApiOperation({ summary: 'Delete a user by ID (Admin Only)' })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Delete()
  @ApiOperation({ summary: 'Delete all users' })
  @ApiResponse({
    status: 200,
    description: 'All users have been successfully deleted.',
  })
  removeall() {
    return this.usersService.removeall();
  }

  @Post('/deleteImage')
  deleteImage(@Body('fileId') fileId: string) {
    return this.usersService.deleteImage(fileId);
  }
}
