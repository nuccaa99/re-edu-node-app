import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Post {
  @Prop({ Type: String })
  title: string;
  @Prop({ Type: String })
  content: string;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: mongoose.Schema.Types.ObjectId;
}

export const PostSchema = SchemaFactory.createForClass(Post);
