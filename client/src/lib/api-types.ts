type BaseErrorCode = 'NETWORK_ERROR' | 'UNKNOWN_ERROR';

export type ApiError<TCode extends string = string> = {
  code: TCode | BaseErrorCode;
  message: string;
  status: number;
};

export type RegisterErrorCode =
  | 'FINDING_USER_ERROR' // findExistingUser DB failure
  | 'CREATING_USER_ERROR' // createUser DB failure
  | 'HASHING_PASSWORD_ERROR' // bcrypt hash failure
  | 'USER_ALREADY_EXISTS'; // user already exists (400)

export type LoginErrorCode =
  | 'FINDING_USER_ERROR' // findUserByUsername DB failure
  | 'COMPARING_PASSWORD_ERROR' // bcrypt compare failure
  | 'USER_NOT_FOUND' // user doesn't exist (400)
  | 'INVALID_CREDENTIALS'; // wrong password (500)

export type InitForgetPasswordErrorCode =
  | 'FINDING_USER_ERROR' // findUserByEmail DB failure
  | 'UPDATING_USER_ERROR' // generateAndUpdateUserWithResetToken DB failure
  | 'USER_NOT_FOUND'; // user doesn't exist (500)

export type NewPasswordTokenErrorCode =
  | 'FIND_USER_BYTOKEN_ERROR' // findUserByToken DB failure
  | 'UPDATING_USER_PASSWORD' // updateUserPasswordwithToken DB failure
  | 'HASHING_PASSWORD_ERROR' // bcrypt hash failure
  | 'TOKEN_REQUIRED' // no token provided (400)
  | 'USER_NOT_FOUND' // user not found by token (404)
  | 'PASSWORDS_DONT_MATCH'; // old !== new password (400)

export type UpdatePasswordErrorCode =
  | 'FINDING_USER_ERROR' // findUserById DB failure
  | 'COMPARING_PASSWORD_ERROR' // bcrypt compare failure
  | 'UPDATING_PASSWORD_ERROR' // updateUserPassword DB failure
  | 'HASHING_PASSWORD_ERROR' // bcrypt hash failure
  | 'UNAUTHORIZED' // no userId on request (401)
  | 'USER_NOT_FOUND' // user not found (404)
  | 'INVALID_CREDENTIALS'; // old password wrong (500)

export type UpdateEmailErrorCode =
  | 'FINDING_USER_ERROR' // findUserByEmail DB failure
  | 'GENERATE_ACCESS_TOKEN_ERROR' // updateUserEmail DB failure (misnamed in backend)
  | 'USER_NOT_FOUND' // old email not found (404)
  | 'EMAIL_ALREADY_IN_USE'; // new email taken (404)

export type RefreshTokenErrorCode =
  | 'FINDING_USER_ERROR' // findUserById DB failure
  | 'UPDATING_USER_ERROR' // generateAndUpdateRefreshToken DB failure
  | 'TOKEN_NOT_PROVIDED' // no refresh token cookie (401)
  | 'TOKEN_EXPIRED' // refresh token expired/invalid (401)
  | 'USER_NOT_FOUND'; // user not found (404)

export type OAuthRedirectErrorCode = 'INVALID_PROVIDER'; // unknown OAuth provider (400)

// ── Per-endpoint response types ──

export type MessageResponse = {
  success: true;
  message: string;
};

export type LoginResponse = {
  success: true;
  message: string;
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
      accessToken: string;
    };
  };
};

export type OAuthRedirectResponse = {
  data: {
    redirectUrl: string;
  };
};

export type RefreshTokenResponse = {
  success: true;
  message: string;
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      role: string;
      accessToken: string;
    };
  };
};
