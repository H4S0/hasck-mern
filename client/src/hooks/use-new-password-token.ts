import { passwordSchema } from '@/components/forms/password-reset-form';
import { api } from '@/lib/api-client';
import type {
  ApiError,
  MessageResponse,
  NewPasswordTokenErrorCode,
} from '@/lib/api-types';
import { createSHA512Hash } from '@/lib/hashing';
import { useMutation } from '@tanstack/react-query';
import z from 'zod';

export const usePasswordReset = (token: string) => {
  return useMutation<
    MessageResponse,
    ApiError<NewPasswordTokenErrorCode>,
    z.infer<typeof passwordSchema>
  >({
    mutationFn: async (data: z.infer<typeof passwordSchema>) => {
      const oldHashedPassword = await createSHA512Hash(data.oldPassword);
      const newHashedPassword = await createSHA512Hash(data.newPassword);

      const result = await api.auth.newPasswordWithToken(token, {
        ...data,
        oldPassword: oldHashedPassword,
        newPassword: newHashedPassword,
      });

      if (result.isErr()) throw result.error;
      return result.value;
    },
  });
};
