import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateExpenseDto } from './create-expense.dto';

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {
  @ApiProperty({
    description: 'The updated category of the expense',
    example: 'Utilities',
    required: false,
  })
  category?: string;

  @ApiProperty({
    description: 'The updated name of the product',
    example: 'Electricity',
    required: false,
  })
  productName?: string;

  @ApiProperty({
    description: 'The updated quantity of the product',
    example: 10,
    required: false,
  })
  quantity?: number;

  @ApiProperty({
    description: 'The updated price per unit of the product',
    example: 2.5,
    required: false,
  })
  price?: number;

  @ApiProperty({
    description: 'The updated total price of the product',
    example: 25.0,
    required: false,
  })
  totalPrice?: number;
}
