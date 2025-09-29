import { LoginSchema } from '@/components/forms/login-form';
import type { User } from '@/context/auth-context';
import { getErrorMessage } from '@/lib/error-helper';
import { createSHA512Hash } from '@/lib/hashing';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import z from 'zod';

export const BE_URL = 'http://localhost:3000';

type LoginResponse = {
  message: string;
  data: {
    user: User;
  };
};

export const useLogin = () => {
  return useMutation<LoginResponse, Error, z.infer<typeof LoginSchema>>({
    mutationFn: async (data: z.infer<typeof LoginSchema>) => {
      try {
        const hashedPassword = await createSHA512Hash(data.password);

        const newData = {
          ...data,
          password: hashedPassword,
        };

        const response = await axios.post<LoginResponse>(
          `${BE_URL}/api/v1/auth/login`,
          newData,
          { withCredentials: true }
        );

        return response.data;
      } catch (err) {
        throw new Error(getErrorMessage(err));
      }
    },
  });
};
