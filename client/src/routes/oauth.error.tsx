import { createFileRoute } from '@tanstack/react-router';
import ErrorPage from '@/pages/auth/oauth/error-page';

export const Route = createFileRoute('/oauth/error')({
  component: ErrorPage,
});
