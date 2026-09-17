import { getEffectiveEmailProvider } from './provider';
import { PriceAlertEmailProps, renderPriceAlertEmail } from './templates/priceAlert';
import { WelcomeEmailProps, renderWelcomeEmail } from './templates/welcome';
import { EmailSendResult } from './types';

export async function sendPriceAlertEmail(
  toEmail: string,
  alertProps: PriceAlertEmailProps
): Promise<EmailSendResult> {
  const provider = getEffectiveEmailProvider();
  const { subject, html, text } = renderPriceAlertEmail(alertProps);

  return provider.send({
    to: toEmail,
    subject,
    html,
    text,
  });
}

export async function sendWelcomeEmail(
  toEmail: string,
  welcomeProps: WelcomeEmailProps
): Promise<EmailSendResult> {
  const provider = getEffectiveEmailProvider();
  const { subject, html, text } = renderWelcomeEmail(welcomeProps);

  return provider.send({
    to: toEmail,
    subject,
    html,
    text,
  });
}
