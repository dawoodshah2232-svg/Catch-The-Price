import type { Metadata } from 'next';
import { TrustPage } from '@/components/legal/TrustPage';
import { PrivacySettingsButton } from '@/components/privacy/PrivacySettingsButton';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'CatchThePrice privacy policy for site usage, analytics, saved products, alerts and retailer click tracking.',
};

export default function PrivacyPage() {
  return (
    <TrustPage
      eyebrow="Privacy"
      title="Privacy policy"
      intro="CatchThePrice aims to collect only the information needed to operate the service, understand usage and provide requested features."
      sections={[
        { title: 'Information we may process', body: <p>Depending on the feature, this may include account details you provide, saved products, alert preferences, page and search activity, coarse device/browser information, selected market, and retailer click events. We do not need to retain full IP addresses for ordinary shopping analytics.</p> },
        { title: 'How information is used', body: <p>Information may be used to provide saved items and alerts, improve search and product discovery, measure site performance, detect errors and abuse, and understand which retailer links or content are useful.</p> },
        { title: 'Privacy choices', body: <div className="space-y-3"><p>Essential browser storage supports features such as market, appearance and saved-item preferences. Optional first-party analytics is disabled until you choose to allow it. You can change that choice at any time.</p><PrivacySettingsButton /></div> },
        { title: 'Third-party services', body: <p>CatchThePrice may use hosting, database, analytics, advertising, email and affiliate services. Those providers may process information under their own terms and applicable privacy obligations.</p> },
        { title: 'Advertising and affiliate measurement', body: <p>Advertising cookies are not activated by the CatchThePrice analytics preference control. If advertising or affiliate technologies requiring additional consent are enabled later, they must be connected to an appropriate consent flow before use.</p> },
        { title: 'Retention and security', body: <p>We aim to retain personal information only for as long as needed for the relevant feature, legal requirement or legitimate operational purpose. Access to administrative systems and service credentials is restricted.</p> },
        { title: 'Your choices', body: <p>You may choose not to use account-based features. Where supported, you can update or remove saved items and alerts. For privacy questions or requests, contact CatchThePrice through the Contact page.</p> },
      ]}
    />
  );
}
