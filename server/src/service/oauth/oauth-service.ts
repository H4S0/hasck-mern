import axios from 'axios';
import {
  OAUTH_PROVIDERS,
  ProviderName,
  OAuthProviders,
  GithubEmailResponse,
  GITHUB_URL,
} from './providers.js';
import { ok, err, Result } from 'neverthrow';

export class OAuthService<P extends ProviderName> {
  private provider: OAuthProviders[P];
  private redirectUri: string;

  private constructor(provider: OAuthProviders[P], redirectUri: string) {
    this.provider = provider;
    this.redirectUri = redirectUri;
  }

  static create<T extends ProviderName>(
    providerName: T
  ): Result<OAuthService<T>, Error> {
    const provider = OAUTH_PROVIDERS[providerName];

    if (!provider) {
      return err(new Error('Invalid OAuth provider'));
    }

    const redirectUri = process.env.OAUTH_REDIRECT_URL;
    if (!redirectUri) {
      return err(new Error('Missing OAUTH_REDIRECT_URL env'));
    }

    return ok(new OAuthService(provider, redirectUri));
  }

  getAuthRedirectUrl() {
    const params = new URLSearchParams({
      client_id: this.provider.clientId!,
      redirect_uri: this.redirectUri,
      response_type: 'code',
      scope: this.provider.scope ?? '',
    });

    return `${this.provider.authUrl}?${params.toString()}`;
  }

  async fetchAccessToken(code: string): Promise<Result<string, Error>> {
    const payload: Record<string, string> = {
      client_id: this.provider.clientId!,
      client_secret: this.provider.clientSecret!,
      code,
      redirect_uri: this.redirectUri,
      grant_type: 'authorization_code',
    };

    const isDiscord = this.provider.name === 'discord';

    try {
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

      return ok(response.data.access_token as string);
    } catch {
      return err(new Error('Failed to fetch access token'));
    }
  }

  async fetchUser(
    accessToken: string
  ): Promise<Result<ReturnType<OAuthProviders[P]['getUserData']>, Error>> {
    try {
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

      return ok(
        this.provider.getUserData(baseUserRes.data, email!) as ReturnType<
          OAuthProviders[P]['getUserData']
        >
      );
    } catch {
      return err(new Error('Failed to fetch user data'));
    }
  }
}
