import StatusCard from '@/components/oauth-components/status-card';
import { useAuth } from '@/utils/auth/auth';
import { BadgeCheck } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

const SuccessPage = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);

      const accessToken = params.get('accessToken');
      const userRaw = params.get('user');

      if (!accessToken || !userRaw) return;

      try {
        const user = JSON.parse(userRaw);

        auth.setOAuthUser({ ...user, accessToken });

        if (auth.refetchUser) {
          await auth.refetchUser();
        }

        navigate({ to: '/dashboard' });
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
