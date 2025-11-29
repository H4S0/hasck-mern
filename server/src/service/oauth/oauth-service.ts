import axios from 'axios';
import {
  OAUTH_PROVIDERS,
  ProviderName,
  OAuthProviders,
  GithubEmailResponse,
  GITHUB_API_URL,
} from './providers';
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
    if (!provider) return err(new Error('Invalid OAuth provider'));

    const redirectUri = `http://localhost:3000/api/v1/auth/oauth/callback?provider=${providerName}`;
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
    } catch (error) {
      console.error('fetchAccessToken error:', error);
      return err(new Error('Failed to fetch access token'));
    }
  }

  async fetchUser(
    accessToken: string
  ): Promise<Result<ReturnType<OAuthProviders[P]['getUserData']>, Error>> {
    try {
      const baseUserRes = await axios.get(this.provider.userUrl, {
        headers: {
          Authorization:
            this.provider.name === 'github'
              ? `token ${accessToken}`
              : `Bearer ${accessToken}`,
        },
      });

      let email: string | undefined = baseUserRes.data.email;

      if (this.provider.name === 'github' && !email) {
        const emailsRes = await axios.get<GithubEmailResponse[]>(
          `${GITHUB_API_URL}/user/emails`,
          {
            headers: { Authorization: `token ${accessToken}` },
          }
        );

        const primaryVerified = emailsRes.data.find(
          (e) => e.primary && e.verified
        );
        email =
          primaryVerified?.email ||
          emailsRes.data.find((e) => e.verified)?.email;

        if (!email)
          return err(new Error('No verified email found for GitHub user'));
      }

      if (!email) return err(new Error('Email is undefined'));

      return ok(
        this.provider.getUserData(baseUserRes.data, email) as ReturnType<
          OAuthProviders[P]['getUserData']
        >
      );
    } catch {
      return err(new Error('Failed to fetch user data'));
    }
  }
}
