import axios, { type AxiosInstance } from 'axios';
import { ResultAsync } from 'neverthrow';
import type {
  ApiError,
  InitForgetPasswordErrorCode,
  LoginErrorCode,
  LoginResponse,
  MessageResponse,
  NewPasswordTokenErrorCode,
  OAuthRedirectErrorCode,
  OAuthRedirectResponse,
  RefreshTokenErrorCode,
  RefreshTokenResponse,
  RegisterErrorCode,
  UpdateEmailErrorCode,
  UpdatePasswordErrorCode,
} from './api-types';

export const BE_URL = 'http://localhost:3000';

function apiCall<TResponse, TCode extends string>(
  request: () => Promise<{ data: TResponse }>
): ResultAsync<TResponse, ApiError<TCode>> {
  return ResultAsync.fromPromise(
    request().then((res) => res.data),
    (error): ApiError<TCode> => {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status ?? 500;
        const backendError = error.response?.data?.error;
        return {
          code: backendError?.code ?? 'UNKNOWN_ERROR',
          message:
            backendError?.message ??
            error.response?.data?.message ??
            error.message,
          status,
        };
      }
      if (error instanceof Error) {
        return { code: 'NETWORK_ERROR', message: error.message, status: 0 };
      }
      return {
        code: 'UNKNOWN_ERROR',
        message: 'Something went wrong',
        status: 0,
      };
    }
  );
}

// ── Public API (no auth required) ──

export const api = {
  auth: {
    register(data: { username: string; email: string; password: string }) {
      return apiCall<MessageResponse, RegisterErrorCode>(() =>
        axios.post(`${BE_URL}/api/v1/auth/register`, data, {
          withCredentials: true,
        })
      );
    },

    login(data: { username: string; password: string }) {
      return apiCall<LoginResponse, LoginErrorCode>(() =>
        axios.post(`${BE_URL}/api/v1/auth/login`, data, {
          withCredentials: true,
        })
      );
    },

    logout(axiosInstance: AxiosInstance) {
      return apiCall<MessageResponse, never>(() =>
        axiosInstance.post(`${BE_URL}/api/v1/auth/logout`)
      );
    },

    initForgetPassword(data: { email: string }) {
      return apiCall<MessageResponse, InitForgetPasswordErrorCode>(() =>
        axios.put(`${BE_URL}/api/v1/auth/init-forget-password`, data, {
          withCredentials: true,
        })
      );
    },

    newPasswordWithToken(
      token: string,
      data: { oldPassword: string; newPassword: string }
    ) {
      return apiCall<MessageResponse, NewPasswordTokenErrorCode>(() =>
        axios.put(`${BE_URL}/api/v1/auth/new-password/${token}`, data, {
          withCredentials: true,
        })
      );
    },

    oauthRedirect(provider: string) {
      return apiCall<OAuthRedirectResponse, OAuthRedirectErrorCode>(() =>
        axios.get(`${BE_URL}/api/v1/auth/oauth/redirect`, {
          params: { provider },
          withCredentials: true,
        })
      );
    },
  },

  verify: {
    refreshToken(axiosInstance: AxiosInstance) {
      return apiCall<RefreshTokenResponse, RefreshTokenErrorCode>(() =>
        axiosInstance.post(`${BE_URL}/api/v1/verify/refresh-token`)
      );
    },
  },
};

// ── Authenticated API (requires auth axios instance) ──

export function createAuthApi(axiosInstance: AxiosInstance) {
  return {
    user: {
      updatePassword(data: { oldPassword: string; newPassword: string }) {
        return apiCall<MessageResponse, UpdatePasswordErrorCode>(() =>
          axiosInstance.put(`${BE_URL}/api/v1/user/new-password`, data, {
            withCredentials: true,
          })
        );
      },

      updateEmail(data: { oldEmail: string; newEmail: string }) {
        return apiCall<MessageResponse, UpdateEmailErrorCode>(() =>
          axiosInstance.put(`${BE_URL}/api/v1/user/email-update`, data, {
            withCredentials: true,
          })
        );
      },
    },
  };
}
