import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth_public')({
  loader({ context }) {
    if (context.auth?.isAuthenticated) {
      throw redirect({ to: '/dashboard' });
    }
  },
  component: () => <Outlet />,
});
