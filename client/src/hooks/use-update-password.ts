import { useMutation } from '@tanstack/react-query';
import z from 'zod';
import { createSHA512Hash } from '@/lib/hashing';
import type { passwordSchema } from '@/components/forms/password-reset-form';
import { BE_URL } from './use-login';
import { useUser } from '@/context/auth-context';
import { getErrorMessage } from '@/lib/error-helper';

type PasswordResetResponse = {
  message: string;
};

export const useNewPassword = () => {
  const { axios } = useUser();
  return useMutation<
    PasswordResetResponse,
    Error,
    z.infer<typeof passwordSchema>
  >({
    mutationFn: async (data: z.infer<typeof passwordSchema>) => {
      try {
        const oldHashedPassword = await createSHA512Hash(data.oldPassword);
        const newHashedPassword = await createSHA512Hash(data.newPassword);

        const newData = {
          ...data,
          oldPassword: oldHashedPassword,
          newPassword: newHashedPassword,
        };
        const response = await axios.put<PasswordResetResponse>(
          `${BE_URL}/api/v1/user/new-password`,
          newData,
          { withCredentials: true }
        );

        return response.data;
      } catch (err) {
        throw new Error(getErrorMessage(err));
      }
    },
  });
};
