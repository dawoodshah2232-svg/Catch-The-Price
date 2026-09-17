import { EmailMessage, EmailProvider, EmailSendResult } from './types';

const DEFAULT_FROM = process.env.EMAIL_FROM || 'CatchThePrice <alerts@catchtheprice.com>';

export class ResendProvider implements EmailProvider {
  name = 'resend';
  private apiKey = process.env.RESEND_API_KEY;

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.startsWith('re_'));
  }

  async send(message: EmailMessage): Promise<EmailSendResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        provider: this.name,
        error: 'Resend API key is missing or invalid.',
      };
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: message.from || DEFAULT_FROM,
          to: Array.isArray(message.to)
            ? message.to.map((r) => (typeof r === 'string' ? r : r.email))
            : typeof message.to === 'string'
            ? [message.to]
            : [message.to.email],
          subject: message.subject,
          html: message.html,
          text: message.text,
          reply_to: message.replyTo,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return { success: false, provider: this.name, error: `Resend error: ${errText}` };
      }

      const data = await response.json();
      return { success: true, provider: this.name, messageId: data.id };
    } catch (error) {
      return {
        success: false,
        provider: this.name,
        error: error instanceof Error ? error.message : 'Unknown Resend error',
      };
    }
  }
}

export class SendgridProvider implements EmailProvider {
  name = 'sendgrid';
  private apiKey = process.env.SENDGRID_API_KEY;

  isConfigured(): boolean {
    return Boolean(this.apiKey && this.apiKey.startsWith('SG.'));
  }

  async send(message: EmailMessage): Promise<EmailSendResult> {
    if (!this.isConfigured()) {
      return {
        success: false,
        provider: this.name,
        error: 'SendGrid API key is missing or invalid.',
      };
    }

    try {
      const recipients = Array.isArray(message.to)
        ? message.to.map((r) => ({ email: typeof r === 'string' ? r : r.email }))
        : [{ email: typeof message.to === 'string' ? message.to : message.to.email }];

      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: recipients }],
          from: { email: message.from || DEFAULT_FROM },
          subject: message.subject,
          content: [
            { type: 'text/html', value: message.html },
            ...(message.text ? [{ type: 'text/plain', value: message.text }] : []),
          ],
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        return { success: false, provider: this.name, error: `SendGrid error: ${errText}` };
      }

      const messageId = response.headers.get('x-message-id') || undefined;
      return { success: true, provider: this.name, messageId };
    } catch (error) {
      return {
        success: false,
        provider: this.name,
        error: error instanceof Error ? error.message : 'Unknown SendGrid error',
      };
    }
  }
}

export class UnconfiguredProvider implements EmailProvider {
  name = 'none';

  isConfigured(): boolean {
    return false;
  }

  async send(message: EmailMessage): Promise<EmailSendResult> {
    // Graceful no-op with clear failure reason so delivery is never falsely reported
    console.info(`[Email Unconfigured] Message not dispatched to ${JSON.stringify(message.to)}: "${message.subject}"`);
    return {
      success: false,
      provider: this.name,
      error: 'No transactional email provider is configured. Configure RESEND_API_KEY in .env.local to enable real delivery.',
    };
  }
}

export function getEffectiveEmailProvider(): EmailProvider {
  const resend = new ResendProvider();
  if (resend.isConfigured()) return resend;

  const sendgrid = new SendgridProvider();
  if (sendgrid.isConfigured()) return sendgrid;

  return new UnconfiguredProvider();
}
