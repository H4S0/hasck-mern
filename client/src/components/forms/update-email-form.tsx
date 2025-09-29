import { zodResolver } from '@hookform/resolvers/zod';
import { type SubmitHandler, useForm } from 'react-hook-form';
import z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { useEmailUpdate } from '@/hooks/use-update-email';

export const EmailUpdateSchema = z.object({
  oldEmail: z.string().email(),
  newEmail: z.string().email(),
});

const UpdateEmailForm = () => {
  const { mutate } = useEmailUpdate();
  const form = useForm<z.infer<typeof EmailUpdateSchema>>({
    resolver: zodResolver(EmailUpdateSchema),
  });

  const onSubmit: SubmitHandler<z.infer<typeof EmailUpdateSchema>> = (data) => {
    mutate(data, {
      onSuccess: (response) => {
        toast.success(response.message);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email update form</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="oldEmail"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current email</FormLabel>
                  <FormControl>
                    <Input placeholder="Current email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="newEmail"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UpdateEmailForm;
