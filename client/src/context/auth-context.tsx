import { createContext, useContext, useState, type ReactNode } from 'react';
import axios, { type AxiosInstance } from 'axios';
import { api } from '@/lib/api-client';

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
    const result = await api.verify.refreshToken(axiosInstance);

    if (result.isErr()) {
      setUser(null);
      return null;
    }

    const { id, ...rest } = result.value.data.user;
    const refreshedUser: User = { _id: id, ...rest };
    setUser(refreshedUser);
    return refreshedUser;
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
    await api.auth.logout(axiosInstance);
    setUser(null);
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
