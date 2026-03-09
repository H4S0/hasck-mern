import { useAuth } from '@/utils/auth/use-auth';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;
