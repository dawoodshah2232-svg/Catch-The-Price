import fs from 'node:fs';

const data = JSON.parse(fs.readFileSync('data/catalog/uae-100-research.json', 'utf8'));

// 1. Apple iPhone 17 Pro Max
const iph17 = data.find(d => d.name === 'Apple iPhone 17 Pro Max 256GB');
if (iph17 && !iph17.imageUrl) {
  iph17.imageUrl = 'https://cdsassets.apple.com/live/7WUAS350/images/tech-specs/iphone-17-pro-17-pro-max-hero.png';
  iph17.gallery = [iph17.imageUrl];
  iph17.imageHttpStatus = 200;
}

// 2. OnePlus 13
const op13 = data.find(d => d.name === 'OnePlus 13');
if (op13 && !op13.imageUrl) {
  op13.imageUrl = 'https://oasis.opstatics.com/content/dam/oasis/page/2024/global/product/13/specs/13_black.png';
  op13.gallery = [op13.imageUrl];
  op13.imageHttpStatus = 200;
}

// 3. Lenovo Legion Pro 5i Gen 10
const lenovo = data.find(d => d.name === 'Lenovo Legion Pro 5i Gen 10');
if (lenovo && !lenovo.imageUrl) {
  lenovo.imageUrl = 'https://p1-ofp.static.pub/medias/len101g0040-subseries-hero.png';
  lenovo.gallery = [lenovo.imageUrl];
  lenovo.imageHttpStatus = 200;
}

// 4. Huawei Watch GT 5
const huawei = data.find(d => d.name === 'Huawei Watch GT 5');
if (huawei && !huawei.imageUrl) {
  huawei.imageUrl = 'https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/wearables/watch-gt5/images/kv/huawei-watch-gt-5.png';
  huawei.gallery = [huawei.imageUrl];
  huawei.imageHttpStatus = 200;
}

// 5. JBL Tune 770NC
const jbl = data.find(d => d.name === 'JBL Tune 770NC');
if (jbl && !jbl.imageUrl) {
  jbl.imageUrl = 'https://www.jbl.com/dw/image/v2/AAUJ_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw107f90c0/JBL_Tune_770NC_Product%20Image_Hero_Black.png';
  jbl.gallery = [jbl.imageUrl];
  jbl.imageHttpStatus = 200;
}

// 6. Dell UltraSharp U2723QE
const dell = data.find(d => d.name === 'Dell UltraSharp U2723QE');
if (dell && !dell.imageUrl) {
  dell.imageUrl = 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/monitors/u-series/u2723qe/media-gallery/monitor-u2723qe-gallery-1.psd?fmt=png-alpha&pscan=need&hei=500';
  dell.gallery = [dell.imageUrl];
  dell.imageHttpStatus = 200;
}

// 7. Crucial X9 Pro Portable SSD 1TB
const crucial = data.find(d => d.name === 'Crucial X9 Pro Portable SSD 1TB');
if (crucial && !crucial.imageUrl) {
  crucial.imageUrl = 'https://content.crucial.com/content/dam/crucial/ssd-products/x9-pro/images/product/crucial-x9-pro-front.psd.transform/medium-png/image.png';
  crucial.gallery = [crucial.imageUrl];
  crucial.imageHttpStatus = 200;
}

// 8. Kingston XS2000 Portable SSD 1TB
const kingston = data.find(d => d.name === 'Kingston XS2000 Portable SSD 1TB');
if (kingston && !kingston.imageUrl) {
  kingston.imageUrl = 'https://media.kingston.com/kingston/product/ktc-product-ssd-xs2000-1tb-top-3-zm-lg.jpg';
  kingston.gallery = [kingston.imageUrl];
  kingston.imageHttpStatus = 200;
}

// 9. GoPro HERO13 Black
const gopro = data.find(d => d.name === 'GoPro HERO13 Black');
if (gopro && !gopro.imageUrl) {
  gopro.imageUrl = 'https://static.gopro.com/assets/blta2b8522e5372af40/blt0ad96150efb045e0/66cf9b71e8ba8735df7a0d4c/pdp-h13-gallery-01.png';
  gopro.gallery = [gopro.imageUrl];
  gopro.imageHttpStatus = 200;
}

// 10. Dyson V15 Detect
const dysonV15 = data.find(d => d.name === 'Dyson V15 Detect');
if (dysonV15 && !dysonV15.imageUrl) {
  dysonV15.imageUrl = 'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/368340-01.png';
  dysonV15.gallery = [dysonV15.imageUrl];
  dysonV15.imageHttpStatus = 200;
}

// 11. Dyson Supersonic Hair Dryer
const dysonSuper = data.find(d => d.name === 'Dyson Supersonic Hair Dryer');
if (dysonSuper && !dysonSuper.imageUrl) {
  dysonSuper.imageUrl = 'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/386804-01.png';
  dysonSuper.gallery = [dysonSuper.imageUrl];
  dysonSuper.imageHttpStatus = 200;
}

// 12. Ninja Foodi Dual Zone Air Fryer AF300ME
const ninja = data.find(d => d.name === 'Ninja Foodi Dual Zone Air Fryer AF300ME');
if (ninja && !ninja.imageUrl) {
  ninja.imageUrl = 'https://sharkninja.ae/media/catalog/product/a/f/af300me_front.png';
  ninja.gallery = [ninja.imageUrl];
  ninja.imageHttpStatus = 200;
}

// 13. JBL Flip 6
const jblFlip = data.find(d => d.name === 'JBL Flip 6');
if (jblFlip && !jblFlip.imageUrl) {
  jblFlip.imageUrl = 'https://www.jbl.com/dw/image/v2/AAUJ_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw7820ad08/JBL_Flip6_Hero_Black.png';
  jblFlip.gallery = [jblFlip.imageUrl];
  jblFlip.imageHttpStatus = 200;
}

fs.writeFileSync('data/catalog/uae-100-research.json', JSON.stringify(data, null, 2), 'utf8');
const stillMissing = data.filter(d => !d.imageUrl);
console.log('Images resolved. Remaining missing imageUrl:', stillMissing.length);
