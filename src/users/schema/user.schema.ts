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
  @Prop({ type: String })
  avatar: string;
  @Prop({ type: String, select: false })
  password: string;
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Expense',
    default: [],
  })
  expenses: mongoose.Schema.Types.ObjectId[];
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Post',
    default: [],
  })
  posts: mongoose.Schema.Types.ObjectId[];
  @Prop({ required: true, enum: ['user', 'admin'], default: 'user' })
  role: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
