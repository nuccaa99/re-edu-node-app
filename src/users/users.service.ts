import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddUserDto } from './DTOs/add-user.dto';
import { UpdateUserDto } from './DTOs/update-user.dto';

@Injectable()
export class UsersService {
  private users = [
    {
      id: 1,
      firstName: 'nuca',
      lastName: 'khar',
      email: 'n@gmail.com',
      phoneNumber: '555555555',
      gender: 'F',
    },
    {
      id: 2,
      firstName: 'nino',
      lastName: 'khar',
      email: 'nin@gmail.com',
      phoneNumber: '555556555',
      gender: 'F',
    },
  ];

  getAllUsers() {
    return this.users;
  }

  getUserById(id: number) {
    const user = this.users.find((el) => el.id === id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  addUser(body: AddUserDto) {
    const lastId = this.users[this.users.length - 1]?.id || 0;
    const newUser = {
      id: lastId + 1,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNumber: body.phoneNumber,
      gender: body.gender,
    };
    this.users.push(newUser);
    return newUser;
  }

  deleteUser(id: number) {
    const index = this.users.findIndex((el) => el.id === id);
    if (index === -1)
      throw new HttpException('User id is invalid', HttpStatus.BAD_REQUEST);
    const deletedUser = this.users.splice(index, 1);
    return deletedUser;
  }

  updateUser(id: number, body: UpdateUserDto) {
    const index = this.users.findIndex((el) => el.id === id);
    if (index === -1) {
      throw new HttpException('User id is invalid', HttpStatus.BAD_REQUEST);
    }
    const updatedUser = {
      ...this.users[index],
      ...body,
    };
    this.users[index] = updatedUser;
    return updatedUser;
  }
}
