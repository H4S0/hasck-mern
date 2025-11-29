import StatusCard from '@/components/oauth-components/status-card';
import { useUser } from '@/context/auth-context';
import { BadgeCheck } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();
  const auth = useUser();
  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);

      const accessToken = params.get('accessToken');
      const userRaw = params.get('user');

      if (!accessToken || !userRaw) return;

      try {
        const user = JSON.parse(userRaw);

        auth.setUser(user);

        if (auth.refetchUser) {
          await auth.refetchUser();
        }

        navigate('/dashboard');
      } catch (err) {
        console.error('Failed parsing user from URL:', err);
      }
    };

    run();
  }, [auth, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <StatusCard
        title="Connected Successfully"
        description="Your account has been linked with the provider."
        icon={<BadgeCheck />}
        variant="success"
      />
    </div>
  );
};

export default SuccessPage;
