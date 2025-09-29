import z from 'zod';

export const RegisterSchema = z.object({
  username: z.string(),
  email: z.email(),
  password: z.string().min(8),
});

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string().min(8),
});

export const NewPasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string(),
});

export const EmailUpdateSchema = z.object({
  oldEmail: z.email(),
  newEmail: z.email(),
});
