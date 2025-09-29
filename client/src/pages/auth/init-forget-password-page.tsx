import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useInitPasswordReset } from '@/hooks/use-init-forget-password';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, useForm, type SubmitHandler } from 'react-hook-form';
import z from 'zod';

const InitPasswordResetSchema = z.object({
  email: z.email(),
});

const InitForgetPasswordPage = () => {
  const { mutate, isPending } = useInitPasswordReset();

  const form = useForm<z.infer<typeof InitPasswordResetSchema>>({
    resolver: zodResolver(InitPasswordResetSchema),
  });

  const onSubmit: SubmitHandler<
    z.infer<typeof InitPasswordResetSchema>
  > = () => {};

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-lg sm:max-w-lg">
        <CardHeader>
          <CardTitle>Login form</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="example@mail.test" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? 'Loading...' : 'Login'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InitForgetPasswordPage;
