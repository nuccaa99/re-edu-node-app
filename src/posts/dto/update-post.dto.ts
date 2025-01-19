import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiProperty({
    description: 'The updated title of the post',
    example: 'How to use Nest (Updated)',
    required: false,
  })
  title?: string;

  @ApiProperty({
    description: 'The updated content of the post',
    example: 'This updated guide explains how to use NestJS efficiently.',
    required: false,
  })
  content?: string;
}
