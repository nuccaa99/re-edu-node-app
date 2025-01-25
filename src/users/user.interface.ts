import mongoose from 'mongoose';

export class IUser {
  _id: mongoose.Schema.Types.ObjectId;
  firstName: string;
  lastName: string;
  age: number;
  email: string;
  phoneNumber: string;
  gender: string;
  avatar: any;
}
