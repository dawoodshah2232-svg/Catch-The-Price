import type { Metadata } from 'next';
import { TrustPage } from '@/components/legal/TrustPage';

export const metadata: Metadata = {
  title: 'Affiliate Disclosure',
  description: 'How affiliate relationships may support CatchThePrice and how they affect retailer links.',
};

export default function AffiliateDisclosurePage() {
  return (
    <TrustPage
      eyebrow="Commercial transparency"
      title="Affiliate disclosure"
      intro="CatchThePrice may earn a commission when a user follows an eligible retailer link and completes a purchase."
      sections={[
        { title: 'No extra cost to the shopper', body: <p>Eligible affiliate commissions are paid by the retailer or affiliate network and generally do not increase the price shown to the shopper.</p> },
        { title: 'Amazon Associates disclosure', body: <p>As an Amazon Associate I earn from qualifying purchases.</p> },
        { title: 'Affiliate links are approval-based', body: <p>CatchThePrice does not add or invent affiliate identifiers. Affiliate tracking is enabled only after the relevant retailer or network relationship is approved and recorded.</p> },
        { title: 'Rankings and editorial independence', body: <p>A commercial relationship does not give a retailer permission to receive fabricated pricing, false “best” claims or unsupported editorial endorsements. Where ranking logic is used, it should rely on disclosed product and offer data.</p> },
        { title: 'Retailer checkout', body: <p>CatchThePrice does not process retailer purchases. Orders, payments, returns, warranty and customer service remain subject to the retailer’s own terms.</p> },
      ]}
    />
  );
}
