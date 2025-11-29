import StatusCard from '@/components/oauth-components/status-card';
import { ShieldAlert } from 'lucide-react';

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <StatusCard
        title="Connected Successfully"
        description="Your account has been linked with the provider."
        icon={<ShieldAlert />}
        variant="success"
      />
    </div>
  );
};

export default ErrorPage;
