import { createFileRoute } from '@tanstack/react-router';
import RegisterForm from '@/components/forms/register-form';

export const Route = createFileRoute('/_auth_public/register')({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <RegisterForm />
    </div>
  );
}
