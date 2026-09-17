import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

const checks = [];
const check = (name, condition, detail) => checks.push({ name, ok: Boolean(condition), detail });

const home = read('app/[country]/page.tsx');
const outbound = read('app/api/outbound/route.ts');
const adminLayout = read('app/admin/layout.tsx');
const catalog = read('lib/data/catalog.server.ts');
const header = read('components/layout/Header.tsx');
const bottomNav = read('components/layout/MobileBottomNav.tsx');
const productPage = read('components/product/ProductClientPage.tsx');
const sourceAdapter = read('lib/ingestion/sourceAdapter.ts');

check('Only UAE and US hreflang are public', !/en-GB|en-CA|en-AU|en-SA/.test(home), 'Homepage metadata must expose launch markets only.');
check('Outbound redirects resolve by offer ID', outbound.includes("searchParams.get('offerId')") && !outbound.includes("searchParams.get('targetUrl')"), 'Never trust a visitor-supplied retailer destination.');
check('Outbound destinations require HTTPS', outbound.includes("destination.protocol !== 'https:'"), 'Retailer hand-offs must remain HTTPS-only.');
check('Outbound destination host is merchant-bound', outbound.includes('hostAllowed') && outbound.includes('merchantHost'), 'Open redirects must remain blocked.');
check('Admin is auth + allowlist protected', adminLayout.includes('createAuthServerClient') && adminLayout.includes('isAllowedAdminEmail'), 'Admin must never rely on obscurity.');
check('Demo catalog is explicit preview behavior', catalog.includes('ENABLE_DEMO_CATALOG') && catalog.includes('vercel.app'), 'Production must not silently fall back to fixtures.');
check('Source ingestion is rights-gated', sourceAdapter.includes('sourceRightsId') && /ACTIVE|active/.test(sourceAdapter), 'Retailer accessibility is not publication permission.');
check('Mobile search remains sticky', header.includes('sticky top-0') && (header.includes('<SearchBar chrome') || header.includes('<HeaderSearch')), 'Search must stay available while mobile shoppers scroll.');
check('Mobile bottom chrome remains dark', bottomNav.includes("bg-[#071015]"), 'Top and bottom brand chrome stay dark in both themes.');
check('Product retailer CTA uses offer ID only', productPage.includes('/api/outbound?offerId=') && !productPage.includes('targetUrl='), 'Product pages must not pass retailer URLs through the browser.');

const publicFiles = [];
const publicRoots = [
  'app/[country]',
  'components/home',
  'components/layout',
  'components/product',
  'components/search',
];

function walk(relative) {
  const absolute = path.join(root, relative);
  if (!fs.existsSync(absolute)) return;
  for (const entry of fs.readdirSync(absolute, { withFileTypes: true })) {
    const next = path.join(relative, entry.name);
    if (entry.isDirectory()) walk(next);
    else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) publicFiles.push(next);
  }
}

publicRoots.forEach(walk);
const riskyPhrases = [
  'Verified Rating',
  'Verified All-Time Low',
  'certified authorized retailers',
  'scans verified stores 24/7',
  'Lowest recorded in 90 days',
];

for (const phrase of riskyPhrases) {
  const offenders = publicFiles.filter((file) => read(file).includes(phrase));
  check(`No unsupported public claim: ${phrase}`, offenders.length === 0, offenders.length ? `Found in: ${offenders.join(', ')}` : '');
}

const failed = checks.filter((item) => !item.ok);
for (const item of checks) {
  console.log(`${item.ok ? 'PASS' : 'FAIL'}  ${item.name}${item.detail ? ` — ${item.detail}` : ''}`);
}

console.log(`\nRelease audit: ${checks.length - failed.length}/${checks.length} checks passed.`);
if (failed.length) process.exit(1);
