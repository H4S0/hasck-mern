import { useMutation } from '@tanstack/react-query';
import z from 'zod';
import { createSHA512Hash } from '@/utils/auth/hashing';
import type { passwordSchema } from '@/components/forms/password-reset-form';
import { createAuthApi } from '@/utils/api/api-client';
import type {
  ApiError,
  MessageResponse,
  UpdatePasswordErrorCode,
} from '@/utils/api/api-types';
import { useAuth } from '@/utils/auth/auth';
import type { Result } from 'neverthrow';

export const useNewPassword = () => {
  const { axios } = useAuth();
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
