export const GITHUB_URL = process.env.GITHUB_URL!;
const DISCORD_URL = process.env.DISCORD_URL!;

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
    authUrl: `${GITHUB_URL}/login/oauth/authorize`,
    tokenUrl: `${GITHUB_URL}/login/oauth/access_token`,
    userUrl: `${GITHUB_URL}/user`,
    scope: 'user:email',
    getUserData: (data, email) => ({
      providerId: data.id,
      email,
      username: data.login,
    }),
  },
};
