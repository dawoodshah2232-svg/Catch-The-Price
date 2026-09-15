import type { Metadata } from 'next';
import { TrustPage } from '@/components/legal/TrustPage';

export const metadata: Metadata = {
  title: 'Contact CatchThePrice',
  description: 'Contact CatchThePrice about support, retailer data, partnerships and corrections.',
};

export default function ContactPage() {
  return (
    <TrustPage
      eyebrow="Contact"
      title="Questions, corrections or partnerships?"
      intro="Use the contact details below for support, retailer-data corrections, partnership enquiries or questions about how CatchThePrice presents product information."
      sections={[
        { title: 'General support', body: <p>Email <strong>info@catchtheprice.com</strong>. Include the product, page URL and market when reporting a pricing or product-data issue.</p> },
        { title: 'Retailers and data providers', body: <p>Retailers, affiliate networks and feed providers can contact us to discuss approved product feeds, pricing data, images, attribution and permitted retention.</p> },
        { title: 'Corrections', body: <p>If you believe a product, retailer or editorial statement is inaccurate, send the exact page and correction details. We prefer to remove unsupported information rather than leave uncertain claims live.</p> },
      ]}
    />
  );
}
