import { err, ok, ResultAsync } from 'neverthrow';
import { User, UserType } from '../models/User';
import { RegisterSchema } from '../utils/zod-schemas';
import z from 'zod';
import bcrypt from 'bcrypt-ts';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request } from 'express';

dotenv.config();
const SALT = 10;

type ErrorResponse = {
  code: string;
  message: string;
};

export const findExistingUser = (username: string, email: string) => {
  return ResultAsync.fromPromise(
    User.findOne({
      $or: [{ username }, { email }],
    }),
    (e) => ({
      code: 'FINDING_USER_ERROR',
      message: `Error while finding existing user ${err(e as Error)}`,
    })
  );
};

export const findUserByEmail = (email: string) => {
  return ResultAsync.fromPromise(
    User.findOne({ email: email }).exec(),
    (e) => ({
      code: 'FINDING_USER_ERROR',
      message: `Error while finding existing user ${err(e as Error)}`,
    })
  );
};
export const getAuthToken = (req: Request) => {
  const token = req.cookies['refreshToken'];
  return token;
};

export const findUserByUsername = (
  username: string
): ResultAsync<UserType | null, ErrorResponse> =>
  ResultAsync.fromPromise(User.findOne({ username: username }).exec(), (e) => ({
    code: 'FINDING_USER_ERROR',
    message: `Error while finding existing user ${err(e as Error)}`,
  }));

export const findUserById = (userId: string) => {
  return ResultAsync.fromPromise(User.findById(userId), (e) => ({
    code: 'FINDING_USER_ERROR',
    message: `Error while finding existing user ${err(e as Error)}`,
  }));
};

export const comparePassword = (
  insertedPassword: string,
  userPassword: string
) => {
  return ResultAsync.fromPromise(
    bcrypt.compare(insertedPassword, userPassword),
    (e) => ({
      code: 'COMPARING_PASSWORD_ERROR',
      message: `Error while comparing password ${err(e as Error)}`,
    })
  );
};

export const hashPassword = async (password: string) =>
  ResultAsync.fromPromise(bcrypt.hash(password, SALT), (e) => ({
    code: 'HASHING_PASSWORD_ERROR',
    message: `Error while comparing password ${err(e as Error)}`,
  }));

export const createUser = async (user: z.infer<typeof RegisterSchema>) => {
  const hashedPassword = await hashPassword(user.password);

  if (hashedPassword.isErr()) {
    return err(hashedPassword.error);
  }

  return ResultAsync.fromPromise(
    User.insertOne({
      _id: crypto.randomUUID(),
      username: user.username,
      email: user.email,
      password: hashedPassword.value,
      role: 'user',
    }),
    (e) => ({
      code: 'CREATING_USER_ERROR',
      message: `Error while creating user ${err(e as Error)}`,
    })
  );
};

export const updateUserPassword = async (userId: string, password: string) => {
  const hashedPassword = await hashPassword(password);

  if (hashedPassword.isErr()) {
    return err(hashedPassword.error);
  }

  return ResultAsync.fromPromise(
    User.findByIdAndUpdate(userId, {
      password: hashedPassword.value,
    }),
    (e) => ({
      code: 'UPDATING_PASSWORD_ERROR',
      message: `Error while updating password ${err(e as Error)}`,
    })
  );
};

export const saveRefreshToken = (userId: string, refreshToken: string) => {
  return ResultAsync.fromPromise(
    User.findByIdAndUpdate(userId, {
      refreshToken: refreshToken,
    }),
    (e) => ({
      code: 'CREATING_USER_ERROR',
      message: `Error while saving refresh token to user ${err(e as Error)}`,
    })
  );
};

const accessTokenSecret = process.env.JWT_SECRET!;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;

export const generateRefreshToken = async (
  _id: string,
  username: string,
  email: string,
  role: string
) => {
  try {
    return ok(
      jwt.sign({ _id, username, email, role }, refreshTokenSecret, {
        expiresIn: '7d',
      })
    );
  } catch (e) {
    return err(e as Error);
  }
};
export const generateAccessToken = async (
  _id: string,
  username: string,
  email: string,
  role: string
) => {
  try {
    return ok(
      jwt.sign({ _id, username, email, role }, accessTokenSecret, {
        expiresIn: '15m',
      })
    );
  } catch (e) {
    return err(e as Error);
  }
};

export const updateUserEmail = (userId: string, email: string) => {
  return ResultAsync.fromPromise(
    User.findByIdAndUpdate(userId, {
      email: email,
    }),
    (e) => ({
      code: 'UPDATING_EMAIL_ERROR',
      message: `Error while updating users email ${err(e as Error)}`,
    })
  );
};

export const generateAndUpdateRefreshToken = async (
  _id: string,
  username: string,
  email: string,
  role: string
) => {
  const refreshToken = await generateRefreshToken(_id, username, email, role);

  if (refreshToken.isErr()) {
    return err(refreshToken.error as Error);
  }

  return ResultAsync.fromPromise(
    User.findByIdAndUpdate(_id, {
      refreshToken: refreshToken.value,
    }),
    (e) => ({
      code: 'UPDATING_USER_ERROR',
      message: `Error while updating user with new refresh token ${err(e as Error)}`,
    })
  );
};

export async function deleteRefreshToken(refreshToken: string) {
  return ResultAsync.fromPromise(
    User.updateOne({ refreshToken }, { $set: { refreshToken: null } }),
    (e) => ({
      code: 'LOGOUT_USER_ERROR',
      message: `Error while logging out ${err(e as Error)}`,
    })
  );
}
