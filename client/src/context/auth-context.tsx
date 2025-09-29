import { createContext, useContext, useState, type ReactNode } from 'react';
import axios, { type AxiosInstance } from 'axios';
import { BE_URL } from '@/hooks/use-login';

export type UserResponse = {
  data: {
    user: User;
  };
};

export type User = {
  _id: string;
  username: string;
  email: string;
  role: string;
  accessToken: string;
};

type UserContextOpts = {
  user: User | null;
  setUser: (user: User | null) => void;
  refetchUser: () => Promise<User | null>;
  logout: () => void;
  axios: AxiosInstance;
};

const UserContext = createContext<UserContextOpts | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const axiosInstance = axios.create({
    withCredentials: true,
  });

  const refetchUser = async () => {
    try {
      const res = await axiosInstance.post<UserResponse>(
        'http://localhost:3000/api/v1/verify/refresh-token'
      );
      setUser(res.data.data.user);
      return res.data.data.user;
    } catch {
      setUser(null);
      return null;
    }
  };
  axiosInstance.interceptors.request.use((config) => {
    if (user?.accessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
  });

  axiosInstance.interceptors.response.use(
    (res) => res,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        await refetchUser();
        if (user?.accessToken) {
          originalRequest.headers[
            'Authorization'
          ] = `Bearer ${user.accessToken}`;
          return axiosInstance(originalRequest);
        }
      }
      return Promise.reject(error);
    }
  );

  const logout = async () => {
    try {
      await axiosInstance.post(`${BE_URL}/api/v1/auth/logout`);
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, setUser, refetchUser, axios: axiosInstance, logout }}
    >
      {children}
    </UserContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used inside UserProvider');
  return ctx;
};
