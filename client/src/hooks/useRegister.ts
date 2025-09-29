import type { RegisterSchema } from '@/components/forms/register-form';
import { createSHA512Hash } from '@/lib/hashing';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import z from 'zod';
import { BE_URL } from './use-login';
import { getErrorMessage } from '@/lib/error-helper';

type RegisterResponse = {
  message: string;
};

export const useRegister = () => {
  return useMutation<RegisterResponse, Error, z.infer<typeof RegisterSchema>>({
    mutationFn: async (data: z.infer<typeof RegisterSchema>) => {
      try {
        const hashedPassword = await createSHA512Hash(data.password);

        const newData = {
          ...data,
          password: hashedPassword,
        };

        const response = await axios.post<RegisterResponse>(
          `${BE_URL}/api/v1/auth/register`,
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
