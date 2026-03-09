import type { AuthContextType } from '@/utils/auth/auth-context';
import type { QueryClient } from '@tanstack/react-query';
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router';

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  auth: AuthContextType | null;
}>()({
  component: RootComponent,
});

function RootComponent() {
  return <Outlet />;
}
