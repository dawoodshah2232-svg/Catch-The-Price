import type { Metadata } from 'next';
import { TrustPage } from '@/components/legal/TrustPage';

export const metadata: Metadata = {
  title: 'How Pricing Works',
  description: 'How CatchThePrice collects, validates and presents retailer prices and price history.',
};

export default function HowPricingWorksPage() {
  return (
    <TrustPage
      eyebrow="Pricing methodology"
      title="How CatchThePrice presents prices."
      intro="Our goal is to show source-backed retailer offers without pretending a price is more certain, more recent or more complete than the underlying data allows."
      sections={[
        { title: 'Current prices', body: <p>Current prices come from eligible retailer APIs, feeds or other permitted sources. Offers are tied to a specific market and product record and include a last-checked time where available.</p> },
        { title: 'Reference and previous prices', body: <p>A crossed-out or reference price is only shown when the source provides a valid reference value or when a genuine prior observation supports it. We do not manufacture discounts from arbitrary list prices.</p> },
        { title: 'Price history', body: <p>Historical charts are built from recorded observations for the same offer or exact product context. If there are not enough genuine observations, the chart remains unavailable.</p> },
        { title: 'Lowest price', body: <p>“Lowest” means the lowest eligible price among the offers currently available to CatchThePrice for that market. It does not guarantee that no lower price exists elsewhere.</p> },
        { title: 'Final retailer price', body: <p>Retailer prices, availability, delivery fees, warranty and promotions can change after our last check. Always confirm final details on the retailer website before purchase.</p> },
      ]}
    />
  );
}
