import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Smartphone',
  })
  name: string;

  @ApiProperty({
    description: 'The price of the product',
    example: '499.99',
  })
  price: string;

  @ApiProperty({
    description: 'The category of the product',
    example: 'Electronics',
  })
  category: string;

  @ApiProperty({
    description: 'The creation date of the product',
    example: '2025-01-19',
  })
  createdAt: string;
}
