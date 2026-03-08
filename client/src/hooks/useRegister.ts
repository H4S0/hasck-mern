import type { RegisterSchema } from '@/components/forms/register-form';
import { api } from '@/utils/api/api-client';
import type {
  ApiError,
  MessageResponse,
  RegisterErrorCode,
} from '@/utils/api/api-types';
import { createSHA512Hash } from '@/utils/auth/hashing';
import { useMutation } from '@tanstack/react-query';
import type { Result } from 'neverthrow';
import z from 'zod';

export const useRegister = () => {
  return useMutation<
    Result<MessageResponse, ApiError<RegisterErrorCode>>,
    never,
    z.infer<typeof RegisterSchema>
  >({
    mutationFn: async (data: z.infer<typeof RegisterSchema>) => {
      const hashedPassword = await createSHA512Hash(data.password);

      return api.auth.register({
        ...data,
        password: hashedPassword,
      });
    },
  });
};
