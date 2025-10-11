import { passwordSchema } from '@/components/forms/password-reset-form';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import z from 'zod';

type PasswordResetResponse = {
  message: string;
};

export const usePasswordReset = (token) => {
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
        `/api/auth/forgot-password/${token}`,
        newData,
        { withCredentials: true }
      );

      return response.data;
    },
  });
};
