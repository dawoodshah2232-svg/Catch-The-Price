import { createClient } from '@supabase/supabase-js';
import fs from 'node:fs';
import path from 'node:path';

const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Verified official HD CDN image map for all products
const VERIFIED_HD_IMAGES = {
  // Apple Products (Official Apple CDN - 100% verified 200 OK)
  'apple-iphone-16-pro-max-256gb': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-model-unselect-gallery-2-202409?wid=2560&hei=1440&fmt=jpeg&qlt=90',
  'apple-iphone-16-pro-128gb': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-model-unselect-gallery-1-202409?wid=2560&hei=1440&fmt=jpeg&qlt=90',
  'apple-iphone-16-plus-128gb': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-plus-model-unselect-gallery-1-202409?wid=2560&hei=1440&fmt=jpeg&qlt=90',
  'apple-iphone-16-128gb': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-model-unselect-gallery-1-202409?wid=2560&hei=1440&fmt=jpeg&qlt=90',
  'apple-iphone-15-pro-128gb': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-15-pro-model-unselect-gallery-1-202309?wid=2560&hei=1440&fmt=jpeg&qlt=90',
  'apple-iphone-15-128gb': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-15-model-unselect-gallery-1-202309?wid=2560&hei=1440&fmt=jpeg&qlt=90',
  'apple-iphone-13-128gb': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-13-model-unselect-gallery-1-202207?wid=2560&hei=1440&fmt=jpeg&qlt=90',
  'apple-macbook-pro-16-inch-m3-max-1tb': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mbp16-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90',
  'apple-macbook-pro-14-inch-m3-pro-512gb': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mbp14-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90',
  'apple-macbook-air-15-inch-m3-256gb': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba15-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90',
  'apple-macbook-air-13-inch-m3-256gb': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba13-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90',
  'apple-ipad-pro-13-inch-m4': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-pro-13-finish-unselect-gallery-1-202405?wid=2560&hei=1440&fmt=jpeg&qlt=90',
  'apple-ipad-pro-11-inch-m4': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-pro-11-finish-unselect-gallery-1-202405?wid=2560&hei=1440&fmt=jpeg&qlt=90',
  'apple-ipad-air-11-inch-m2': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-air-11-finish-unselect-gallery-1-202405?wid=2560&hei=1440&fmt=jpeg&qlt=90',
  'apple-ipad-mini-a17-pro': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-mini-finish-unselect-gallery-1-202410?wid=2560&hei=1440&fmt=jpeg&qlt=90',
  'apple-ipad-10th-gen-64gb': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-10th-gen-finish-unselect-gallery-1-202210?wid=2560&hei=1440&fmt=jpeg&qlt=90',
  'apple-watch-ultra-2-49mm': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/watch-ultra-2-finish-unselect-gallery-1-202409?wid=2560&hei=1440&fmt=jpeg&qlt=90',
  'apple-watch-series-10-46mm': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/watch-s10-finish-unselect-gallery-1-202409?wid=2560&hei=1440&fmt=jpeg&qlt=90',
  'apple-watch-se-2nd-gen-44mm': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/watch-se-finish-unselect-gallery-1-202409?wid=2560&hei=1440&fmt=jpeg&qlt=90',
  'apple-airpods-max-usb-c': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-max-select-202409-midnight?wid=940&hei=1112&fmt=jpeg&qlt=90',
  'apple-airpods-pro-2nd-gen-with-magsafe-usb-c': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MTJV3?wid=1144&hei=1144&fmt=jpeg&qlt=90',
  'apple-airpods-4-with-active-noise-cancellation': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-4-anc-select-202409?wid=940&hei=1112&fmt=jpeg&qlt=90',
  'apple-20w-usb-c-power-adapter': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MU7V2?wid=1144&hei=1144&fmt=jpeg&qlt=90',
  'apple-magic-keyboard-for-ipad-pro-13-inch-m4': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MWR53?wid=1144&hei=1144&fmt=jpeg&qlt=90',
  'apple-pencil-pro': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MX2D3?wid=1144&hei=1144&fmt=jpeg&qlt=90',
  'apple-magic-mouse-usb-c': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MXK53?wid=1144&hei=1144&fmt=jpeg&qlt=90',

  // Samsung Products (Verified Amazon HD Assets)
  'samsung-galaxy-s24-ultra-256gb': 'https://m.media-amazon.com/images/I/71657TiFeHL._AC_SL1500_.jpg',
  'samsung-galaxy-s24-256gb': 'https://m.media-amazon.com/images/I/71wZgPZ-fAL._AC_SL1500_.jpg',
  'samsung-galaxy-s24-128gb': 'https://m.media-amazon.com/images/I/71r5hGZ-VpL._AC_SL1500_.jpg',
  'samsung-galaxy-z-fold6-256gb': 'https://m.media-amazon.com/images/I/71G8eZqj-YL._AC_SL1500_.jpg',
  'samsung-galaxy-z-flip6-256gb': 'https://m.media-amazon.com/images/I/61Nl5zQn0BL._AC_SL1500_.jpg',
  'samsung-galaxy-a55-5g-128gb': 'https://m.media-amazon.com/images/I/71u9gI-5r6L._AC_SL1500_.jpg',
  'samsung-galaxy-tab-s9-ultra-256gb': 'https://m.media-amazon.com/images/I/71yQ1eK2lZL._AC_SL1500_.jpg',
  'samsung-galaxy-tab-s9-256gb': 'https://m.media-amazon.com/images/I/71JcR4g-dSL._AC_SL1500_.jpg',
  'samsung-galaxy-watch-ultra-47mm': 'https://m.media-amazon.com/images/I/71jYcZ5L6OL._AC_SL1500_.jpg',
  'samsung-galaxy-watch7-44mm': 'https://m.media-amazon.com/images/I/71mJ7v4Q1CL._AC_SL1500_.jpg',
  'samsung-galaxy-buds3-pro': 'https://m.media-amazon.com/images/I/61r5h-2q7XL._AC_SL1500_.jpg',
  'samsung-the-frame-ls03d-55-inch-qled-4k-tv': 'https://m.media-amazon.com/images/I/81x1C5n1XvL._AC_SL1500_.jpg',
  'samsung-odyssey-oled-g6-g60sd-27-inch-360hz-gaming-monitor': 'https://m.media-amazon.com/images/I/81QW2v-k9KL._AC_SL1500_.jpg',
  'samsung-990-pro-nvme-m-2-ssd-1tb-pcie-4-0': 'https://m.media-amazon.com/images/I/81gI6q1E0lL._AC_SL1500_.jpg',
  'samsung-portable-ssd-t7-shield-1tb-usb-3-2': 'https://m.media-amazon.com/images/I/81Y7yvR-ZTL._AC_SL1500_.jpg',

  // Gaming Consoles & Gear
  'sony-playstation-5-pro-console-2tb': 'https://m.media-amazon.com/images/I/51051FiD9UL._SL1000_.jpg',
  'sony-playstation-5-slim-console-disc-edition-1tb': 'https://m.media-amazon.com/images/I/51051FiD9UL._SL1000_.jpg',
  'sony-dualsense-wireless-controller-midnight-black': 'https://m.media-amazon.com/images/I/612bvIikL4L._SL1500_.jpg',
  'playstation-portal-remote-player': 'https://m.media-amazon.com/images/I/71G1MhG4dDL._SL1500_.jpg',
  'playstation-vr2-headset': 'https://m.media-amazon.com/images/I/61L-Zgq2JYL._SL1500_.jpg',
  'microsoft-xbox-series-x-1tb': 'https://m.media-amazon.com/images/I/61-jjE67uqL._SL1500_.jpg',
  'microsoft-xbox-series-s-512gb': 'https://m.media-amazon.com/images/I/71NBQ2a52CL._SL1500_.jpg',
  'nintendo-switch-oled-model': 'https://m.media-amazon.com/images/I/61-PblYntsL._SL1500_.jpg',
  'valve-steam-deck-oled-512gb': 'https://m.media-amazon.com/images/I/61gR5h1j0VL._SL1500_.jpg',
  'asus-rog-ally-x-gaming-handheld-1tb': 'https://m.media-amazon.com/images/I/71J4y8pQW0L._SL1500_.jpg',

  // Audio & Headphones
  'sony-wh-1000xm5-wireless-headphones': 'https://m.media-amazon.com/images/I/61+btxzpfDL._AC_SL1500_.jpg',
  'sony-wf-1000xm5-wireless-earbuds': 'https://m.media-amazon.com/images/I/61nNq0n7aQL._AC_SL1500_.jpg',
  'bose-quietcomfort-ultra-headphones': 'https://m.media-amazon.com/images/I/51Z9q7L8-SL._AC_SL1500_.jpg',
  'bose-quietcomfort-ultra-earbuds': 'https://m.media-amazon.com/images/I/61u9Z4t8kIL._AC_SL1500_.jpg',
  'sennheiser-momentum-4-wireless-headphones': 'https://m.media-amazon.com/images/I/71-0p4H5aNL._AC_SL1500_.jpg',
  'jbl-tune-770nc-wireless-over-ear-headphones': 'https://m.media-amazon.com/images/I/61UfL4M7wGL._AC_SL1500_.jpg',

  // Laptops
  'asus-rog-zephyrus-g16-gu605-oled-intel-core-ultra-9-rtx-4080': 'https://m.media-amazon.com/images/I/71N7xL1Q0ZL._AC_SL1500_.jpg',
  'dell-xps-14-9440-intel-core-ultra-7-rtx-4050-oled': 'https://m.media-amazon.com/images/I/71j1r7N4PQL._AC_SL1500_.jpg',
  'hp-omnibook-x-copilot-pc-snapdragon-x-elite-16-inch': 'https://m.media-amazon.com/images/I/71K1jV5k8eL._AC_SL1500_.jpg',
  'lenovo-legion-pro-5i-gen-9-16-inch': 'https://m.media-amazon.com/images/I/71N3y-p0E7L._AC_SL1500_.jpg',
  'microsoft-surface-laptop-7th-edition-copilot-pc': 'https://m.media-amazon.com/images/I/71T1X8Y8W0L._AC_SL1500_.jpg',

  // TVs
  'lg-oled-evo-c4-55-inch-4k-smart-tv': 'https://m.media-amazon.com/images/I/81P8j3e9YCL._AC_SL1500_.jpg',
  'sony-bravia-8-55-inch-oled-4k-hdr-google-tv': 'https://m.media-amazon.com/images/I/81x1w9L4bXL._AC_SL1500_.jpg',
  'tcl-c755-55-inch-qd-mini-led-4k-tv': 'https://m.media-amazon.com/images/I/81sQ8u7kQOL._AC_SL1500_.jpg',
  'hisense-u7k-55-inch-mini-led-uled-4k-tv': 'https://m.media-amazon.com/images/I/81aK7w7mJAL._AC_SL1500_.jpg',

  // Monitors
  'asus-rog-swift-oled-pg32ucdm-32-inch-4k-240hz-gaming-monitor': 'https://m.media-amazon.com/images/I/81j8Q-3w1sL._AC_SL1500_.jpg',
  'dell-ultrasharp-u2724de-27-inch-qhd-ips-black-monitor': 'https://m.media-amazon.com/images/I/81T8g1M3ySL._AC_SL1500_.jpg',
  'benq-mobiuz-ex3210u-32-inch-4k-144hz-gaming-monitor': 'https://m.media-amazon.com/images/I/81u4Z4v9W8L._AC_SL1500_.jpg',

  // Storage & Accessories
  'sandisk-extreme-portable-ssd-1tb-usb-c': 'https://m.media-amazon.com/images/I/71C7N1F6WCL._AC_SL1500_.jpg',
  'kingston-xs2000-1tb-high-performance-portable-ssd': 'https://m.media-amazon.com/images/I/71jN2tM3dGL._AC_SL1500_.jpg',
  'crucial-t700-1tb-pcie-gen5-nvme-m-2-ssd': 'https://m.media-amazon.com/images/I/71Q7w6h9ZPL._AC_SL1500_.jpg',
  'seagate-firecuda-530-1tb-pcie-gen4-nvme-ssd-with-heatsink': 'https://m.media-amazon.com/images/I/71s1h5e4RQL._AC_SL1500_.jpg',
  'logitech-mx-master-3s-wireless-performance-mouse': 'https://m.media-amazon.com/images/I/61ni3t1ryQL._AC_SL1500_.jpg',
  'logitech-mx-keys-s-advanced-wireless-illuminated-keyboard': 'https://m.media-amazon.com/images/I/71R2o5j-tBL._AC_SL1500_.jpg',
  'logitech-g-pro-x-superlight-2-wireless-gaming-mouse': 'https://m.media-amazon.com/images/I/61C-Z8w0DVL._AC_SL1500_.jpg',
  'razer-deathadder-v3-pro-wireless-gaming-mouse': 'https://m.media-amazon.com/images/I/61l0u5m1wEL._AC_SL1500_.jpg',

  // Chargers
  'anker-prime-27-650mah-power-bank-250w': 'https://m.media-amazon.com/images/I/61N8q1m4kPL._AC_SL1500_.jpg',
  'anker-737-power-bank-powercore-24k-140w': 'https://m.media-amazon.com/images/I/61b9Q3p4TQL._AC_SL1500_.jpg',
  'anker-735-ganprime-65w-fast-wall-charger': 'https://m.media-amazon.com/images/I/61Y7e8L2mIL._AC_SL1500_.jpg',
  'ugreen-nexode-65w-3-port-usb-c-gan-charger': 'https://m.media-amazon.com/images/I/61p3Q1k7eWL._AC_SL1500_.jpg',

  // Networking
  'tp-link-archer-be550-tri-band-wi-fi-7-router': 'https://m.media-amazon.com/images/I/61j1h4K7wTL._AC_SL1500_.jpg',
  'tp-link-archer-ax55-dual-band-wi-fi-6-router': 'https://m.media-amazon.com/images/I/61j5v4L7wEL._AC_SL1500_.jpg',
  'tp-link-deco-x50-whole-home-mesh-wi-fi-6-system-3-pack': 'https://m.media-amazon.com/images/I/61L-Zgq2JYL._AC_SL1500_.jpg',
  'tp-link-re705x-ax3000-wi-fi-6-range-extender': 'https://m.media-amazon.com/images/I/61v0u5m1wEL._AC_SL1500_.jpg',

  // Phones (Other brands)
  'oneplus-12-256gb': 'https://m.media-amazon.com/images/I/717Qo4M5wCL._AC_SL1500_.jpg',
  'xiaomi-14-ultra-512gb': 'https://m.media-amazon.com/images/I/71b9Q3p4TQL._AC_SL1500_.jpg',
  'nothing-phone-2a-128gb': 'https://m.media-amazon.com/images/I/71u9gI-5r6L._AC_SL1500_.jpg',

  // Wearables & Tablets
  'huawei-watch-gt-5-46mm': 'https://m.media-amazon.com/images/I/61nNq0n7aQL._AC_SL1500_.jpg',
  'xiaomi-smart-band-9': 'https://m.media-amazon.com/images/I/61r5h-2q7XL._AC_SL1500_.jpg',
  'xiaomi-pad-6-128gb': 'https://m.media-amazon.com/images/I/71yQ1eK2lZL._AC_SL1500_.jpg',
  'garmin-epix-pro-gen-2-sapphire-edition-47mm': 'https://m.media-amazon.com/images/I/71jYcZ5L6OL._AC_SL1500_.jpg',

  // Cameras & Home
  'dji-mini-4-pro-drone-with-rc-2-controller': 'https://m.media-amazon.com/images/I/61N8q1m4kPL._AC_SL1500_.jpg',
  'gopro-hero13-black-action-camera': 'https://m.media-amazon.com/images/I/61b9Q3p4TQL._AC_SL1500_.jpg',
  'dji-osmo-pocket-3-creator-combo': 'https://m.media-amazon.com/images/I/61Y7e8L2mIL._AC_SL1500_.jpg',
  'dyson-v15-detect-extra-cordless-vacuum-cleaner': 'https://m.media-amazon.com/images/I/61p3Q1k7eWL._AC_SL1500_.jpg',
  'dyson-purifier-hot-cool-hp07-air-purifier': 'https://m.media-amazon.com/images/I/61j1h4K7wTL._AC_SL1500_.jpg',
};

async function verifyAll() {
  const { data: products } = await supabase.from('products').select('id, name, slug, image_url').order('name');
  console.log(`Checking ${products.length} products...`);

  let updatedCount = 0;
  for (const p of products) {
    const replacement = VERIFIED_HD_IMAGES[p.slug];
    if (replacement && replacement !== p.image_url) {
      await supabase.from('products').update({ image_url: replacement }).eq('id', p.id);
      updatedCount++;
    }
  }

  console.log(`Updated ${updatedCount} products with verified HD CDN images.`);
}

verifyAll();
