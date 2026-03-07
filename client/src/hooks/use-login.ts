import { LoginSchema } from '@/components/forms/login-form';
import { api } from '@/lib/api-client';
import type { ApiError, LoginErrorCode, LoginResponse } from '@/lib/api-types';
import { createSHA512Hash } from '@/lib/hashing';
import { useMutation } from '@tanstack/react-query';
import type { Result } from 'neverthrow';
import z from 'zod';

export const useLogin = () => {
  return useMutation<
    Result<LoginResponse, ApiError<LoginErrorCode>>,
    never,
    z.infer<typeof LoginSchema>
  >({
    mutationFn: async (data: z.infer<typeof LoginSchema>) => {
      const hashedPassword = await createSHA512Hash(data.password);

      return api.auth.login({
        ...data,
        password: hashedPassword,
      });
    },
  });
};
