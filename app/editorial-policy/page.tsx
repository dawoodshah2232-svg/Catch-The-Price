import type { Metadata } from 'next';
import { TrustPage } from '@/components/legal/TrustPage';

export const metadata: Metadata = {
  title: 'Editorial Policy',
  description: 'CatchThePrice editorial standards for buying guides, comparisons, AI-assisted drafts and corrections.',
};

export default function EditorialPolicyPage() {
  return (
    <TrustPage
      eyebrow="Editorial standards"
      title="Useful first. Source-backed always."
      intro="CatchThePrice uses editorial content to help shoppers understand products, comparisons and price context. We do not want articles that exist only to attract search traffic."
      sections={[
        { title: 'Research and sourcing', body: <p>Product specifications, launch facts and retailer claims should be checked against reliable sources. Official manufacturer information is preferred for specifications, while pricing statements should be tied to eligible market data.</p> },
        { title: 'AI-assisted content', body: <p>AI may help research, structure or draft content, but AI-generated text is not treated as evidence. New factual claims must be grounded in source material, and publication should pass quality review rather than happen automatically.</p> },
        { title: 'Rumours and future products', body: <p>Leaks, rumours and speculation must be clearly labelled and separated from confirmed information. We do not present unannounced specifications as fact.</p> },
        { title: 'Comparisons', body: <p>Comparisons should use the same product variant and market context where possible. AI summaries may explain structured differences, but should not invent specifications, test results or retailer availability.</p> },
        { title: 'Corrections', body: <p>When a material error is identified, we aim to correct or remove it. Unsupported claims should not remain live simply because they appeared in an earlier version of an article.</p> },
      ]}
    />
  );
}
