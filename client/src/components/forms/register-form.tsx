import { type SubmitHandler, useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Separator } from '../ui/separator';
import { useRegister } from '@/hooks/useRegister';
import { Link, useNavigate } from 'react-router-dom';

export const RegisterSchema = z
  .object({
    email: z.email(),
    username: z.string().min(4, 'Username must be at least 4 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

const RegisterForm = () => {
  const { mutate, isPending } = useRegister();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
  });
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<z.infer<typeof RegisterSchema>> = (data) => {
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
    <Card className="w-full max-w-lg sm:max-w-lg">
      <CardHeader>
        <CardTitle>Register form</CardTitle>
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
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Choose a username" {...field} />
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

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? 'Loading...' : 'Register'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <Separator />

      <CardFooter className="flex flex-col items-center gap-5">
        <CardDescription>Already have account?</CardDescription>
        <Link to="/auth/login" className="w-full">
          <Button className="w-full" variant="secondary">
            Login
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default RegisterForm;
