import { EmailUpdateSchema } from '@/components/forms/update-email-form';
import { createAuthApi } from '@/lib/api-client';
import type { ApiError } from '@/lib/api-types';
import { useUser } from '@/context/auth-context';
import { useMutation } from '@tanstack/react-query';
import z from 'zod';

type EmailUpdateResponse = {
  message: string;
};

export const useEmailUpdate = () => {
  const { axios } = useUser();
  const authApi = createAuthApi(axios);

  return useMutation<
    EmailUpdateResponse,
    ApiError,
    z.infer<typeof EmailUpdateSchema>
  >({
    mutationFn: async (data: z.infer<typeof EmailUpdateSchema>) => {
      const result = await authApi.user.updateEmail(data);

      if (result.isErr()) throw result.error;
      return result.value as EmailUpdateResponse;
    },
  });
};
