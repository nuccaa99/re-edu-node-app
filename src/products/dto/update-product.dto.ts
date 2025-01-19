import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiProperty({
    description: 'The updated name of the product',
    example: 'Smartphone',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'The updated price of the product',
    example: '599.99',
    required: false,
  })
  price?: string;

  @ApiProperty({
    description: 'The updated category of the product',
    example: 'Electronics',
    required: false,
  })
  category?: string;

  @ApiProperty({
    description: 'The updated creation date of the product',
    example: '2025-01-20',
    required: false,
  })
  createdAt?: string;
}
