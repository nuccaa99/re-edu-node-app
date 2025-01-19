import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The first name of the user',
    example: 'Giorgi',
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'maisuradze',
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'The age of the user',
    example: 25,
  })
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @ApiProperty({
    description: 'The email address of the user',
    example: 'giorgi@gmail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+995599123456',
  })
  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @ApiProperty({
    description: 'The gender of the user',
    example: 'Male',
  })
  @IsNotEmpty()
  @IsString()
  gender: string;
}
