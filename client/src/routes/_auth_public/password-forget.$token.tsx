import { createFileRoute } from '@tanstack/react-router';
import ForgetPasswordPage from '@/pages/auth/new-password-page-token';

export const Route = createFileRoute('/_auth_public/password-forget/$token')({
  component: ForgetPasswordPage,
});
