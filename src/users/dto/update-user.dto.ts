import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The updated first name of the user',
    example: 'Giorgi',
    required: false,
  })
  firstName?: string;

  @ApiProperty({
    description: 'The updated last name of the user',
    example: 'maisuradze',
    required: false,
  })
  lastName?: string;

  @ApiProperty({
    description: 'The updated email address of the user',
    example: 'giorgi.updated@gmail.com',
    required: false,
  })
  email?: string;

  @ApiProperty({
    description: 'The updated age of the user',
    example: 26,
    required: false,
  })
  age?: number;

  @ApiProperty({
    description: 'The updated phone number of the user',
    example: '+995599654321',
    required: false,
  })
  phoneNumber?: string;

  @ApiProperty({
    description: 'The updated gender of the user',
    example: 'Female',
    required: false,
  })
  gender?: string;
}
