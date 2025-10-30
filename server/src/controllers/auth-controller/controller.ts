import express from 'express';
import validate from 'express-zod-safe';
import { LoginSchema, RegisterSchema } from '../../utils/zod-schemas';
import {
  comparePassword,
  createUser,
  deleteRefreshToken,
  findExistingUser,
  findUserByEmail,
  findUserByToken,
  findUserByUsername,
  generateAccessToken,
  generateAndUpdateUserWithResetToken,
  generateRefreshToken,
  saveRefreshToken,
  updateUserPasswordwithToken,
} from '../../service/user-service';
import { StatusCodes } from 'http-status-codes';
import { formatError, formatSuccess } from '../../utils/response-handling';
import z from 'zod';
import { EmailTemplate, TemplateVariant } from '../../utils/email-template';
import { Resend } from 'resend';

export const authController = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);

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
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
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

authController.put(
  '/init-forget-password',
  validate({ body: { email: z.email() } }),
  async (req, res) => {
    const { email } = req.body;

    const user = await findUserByEmail(email);

    if (user.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(user.error));
      return;
    }

    if (!user.value) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError({ message: 'User doesnt exist' }));
      return;
    }

    const updatedUser = await generateAndUpdateUserWithResetToken(
      user.value._id
    );

    if (updatedUser.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(updatedUser.error));
      return;
    }

    if (!updatedUser.value) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json(formatError({ message: 'Error while updating user' }));
      return;
    }

    await resend.emails.send({
      from: 'Acme <hasck-mern@resend.dev>',
      to: [`${updatedUser.value.email}`],
      subject: 'Password reset request',
      react: EmailTemplate({
        firstName: updatedUser.value.username,
        variant: TemplateVariant.passwordReset,
        hashedToken: updatedUser.value.passwordResetToken,
      }),
    });

    res.status(StatusCodes.OK).json(
      formatSuccess({
        message: 'Email sent successfully, please visit you inbox',
      })
    );
  }
);

authController.put(
  '/new-password/:token',
  validate({
    params: { token: z.string() },
    body: { oldPassword: z.string(), newPassword: z.string() },
  }),
  async (req, res) => {
    const { token } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!token) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(formatError({ message: 'Token must be provided' }));
      return;
    }

    const user = await findUserByToken(token);

    if (user.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(user.error));
      return;
    }

    if (!user.value) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json(formatError({ message: 'User doesnt exist' }));
      return;
    }

    if (oldPassword !== newPassword) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(formatError({ message: 'Passwords doesnt match' }));
      return;
    }

    const updatedUser = await updateUserPasswordwithToken(
      user.value.id,
      newPassword
    );

    if (updatedUser.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(updatedUser.error));
      return;
    }

    res.status(StatusCodes.OK).json(
      formatSuccess({
        message: 'Password updated successfully',
      })
    );
  }
);
