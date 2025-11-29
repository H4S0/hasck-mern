import mongoose, { Schema, InferSchemaType } from 'mongoose';
import crypto from 'crypto';

export const userRoles = ['user', 'admin'] as const;
export type UserRole = (typeof userRoles)[number];

const UserSchema = new Schema(
  {
    _id: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: {
      type: String,
      required: true,
      default: () => crypto.randomUUID(),
    },
    role: {
      type: String,
      enum: userRoles,
      default: 'user',
    },
    refreshToken: {
      type: String,
      default: null,
    },
    passwordResetToken: {
      type: String,
      default: null,
    },
    passwordResetExpire: {
      type: Date,
      default: null,
    },
    provider: {
      type: String,
      enum: ['discord', 'github'],
      required: false,
    },
    providerId: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

UserSchema.index({ provider: 1, providerId: 1 });

export const User = mongoose.model('User', UserSchema);
export type UserType = InferSchemaType<typeof UserSchema>;
