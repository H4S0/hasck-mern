import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import { formatError } from '../utils/response-handling';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AuthPayload extends JwtPayload {
  _id: string;
  username: string;
  email: string;
  role: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthPayload;
  }
}

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      res.status(StatusCodes.UNAUTHORIZED).json(
        formatError({
          message: 'You are not authorized to perform this action',
        })
      );
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;

    if (!decoded || !decoded._id) {
      res.status(StatusCodes.UNAUTHORIZED).json(
        formatError({
          message: 'Invalid or expired token',
        })
      );
      return;
    }

    req.user = decoded;

    next();
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json(
      formatError({
        message: 'You are not authorized to access this page!',
      })
    );
  }
};
