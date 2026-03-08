import { EmailUpdateSchema } from '@/components/forms/update-email-form';
import { createAuthApi } from '@/lib/api-client';
import type {
  ApiError,
  MessageResponse,
  UpdateEmailErrorCode,
} from '@/utils/api/api-types';
import { useUser } from '@/context/auth-context';
import { useMutation } from '@tanstack/react-query';
import type { Result } from 'neverthrow';
import z from 'zod';

export const useEmailUpdate = () => {
  const { axios } = useUser();
  const authApi = createAuthApi(axios);

  return useMutation<
    Result<MessageResponse, ApiError<UpdateEmailErrorCode>>,
    never,
    z.infer<typeof EmailUpdateSchema>
  >({
    mutationFn: async (data: z.infer<typeof EmailUpdateSchema>) => {
      return authApi.user.updateEmail(data);
    },
  });
};
