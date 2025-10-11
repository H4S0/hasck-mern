'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePasswordReset } from '@/hooks/use-new-password-token';
import { useNavigate, useParams } from 'react-router-dom';

// eslint-disable-next-line react-refresh/only-export-components
export const passwordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: z.string(),
  })
  .refine((data) => data.oldPassword === data.newPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const PasswordResetForm = () => {
  const { token } = useParams();
  const { mutate, isPending } = usePasswordReset(token!);
  const form = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
  });
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<z.infer<typeof passwordSchema>> = (data) => {
    mutate(data, {
      onSuccess: (response) => {
        toast.success(response.message);
        navigate('/auth/login');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-lg sm:max-w-lg">
        <CardHeader>
          <CardTitle>Init password reset</CardTitle>
          <CardDescription>
            Make sure to insert correct email, you will recive confirmation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? 'Loading' : 'Submit'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PasswordResetForm;
