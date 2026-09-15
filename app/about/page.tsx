import type { Metadata } from 'next';
import { TrustPage } from '@/components/legal/TrustPage';

export const metadata: Metadata = {
  title: 'About CatchThePrice',
  description: 'Learn how CatchThePrice helps shoppers compare retailer offers, track prices and make better buying decisions.',
};

export default function AboutPage() {
  return (
    <TrustPage
      eyebrow="About CatchThePrice"
      title="Shopping intelligence built around better decisions."
      intro="CatchThePrice is an independent price-comparison and price-tracking platform. We help shoppers discover products, compare available retailer offers and understand price movement before choosing where to buy."
      sections={[
        { title: 'What we do', body: <p>We organize product information, current retailer offers, price observations, comparisons and buying guidance into one place. CatchThePrice does not sell products or collect payment for retailer purchases.</p> },
        { title: 'Launch markets', body: <p>CatchThePrice is being built first for the United Arab Emirates and the United States. Additional markets will only be presented as live after local product coverage and source permissions are ready.</p> },
        { title: 'How we make money', body: <p>CatchThePrice may earn revenue from advertising and approved affiliate partnerships. Commercial relationships do not change the price a shopper pays and do not permit us to invent rankings, prices or retailer availability.</p> },
        { title: 'Our standard', body: <p>We prefer missing information over fabricated information. Product prices, merchant destinations and historical observations should only be shown when they come from an eligible source and pass our validation rules.</p> },
      ]}
    />
  );
}
