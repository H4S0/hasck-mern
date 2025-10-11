import * as React from 'react';

export enum TemplateVariant {
  registration = 'registration',
  emailUpdate = 'emailUpdate',
  passwordReset = 'passwordReset',
  passwordUpdate = 'passwordUpdate',
}

interface EmailTemplateProps {
  firstName: string;
  updatedEmail?: string;
  variant: TemplateVariant;
  hashedToken?: string | null;
}

export function EmailTemplate({
  firstName,
  variant,
  updatedEmail,
  hashedToken,
}: EmailTemplateProps) {
  const renderContent = () => {
    switch (variant) {
      case TemplateVariant.registration:
        return (
          <>
            <h1>Welcome aboard, {firstName}!</h1>
            <p>🎉 Your registration was successful.</p>
          </>
        );

      case TemplateVariant.emailUpdate:
        return (
          <>
            <h1>Hello, {firstName}!</h1>
            <p>📫 Your email was successfully updated to `${updatedEmail}`</p>
          </>
        );

      case TemplateVariant.passwordReset:
        return (
          <>
            <h1>Hey {firstName},</h1>
            <p>
              🔑 Your request password reset click button bellow to continue
            </p>
            <a
              href={`http://localhost:5173/auth/password-forget/${hashedToken}`}
            >
              Confirm Now
            </a>
          </>
        );
      case TemplateVariant.passwordUpdate:
        return (
          <>
            <h1>Hey {firstName},</h1>
            <p>🔑 Your password was updated successfully</p>
          </>
        );

      default:
        return (
          <>
            <h1>Hi {firstName},</h1>
            <p>This is a generic message.</p>
          </>
        );
    }
  };

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        color: '#333',
      }}
    >
      {renderContent()}

      <p>We are excited to have you as part of our community.</p>

      <p>
        If you have any questions, feel free to reach out to our support team.
      </p>

      <p style={{ marginTop: '30px' }}>
        Best regards,
        <br />
        The Team 🚀
      </p>
    </div>
  );
}
