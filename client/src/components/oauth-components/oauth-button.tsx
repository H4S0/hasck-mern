import { useState } from 'react';
import { Button } from '../ui/button';
import { Github } from 'lucide-react';
import { FaDiscord } from 'react-icons/fa';
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
