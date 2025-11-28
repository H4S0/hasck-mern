import mongoose, { Schema, InferSchemaType } from 'mongoose';

export const userRoles = ['user', 'admin'] as const;
export type UserRole = (typeof userRoles)[number];

const UserSchema = new Schema(
  {
    _id: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    role: { type: String, enum: userRoles, default: 'user' },
    passwordResetToken: { type: String, default: null },
    passwordResetExpire: { type: Date, default: null },
    refreshToken: { type: String, default: null },
    provider: { type: String, enum: ['discord', 'github'], required: false },
    providerId: { type: String, required: false },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', UserSchema);
export type UserType = InferSchemaType<typeof UserSchema>;

export interface IUser {
  _id: string;
  username: string;
  email: string;
  role: UserRole;
  provider?: 'discord' | 'github';
  providerId?: string;
}
