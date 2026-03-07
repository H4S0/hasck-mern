import type { InitPasswordResetSchema } from '@/pages/auth/init-forget-page';
import { api } from '@/lib/api-client';
import type {
  ApiError,
  InitForgetPasswordErrorCode,
  MessageResponse,
} from '@/lib/api-types';
import { useMutation } from '@tanstack/react-query';
import type { Result } from 'neverthrow';
import z from 'zod';

export const usePasswordResetInit = () => {
  return useMutation<
    Result<MessageResponse, ApiError<InitForgetPasswordErrorCode>>,
    never,
    z.infer<typeof InitPasswordResetSchema>
  >({
    mutationFn: async (data: z.infer<typeof InitPasswordResetSchema>) => {
      return api.auth.initForgetPassword(data);
    },
  });
};
