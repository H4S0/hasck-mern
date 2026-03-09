import { createFileRoute } from '@tanstack/react-router';
import LoginForm from '@/components/forms/login-form';

export const Route = createFileRoute('/_auth_public/login')({
  component: LoginPage,
});

function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoginForm />
    </div>
  );
}
