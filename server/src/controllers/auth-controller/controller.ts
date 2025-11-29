import express from 'express';
import validate from 'express-zod-safe';
import { LoginSchema, RegisterSchema } from '../../utils/zod-schemas';
import {
  CleanedUser,
  comparePassword,
  createProviderUser,
  createUser,
  deleteRefreshToken,
  findExistingUser,
  findUserByEmail,
  findUserByProvider,
  findUserByToken,
  findUserByUsername,
  generateAccessToken,
  generateAndUpdateUserWithResetToken,
  generateRefreshToken,
  saveRefreshToken,
  updateUserPasswordwithToken,
  userToCleanUser,
} from '../../service/user-service';
import { StatusCodes } from 'http-status-codes';
import { formatError, formatSuccess } from '../../utils/response-handling';
import z from 'zod';
import { EmailTemplate, TemplateVariant } from '../../utils/email-template';
import { Resend } from 'resend';
import { OAuthService } from '../../service/oauth/oauth-service';

export const authController = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY);
const CLIENT_URL = 'http://localhost:5173';

authController.post(
  '/register',
  validate({ body: RegisterSchema }),
  async (req, res) => {
    const { username, email } = req.body;
    const existingUser = await findExistingUser(username, email);

    if (existingUser.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(existingUser.error));
      return;
    }

    if (existingUser.value) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(formatError({ message: 'User already exists' }));
      return;
    }

    const user = await createUser(req.body);

    if (user.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(user.error));
      return;
    }

    res
      .status(StatusCodes.OK)
      .json(formatSuccess({ message: 'User created successfully' }));
  }
);

authController.post(
  '/login',
  validate({ body: LoginSchema }),
  async (req, res) => {
    const { username, password } = req.body;

    const user = await findUserByUsername(username);

    if (user.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(user.error));
      return;
    }

    if (!user.value) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(formatError({ message: 'User doesnt exists' }));
      return;
    }

    const isMatch = await comparePassword(password, user.value.password);

    if (isMatch.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(isMatch.error));
      return;
    }

    if (!isMatch.value) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError({ message: 'Invalid credentials' }));
      return;
    }

    const accessToken = await generateAccessToken(
      user.value._id,
      user.value.username,
      user.value.email,
      user.value.role
    );

    if (accessToken.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(accessToken.error));
      return;
    }

    const refreshToken = await generateRefreshToken(
      user.value._id,
      user.value.username,
      user.value.email,
      user.value.role
    );

    if (refreshToken.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(refreshToken.error));
      return;
    }

    const savedToken = await saveRefreshToken(
      user.value._id,
      refreshToken.value
    );

    if (savedToken.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(savedToken.error));
      return;
    }

    res.cookie('refreshToken', refreshToken.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(StatusCodes.OK).json(
      formatSuccess({
        data: {
          user: {
            id: user.value._id,
            username: user.value.username,
            email: user.value.email,
            role: user.value.role,
            accessToken: accessToken.value,
          },
        },
        message: 'Login successful',
      })
    );
  }
);

authController.post('/logout', async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (refreshToken) {
    await deleteRefreshToken(refreshToken);
  }

  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });

  res.status(StatusCodes.OK).json(
    formatSuccess({
      message: 'Logged out successfully',
    })
  );
});

authController.put(
  '/init-forget-password',
  validate({ body: { email: z.email() } }),
  async (req, res) => {
    const { email } = req.body;

    const user = await findUserByEmail(email);

    if (user.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(user.error));
      return;
    }

    if (!user.value) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError({ message: 'User doesnt exist' }));
      return;
    }

    const updatedUser = await generateAndUpdateUserWithResetToken(
      user.value._id
    );

    if (updatedUser.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(updatedUser.error));
      return;
    }

    if (!updatedUser.value) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json(formatError({ message: 'Error while updating user' }));
      return;
    }

    await resend.emails.send({
      from: 'Acme <hasck-mern@resend.dev>',
      to: [`${updatedUser.value.email}`],
      subject: 'Password reset request',
      react: EmailTemplate({
        firstName: updatedUser.value.username,
        variant: TemplateVariant.passwordReset,
        hashedToken: updatedUser.value.passwordResetToken,
      }),
    });

    res.status(StatusCodes.OK).json(
      formatSuccess({
        message: 'Email sent successfully, please visit you inbox',
      })
    );
  }
);

