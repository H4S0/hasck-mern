import axios from 'axios';
import {
  OAUTH_PROVIDERS,
  ProviderName,
  OAuthProviders,
  GithubEmailResponse,
  GITHUB_URL,
} from './providers.js';

export class OAuthService<P extends ProviderName> {
  private provider: OAuthProviders[P];
  private redirectUri: string;

  constructor(providerName: P) {
    const provider = OAUTH_PROVIDERS[providerName];
    if (!provider) {
      throw new Error('Invalid OAuth provider');
    }

    this.provider = provider;
    this.redirectUri = process.env.OAUTH_REDIRECT_URL!;
  }

  getAuthRedirectUrl() {
    const params = new URLSearchParams({
      client_id: this.provider.clientId ?? '',
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: this.provider.scope,
    });

    return `${this.provider.authUrl}?${params.toString()}`;
  }

  async fetchAccessToken(code: string): Promise<string> {
    const payload: Record<string, string> = {
      client_id: this.provider.clientId!,
      client_secret: this.provider.clientSecret!,
      code,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
    };

    const isDiscord = this.provider.name === 'discord';

    const response = await axios.post(
      this.provider.tokenUrl,
      isDiscord ? new URLSearchParams(payload) : payload,
      {
        headers: {
          'Content-Type': isDiscord
            ? 'application/x-www-form-urlencoded'
            : 'application/json',
          Accept: 'application/json',
        },
      }
    );

    return response.data.access_token as string;
  }

  async fetchUser(accessToken: string) {
    const baseUserRes = await axios.get(this.provider.userUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    let email = baseUserRes.data.email as string | undefined;

    if (this.provider.name === 'github') {
      const emailsRes = await axios.get<GithubEmailResponse[]>(
        `${GITHUB_URL}/user/emails`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      email = emailsRes.data.find((e) => e.primary)?.email;
    }

    return this.provider.getUserData(
      baseUserRes.data,
      this.provider.name === 'github' ? email : (undefined as any)
    );
  }
}
