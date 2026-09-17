export interface EmailRecipient {
  email: string;
  name?: string;
}

export interface EmailMessage {
  to: string | EmailRecipient | (string | EmailRecipient)[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  provider: string;
  error?: string;
  queued?: boolean;
}

export interface EmailProvider {
  name: string;
  isConfigured(): boolean;
  send(message: EmailMessage): Promise<EmailSendResult>;
}
