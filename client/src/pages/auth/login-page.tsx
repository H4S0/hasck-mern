import LoginForm from '@/components/forms/login-form';
import { useUser } from '@/context/auth-context';

const LoginPage = () => {
  const { user } = useUser();

  console.log(user);
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoginForm />
    </div>
  );
};

export default LoginPage;
