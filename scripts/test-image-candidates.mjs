import fs from 'node:fs';

// Helper to test if a URL returns 200 OK
async function verifyUrl(url) {
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
        'Range': 'bytes=0-100'
      }
    });
    return (res.ok || res.status === 206);
  } catch {
    return false;
  }
}

// Test a sample of reliable CDN URLs for the affected brands
async function testCandidates() {
  const candidates = {
    // Samsung S24 Ultra
    s24Ultra: [
      'https://images.samsung.com/is/image/samsung/p6pim/ae/2401/gallery/ae-galaxy-s24-ultra-489297-sm-s928bztgmea-thumb-539299407?$344_344_PNG$',
      'https://m.media-amazon.com/images/I/71657TiFeHL._AC_SL1500_.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Samsung_Galaxy_S24_Ultra_Titanium_Gray.png/640px-Samsung_Galaxy_S24_Ultra_Titanium_Gray.png'
    ],
    // PS5
    ps5: [
      'https://m.media-amazon.com/images/I/51051FiD9UL._SL1000_.jpg',
      'https://m.media-amazon.com/images/I/619L9JFvTxL._AC_SL1500_.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/PlayStation_5_and_DualSense_with_transparent_background.png/640px-PlayStation_5_and_DualSense_with_transparent_background.png'
    ],
    // Nintendo Switch OLED
    switchOled: [
      'https://m.media-amazon.com/images/I/51yJ+Ode+bL._SL1000_.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Nintendo_Switch_OLED_model.png/640px-Nintendo_Switch_OLED_model.png'
    ],
    // Xbox Series X
    xboxX: [
      'https://m.media-amazon.com/images/I/61-jjE67uqL._SL1500_.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Xbox_Series_X_Front_black_background.png/640px-Xbox_Series_X_Front_black_background.png'
    ],
    // Sony WH-1000XM5
    sonyXm5: [
      'https://m.media-amazon.com/images/I/61+btxzpfDL._AC_SL1500_.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Sony_WH-1000XM5.png/640px-Sony_WH-1000XM5.png'
    ]
  };

  for (const [key, urls] of Object.entries(candidates)) {
    console.log(`Testing ${key}:`);
    for (const u of urls) {
      const ok = await verifyUrl(u);
      console.log(`  [${ok ? '200 OK' : 'FAILED'}] ${u}`);
    }
  }
}

testCandidates();
