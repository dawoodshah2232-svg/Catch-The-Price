// One-off manufacturer evidence collection. Never fetches Amazon or retailer feeds.
import { readFile, writeFile } from 'node:fs/promises';
const input = new URL('../data/catalog/uae-100-candidates.tsv', import.meta.url);
const output = new URL('../data/catalog/uae-100-research.json', import.meta.url);
const decode = (s = '') => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ');
const rows = (await readFile(input, 'utf8')).trim().split(/\r?\n/).slice(1).map(line => {
  const [name, brand, category, source] = line.split('\t');
  return { name, brand, category, source };
});
let previous = [];
try { previous = JSON.parse(await readFile(output, 'utf8')); } catch {}
const results = [];
async function research(row) {
  const cached = previous.find(p => p.name === row.name && p.source === row.source && p.httpStatus === 200 && p.imageHttpStatus === 200);
  if (cached) return cached;
  const result = { ...row, checkedAt: new Date().toISOString(), market: 'ae', currency: 'AED', retailerPriority: ['amazon-uae', 'noon-ae'], offers: [], price: null, rating: null, stock: null };
  try {
    const response = await fetch(row.source, { signal: AbortSignal.timeout(25000) });
    result.httpStatus = response.status;
    result.resolvedSource = response.url;
    const html = await response.text();
    result.pageTitle = decode(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim());
    const metas = {};
    for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
      const attrs = Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*["']([^"']*)["']/g)].map(m => [m[1].toLowerCase(), decode(m[2])]));
      metas[attrs.property || attrs.name] = attrs.content;
    }
    result.sourceTitle = metas['og:title'] || result.pageTitle;
    result.sourceDescription = metas['og:description'] || metas.description || null;
    const image = metas['og:image'] || metas['twitter:image'];
    result.imageUrl = image ? new URL(image, response.url).href : null;
    result.gallery = result.imageUrl ? [result.imageUrl] : [];
    if (!image) result.imageCandidates = [...html.matchAll(/<img\b[^>]*>/gi)].slice(0, 50).map(m => m[0]).filter(t => /\.jpg|\.png|\.webp/.test(t)).slice(0, 12);
    if (result.imageUrl) {
      const imageResponse = await fetch(result.imageUrl, { signal: AbortSignal.timeout(15000) });
      result.imageHttpStatus = imageResponse.status;
      result.imageContentType = imageResponse.headers.get('content-type');
      await imageResponse.body?.cancel();
    }
    result.verification = 'review_required';
  } catch (e) { result.error = e.name; result.verification = 'pending'; }
  return result;
}
for (let offset = 0; offset < rows.length; offset += 8) {
  results.push(...await Promise.all(rows.slice(offset, offset + 8).map(research)));
  await writeFile(output, JSON.stringify(results, null, 2) + '\n');
  console.log(`Researched ${results.length}/${rows.length}`);
}
console.log(JSON.stringify({ total: results.length, pages: results.filter(r => r.httpStatus === 200).length, images: results.filter(r => r.imageHttpStatus === 200 && r.imageContentType?.startsWith('image/')).length }));
