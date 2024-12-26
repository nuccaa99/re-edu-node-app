import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Expense {
  @Prop({ Type: String })
  category: string;
  @Prop({ Type: String })
  productName: string;
  @Prop({ Type: Number })
  quantity: number;
  @Prop({ Type: Number })
  price: number;
  @Prop({ Type: Number })
  totalPrice: number;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Schema.Types.ObjectId;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
