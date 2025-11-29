export const DISCORD_URL = process.env.DISCORD_URL!;
export const GITHUB_AUTH_URL = process.env.GITHUB_AUTH_URL!;
export const GITHUB_TOKEN_URL = process.env.GITHUB_TOKEN_URL!;
export const GITHUB_API_URL = process.env.GITHUB_API_URL!;

export type ProviderName = 'discord' | 'github';

export interface OAuthProviderBase {
  name: ProviderName;
  clientId: string | undefined;
  clientSecret: string | undefined;
  authUrl: string;
  tokenUrl: string;
  userUrl: string;
  scope: string;
}

export interface DiscordUserResponse {
  id: string;
  email: string;
  username: string;
}

export interface GithubUserResponse {
  id: number;
  login: string;
}

export interface GithubEmailResponse {
  email: string;
  primary: boolean;
  verified: boolean;
}

export interface OAuthProviders {
  discord: OAuthProviderBase & {
    getUserData: (data: DiscordUserResponse) => {
      providerId: string;
      email: string;
      username: string;
    };
  };
  github: OAuthProviderBase & {
    getUserData: (
      data: GithubUserResponse,
      email: string
    ) => {
      providerId: number;
      email: string;
      username: string;
    };
  };
}

export const OAUTH_PROVIDERS: OAuthProviders = {
  discord: {
    name: 'discord',
    clientId: process.env.DISCORD_CLIENT_ID,
    clientSecret: process.env.DISCORD_CLIENT_SECRET,
    authUrl: `${DISCORD_URL}/api/oauth2/authorize`,
    tokenUrl: `${DISCORD_URL}/api/oauth2/token`,
    userUrl: `${DISCORD_URL}/api/users/@me`,
    scope: 'identify email',
    getUserData: (data) => ({
      providerId: data.id,
      email: data.email,
      username: data.username,
    }),
  },
  github: {
    name: 'github',
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    authUrl: GITHUB_AUTH_URL,
    tokenUrl: GITHUB_TOKEN_URL,
    userUrl: `${GITHUB_API_URL}/user`,
    scope: 'read:user user:email',
    getUserData: (data, email) => ({
      providerId: data.id,
      email,
      username: data.login,
    }),
  },
};
