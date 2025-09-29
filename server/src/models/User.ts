import mongoose from 'mongoose';
import { InferSchemaType } from 'mongoose';

export const userRole = ['user', 'admin'] as const;

const UserSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: userRole, default: 'user' },
    passwordResetToken: { type: String, required: false },
    passwordResetExpire: { type: String, required: false },
    refreshToken: { type: String, required: false, default: null },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', UserSchema);
export type UserType = InferSchemaType<typeof UserSchema>;

export type User = {
  _id: string;
  username: string;
  email: string;
  role: string;
};
