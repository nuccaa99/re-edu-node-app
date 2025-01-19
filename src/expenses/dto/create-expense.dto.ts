import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({
    description: 'The category of the expense',
    example: 'Groceries',
  })
  @IsNotEmpty()
  @IsString()
  category: string;

  @ApiProperty({
    description: 'The name of the product',
    example: 'Apples',
  })
  @IsNotEmpty()
  @IsString()
  productName: string;

  @ApiProperty({
    description: 'The quantity of the product',
    example: 5,
  })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({
    description: 'The price per unit of the product',
    example: 1.99,
  })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({
    description: 'The total price (calculated as quantity * price)',
    example: 9.95,
  })
  totalPrice: number;
}
