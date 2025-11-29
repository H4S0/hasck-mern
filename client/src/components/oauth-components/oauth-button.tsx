import { useState } from 'react';
import { Button } from '../ui/button';

const BACKEND_URL = 'http://localhost:3000/api/v1';

export default function OAuthButtons() {
  const [loading, setLoading] = useState<'github' | 'discord' | null>(null);

  const handleOAuth = async (provider: 'github' | 'discord') => {
    try {
      setLoading(provider);

      const res = await fetch(
        `${BACKEND_URL}/auth/oauth/redirect?provider=${provider}`
      );
      const data = await res.json();

      if (data?.data?.redirectUrl) {
        window.location.href = data.data.redirectUrl;
      } else {
        console.error('Invalid redirect URL from backend', data);
        setLoading(null);
      }
    } catch (err) {
      console.error(err);
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button
        onClick={() => handleOAuth('github')}
        disabled={loading === 'github'}
      >
        {loading === 'github'
          ? 'Connecting to GitHub...'
          : 'Continue with GitHub'}
      </Button>

      <Button
        onClick={() => handleOAuth('discord')}
        disabled={loading === 'discord'}
      >
        {loading === 'discord'
          ? 'Connecting to Discord...'
          : 'Continue with Discord'}
      </Button>
    </div>
  );
}
