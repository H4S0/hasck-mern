import type { InitPasswordResetSchema } from '@/pages/auth/init-forget-page';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import z from 'zod';

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
        '/api/auth/forgot-password/init',
        data,
        { withCredentials: true }
      );

      return response.data;
    },
  });
};
