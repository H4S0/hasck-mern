import { createContext } from 'react';
import type { Result } from 'neverthrow';
import type { ApiError, LoginErrorCode, LoginResponse } from '@/utils/api/api-types';
import type { User } from './auth-storage';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  axios: import('axios').AxiosInstance;
  loginUser: (data: { username: string; password: string }) => Promise<Result<LoginResponse, ApiError<LoginErrorCode>>>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<User | null>;
  setOAuthUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
