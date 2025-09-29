import express from 'express';
import validate from 'express-zod-safe';
import { EmailUpdateSchema, NewPasswordSchema } from '../../utils/zod-schemas';
import {
  comparePassword,
  findUserByEmail,
  findUserById,
  updateUserEmail,
  updateUserPassword,
} from '../../service/user-service';
import { StatusCodes } from 'http-status-codes';
import { formatError, formatSuccess } from '../../utils/response-handling';

export const userController = express.Router();

userController.put(
  '/new-password',
  validate({ body: NewPasswordSchema }),
  async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      res.status(StatusCodes.UNAUTHORIZED).json(
        formatError({
          message: 'You are not authorized to perform this action',
        })
      );
      return;
    }

    const user = await findUserById(userId);

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

    const isMatch = await comparePassword(oldPassword, user.value.password);

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

    const updatedUser = await updateUserPassword(userId, newPassword);

    if (updatedUser.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(updatedUser.error));
      return;
    }

    res
      .status(StatusCodes.OK)
      .json(formatSuccess({ message: 'Password updated successfully' }));
  }
);

userController.put(
  '/email-update',
  validate({ body: EmailUpdateSchema }),
  async (req, res) => {
    const { oldEmail, newEmail } = req.body;

    const existingUser = await findUserByEmail(oldEmail);

    if (existingUser.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(existingUser.error));
      return;
    }

    if (!existingUser.value) {
      res.status(StatusCodes.NOT_FOUND).json(
        formatError({
          message: 'User not exist',
        })
      );
      return;
    }

    const existingWithNewEmail = await findUserByEmail(newEmail);

    if (existingWithNewEmail.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(existingWithNewEmail.error));
      return;
    }

    if (existingWithNewEmail.value) {
      res.status(StatusCodes.NOT_FOUND).json(
        formatError({
          message: 'This email is already in use',
        })
      );
      return;
    }

    const updated = await updateUserEmail(existingUser.value._id, newEmail);

    if (updated.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(updated.error));
      return;
    }

    res
      .status(StatusCodes.OK)
      .json(formatSuccess({ message: 'Email updated successfully' }));
  }
);
