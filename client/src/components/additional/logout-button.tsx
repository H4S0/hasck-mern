import { Button } from '@/components/ui/button';
import { useUser } from '@/context/auth-context';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const { logout, setUser } = useUser();
  const navigate = useNavigate();
  return (
    <Button
      variant="secondary"
      onClick={async () => {
        await logout();
        setUser(null);
        navigate('/');
      }}
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
