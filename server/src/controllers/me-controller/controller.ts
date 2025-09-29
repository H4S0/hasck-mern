import express from 'express';
import jwt, { JwtPayload as DefaultJwtPayload } from 'jsonwebtoken';
import {
  findUserById,
  generateAccessToken,
  generateAndUpdateRefreshToken,
  getAuthToken,
} from '../../service/user-service';
import { StatusCodes } from 'http-status-codes';
import { formatError, formatSuccess } from '../../utils/response-handling';

interface RefreshTokenPayload extends DefaultJwtPayload {
  _id: string;
}

export const meController = express.Router();

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

meController.post('/refresh-token', async (req, res) => {
  const oldRefreshToken = getAuthToken(req);

  if (!oldRefreshToken) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json(formatError({ message: 'Refresh token not provided' }));
    return;
  }

  const decoded = jwt.verify(
    oldRefreshToken,
    REFRESH_TOKEN_SECRET
  ) as RefreshTokenPayload;

  const userResult = await findUserById(decoded._id);

  if (userResult.isErr()) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(formatError(userResult.error));
    return;
  }

  const user = userResult.value;

  if (!user) {
    res
      .status(StatusCodes.NOT_FOUND)
      .json(formatError({ message: 'User does not exist' }));
    return;
  }

  if (user.refreshToken !== oldRefreshToken) {
    const tokenData = jwt.decode(oldRefreshToken) as RefreshTokenPayload | null;
    if (!tokenData || (tokenData.exp && tokenData.exp * 1000 < Date.now())) {
      res
        .status(StatusCodes.UNAUTHORIZED)
        .json(formatError({ message: 'Refresh token expired or invalid' }));
      return;
    }
  }

  const tokenExpMs = (decoded.exp ?? 0) * 1000 - Date.now();
  let newRefreshToken = oldRefreshToken;
  if (tokenExpMs < 24 * 60 * 60 * 1000) {
    const rotated = await generateAndUpdateRefreshToken(
      user._id,
      user.username,
      user.email,
      user.role
    );
    if (rotated.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(rotated.error));
      return;
    }
    newRefreshToken = rotated.value?.refreshToken;
  }

  const accessTokenResult = await generateAccessToken(
    user._id,
    user.username,
    user.email,
    user.role
  );
  if (accessTokenResult.isErr()) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(formatError(accessTokenResult.error));
    return;
  }

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(StatusCodes.OK).json(
    formatSuccess({
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          accessToken: accessTokenResult.value,
        },
      },
      message: 'Access token refreshed successfully',
    })
  );
});
