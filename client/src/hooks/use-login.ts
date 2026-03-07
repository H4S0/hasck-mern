import { LoginSchema } from '@/components/forms/login-form';
import { api } from '@/lib/api-client';
import type { ApiError, LoginErrorCode, LoginResponse } from '@/lib/api-types';
import { createSHA512Hash } from '@/lib/hashing';
import { useMutation } from '@tanstack/react-query';
import z from 'zod';

export const useLogin = () => {
  return useMutation<
    LoginResponse,
    ApiError<LoginErrorCode>,
    z.infer<typeof LoginSchema>
  >({
    mutationFn: async (data: z.infer<typeof LoginSchema>) => {
      const hashedPassword = await createSHA512Hash(data.password);

      const result = await api.auth.login({
        ...data,
        password: hashedPassword,
      });

      if (result.isErr()) throw result.error;
      return result.value;
    },
  });
};
