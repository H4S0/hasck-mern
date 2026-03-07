import { useMutation } from '@tanstack/react-query';
import z from 'zod';
import { createSHA512Hash } from '@/lib/hashing';
import type { passwordSchema } from '@/components/forms/password-reset-form';
import { createAuthApi } from '@/lib/api-client';
import type { ApiError } from '@/lib/api-types';
import { useUser } from '@/context/auth-context';

type PasswordResetResponse = {
  message: string;
};

export const useNewPassword = () => {
  const { axios } = useUser();
  const authApi = createAuthApi(axios);

  return useMutation<
    PasswordResetResponse,
    ApiError,
    z.infer<typeof passwordSchema>
  >({
    mutationFn: async (data: z.infer<typeof passwordSchema>) => {
      const oldHashedPassword = await createSHA512Hash(data.oldPassword);
      const newHashedPassword = await createSHA512Hash(data.newPassword);

      const result = await authApi.user.updatePassword({
        ...data,
        oldPassword: oldHashedPassword,
        newPassword: newHashedPassword,
      });

      if (result.isErr()) throw result.error;
      return result.value as PasswordResetResponse;
    },
  });
};
