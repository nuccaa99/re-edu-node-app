import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ Type: String })
  firstName: string;
  @Prop({ Type: String })
  lastName: string;
  @Prop({ Type: Number })
  age: number;
  @Prop({ Type: String })
  email: string;
  @Prop({ Type: String })
  phoneNumber: string;
  @Prop({ Type: String })
  gender: string;
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Expense',
    default: [],
  })
  expenses: mongoose.Schema.Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);
