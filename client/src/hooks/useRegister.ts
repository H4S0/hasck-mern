import type { RegisterSchema } from '@/components/forms/register-form';
import { api } from '@/lib/api-client';
import type {
  ApiError,
  MessageResponse,
  RegisterErrorCode,
} from '@/lib/api-types';
import { createSHA512Hash } from '@/lib/hashing';
import { useMutation } from '@tanstack/react-query';
import z from 'zod';

export const useRegister = () => {
  return useMutation<
    MessageResponse,
    ApiError<RegisterErrorCode>,
    z.infer<typeof RegisterSchema>
  >({
    mutationFn: async (data: z.infer<typeof RegisterSchema>) => {
      const hashedPassword = await createSHA512Hash(data.password);

      const result = await api.auth.register({
        ...data,
        password: hashedPassword,
      });

      if (result.isErr()) throw result.error;
      return result.value;
    },
  });
};
