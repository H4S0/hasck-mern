import { useMutation } from '@tanstack/react-query';
import z from 'zod';
import { createSHA512Hash } from '@/lib/hashing';
import type { passwordSchema } from '@/components/forms/password-reset-form';
import { createAuthApi } from '@/lib/api-client';
import type {
  ApiError,
  MessageResponse,
  UpdatePasswordErrorCode,
} from '@/lib/api-types';
import { useUser } from '@/context/auth-context';
import type { Result } from 'neverthrow';

export const useNewPassword = () => {
  const { axios } = useUser();
  const authApi = createAuthApi(axios);

  return useMutation<
    Result<MessageResponse, ApiError<UpdatePasswordErrorCode>>,
    never,
    z.infer<typeof passwordSchema>
  >({
    mutationFn: async (data: z.infer<typeof passwordSchema>) => {
      const oldHashedPassword = await createSHA512Hash(data.oldPassword);
      const newHashedPassword = await createSHA512Hash(data.newPassword);

      return authApi.user.updatePassword({
        ...data,
        oldPassword: oldHashedPassword,
        newPassword: newHashedPassword,
      });
    },
  });
};
