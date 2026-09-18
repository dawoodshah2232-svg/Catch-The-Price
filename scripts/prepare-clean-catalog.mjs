import fs from 'node:fs';

export const cleanCatalog = [
  // PHONES (14)
  {
    name: 'Apple iPhone 16 Pro Max 256GB',
    brand: 'Apple',
    category: 'phones',
    source: 'https://www.apple.com/ae/iphone-16-pro/',
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-max-natural-titanium-select?wid=940&hei=1112&fmt=png-alpha',
    description: 'iPhone 16 Pro Max with grade 5 titanium design, A18 Pro chip, Camera Control, 48MP Fusion camera, and industry-leading battery life.'
  },
  {
    name: 'Apple iPhone 16 Pro 128GB',
    brand: 'Apple',
    category: 'phones',
    source: 'https://www.apple.com/ae/iphone-16-pro/',
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-pro-black-titanium-select?wid=940&hei=1112&fmt=png-alpha',
    description: 'iPhone 16 Pro featuring a lightweight titanium frame, Camera Control, 4K 120 fps Dolby Vision, and powerful A18 Pro silicon.'
  },
  {
    name: 'Apple iPhone 16 Plus 128GB',
    brand: 'Apple',
    category: 'phones',
    source: 'https://www.apple.com/ae/iphone-16/',
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-plus-ultramarine-select?wid=940&hei=1112&fmt=png-alpha',
    description: 'iPhone 16 Plus with 6.7-inch Super Retina XDR display, Camera Control, 48MP Fusion camera with 2x Telephoto, and A18 processor.'
  },
  {
    name: 'Apple iPhone 16 128GB',
    brand: 'Apple',
    category: 'phones',
    source: 'https://www.apple.com/ae/iphone-16/',
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-teal-select?wid=940&hei=1112&fmt=png-alpha',
    description: 'iPhone 16 with Camera Control, 48MP Fusion camera, vibrant color-infused back glass, and cutting-edge A18 chip.'
  },
  {
    name: 'Apple iPhone 15 128GB',
    brand: 'Apple',
    category: 'phones',
    source: 'https://www.apple.com/ae/iphone-15/',
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-15-black-select?wid=940&hei=1112&fmt=png-alpha',
    description: 'iPhone 15 featuring Dynamic Island, 48MP Main camera with 2x Telephoto, durable color-infused glass, and USB-C connectivity.'
  },
  {
    name: 'Samsung Galaxy S24 Ultra 256GB',
    brand: 'Samsung',
    category: 'phones',
    source: 'https://www.samsung.com/ae/smartphones/galaxy-s24-ultra/',
    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/ae/2401/gallery/ae-galaxy-s24-ultra-sm-s928bztcmea-thumb-539304918?$216_216_PNG$',
    description: 'Galaxy S24 Ultra with titanium exterior, embedded S Pen, Galaxy AI capabilities, 200MP camera system, and Snapdragon 8 Gen 3 for Galaxy.'
  },
  {
    name: 'Samsung Galaxy S24+ 256GB',
    brand: 'Samsung',
    category: 'phones',
    source: 'https://www.samsung.com/ae/smartphones/galaxy-s24/',
    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/ae/2401/gallery/ae-galaxy-s24-plus-sm-s926bzyvmea-thumb-539304724?$216_216_PNG$',
    description: 'Galaxy S24+ offering a 6.7-inch QHD+ Dynamic AMOLED 2X screen, Galaxy AI suite, 50MP triple camera, and 4,900mAh battery.'
  },
  {
    name: 'Samsung Galaxy S24 128GB',
    brand: 'Samsung',
    category: 'phones',
    source: 'https://www.samsung.com/ae/smartphones/galaxy-s24/',
    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/ae/2401/gallery/ae-galaxy-s24-sm-s921bzkvmea-thumb-539304530?$216_216_PNG$',
    description: 'Compact Galaxy S24 with streamlined aluminum frame, Circle to Search, 50MP primary sensor, and AI Photo Assist.'
  },
  {
    name: 'Samsung Galaxy Z Fold6 256GB',
    brand: 'Samsung',
    category: 'phones',
    source: 'https://www.samsung.com/ae/smartphones/galaxy-z-fold6/',
    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/ae/2407/gallery/ae-galaxy-z-fold6-f956-sm-f956bzbemea-thumb-542385154?$216_216_PNG$',
    description: 'Galaxy Z Fold6 with thinner, lighter folding design, 7.6-inch main display, enhanced Armor Aluminum, and multi-window productivity.'
  },
  {
    name: 'Samsung Galaxy Z Flip6 256GB',
    brand: 'Samsung',
    category: 'phones',
    source: 'https://www.samsung.com/ae/smartphones/galaxy-z-flip6/',
    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/ae/2407/gallery/ae-galaxy-z-flip6-f741-sm-f741bzyemea-thumb-542384950?$216_216_PNG$',
    description: 'Galaxy Z Flip6 pocket-sized foldable with 3.4-inch FlexWindow, 50MP wide camera, vapor chamber cooling, and FlexCam with Auto Zoom.'
  },
  {
    name: 'Samsung Galaxy A55 5G 128GB',
    brand: 'Samsung',
    category: 'phones',
    source: 'https://www.samsung.com/ae/smartphones/galaxy-a/galaxy-a55-5g-awesome-navy-128gb-sm-a556bzkvmea/',
    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/ae/sm-a556bzkvmea/gallery/ae-galaxy-a55-5g-sm-a556-sm-a556bzkvmea-thumb-540280456?$216_216_PNG$',
    description: 'Galaxy A55 5G featuring metal frame with flat design, Corning Gorilla Glass Victus+, 50MP triple camera, and Samsung Knox Vault.'
  },
  {
    name: 'OnePlus 12 256GB',
    brand: 'OnePlus',
    category: 'phones',
    source: 'https://www.oneplus.com/global/12',
    imageUrl: 'https://oasis.opstatics.com/content/dam/oasis/page/2024/global/product/13/specs/13_black.png',
    description: 'Flagship OnePlus phone with Snapdragon 8 Gen 3, 4th Gen Hasselblad Camera System, 5,400mAh battery with 100W SUPERVOOC charging.'
  },
  {
    name: 'Xiaomi 14 Ultra 512GB',
    brand: 'Xiaomi',
    category: 'phones',
    source: 'https://www.mi.com/global/product/xiaomi-14-ultra/',
    imageUrl: 'https://i02.appmifile.com/492_operatorx_operatorx_opx/02/03/2024/fa9c20a7b6cb8c3ff6f30e6a9ee562ec.png',
    description: 'Xiaomi 14 Ultra co-engineered with Leica featuring 1-inch LYT-900 sensor with stepless variable aperture, quad 50MP cameras, and WQHD+ AMOLED.'
  },
  {
    name: 'Nothing Phone (2a) 128GB',
    brand: 'Nothing',
    category: 'phones',
    source: 'https://nothing.tech/pages/phone-2a',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0376/5420/0459/files/0000s_0006_Layer_1.png?v=1709631776',
    description: 'Nothing Phone (2a) with custom Dimensity 7200 Pro chipset, iconic Glyph Interface, 50MP dual rear camera, and flexible AMOLED 120Hz display.'
  },

  // LAPTOPS (11)
  {
    name: 'Apple MacBook Air 13-inch M3 256GB',
    brand: 'Apple',
    category: 'laptops',
    source: 'https://www.apple.com/ae/macbook-air/',
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba13-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90',
    description: 'MacBook Air 13-inch supercharged by Apple M3 chip, Liquid Retina display, up to 18 hours battery life, and MagSafe charging.'
  },
  {
    name: 'Apple MacBook Air 15-inch M3 256GB',
    brand: 'Apple',
    category: 'laptops',
    source: 'https://www.apple.com/ae/macbook-air/',
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba15-starlight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90',
    description: '15-inch MacBook Air with expansive Liquid Retina screen, M3 silicon, six-speaker sound system with Spatial Audio, and fanless silent design.'
  },
  {
    name: 'Apple MacBook Pro 14-inch M3 Pro 512GB',
    brand: 'Apple',
    category: 'laptops',
    source: 'https://www.apple.com/ae/macbook-pro/',
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mbp14-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90',
    description: '14-inch MacBook Pro with M3 Pro chip in Space Black, Liquid Retina XDR display with ProMotion 120Hz, HDMI, and SDXC card reader.'
  },
  {
    name: 'Apple MacBook Pro 16-inch M3 Max 1TB',
    brand: 'Apple',
    category: 'laptops',
    source: 'https://www.apple.com/ae/macbook-pro/',
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mbp16-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90',
    description: 'MacBook Pro 16-inch with top-tier M3 Max chip, 16.2-inch Extreme Dynamic Range panel, hardware-accelerated ray tracing, and up to 22h battery life.'
  },
  {
    name: 'ASUS Zenbook 14 OLED UX3405',
    brand: 'ASUS',
    category: 'laptops',
    source: 'https://www.asus.com/me-en/laptops/for-home/zenbook/asus-zenbook-14-oled-ux3405/',
    imageUrl: 'https://dlcdnwebimgs.asus.com/gain/282fa6b1-5d9e-4950-ab46-1558bf2a096c/w800',
    description: 'Premium ultraportable Zenbook with Intel Core Ultra 7 processor, 3K 120Hz ASUS Lumina OLED display, and all-day 75Wh battery.'
  },
  {
    name: 'ASUS Vivobook 15 X1504',
    brand: 'ASUS',
    category: 'laptops',
    source: 'https://www.asus.com/me-en/laptops/for-home/vivobook/asus-vivobook-15-x1504/',
    imageUrl: 'https://dlcdnwebimgs.asus.com/gain/79f909a4-cf8c-4120-bebe-58a4369e160f/w800',
    description: 'Everyday laptop with 15.6-inch FHD display, 180° lay-flat hinge, physical webcam privacy shield, and comprehensive I/O connectivity.'
  },
  {
    name: 'ASUS TUF Gaming A15 FA507',
    brand: 'ASUS',
    category: 'laptops',
    source: 'https://www.asus.com/me-en/laptops/for-gaming/tuf-gaming/asus-tuf-gaming-a15-2023/',
    imageUrl: 'https://dlcdnwebimgs.asus.com/gain/8b25250f-bf55-425f-93bd-bb1d8a1db1fe/w800',
    description: 'Military-grade rugged gaming laptop with AMD Ryzen 7 7735HS, NVIDIA GeForce RTX 4060 GPU with MUX Switch, and 144Hz FHD gaming panel.'
  },
  {
    name: 'ASUS ROG Zephyrus G14 (2024)',
    brand: 'ASUS',
    category: 'laptops',
    source: 'https://rog.asus.com/laptops/rog-zephyrus/rog-zephyrus-g14-2024/',
    imageUrl: 'https://dlcdnwebimgs.asus.com/gain/BA146EC2-FF9D-4A8E-A91A-CD16CF23EBCE/w800',
    description: 'Precision CNC-machined 14-inch gaming laptop featuring 3K 120Hz ROG Nebula OLED display, AMD Ryzen 9 8945HS, and Slash Lighting LED bar.'
  },
  {
    name: 'Microsoft Surface Laptop 7th Edition (Copilot+ PC)',
    brand: 'Microsoft',
    category: 'laptops',
    source: 'https://www.microsoft.com/en-us/surface/devices/surface-laptop-7th-edition',
    imageUrl: 'https://images.ctfassets.net/jy9s7k22hbg4/7vvUfkCAzo0Dqi4g39G5gA/7be378413a2862d80cbe3596706059d6/Surface-Laptop-7th-Edition-Hero.png',
    description: 'Next-generation AI PC powered by Snapdragon X Elite, PixelSense touchscreen with ultrathin bezels, Copilot key, and up to 20h battery.'
  },
  {
    name: 'Lenovo Legion Pro 5i Gen 9 16-inch',
    brand: 'Lenovo',
    category: 'laptops',
    source: 'https://www.lenovo.com/ae/en/p/laptops/legion-laptops/legion-pro-series/legion-pro-5i-gen-9-16-inch-intel/len101g0033',
    imageUrl: 'https://p1-ofp.static.pub/medias/len101g0040-subseries-hero.png',
    description: 'High-performance esports laptop with 14th Gen Intel Core i9 processor, NVIDIA GeForce RTX 4070 GPU, and 16-inch 240Hz PureSight Gaming display.'
  },
  {
    name: 'HP OmniBook X 14',
    brand: 'HP',
    category: 'laptops',
    source: 'https://www.hp.com/us-en/laptops-and-2-in-1s/omnibook-x-ai-pc.html',
    imageUrl: 'https://www.hp.com/content/dam/sites/worldwide/personal-computers/consumer/laptops/omnibook-x/omnibook-x-gallery-1.png',
    description: 'Ultra-efficient AI PC with Snapdragon X Elite silicon, 2.2K eye-comfort touch display, Poly Camera Pro AI video tools, and 26-hour battery rating.'
  },

  // TABLETS (8)
  {
    name: 'Apple iPad Pro 13-inch (M4)',
    brand: 'Apple',
    category: 'tablets',
    source: 'https://www.apple.com/ae/ipad-pro/',
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-pro-13-select-wifi-spaceblack-202405?wid=940&hei=1112&fmt=png-alpha',
    description: 'Thinnest Apple product ever with breakthrough Ultra Retina XDR tandem OLED display, ultra-powerful M4 chip, and Apple Pencil Pro support.'
  },
  {
    name: 'Apple iPad Pro 11-inch (M4)',
    brand: 'Apple',
    category: 'tablets',
    source: 'https://www.apple.com/ae/ipad-pro/',
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-pro-11-select-wifi-silver-202405?wid=940&hei=1112&fmt=png-alpha',
    description: '11-inch iPad Pro with Ultra Retina XDR OLED screen, 5.3mm thin enclosure, M4 neural engine, and landscape front camera.'
  },
  {
    name: 'Apple iPad Air 11-inch (M2)',
    brand: 'Apple',
    category: 'tablets',
    source: 'https://www.apple.com/ae/ipad-air/',
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-air-11-select-wifi-blue-202405?wid=940&hei=1112&fmt=png-alpha',
    description: 'Redesigned iPad Air driven by M2 chip, vibrant Liquid Retina display, Touch ID, landscape stereo speakers, and fast Wi-Fi 6E.'
  },
  {
    name: 'Apple iPad mini (A17 Pro)',
    brand: 'Apple',
    category: 'tablets',
    source: 'https://www.apple.com/ae/ipad-mini/',
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-mini-select-wifi-purple-202410?wid=940&hei=1112&fmt=png-alpha',
    description: 'Ultra-portable 8.3-inch iPad mini with A17 Pro chip, Apple Intelligence capability, Apple Pencil Pro support, and USB-C speeds up to 10Gbps.'
  },
  {
    name: 'Apple iPad 10th Gen 64GB',
    brand: 'Apple',
    category: 'tablets',
    source: 'https://www.apple.com/ae/ipad-10.9/',
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-10th-gen-finish-select-202212-blue?wid=940&hei=1112&fmt=png-alpha',
    description: 'All-screen 10.9-inch iPad with A14 Bionic processor, 12MP Ultra Wide front camera with Center Stage, USB-C, and Magic Keyboard Folio support.'
  },
  {
    name: 'Samsung Galaxy Tab S9 Ultra 256GB',
    brand: 'Samsung',
    category: 'tablets',
    source: 'https://www.samsung.com/ae/tablets/galaxy-tab-s9/',
    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/ae/sm-x910nzaamea/gallery/ae-galaxy-tab-s9-ultra-wifi-x910-sm-x910nzaamea-thumb-537877969?$216_216_PNG$',
    description: 'Massive 14.6-inch Dynamic AMOLED 2X Android tablet with S Pen included, IP68 water resistance, and Snapdragon 8 Gen 2 processor.'
  },
  {
    name: 'Samsung Galaxy Tab S9+ 256GB',
    brand: 'Samsung',
    category: 'tablets',
    source: 'https://www.samsung.com/ae/tablets/galaxy-tab-s9/',
    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/ae/sm-x810nzaamea/gallery/ae-galaxy-tab-s9-plus-wifi-x810-sm-x810nzaamea-thumb-537877561?$216_216_PNG$',
    description: '12.4-inch Galaxy Tab S9+ with 120Hz AMOLED panel, Armor Aluminum chassis, quad AKG speakers, and dual rear cameras.'
  },
  {
    name: 'Xiaomi Pad 6 128GB',
    brand: 'Xiaomi',
    category: 'tablets',
    source: 'https://www.mi.com/global/product/xiaomi-pad-6/',
    imageUrl: 'https://i02.appmifile.com/542_operatorx_operatorx_opx/02/03/2024/79b47e85c2b0c1b79f8ea7cf8b9be2e0.png',
    description: 'Sleek aluminum unibody tablet with 11-inch 144Hz WQHD+ display, Snapdragon 870 platform, quad stereo speakers, and 8,840mAh battery.'
  },

  // SMARTWATCHES (8)
  {
    name: 'Apple Watch Ultra 2 (GPS + Cellular)',
    brand: 'Apple',
    category: 'smartwatches',
    source: 'https://www.apple.com/ae/apple-watch-ultra-2/',
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/watch-ultra-2-black-titanium-milanese-select-202409?wid=940&hei=1112&fmt=png-alpha',
    description: 'Rugged 49mm titanium sports watch with 3000-nit display, S9 SiP with Double Tap gesture, precision dual-frequency GPS, and 72-hour low power battery.'
  },
  {
    name: 'Apple Watch Series 10 46mm',
    brand: 'Apple',
    category: 'smartwatches',
    source: 'https://www.apple.com/ae/apple-watch-series-10/',
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/watch-s10-jetblack-sport-band-black-select-202409?wid=940&hei=1112&fmt=png-alpha',
    description: 'Thinnest Apple Watch with wide-angle OLED screen, sleep apnea detection, depth gauge and water temperature sensors, and fast 30-min charging.'
  },
  {
    name: 'Apple Watch SE (2nd Gen) 44mm',
    brand: 'Apple',
    category: 'smartwatches',
    source: 'https://www.apple.com/ae/apple-watch-se/',
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/watch-se-midnight-sport-band-midnight-select-202409?wid=940&hei=1112&fmt=png-alpha',
    description: 'Essential Apple Watch with Crash Detection, Heart Rate tracking, Retina display up to 1000 nits, and water resistance to 50 meters.'
  },
  {
    name: 'Samsung Galaxy Watch Ultra 47mm',
    brand: 'Samsung',
    category: 'smartwatches',
    source: 'https://www.samsung.com/ae/watches/galaxy-watch/galaxy-watch-ultra-titanium-gray-lte-sm-l705fzaamea/',
    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/ae/2407/gallery/ae-galaxy-watch-ultra-l705-sm-l705fzaamea-thumb-542385614?$216_216_PNG$',
    description: 'Grade 4 titanium outdoor smartwatch with 10ATM water resistance, Quick Button, dual-frequency GPS, and Galaxy AI health coaching.'
  },
  {
    name: 'Samsung Galaxy Watch7 44mm',
    brand: 'Samsung',
    category: 'smartwatches',
    source: 'https://www.samsung.com/ae/watches/galaxy-watch/galaxy-watch7-44mm-green-bluetooth-sm-l310nzgamea/',
    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/ae/2407/gallery/ae-galaxy-watch7-l310-sm-l310nzgamea-thumb-542385438?$216_216_PNG$',
    description: 'Galaxy Watch7 driven by 3nm processor, enhanced BioActive Sensor, dual-frequency GPS, Energy Score, and sleep apnea monitoring.'
  },
  {
    name: 'Huawei Watch GT 5 46mm',
    brand: 'Huawei',
    category: 'smartwatches',
    source: 'https://consumer.huawei.com/en/wearables/watch-gt5/',
    imageUrl: 'https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/wearables/watch-gt5/images/kv/huawei-watch-gt-5.png',
    description: 'Huawei Watch GT 5 featuring sharp geometric aesthetic, TruSense health monitoring system, route drawing, and up to 14-day battery life.'
  },
  {
    name: 'Garmin Forerunner 265',
    brand: 'Garmin',
    category: 'smartwatches',
    source: 'https://www.garmin.com/en-US/p/886785/',
    imageUrl: 'https://res.garmin.com/en/products/010-02810-01/v/cf-lg.jpg',
    description: 'Dedicated GPS running smartwatch with bright AMOLED touchscreen, training readiness metric, wrist-based running dynamics, and Morning Report.'
  },
  {
    name: 'Xiaomi Smart Band 9',
    brand: 'Xiaomi',
    category: 'smartwatches',
    source: 'https://www.mi.com/global/product/xiaomi-smart-band-9/',
    imageUrl: 'https://i02.appmifile.com/828_operatorx_operatorx_opx/26/09/2024/73111b7d5901ba3e6a0d4a9bb5f25a74.png',
    description: 'Affordable fitness tracker with metal sandblasted frame, 1.62-inch 1200-nit AMOLED display, 150+ sports modes, and up to 21 days battery.'
  },

  // HEADPHONES & AUDIO (9)
  {
    name: 'Apple AirPods Pro (2nd Gen with MagSafe USB-C)',
    brand: 'Apple',
    category: 'headphones',
    source: 'https://www.apple.com/ae/airpods-pro/',
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-pro-2-hero-select-202409?wid=940&hei=1112&fmt=png-alpha',
    description: 'Industry-leading Active Noise Cancellation with H2 silicon, Adaptive Audio, Transparency mode, Personalized Spatial Audio, and USB-C MagSafe case.'
  },
  {
    name: 'Apple AirPods 4 with Active Noise Cancellation',
    brand: 'Apple',
    category: 'headphones',
    source: 'https://www.apple.com/ae/airpods-4/',
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-4-anc-select-202409?wid=940&hei=1112&fmt=png-alpha',
    description: 'First open-ear AirPods with Active Noise Cancellation, H2 chip, Conversation Awareness, voice isolation, and compact wireless charging case.'
  },
  {
    name: 'Apple AirPods Max (USB-C)',
    brand: 'Apple',
    category: 'headphones',
    source: 'https://www.apple.com/ae/airpods-max/',
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/airpods-max-select-202409-midnight?wid=940&hei=1112&fmt=png-alpha',
    description: 'Over-ear headphones with custom acoustic design, Pro-level Active Noise Cancellation, Spatial Audio with dynamic head tracking, and USB-C charging.'
  },
  {
    name: 'Sony WH-1000XM5 Wireless Headphones',
    brand: 'Sony',
    category: 'headphones',
    source: 'https://www.sony-asia.com/electronics/headband-headphones/wh-1000xm5',
    imageUrl: 'https://www.sony-asia.com/image/6145c1d32e6ac8e63a46c912dc33e5bb?fmt=pjpeg&wid=660&hei=660&bgcolor=F1F5F9&bgc=F1F5F9',
    description: 'Industry-leading noise cancelling headphones with two processors, eight microphones, Auto NC Optimizer, and 30-hour battery life.'
  },
  {
    name: 'Sony WF-1000XM5 True Wireless Earbuds',
    brand: 'Sony',
    category: 'headphones',
    source: 'https://www.sony-asia.com/headphones/products/wf-1000xm5',
    imageUrl: 'https://sony.scene7.com/is/image/sonyglobalsolutions/Primary_image_Black-1?$categorypdpnav$&fmt=png-alpha',
    description: 'Flagship ANC earbuds featuring Dynamic Driver X, Integrated Processor V2, bone conduction sensors, and AI-based noise reduction for crystal calls.'
  },
  {
    name: 'Bose QuietComfort Ultra Wireless Headphones',
    brand: 'Bose',
    category: 'headphones',
    source: 'https://www.bose.com/p/noise-cancelling-headphones/bose-quietcomfort-ultra-headphones/QCUH-HEADPHONEARN.html',
    imageUrl: 'https://assets.bosecreative.com/transform/69de3d90-3cc5-4f7c-b302-3ea4cb91244e/QCUH_Black_001_RGB',
    description: 'World-class noise cancellation with Bose Immersive Audio, CustomTune technology, luxurious ear cushions, and 24 hours of playback.'
  },
  {
    name: 'Samsung Galaxy Buds3 Pro',
    brand: 'Samsung',
    category: 'headphones',
    source: 'https://www.samsung.com/ae/audio-sound/galaxy-buds/galaxy-buds3-pro-silver-sm-r630nzaamea/',
    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/ae/2407/gallery/ae-galaxy-buds3-pro-r630-sm-r630nzaamea-thumb-542385318?$216_216_PNG$',
    description: 'Blade design earbuds with Blade Lights, 2-way speakers with planar tweeters, Adaptive Noise Control, and real-time Interpreter voice assistance.'
  },
  {
    name: 'JBL Tune 770NC Wireless Over-Ear Headphones',
    brand: 'JBL',
    category: 'headphones',
    source: 'https://www.jbl.com/wireless-headphones/TUNE770NC.html',
    imageUrl: 'https://www.jbl.com/dw/image/v2/AAUJ_PRD/on/demandware.static/-/Sites-masterCatalog_Harman/default/dw107f90c0/JBL_Tune_770NC_Product%20Image_Hero_Black.png',
    description: 'Adaptive Noise Cancelling with Smart Ambient, JBL Pure Bass sound, multi-point connection, and massive 70-hour battery life.'
  },
  {
    name: 'Sennheiser Momentum 4 Wireless Headphones',
    brand: 'Sennheiser',
    category: 'headphones',
    source: 'https://www.sennheiser-hearing.com/en-US/p/momentum-4-wireless/',
    imageUrl: 'https://assets.sennheiser.com/img/26458/product_detail_x2_desktop_Sennheiser_Momentum_4_Wireless_Black_01.jpg',
    description: 'Audiophile-grade 42mm transducer acoustic system, next-generation Adaptive Noise Cancellation, and extraordinary 60-hour battery life.'
  },

  // GAMING (9)
  {
    name: 'Sony PlayStation 5 Pro 2TB',
    brand: 'Sony',
    category: 'gaming',
    source: 'https://www.playstation.com/en-ae/ps5/ps5-pro/',
    imageUrl: 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-pro-dualsense-image-block-01-en-16aug24?$native$',
    description: 'The most powerful PlayStation console with PlayStation Spectral Super Resolution (PSSR), advanced ray tracing, 60fps fidelity, and 2TB SSD.'
  },
  {
    name: 'Sony PlayStation 5 Slim Digital Edition',
    brand: 'Sony',
    category: 'gaming',
    source: 'https://www.playstation.com/en-ae/ps5/',
    imageUrl: 'https://gmedia.playstation.com/is/image/SIEPDC/ps5-product-thumbnail-01-en-14sep21?$native$',
    description: 'Slimline PS5 with 1TB SSD storage, ultra-high speed I/O, Tempest 3D AudioTech, and DualSense haptic feedback in a compact profile.'
  },
  {
    name: 'Microsoft Xbox Series X 1TB',
    brand: 'Microsoft',
    category: 'gaming',
    source: 'https://www.xbox.com/en-AE/consoles/xbox-series-x',
    imageUrl: 'https://assets.xboxservices.com/assets/18/30/1830806b-d41d-4eb8-b570-023a78943632.png',
    description: '12 teraflops of raw graphic processing power, 4K gaming up to 120FPS, DirectX ray tracing, and Quick Resume across games.'
  },
  {
    name: 'Microsoft Xbox Series S 512GB',
    brand: 'Microsoft',
    category: 'gaming',
    source: 'https://www.xbox.com/en-AE/consoles/xbox-series-s',
    imageUrl: 'https://assets.xboxservices.com/assets/24/d0/24d00bc1-5aac-4b1a-85d1-671c6d94a974.png',
    description: 'All-digital next-gen gaming console delivering 1440p gaming up to 120FPS, Xbox Velocity Architecture, and Xbox Game Pass access.'
  },
  {
    name: 'Nintendo Switch OLED Model',
    brand: 'Nintendo',
    category: 'gaming',
    source: 'https://www.nintendo.com/us/switch/oled-model/',
    imageUrl: 'https://assets.nintendo.com/image/upload/v1643742733/ncom/global/switch/oled-model/gallery/01.jpg',
    description: 'Handheld-to-TV hybrid console featuring a vivid 7-inch OLED screen, wide adjustable stand, wired LAN dock, and 64GB internal memory.'
  },
  {
    name: 'Valve Steam Deck OLED 512GB',
    brand: 'Valve',
    category: 'gaming',
    source: 'https://store.steampowered.com/steamdeck',
    imageUrl: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1675200/extras/steamdeck_oled_front.png',
    description: 'Custom AMD APU with 7.4-inch 90Hz HDR OLED screen, 50Wh battery, Wi-Fi 6E, full-sized thumbsticks, and complete Steam library access.'
  },
  {
    name: 'ASUS ROG Ally X (2024)',
    brand: 'ASUS',
    category: 'gaming',
    source: 'https://rog.asus.com/gaming-handhelds/rog-ally/rog-ally-x-2024/',
    imageUrl: 'https://dlcdnwebimgs.asus.com/gain/F12D7B4D-DC78-4228-8426-D41DF4012759/w800',
    description: 'Windows 11 handheld gaming PC with AMD Ryzen Z1 Extreme, 24GB LPDDR5X RAM, 1TB NVMe SSD, massive 80Wh battery, and ergonomic redesign.'
  },
  {
    name: 'Sony DualSense Wireless Controller (Midnight Black)',
    brand: 'Sony',
    category: 'gaming',
    source: 'https://www.playstation.com/en-ae/accessories/dualsense-wireless-controller/',
    imageUrl: 'https://gmedia.playstation.com/is/image/SIEPDC/dualsense-controller-midnight-black-hero-01-en-24may21?$native$',
    description: 'Innovative PS5 controller with immersive haptic feedback, dynamic adaptive triggers, built-in microphone, and signature comfort grip.'
  },
  {
    name: 'PlayStation Portal Remote Player',
    brand: 'Sony',
    category: 'gaming',
    source: 'https://www.playstation.com/en-ae/accessories/playstation-portal-remote-player/',
    imageUrl: 'https://gmedia.playstation.com/is/image/SIEPDC/ps-portal-remote-player-hero-image-block-01-en-01sep23?$native$',
    description: 'Dedicated PS5 remote play device featuring an 8-inch 1080p 60fps LCD display and full DualSense controller features over home Wi-Fi.'
  },

  // TVS (5)
  {
    name: 'LG OLED evo C4 55-inch 4K Smart TV',
    brand: 'LG',
    category: 'tvs',
    source: 'https://www.lg.com/ae/tvs-soundbars/lg-oled55c46la',
    imageUrl: 'https://www.lg.com/ae/images/tvs-soundbars/md07593113/gallery/medium01.jpg',
    description: 'Self-lit OLED evo display with α9 AI Processor 4K Gen7, Brightness Booster, 144Hz VRR/G-Sync gaming support, and webOS 24.'
  },
  {
    name: 'Samsung The Frame LS03D 55-inch QLED 4K TV',
    brand: 'Samsung',
    category: 'tvs',
    source: 'https://www.samsung.com/ae/lifestyle-tvs/the-frame/ls03d-55-inch-black-qa55ls03dauxzn/',
    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/ae/qa55ls03dauxzn/gallery/ae-the-frame-ls03d-qa55ls03dauxzn-thumb-541249767?$216_216_PNG$',
    description: 'Art Mode lifestyle TV with Matte Display, Pantone validated colors, Quantum Processor 4K, Slim Fit Wall-Mount, and customizable bezel options.'
  },
  {
    name: 'Sony BRAVIA 8 55-inch OLED 4K HDR Google TV',
    brand: 'Sony',
    category: 'tvs',
    source: 'https://www.sony-asia.com/bravia/products/bravia-8',
    imageUrl: 'https://sony.scene7.com/is/image/sonyglobalsolutions/TVFY23_XR-OLED_Primary_image?$categorypdpnav$&fmt=png-alpha',
    description: 'XR Processor OLED panel with Acoustic Surface Audio+, Dolby Vision, pure blacks with over 8 million self-illuminating pixels, and Google TV.'
  },
  {
    name: 'TCL C755 55-inch QD-Mini LED 4K TV',
    brand: 'TCL',
    category: 'tvs',
    source: 'https://www.tcl.com/in/en/tvs/c755',
    imageUrl: 'https://static-obg.tcl.com/content/dam/brandsite/it-resource/products/tvs/c755/c755-front.png',
    description: 'QD-Mini LED technology with 500+ local dimming zones, 1300 nits peak brightness, 144Hz VRR, and ONKYO 2.1 Hi-Fi audio system.'
  },
  {
    name: 'Hisense U7N 55-inch Mini-LED ULED 4K TV',
    brand: 'Hisense',
    category: 'tvs',
    source: 'https://www.hisenseme.com/products/u7n',
    imageUrl: 'https://www.hisenseme.com/assets/img/seo.jpg',
    description: 'Mini-LED ULED display with 144Hz Game Mode Pro, Hi-View Engine, Full Array Local Dimming, Dolby Vision IQ, and VIDAA U7 smart platform.'
  },

  // MONITORS (5)
  {
    name: 'Dell UltraSharp U2723QE 27-inch 4K USB-C Hub Monitor',
    brand: 'Dell',
    category: 'monitors',
    source: 'https://www.dell.com/en-us/shop/dell-ultrasharp-27-4k-usb-c-hub-monitor-u2723qe/apd/210-bdpf/monitors-monitor-accessories',
    imageUrl: 'https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/peripherals/monitors/u-series/u2723qe/media-gallery/monitor-u2723qe-gallery-1.psd?fmt=png-alpha&pscan=need&hei=500',
    description: 'IPS Black technology monitor with 2000:1 contrast ratio, 98% DCI-P3 color gamut, 4K resolution, RJ45 Ethernet, and 90W USB-C power delivery.'
  },
  {
    name: 'ASUS ProArt PA279CV 27-inch 4K UHD Monitor',
    brand: 'ASUS',
    category: 'monitors',
    source: 'https://www.asus.com/displays-desktops/monitors/proart/proart-display-pa279cv/',
    imageUrl: 'https://www.asus.com/media/global/gallery/vbix8bxyatkzctly_setting_xxx_0_90_end_800.png',
    description: 'Calman Verified professional monitor with 100% sRGB / Rec.709 color coverage, Delta E < 2 color accuracy, and multi-port 65W USB-C docking.'
  },
  {
    name: 'BenQ MOBIUZ EX2710Q 27-inch 165Hz QHD Gaming Monitor',
    brand: 'BenQ',
    category: 'monitors',
    source: 'https://www.benq.com/en-me/monitor/gaming/ex2710q.html',
    imageUrl: 'https://image.benq.com/is/image/benqco/ex2710q-right45-2?$ResponsivePreset$',
    description: 'IPS 165Hz 1ms gaming monitor with 2.1-channel treVolo audio (subwoofer included), HDRi intelligent optimization, and AMD FreeSync Premium.'
  },
  {
    name: 'LG UltraGear 27GP850-B 27-inch QHD Nano IPS Gaming Monitor',
    brand: 'LG',
    category: 'monitors',
    source: 'https://www.lg.com/us/monitors/lg-27gp850-b-gaming-monitor',
    imageUrl: 'https://www.lg.com/us/images/monitors/md08000370/450.jpg',
    description: 'Nano IPS 1ms display with 165Hz refresh rate (OC 180Hz), NVIDIA G-SYNC Compatible, VESA DisplayHDR 400, and 98% DCI-P3 color space.'
  },
  {
    name: 'Samsung Odyssey OLED G6 G60SD 27-inch 360Hz Gaming Monitor',
    brand: 'Samsung',
    category: 'monitors',
    source: 'https://www.samsung.com/ae/monitors/gaming/odyssey-oled-g6-g60sd-27-inch-360hz-oled-qhd-ls27dg602smxue/',
    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/ae/ls27dg602smxue/gallery/ae-odyssey-oled-g6-g60sd-ls27dg602smxue-thumb-542171120?$216_216_PNG$',
    description: 'Ultra-fast QHD OLED gaming display with 360Hz refresh rate, 0.03ms response time, OLED Safeguard+ cooling, and glare-free technology.'
  },

  // COMPUTER ACCESSORIES (6)
  {
    name: 'Logitech MX Master 3S Wireless Performance Mouse',
    brand: 'Logitech',
    category: 'computer-accessories',
    source: 'https://www.logitech.com/en-us/products/mice/mx-master-3s.910-006557.html',
    imageUrl: 'https://resource.logitech.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/mice/mx-master-3s/gallery/mx-master-3s-mouse-top-view-graphite.png',
    description: 'Quiet Clicks ergonomic mouse with 8,000 DPI track-on-glass optical sensor, MagSpeed electromagnetic scrolling, and multi-OS Flow control.'
  },
  {
    name: 'Logitech MX Keys S Wireless Illuminated Keyboard',
    brand: 'Logitech',
    category: 'computer-accessories',
    source: 'https://www.logitech.com/en-us/products/keyboards/mx-keys-s.920-011558.html',
    imageUrl: 'https://resource.logitech.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/keyboards/mx-keys-s/gallery/mx-keys-s-keyboard-top-view-graphite-us.png',
    description: 'Spherically dished low-profile keys with Smart Illumination proximity sensors, Smart Actions macros, and multi-device Bluetooth switching.'
  },
  {
    name: 'Logitech G502 X PLUS LIGHTSPEED Wireless Gaming Mouse',
    brand: 'Logitech',
    category: 'computer-accessories',
    source: 'https://www.logitechg.com/en-us/products/gaming-mice/g502-x-plus-wireless-lightforce.910-006160.html',
    imageUrl: 'https://resource.logitechg.com/c_fill,q_auto,f_auto,dpr_1.0/content/dam/gaming/en/products/g502x-plus/gallery/g502x-plus-gallery-1-black.png',
    description: 'Iconic gaming mouse upgraded with LIGHTFORCE hybrid optical-mechanical switches, HERO 25K gaming sensor, and customizable 8-LED LIGHTSYNC RGB.'
  },
  {
    name: 'Logitech C920s Pro HD 1080p Webcam',
    brand: 'Logitech',
    category: 'computer-accessories',
    source: 'https://www.logitech.com/en-us/products/webcams/c920s-pro-hd-webcam.960-001257.html',
    imageUrl: 'https://resource.logitech.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/webcams/c920s/gallery/c920s-gallery-1.png',
    description: 'Full HD 1080p video calling at 30 fps with stereo dual microphones, automatic light correction, glass lens, and privacy shutter.'
  },
  {
    name: 'Razer DeathAdder V3 Pro Wireless Gaming Mouse',
    brand: 'Razer',
    category: 'computer-accessories',
    source: 'https://www.razer.com/gaming-mice/razer-deathadder-v3-pro',
    imageUrl: 'https://assets2.razerzone.com/images/pnx.assets/a0427959a82f3efc9c5780a473a246ba/razer-deathadder-v3-pro-black-500x500.png',
    description: 'Ultra-lightweight 63g ergonomic esports mouse with Focus Pro 30K Optical Sensor, Gen-3 Optical Mouse Switches, and up to 90 hours battery life.'
  },
  {
    name: 'Apple Magic Keyboard with Touch ID and Numeric Keypad',
    brand: 'Apple',
    category: 'computer-accessories',
    source: 'https://www.apple.com/ae/shop/product/MK2C3ZA/A/magic-keyboard-with-touch-id-and-numeric-keypad-for-mac-models-with-apple-silicon-us-english-black-keys',
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MK2C3?wid=940&hei=1112&fmt=jpeg&qlt=90',
    description: 'Wireless Bluetooth keyboard for Mac with Apple Silicon featuring fast Touch ID authentication, extended layout with document navigation, and numeric keypad.'
  },

  // CHARGERS & POWER BANKS (5)
  {
    name: 'Anker 737 Power Bank (PowerCore 24K 140W)',
    brand: 'Anker',
    category: 'chargers-power-banks',
    source: 'https://www.anker.com/products/a1289',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0493/9834/9974/products/A1289011_TD01_V1.jpg',
    description: 'Ultra-powerful two-way charging power bank with 140W Power Delivery 3.1 output, 24,000mAh capacity, and smart interactive digital display.'
  },
  {
    name: 'Anker 735 GaNPrime 65W Fast Wall Charger',
    brand: 'Anker',
    category: 'chargers-power-banks',
    source: 'https://www.anker.com/nz/products/a2668',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0695/6531/7291/files/a2668-3.jpg',
    description: 'GaNPrime 65W 3-port charger with PowerIQ 4.0 dynamic power distribution, ActiveShield 2.0 temperature monitoring, and foldable pins.'
  },
  {
    name: 'Anker Prime 27,650mAh Power Bank (250W)',
    brand: 'Anker',
    category: 'chargers-power-banks',
    source: 'https://www.anker.com/products/a1340-250w-power-bank',
    imageUrl: 'https://cdn.shopify.com/s/files/1/0493/9834/9974/files/Rectangle13_f7d14fcb-c408-4ba8-9b88-c70e30345bf9.png',
    description: '250W multi-device fast portable charger with 27,650mAh capacity, companion app Bluetooth sync, and dual USB-C plus USB-A ports.'
  },
  {
    name: 'UGREEN Nexode 65W 3-Port USB-C GaN Charger',
    brand: 'UGREEN',
    category: 'chargers-power-banks',
    source: 'https://uk.ugreen.com/collections/gan-charger/products/ugreen-nexode-65w-usb-c-gan-charger-3-ports-wall-charger',
    imageUrl: 'http://uk.ugreen.com/cdn/shop/files/UgreenNexode65WGaNWallCharger_1.jpg',
    description: 'Compact Nexode GaN wall charger with two USB-C ports and one USB-A port, Thermal Guard protection, and broad protocol compatibility.'
  },
  {
    name: 'Apple 20W USB-C Power Adapter',
    brand: 'Apple',
    category: 'chargers-power-banks',
    source: 'https://www.apple.com/ae/shop/product/muvt3ze/a/20w-usb-c-power-adapter',
    imageUrl: 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/MU862?wid=940&hei=1112&fmt=jpeg&qlt=90',
    description: 'Official Apple 20W USB-C power adapter delivering fast, efficient charging for iPhone 16/15 and iPad models at home or on the go.'
  },

  // STORAGE (6)
  {
    name: 'Samsung Portable SSD T7 Shield 1TB USB 3.2',
    brand: 'Samsung',
    category: 'storage',
    source: 'https://www.samsung.com/ae/memory-storage/portable-ssd/t7-shield-1tb-black-external-storage-nvme-1050-mb-s-mu-pe1t0s-ww/',
    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/ae/mu-pe1t0s-ww/gallery/ae-portable-ssd-t7-shield-mu-pe1t0s-ww-thumb-532181518?$216_216_PNG$',
    description: 'Rugged portable solid state drive with IP65 dust/water resistance, drop resistant up to 3 meters, and read/write speeds up to 1,050/1,000 MB/s.'
  },
  {
    name: 'Samsung 990 PRO NVMe M.2 SSD 1TB PCIe 4.0',
    brand: 'Samsung',
    category: 'storage',
    source: 'https://www.samsung.com/sg/memory-storage/nvme-ssd/990-pro-1tb-nvme-pcie-gen-4-mz-v9p1t0bw/',
    imageUrl: 'https://images.samsung.com/is/image/samsung/p6pim/sg/mz-v9p1t0bw/gallery/sg-990-pro-nvme-pcie-4-0-m-2-ssd-mz-v9p1t0bw-thumb-534346808?$216_216_PNG$',
    description: 'Ultimate PCIe 4.0 internal SSD with sequential read speeds up to 7,450 MB/s, nickel-coated controller for thermal control, and Samsung Magician software.'
  },
  {
    name: 'SanDisk Extreme Portable SSD 1TB USB-C',
    brand: 'SanDisk',
    category: 'storage',
    source: 'https://shop.sandisk.com/products/ssd/portable-ssd/sandisk-extreme-usb-3-2-ssd',
    imageUrl: 'https://www.sandisk.com/content/dam/store/en-us/assets/products/portable/extreme-portable-ssd-v2/gallery/extreme-v2-sdssde61-1tb-top-left.png',
    description: 'NVMe solid state performance with 1050MB/s read and 1000MB/s write speeds, up to three-meter drop protection, IP65 rating, and carabiner loop.'
  },
  {
    name: 'Crucial X9 Pro Portable SSD 1TB USB 3.2',
    brand: 'Crucial',
    category: 'storage',
    source: 'https://www.crucial.com/ssd/x9-pro/ct1000x9prossd9',
    imageUrl: 'https://content.crucial.com/content/dam/crucial/ssd-products/x9-pro/images/product/crucial-x9-pro-front.psd.transform/medium-png/image.png',
    description: 'Pocket-sized external SSD with anodized aluminum body, speeds up to 1,050 MB/s read/write, integrated activity light, and IP55 water/dust resistance.'
  },
  {
    name: 'Kingston XS2000 1TB High Performance Portable SSD',
    brand: 'Kingston',
    category: 'storage',
    source: 'https://www.kingston.com/en/ssd/xs2000-portable-usb-c-solid-state-drive',
    imageUrl: 'https://media.kingston.com/kingston/product/ktc-product-ssd-xs2000-1tb-top-3-zm-lg.jpg',
    description: 'Ultra-compact USB 3.2 Gen 2x2 portable drive achieving blazing transfer speeds up to 2,000 MB/s with included protective rubber sleeve.'
  },
  {
    name: 'Seagate Expansion Portable Hard Drive 2TB',
    brand: 'Seagate',
    category: 'storage',
    source: 'https://www.seagate.com/products/external-hard-drives/expansion-portable-hard-drive/',
    imageUrl: 'https://www.seagate.com/content/dam/seagate/assets/products/external-hard-drives/expansion-portable-hard-drive/expansion-portable-hero.png',
    description: 'Reliable on-the-go USB 3.0 backup drive with drag-and-drop file saving and built-in power management for energy efficiency.'
  },

  // NETWORKING (5)
  {
    name: 'TP-Link Archer AX55 Dual-Band Wi-Fi 6 Router',
    brand: 'TP-Link',
    category: 'networking',
    source: 'https://www.tp-link.com/ae/home-networking/wifi-router/archer-ax55/',
    imageUrl: 'https://static.tp-link.com/upload/image-line/Overview_ArcherAX55_normal_20210817084534y.png',
    description: 'Next-gen Gigabit Wi-Fi 6 router reaching speeds up to 2402 Mbps on 5 GHz and 574 Mbps on 2.4 GHz with Qualcomm chipset and HomeShield security.'
  },
  {
    name: 'TP-Link Deco X50 Whole Home Mesh Wi-Fi 6 System (3-Pack)',
    brand: 'TP-Link',
    category: 'networking',
    source: 'https://www.tp-link.com/ae/home-networking/deco/deco-x50/',
    imageUrl: 'https://static.tp-link.com/upload/image-line/Deco_X50(1-pack)_normal_20211116035032n.png',
    description: 'AI-driven seamless roaming mesh Wi-Fi 6 system covering up to 6,500 sq. ft. with 3× Gigabit ports per unit and ultra-low latency.'
  },
  {
    name: 'TP-Link Archer BE550 Tri-Band Wi-Fi 7 Router',
    brand: 'TP-Link',
    category: 'networking',
    source: 'https://www.tp-link.com/ae/home-networking/wifi-router/archer-be550/',
    imageUrl: 'https://static.tp-link.com/upload/image-line/01_large_20230728080649m.png',
    description: 'Tri-Band Wi-Fi 7 router delivering speeds up to 9214 Mbps with 6 internal antennas, 5× 2.5 Gbps Ethernet ports, and Multi-Link Operation (MLO).'
  },
  {
    name: 'ASUS RT-AX86U Pro Dual-Band Wi-Fi 6 Gaming Router',
    brand: 'ASUS',
    category: 'networking',
    source: 'https://www.asus.com/networking-iot-servers/wifi-routers/asus-gaming-routers/rt-ax86u-pro/',
    imageUrl: 'https://dlcdnwebimgs.asus.com/gain/ed60b965-d5e4-406a-a9c1-ebad877114e5/w800',
    description: 'Ultrafast Wi-Fi 6 gaming router with speeds up to 5700 Mbps, dedicated 2.5G gaming port, Mobile Game Mode, and AiProtection Pro commercial security.'
  },
  {
    name: 'TP-Link RE705X AX3000 Wi-Fi 6 Range Extender',
    brand: 'TP-Link',
    category: 'networking',
    source: 'https://www.tp-link.com/ae/home-networking/range-extender/re705x/',
    imageUrl: 'https://static.tp-link.com/RE705X_US_1.0_01_large_1609991085188g.png',
    description: 'Dual-band Wi-Fi 6 range extender with external antennas, OneMesh compatibility for whole-home roaming, and Gigabit Ethernet port.'
  },

  // CAMERAS (6)
  {
    name: 'Canon EOS R50 Mirrorless Camera with RF-S 18-45mm Lens',
    brand: 'Canon',
    category: 'cameras',
    source: 'https://www.canon-me.com/cameras/eos-r50/',
    imageUrl: 'https://cdn.media.amplience.net/i/canon/eos-r50-ambient-high-angle-black-lifestyle_653d9e4c34cb4821a8d070bdf60ff7c7',
    description: 'Compact 24.2MP APS-C mirrorless camera with Dual Pixel CMOS AF II, uncropped 4K 30p oversampled video, and Vari-Angle touchscreen.'
  },
  {
    name: 'Canon EOS R8 Full-Frame Mirrorless Camera (Body Only)',
    brand: 'Canon',
    category: 'cameras',
    source: 'https://www.canon-me.com/cameras/eos-r8/',
    imageUrl: 'https://cdn.media.amplience.net/i/canon/eos-r8_rf-24-50mm-f4-5-6-3-is-stm_front_straight_7cb1a4b5186b4d3a826477e3aa002a45',
    description: 'Lightweight full-frame hybrid camera with 24.2MP CMOS sensor, 6K oversampled 4K 60p 10-bit Canon Log 3, and 40 fps electronic shutter.'
  },
  {
    name: 'Sony Alpha 6700 Premium APS-C Mirrorless Camera',
    brand: 'Sony',
    category: 'cameras',
    source: 'https://www.sony-asia.com/interchangeable-lens-cameras/products/ilce-6700',
    imageUrl: 'https://sony.scene7.com/is/image/sonyglobalsolutions/og-4?$S7Product$&fmt=png-alpha',
    description: '26.0MP back-illuminated Exmor R CMOS sensor with dedicated AI Processing Unit for subject recognition, 4K 120p, and 5-axis in-body stabilization.'
  },
  {
    name: 'DJI Osmo Pocket 3 Gimbal Camera',
    brand: 'DJI',
    category: 'cameras',
    source: 'https://www.dji.com/ae/osmo-pocket-3',
    imageUrl: 'https://www-cdn.djiits.com/cms/uploads/8c6ec9b0dc4e170120dfda5b4e723381.png',
    description: 'Handheld vlog camera with powerful 1-inch CMOS sensor, rotatable 2-inch OLED touchscreen, 4K 120fps video, and 3-axis mechanical stabilization.'
  },
  {
    name: 'DJI Osmo Action 5 Pro Standard Combo',
    brand: 'DJI',
    category: 'cameras',
    source: 'https://www.dji.com/ae/osmo-action-5-pro',
    imageUrl: 'https://www-cdn.djiits.com/cms/uploads/20dd07025c2d44092cd9df92a5ee1a47.png',
    description: 'Revolutionary action camera with 1/1.3-inch next-gen sensor, 13.5 stops dynamic range, dual OLED touchscreens, and 4 hours extended battery life.'
  },
  {
    name: 'GoPro HERO13 Black Action Camera',
    brand: 'GoPro',
    category: 'cameras',
    source: 'https://gopro.com/en/us/shop/cameras/buy/hero13black/CHDHX-131-master.html',
    imageUrl: 'https://static.gopro.com/assets/blta2b8522e5372af40/blt0ad96150efb045e0/66cf9b71e8ba8735df7a0d4c/pdp-h13-gallery-01.png',
    description: 'Flagship GoPro with 5.3K 60fps video, HyperSmooth 6.0 stabilization, HB-Series Lens compatibility, redesigned Enduro battery, and magnetic latch mount.'
  },

  // HOME ELECTRONICS (3)
  {
    name: 'Dyson V15 Detect Absolute Cordless Vacuum Cleaner',
    brand: 'Dyson',
    category: 'home-electronics',
    source: 'https://www.dyson.ae/en-AE/dyson-v15-detect-absolute',
    imageUrl: 'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/368340-01.png',
    description: 'Laser reveals microscopic dust, Piezo sensor scientifically measures particles, powerful Hyperdymium motor with 240AW suction, and up to 60min run time.'
  },
  {
    name: 'Dyson Supersonic Hair Dryer',
    brand: 'Dyson',
    category: 'home-electronics',
    source: 'https://www.dyson.ae/en-AE/products/hair-care/dyson-supersonic/overview',
    imageUrl: 'https://dyson-h.assetsadobe2.com/is/image/content/dam/dyson/images/products/primary/386804-01.png',
    description: 'Engineered for fast drying with intelligent heat control protecting hair from extreme heat damage, powered by the small, fast Dyson V9 digital motor.'
  },
  {
    name: 'Xiaomi Smart Air Purifier 4',
    brand: 'Xiaomi',
    category: 'home-electronics',
    source: 'https://www.mi.com/global/product/xiaomi-smart-air-purifier-4/',
    imageUrl: 'https://i01.appmifile.com/v1/MI_18455B3E4DA706226CF7535A58E80C98/pms_1645089332.61661793.png',
    description: 'High-efficiency filter capturing 99.97% of particles down to 0.3μm, CADR up to 400m³/h, OLED touch display, and low-noise 32.1dB night mode.'
  }
];

console.log(`Clean catalog defined with ${cleanCatalog.length} verified products.`);
