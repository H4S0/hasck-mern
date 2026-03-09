import { createFileRoute } from '@tanstack/react-router';
import SuccessPage from '@/pages/auth/oauth/success-page';

export const Route = createFileRoute('/oauth/success')({
  component: SuccessPage,
});
