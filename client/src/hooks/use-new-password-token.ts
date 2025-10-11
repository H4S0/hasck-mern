import { passwordSchema } from '@/components/forms/password-reset-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import z from 'zod';
import { BE_URL } from './use-login';

type PasswordResetResponse = {
  message: string;
};

export const usePasswordReset = (token: string) => {
  return useMutation<
    PasswordResetResponse,
    Error,
    z.infer<typeof passwordSchema>
  >({
    mutationFn: async (data: z.infer<typeof passwordSchema>) => {
      const newData = {
        ...data,
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      };
      const response = await axios.put<PasswordResetResponse>(
        `${BE_URL}/api/v1/auth/forgot-password/${token}`,
        newData,
        { withCredentials: true }
      );

      return response.data;
    },
  });
};
