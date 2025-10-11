import type { InitPasswordResetSchema } from '@/pages/auth/init-forget-page';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import z from 'zod';
import { BE_URL } from './use-login';

type PasswordResetResponse = {
  message: string;
};

export const usePasswordResetInit = () => {
  return useMutation<
    PasswordResetResponse,
    Error,
    z.infer<typeof InitPasswordResetSchema>
  >({
    mutationFn: async (data: z.infer<typeof InitPasswordResetSchema>) => {
      const response = await axios.put<PasswordResetResponse>(
        `${BE_URL}/api/v1/auth/init-forget-password`,
        data,
        { withCredentials: true }
      );

      return response.data;
    },
  });
};
