import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateExpenseDto {
  @IsNotEmpty()
  @IsString()
  category: string;
  @IsNotEmpty()
  @IsString()
  productName: string;
  @IsNotEmpty()
  @IsNumber()
  quantity: number;
  @IsNotEmpty()
  @IsNumber()
  price: number;
  totalPrice: number;
}