authController.put(
  '/new-password/:token',
  validate({
    params: { token: z.string() },
    body: { oldPassword: z.string(), newPassword: z.string() },
  }),
  async (req, res) => {
    const { token } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!token) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(formatError({ message: 'Token must be provided' }));
      return;
    }

    const user = await findUserByToken(token);

    if (user.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(user.error));
      return;
    }

    if (!user.value) {
      res
        .status(StatusCodes.NOT_FOUND)
        .json(formatError({ message: 'User doesnt exist' }));
      return;
    }

    if (oldPassword !== newPassword) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json(formatError({ message: 'Passwords doesnt match' }));
      return;
    }

    const updatedUser = await updateUserPasswordwithToken(
      user.value.id,
      newPassword
    );

    if (updatedUser.isErr()) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(formatError(updatedUser.error));
      return;
    }

    res.status(StatusCodes.OK).json(
      formatSuccess({
        message: 'Password updated successfully',
      })
    );
  }
);

const ProviderSchema = z.enum(['discord', 'github']);

function successFullOauthRedirect(accessToken: string, user: CleanedUser) {
  const userStr = encodeURIComponent(JSON.stringify(user));
  return `${CLIENT_URL}/oauth/success?accessToken=${accessToken}&user=${userStr}`;
}

function errorFullOauthRedirect(message: string) {
  return `${CLIENT_URL}/oauth/error?message=${encodeURIComponent(message)}`;
}

authController.get(
  '/oauth/redirect',
  validate({ query: { provider: ProviderSchema } }),
  async (req, res) => {
    const { provider } = req.query;
    const oauthRes = OAuthService.create(provider);
    if (oauthRes.isErr())
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(formatError(oauthRes.error));

    const redirectUrl = oauthRes.value.getAuthRedirectUrl();
    res.status(StatusCodes.OK).json({ data: { redirectUrl } });
  }
);

authController.get(
  '/oauth/callback',
  validate({
    query: { code: z.string(), provider: ProviderSchema.optional() },
  }),
  async (req, res) => {
    const provider = (req.query.provider as 'discord' | 'github') || undefined;
    const { code } = req.query;

    if (!provider)
      return res.redirect(errorFullOauthRedirect('Provider missing'));

    const oAuthRes = OAuthService.create(provider);
    if (oAuthRes.isErr())
      return res.redirect(errorFullOauthRedirect(oAuthRes.error.message));

    const tokenRes = await oAuthRes.value.fetchAccessToken(code as string);
    if (tokenRes.isErr())
      return res.redirect(errorFullOauthRedirect(tokenRes.error.message));

    const userRes = await oAuthRes.value.fetchUser(tokenRes.value);
    if (userRes.isErr())
      return res.redirect(errorFullOauthRedirect(userRes.error.message));

    const existingUser = await findUserByProvider(
      provider,
      userRes.value.providerId
    );
    if (existingUser.isErr())
      return res.redirect(errorFullOauthRedirect(existingUser.error.message));

    let user;
    if (existingUser.value) {
      user = existingUser.value;
    } else {
      const newUser = await createProviderUser(
        provider,
        userRes.value.providerId,
        userRes.value.email,
        userRes.value.username
      );
      if (newUser.isErr())
        return res.redirect(errorFullOauthRedirect(newUser.error.message));
      user = newUser.value;
    }

    const accessToken = await generateAccessToken(
      user._id,
      user.username,
      user.email,
      user.role
    );
    if (accessToken.isErr())
      return res.redirect(errorFullOauthRedirect(accessToken.error.message));

    const refreshToken = await generateRefreshToken(
      user._id,
      user.username,
      user.email,
      user.role
    );
    if (refreshToken.isErr())
      return res.redirect(errorFullOauthRedirect(refreshToken.error.message));

    const savedToken = await saveRefreshToken(user._id, refreshToken.value);
    if (savedToken.isErr())
      return res.redirect(errorFullOauthRedirect(savedToken.error.message));

    res.cookie('refreshToken', refreshToken.value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const cleanedUser = userToCleanUser(user);

    res.redirect(successFullOauthRedirect(accessToken.value, cleanedUser));
  }
);
