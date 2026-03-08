import { useState } from 'react';
import { Button } from '../ui/button';
import { Github } from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';
import { api } from '@/utils/api/api-client';

export default function OAuthButtons() {
  const [loading, setLoading] = useState<'github' | 'discord' | null>(null);

  const handleOAuth = async (provider: 'github' | 'discord') => {
    setLoading(provider);

    const result = await api.auth.oauthRedirect(provider);

    if (result.isErr()) {
      console.error(result.error.message);
      setLoading(null);
      return;
    }

    window.location.href = result.value.data!.redirectUrl;
  };

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        onClick={() => handleOAuth('github')}
        disabled={loading === 'github'}
      >
        <Github />
      </Button>

      <Button
        variant="outline"
        onClick={() => handleOAuth('discord')}
        disabled={loading === 'discord'}
      >
        <FaDiscord />
      </Button>
    </div>
  );
}
