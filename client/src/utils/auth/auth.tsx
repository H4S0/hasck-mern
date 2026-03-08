import * as React from 'react';
import { useState, useCallback, useEffect, useMemo } from 'react';
import type z from 'zod';
import { api } from '../axios-config/axios';
import {
  type User,
  clearUser,
  getStoredUser,
  setStoredUser,
} from './auth-storage';
import { login, LoginSchema } from '../api/user';
import type { ApiResponse } from '../axios-config/axios';
import { toast } from 'sonner';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loginUser: (data: z.infer<typeof LoginSchema>) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<User | null>;
  setOAuthUser: (user: User) => void;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

function isApiResponse(error: any): error is ApiResponse<any> {
  return (
    typeof error === 'object' &&
    error !== null &&
    'success' in error &&
    'message' in error
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const isAuthenticated = !!user;

  const refetchUser = useCallback(async () => {
    try {
      const res = await api.post<User>('/verify/refresh-token');
      const updatedUser = res.data.data;

      setUser(updatedUser);
      setStoredUser(updatedUser);

      return updatedUser;
    } catch (error) {
      setUser(null);
      clearUser();

      if (isApiResponse(error)) {
        toast.error(error.message || 'Please login again!');
      }
      return null;
    }
  }, []);

  const loginUser = useCallback(async (data: z.infer<typeof LoginSchema>) => {
    try {
      const res = await login(data);

      toast.success(res.message || 'You have logged in successfully!');

      if (res.data) {
        setUser(res.data);
        setStoredUser(res.data);
      }
    } catch (error) {
      if (isApiResponse(error)) {
        toast.error(error.message || 'Something went wrong, please try again');
      } else {
        toast.error('Something went wrong. Please check your connection.');
      }

      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setUser(null);
      setStoredUser(null);
      clearUser();
    }
  }, []);

  const setOAuthUser = useCallback((user: User) => {
    setUser(user);
    setStoredUser(user);
  }, []);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      loginUser,
      logout,
      refetchUser,
      setOAuthUser,
    }),
    [isAuthenticated, user, loginUser, logout, refetchUser, setOAuthUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
