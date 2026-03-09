import { createFileRoute } from '@tanstack/react-router';
import InitForgetPasswordPage from '@/pages/auth/init-forget-page';

export const Route = createFileRoute('/_auth_public/init-password-forget')({
  component: InitForgetPasswordPage,
});
