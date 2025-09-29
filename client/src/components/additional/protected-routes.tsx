import { useUser } from '@/context/auth-context';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoutes = ({ children }: { children: ReactNode }) => {
  const { user } = useUser();
  console.log(user);
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoutes;
