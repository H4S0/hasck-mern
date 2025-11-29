import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '../ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from '../ui/card';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { Separator } from '../ui/separator';
import { useLogin } from '@/hooks/use-login';
import { useUser } from '@/context/auth-context';
import { Link, useNavigate } from 'react-router-dom';
import OAuthButtons from '../oauth-components/oauth-button';

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});

const LoginForm = () => {
  const { refetchUser } = useUser();
  const { mutate, isPending } = useLogin();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
  });
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<z.infer<typeof LoginSchema>> = (data) => {
    mutate(data, {
      onSuccess: async (response) => {
        toast.success(response.message);
        await refetchUser();
        navigate('/dashboard');
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Card className="w-full max-w-lg sm:max-w-lg">
      <CardHeader>
        <CardTitle>Login form</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input type="username" placeholder="user2123" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
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

      <Separator />

      <CardFooter className="flex flex-col items-center gap-5">
        <OAuthButtons />
        <CardDescription>Dont have account?</CardDescription>
        <Link to="/auth/register" className="w-full">
          <Button className="w-full" variant="secondary">
            Make one
          </Button>
        </Link>
        <Link to="/auth/init-password-forget" className="w-full">
          <Button className="w-full" variant="outline">
            Forgot password
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
