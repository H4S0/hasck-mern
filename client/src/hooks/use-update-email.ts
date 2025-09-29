import { EmailUpdateSchema } from '@/components/forms/update-email-form';
import { useMutation } from '@tanstack/react-query';
import z from 'zod';
import { BE_URL } from './use-login';
import { useUser } from '@/context/auth-context';
import { getErrorMessage } from '@/lib/error-helper';

type EmailUpdateResponse = {
  message: string;
};

export const useEmailUpdate = () => {
  const { axios } = useUser();
  return useMutation<
    EmailUpdateResponse,
    Error,
    z.infer<typeof EmailUpdateSchema>
  >({
    mutationFn: async (data: z.infer<typeof EmailUpdateSchema>) => {
      try {
        const response = await axios.put(
          `${BE_URL}/api/v1/user/email-update`,
          data,
          {
            withCredentials: true,
          }
        );

        return response.data;
      } catch (err) {
        throw new Error(getErrorMessage(err));
      }
    },
  });
};
