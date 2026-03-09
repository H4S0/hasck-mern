import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import { Toaster } from './components/ui/sonner';
import { useAuth } from './utils/auth/use-auth';
import type { QueryClient } from '@tanstack/react-query';

export function createAppRouter(queryClient: QueryClient) {
  return createRouter({
    routeTree,
    context: { queryClient, auth: null },
    defaultPreload: 'intent',
  });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>;
  }
}

export default function InnerApp({
  router,
}: {
  router: ReturnType<typeof createAppRouter>;
}) {
  const auth = useAuth();

  return (
    <>
      <RouterProvider router={router} context={{ auth }} />
      <Toaster richColors />
    </>
  );
}
