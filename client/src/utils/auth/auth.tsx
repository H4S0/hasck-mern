import * as React from 'react';
import { useState, useCallback, useEffect, useMemo } from 'react';
import axios from 'axios';
import { api } from '@/utils/api/api-client';
import { createSHA512Hash } from '@/utils/auth/hashing';
import {
  type User,
  clearUser,
  getStoredUser,
  setStoredUser,
  setAccessToken,
} from './auth-storage';
import { toast } from 'sonner';

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  axios: import('axios').AxiosInstance;
  loginUser: (data: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  refetchUser: () => Promise<User | null>;
  setOAuthUser: (user: User) => void;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(getStoredUser());
  const isAuthenticated = !!user;

  const axiosInstance = useMemo(() => {
    const instance = axios.create({ withCredentials: true });

    instance.interceptors.request.use((config) => {
      const storedUser = getStoredUser();
      if (storedUser?.accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${storedUser.accessToken}`;
      }
      return config;
    });

    instance.interceptors.response.use(
      (res) => res,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const result = await api.verify.refreshToken(instance);
          if (result.isOk()) {
            const refreshedUser = result.value.data.user;
            setAccessToken(refreshedUser.accessToken);
            originalRequest.headers['Authorization'] =
              `Bearer ${refreshedUser.accessToken}`;
            return instance(originalRequest);
          }
        }
        return Promise.reject(error);
      },
    );

    return instance;
  }, []);

  const refetchUser = useCallback(async () => {
    const result = await api.verify.refreshToken(axiosInstance);

    if (result.isErr()) {
      setUser(null);
      clearUser();
      return null;
    }

    const refreshedUser = result.value.data.user;
    setUser(refreshedUser);
    setStoredUser(refreshedUser);
    return refreshedUser;
  }, [axiosInstance]);

  const loginUser = useCallback(
    async (data: { username: string; password: string }) => {
      const hashedPassword = await createSHA512Hash(data.password);

      const result = await api.auth.login({
        username: data.username,
        password: hashedPassword,
      });

      result.match(
        (response) => {
          toast.success(response.message);
          const loggedInUser = response.data.user;
          setUser(loggedInUser);
          setStoredUser(loggedInUser);
        },
        (error) => {
          toast.error(error.message);
          throw error;
        },
      );
    },
    [],
  );

  const logout = useCallback(async () => {
    await api.auth.logout(axiosInstance);
    setUser(null);
    clearUser();
  }, [axiosInstance]);

  const setOAuthUser = useCallback((oauthUser: User) => {
    setUser(oauthUser);
    setStoredUser(oauthUser);
  }, []);

  useEffect(() => {
    setUser(getStoredUser());
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      axios: axiosInstance,
      loginUser,
      logout,
      refetchUser,
      setOAuthUser,
    }),
    [isAuthenticated, user, axiosInstance, loginUser, logout, refetchUser, setOAuthUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
