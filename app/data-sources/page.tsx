import type { Metadata } from 'next';
import { TrustPage } from '@/components/legal/TrustPage';

export const metadata: Metadata = {
  title: 'Data Sources',
  description: 'How CatchThePrice handles retailer feeds, product data, source permissions and provenance.',
};

export default function DataSourcesPage() {
  return (
    <TrustPage
      eyebrow="Data transparency"
      title="Where CatchThePrice data comes from."
      intro="CatchThePrice is designed to use retailer and product information only when the source, market and allowed uses are understood."
      sections={[
        { title: 'Preferred source types', body: <p>We prioritize official APIs, affiliate APIs, merchant feeds and other explicitly permitted data sources. Publicly accessible information is not automatically treated as permission to republish, retain or commercialize it.</p> },
        { title: 'Source-rights register', body: <p>Each production retailer source must have a recorded approval state covering relevant uses such as pricing, images, historical retention, affiliate links and AI processing. Sources fail closed until required permissions are recorded.</p> },
        { title: 'Matching products', body: <p>We prefer strong identifiers such as GTIN, UPC/EAN, MPN and model number. Title-based or AI-assisted matching is used only when identifiers are incomplete, with uncertain matches held for review.</p> },
        { title: 'Freshness', body: <p>Offers include a last-checked time when available. Old or unavailable source records can be excluded from public presentation rather than shown as current.</p> },
        { title: 'Images and specifications', body: <p>Product images and specifications are only intended for use where CatchThePrice has a lawful and permitted source. Missing media or specifications should remain unavailable rather than be fabricated.</p> },
      ]}
    />
  );
}
