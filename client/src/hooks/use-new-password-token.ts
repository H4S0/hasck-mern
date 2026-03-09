import { passwordSchema } from '@/components/forms/password-reset-form';
import { api } from '@/utils/api/api-client';
import type {
  ApiError,
  MessageResponse,
  NewPasswordTokenErrorCode,
} from '@/utils/api/api-types';
import { createSHA512Hash } from '@/utils/auth/hashing';
import { useMutation } from '@tanstack/react-query';
import type { Result } from 'neverthrow';
import z from 'zod';

export const usePasswordReset = (token: string) => {
  return useMutation<
    Result<MessageResponse, ApiError<NewPasswordTokenErrorCode>>,
    never,
    z.infer<typeof passwordSchema>
  >({
    mutationFn: async (data: z.infer<typeof passwordSchema>) => {
      const oldHashedPassword = await createSHA512Hash(data.oldPassword);
      const newHashedPassword = await createSHA512Hash(data.newPassword);

      return api.auth.newPasswordWithToken(token, {
        ...data,
        oldPassword: oldHashedPassword,
        newPassword: newHashedPassword,
      });
    },
  });
};
