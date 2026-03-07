import axios, { type AxiosInstance } from 'axios';
import { ResultAsync, err, ok } from 'neverthrow';
import type { ApiError, ApiSuccessResponse } from './api-types';

export const BE_URL = 'http://localhost:3000';

/**
 * Wraps an axios call into a ResultAsync<TData, ApiError>.
 * Extracts the backend error shape automatically — no try-catch needed.
 */
function apiCall<TData>(
  request: () => Promise<{ data: ApiSuccessResponse<TData> }>
): ResultAsync<ApiSuccessResponse<TData>, ApiError> {
  return ResultAsync.fromPromise(
    request().then((res) => res.data),
    (error): ApiError => {
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
      return { code: 'UNKNOWN_ERROR', message: 'Something went wrong', status: 0 };
    }
  );
}

// ── Public API (no auth required) ──

export const api = {
  auth: {
    register(data: { username: string; email: string; password: string }) {
      return apiCall<undefined>(() =>
        axios.post(`${BE_URL}/api/v1/auth/register`, data, {
          withCredentials: true,
        })
      );
    },

    login(data: { username: string; password: string }) {
      return apiCall<{
        user: {
          id: string;
          username: string;
          email: string;
          role: string;
          accessToken: string;
        };
      }>(() =>
        axios.post(`${BE_URL}/api/v1/auth/login`, data, {
          withCredentials: true,
        })
      );
    },

    logout(axiosInstance: AxiosInstance) {
      return apiCall<undefined>(() =>
        axiosInstance.post(`${BE_URL}/api/v1/auth/logout`)
      );
    },

    initForgetPassword(data: { email: string }) {
      return apiCall<undefined>(() =>
        axios.put(`${BE_URL}/api/v1/auth/init-forget-password`, data, {
          withCredentials: true,
        })
      );
    },

    newPasswordWithToken(
      token: string,
      data: { oldPassword: string; newPassword: string }
    ) {
      return apiCall<undefined>(() =>
        axios.put(`${BE_URL}/api/v1/auth/new-password/${token}`, data, {
          withCredentials: true,
        })
      );
    },

    oauthRedirect(provider: string) {
      return apiCall<{ redirectUrl: string }>(() =>
        axios.get(`${BE_URL}/api/v1/auth/oauth/redirect`, {
          params: { provider },
          withCredentials: true,
        })
      );
    },
  },

  verify: {
    refreshToken(axiosInstance: AxiosInstance) {
      return apiCall<{
        user: {
          _id: string;
          username: string;
          email: string;
          role: string;
          accessToken: string;
        };
      }>(() =>
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
        return apiCall<undefined>(() =>
          axiosInstance.put(`${BE_URL}/api/v1/user/new-password`, data, {
            withCredentials: true,
          })
        );
      },

      updateEmail(data: { oldEmail: string; newEmail: string }) {
        return apiCall<undefined>(() =>
          axiosInstance.put(`${BE_URL}/api/v1/user/email-update`, data, {
            withCredentials: true,
          })
        );
      },
    },
  };
}
