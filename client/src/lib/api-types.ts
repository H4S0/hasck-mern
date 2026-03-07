// Backend error response shape: { success: false, error: { code, message } }
export type ApiError = {
  code: string;
  message: string;
  status: number;
};

// Backend success response shape: { success: true, message?, data? }
export type ApiSuccessResponse<TData = undefined> = {
  success: true;
  message?: string;
} & (TData extends undefined ? {} : { data: TData });

// ── Error codes per endpoint ──
// These match the error codes your backend can return.

export type RegisterErrorCode =
  | 'FINDING_USER_ERROR'
  | 'CREATING_USER_ERROR'
  | 'USER_ALREADY_EXISTS';

export type LoginErrorCode =
  | 'FINDING_USER_ERROR'
  | 'COMPARING_PASSWORD_ERROR'
  | 'USER_NOT_FOUND'
  | 'INVALID_CREDENTIALS';

export type InitForgetPasswordErrorCode =
  | 'FINDING_USER_ERROR'
  | 'UPDATING_USER_ERROR'
  | 'USER_NOT_FOUND';

export type NewPasswordTokenErrorCode =
  | 'FIND_USER_BYTOKEN_ERROR'
  | 'UPDATING_USER_PASSWORD'
  | 'USER_NOT_FOUND'
  | 'PASSWORDS_DONT_MATCH';

export type UpdatePasswordErrorCode =
  | 'FINDING_USER_ERROR'
  | 'COMPARING_PASSWORD_ERROR'
  | 'UPDATING_PASSWORD_ERROR'
  | 'USER_NOT_FOUND'
  | 'INVALID_CREDENTIALS'
  | 'UNAUTHORIZED';

export type UpdateEmailErrorCode =
  | 'FINDING_USER_ERROR'
  | 'GENERATE_ACCESS_TOKEN_ERROR'
  | 'USER_NOT_FOUND'
  | 'EMAIL_ALREADY_IN_USE';

export type RefreshTokenErrorCode =
  | 'FINDING_USER_ERROR'
  | 'INVALID_TOKEN';

export type OAuthRedirectErrorCode =
  | 'INVALID_PROVIDER';

// ── Response data types ──

export type LoginData = {
  user: {
    id: string;
    username: string;
    email: string;
    role: string;
    accessToken: string;
  };
};

export type OAuthRedirectData = {
  redirectUrl: string;
};

export type RefreshTokenData = {
  user: {
    _id: string;
    username: string;
    email: string;
    role: string;
    accessToken: string;
  };
};
