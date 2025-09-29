import express from 'express';
import validate from 'express-zod-safe';
import { LoginSchema, RegisterSchema } from '../../utils/zod-schemas';
import {
  comparePassword,
  createUser,
  deleteRefreshToken,
  findExistingUser,
  findUserByUsername,
  generateAccessToken,
  generateRefreshToken,
  saveRefreshToken,
} from '../../service/user-service';
import { StatusCodes } from 'http-status-codes';
import { formatError, formatSuccess } from '../../utils/response-handling';

export const authController = express.Router();

authController.post(
  '/register',
  validate({ body: RegisterSchema }),
  async (req, res) => {
    const { username, email } = req.body;
    const existingUser = await findExistingUser(username, email);

    if (existingUser.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(existingUser.error));
      return;
    }

    if (existingUser.value) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(formatError({ message: 'User already exists' }));
      return;
    }

    const user = await createUser(req.body);

    if (user.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(user.error));
      return;
    }

    res
      .status(StatusCodes.OK)
      .json(formatSuccess({ message: 'User created successfully' }));
  }
);

authController.post(
  '/login',
  validate({ body: LoginSchema }),
  async (req, res) => {
    const { username, password } = req.body;

    const user = await findUserByUsername(username);

    if (user.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(user.error));
      return;
    }

    if (!user.value) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(formatError({ message: 'User doesnt exists' }));
      return;
    }

    const isMatch = await comparePassword(password, user.value.password);

    if (isMatch.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(isMatch.error));
      return;
    }

    if (!isMatch.value) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError({ message: 'Invalid credentials' }));
      return;
    }

    const accessToken = await generateAccessToken(
      user.value._id,
      user.value.username,
      user.value.email,
      user.value.role
    );

    if (accessToken.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(accessToken.error));
      return;
    }

    const refreshToken = await generateRefreshToken(
      user.value._id,
      user.value.username,
      user.value.email,
      user.value.role
    );

    if (refreshToken.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(refreshToken.error));
      return;
    }

    const savedToken = await saveRefreshToken(
      user.value._id,
      refreshToken.value
    );

    if (savedToken.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(savedToken.error));
      return;
    }

    res.cookie('refreshToken', refreshToken.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000,
    });

    res.status(StatusCodes.OK).json(
      formatSuccess({
        data: {
          user: {
            id: user.value._id,
            username: user.value.username,
            email: user.value.email,
            role: user.value.role,
            accessToken: accessToken.value,
          },
        },
        message: 'Login successful',
      })
    );
  }
);

authController.post('/logout', async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    await deleteRefreshToken(refreshToken);
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(StatusCodes.OK).json(
    formatSuccess({
      message: 'Logged out successfully',
    })
  );
});
