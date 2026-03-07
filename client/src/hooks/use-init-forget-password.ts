import type { InitPasswordResetSchema } from '@/pages/auth/init-forget-page';
import { api } from '@/lib/api-client';
import type { ApiError } from '@/lib/api-types';
import { useMutation } from '@tanstack/react-query';
import z from 'zod';

type PasswordResetResponse = {
  message: string;
};

export const usePasswordResetInit = () => {
  return useMutation<
    PasswordResetResponse,
    ApiError,
    z.infer<typeof InitPasswordResetSchema>
  >({
    mutationFn: async (data: z.infer<typeof InitPasswordResetSchema>) => {
      const result = await api.auth.initForgetPassword(data);

      if (result.isErr()) throw result.error;
      return result.value as PasswordResetResponse;
    },
  });
};
