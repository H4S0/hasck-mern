import { Button } from '@/components/ui/button';
import { useAuth } from '@/utils/auth/auth';
import { useNavigate } from '@tanstack/react-router';

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  return (
    <Button
      variant="secondary"
      onClick={async () => {
        await logout();
        navigate({ to: '/' });
      }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
