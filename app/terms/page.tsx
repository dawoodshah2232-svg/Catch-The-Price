import type { Metadata } from 'next';
import { TrustPage } from '@/components/legal/TrustPage';

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms governing use of CatchThePrice price comparison, tracking and shopping intelligence services.',
};

export default function TermsPage() {
  return (
    <TrustPage
      eyebrow="Terms"
      title="Terms of use"
      intro="These terms govern use of CatchThePrice. By using the site, you agree to use it lawfully and understand that retailer information can change after our last observation."
      sections={[
        { title: 'Independent comparison service', body: <p>CatchThePrice is an independent shopping information service. We do not sell the retailer products shown on the site and we are not the merchant of record for third-party purchases.</p> },
        { title: 'Prices and availability', body: <p>Prices, discounts, delivery, stock, warranty and retailer terms may change. CatchThePrice does not guarantee that every market offer is included or that a displayed offer will remain available when you visit the retailer.</p> },
        { title: 'Retailer transactions', body: <p>Purchases are completed on third-party retailer websites. Payment, fulfilment, cancellations, returns, warranty and disputes are governed by the retailer’s policies and applicable law.</p> },
        { title: 'Accounts, saves and alerts', body: <p>Where account features are available, you are responsible for maintaining access to your account. Price alerts are informational and should not be treated as a guarantee that an offer will still be available when opened.</p> },
        { title: 'Acceptable use', body: <p>You may not abuse, disrupt, reverse engineer, overload or unlawfully extract data from CatchThePrice, or use the service to violate third-party rights or applicable law.</p> },
        { title: 'Content and trademarks', body: <p>CatchThePrice branding, original editorial content and software are protected by applicable intellectual-property rights. Third-party product and retailer names or marks remain the property of their respective owners.</p> },
        { title: 'Changes', body: <p>We may update the service and these terms as CatchThePrice develops. Material changes should be reflected by an updated date on this page.</p> },
      ]}
    />
  );
}
