import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'How to use Nest',
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The content of the post',
    example: 'NestJS is a progressive Node.js framework.',
  })
  @IsNotEmpty()
  @IsString()
  content: string;
}
