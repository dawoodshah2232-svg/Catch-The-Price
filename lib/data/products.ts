import { Product, CountryCode, Offer, PricePoint } from '../types';
import { COUNTRIES } from './countries';

// Helper to generate dynamic multi-store offers based on country and base price in USD
function generateOffersForCountry(
  productId: string,
  baseUsdPrice: number,
  originalUsdPrice: number,
  country: CountryCode
): { currentBest: number; original: number; currency: string; offers: Offer[] } {
  const multipliers: Record<CountryCode, { rate: number; currency: string }> = {
    ae: { rate: 3.67, currency: 'AED' },
    us: { rate: 1.0, currency: 'USD' },
    sa: { rate: 3.75, currency: 'SAR' },
    uk: { rate: 0.79, currency: 'GBP' },
    ca: { rate: 1.36, currency: 'CAD' },
    au: { rate: 1.52, currency: 'AUD' },
  };

  const { rate, currency } = multipliers[country] || multipliers.ae;
  const bestPrice = Math.round(baseUsdPrice * rate);
  const origPrice = Math.round(originalUsdPrice * rate);

  let offersList: Offer[] = [];

  if (country === 'ae') {
    offersList = [
      {
        id: `off-${productId}-amz-ae`,
        productId,
        merchantId: 'merch-amz-ae',
        merchantName: 'Amazon UAE',
        merchantLogo: 'https://images.unsplash.com/photo-1523474255658-4af61b168344?w=64&h=64&fit=crop&q=80',
        merchantRating: 4.8,
        price: bestPrice,
        originalPrice: origPrice,
        currency,
        inStock: true,
        shippingInfo: 'Free Next-Day Delivery with Prime',
        deliveryDays: 'Tomorrow',
        condition: 'Brand New (Official UAE Warranty)',
        url: `https://www.amazon.ae/dp/B0CTPX${productId.slice(0, 4)}`,
        lastCheckedAt: '12 minutes ago',
        isBestPrice: true,
      },
      {
        id: `off-${productId}-noon-ae`,
        productId,
        merchantId: 'merch-noon-ae',
        merchantName: 'Noon UAE',
        merchantLogo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=64&h=64&fit=crop&q=80',
        merchantRating: 4.6,
        price: Math.round(bestPrice * 1.03),
        originalPrice: origPrice,
        currency,
        inStock: true,
        shippingInfo: 'Noon Express 24h Delivery',
        deliveryDays: 'Tomorrow',
        condition: 'Brand New',
        url: `https://www.noon.com/uae-en/p-${productId}`,
        lastCheckedAt: '35 minutes ago',
      },
      {
        id: `off-${productId}-sharaf-ae`,
        productId,
        merchantId: 'merch-sharaf-ae',
        merchantName: 'Sharaf DG',
        merchantLogo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=64&h=64&fit=crop&q=80',
        merchantRating: 4.5,
        price: Math.round(bestPrice * 1.05),
        originalPrice: origPrice,
        currency,
        inStock: true,
        shippingInfo: 'Free Store Pickup / 2-Day Delivery',
        deliveryDays: '2 Days',
        condition: 'Brand New (Authorized Dealer)',
        url: `https://uae.sharafdg.com/product/${productId}`,
        lastCheckedAt: '18 minutes ago',
      },
      {
        id: `off-${productId}-jumbo-ae`,
        productId,
        merchantId: 'merch-jumbo-ae',
        merchantName: 'Jumbo Electronics',
        merchantLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=64&h=64&fit=crop&q=80',
        merchantRating: 4.4,
        price: Math.round(bestPrice * 1.07),
        originalPrice: origPrice,
        currency,
        inStock: true,
        shippingInfo: 'Standard Delivery',
        deliveryDays: '3 Days',
        condition: 'Brand New',
        url: `https://www.jumbo.ae/product/${productId}`,
        lastCheckedAt: '2 hours ago',
      },
    ];
  } else if (country === 'sa') {
    offersList = [
      {
        id: `off-${productId}-amz-sa`,
        productId,
        merchantId: 'merch-amz-sa',
        merchantName: 'Amazon Saudi Arabia',
        merchantLogo: 'https://images.unsplash.com/photo-1523474255658-4af61b168344?w=64&h=64&fit=crop&q=80',
        merchantRating: 4.8,
        price: bestPrice,
        originalPrice: origPrice,
        currency,
        inStock: true,
        shippingInfo: 'Free Delivery with Prime KSA',
        deliveryDays: 'Tomorrow',
        condition: 'Brand New (Official KSA Warranty)',
        url: `https://www.amazon.sa/dp/B0CTPX${productId.slice(0, 4)}`,
        lastCheckedAt: '10 minutes ago',
        isBestPrice: true,
      },
      {
        id: `off-${productId}-jarir-sa`,
        productId,
        merchantId: 'merch-jarir-sa',
        merchantName: 'Jarir Bookstore',
        merchantLogo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=64&h=64&fit=crop&q=80',
        merchantRating: 4.7,
        price: Math.round(bestPrice * 1.02),
        originalPrice: origPrice,
        currency,
        inStock: true,
        shippingInfo: 'Fast Express Delivery Across KSA',
        deliveryDays: '1-2 Days',
        condition: 'Brand New (2-Year Agent Warranty)',
        url: `https://www.jarir.com/sa-en/p-${productId}`,
        lastCheckedAt: '25 minutes ago',
      },
      {
        id: `off-${productId}-extra-sa`,
        productId,
        merchantId: 'merch-extra-sa',
        merchantName: 'Extra Stores KSA',
        merchantLogo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=64&h=64&fit=crop&q=80',
        merchantRating: 4.6,
        price: Math.round(bestPrice * 1.04),
        originalPrice: origPrice,
        currency,
        inStock: true,
        shippingInfo: 'Same-Day Store Pickup Available',
        deliveryDays: 'Today / 1 Day',
        condition: 'Brand New (Official Warranty)',
        url: `https://www.extra.com/en-sa/p-${productId}`,
        lastCheckedAt: '40 minutes ago',
      },
      {
        id: `off-${productId}-noon-sa`,
        productId,
        merchantId: 'merch-noon-sa',
        merchantName: 'Noon Saudi Arabia',
        merchantLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=64&h=64&fit=crop&q=80',
        merchantRating: 4.5,
        price: Math.round(bestPrice * 1.05),
        originalPrice: origPrice,
        currency,
        inStock: true,
        shippingInfo: 'Noon Express KSA Delivery',
        deliveryDays: '2 Days',
        condition: 'Brand New',
        url: `https://www.noon.com/saudi-en/p-${productId}`,
        lastCheckedAt: '1 hour ago',
      },
    ];
  } else {
    // US / Global
    offersList = [
      {
        id: `off-${productId}-amz-us`,
        productId,
        merchantId: 'merch-amz-us',
        merchantName: country === 'uk' ? 'Amazon UK' : country === 'ca' ? 'Amazon Canada' : country === 'au' ? 'Amazon Australia' : 'Amazon US',
        merchantLogo: 'https://images.unsplash.com/photo-1523474255658-4af61b168344?w=64&h=64&fit=crop&q=80',
        merchantRating: 4.9,
        price: bestPrice,
        originalPrice: origPrice,
        currency,
        inStock: true,
        shippingInfo: 'Free 2-Day Shipping for Prime',
        deliveryDays: '2 Days',
        condition: 'Brand New (Manufacturer Warranty)',
        url: `https://www.amazon.com/dp/B0CTPX${productId.slice(0, 4)}`,
        lastCheckedAt: '18 minutes ago',
        isBestPrice: true,
      },
      {
        id: `off-${productId}-bestbuy-us`,
        productId,
        merchantId: 'merch-bestbuy-us',
        merchantName: country === 'uk' ? 'Currys' : country === 'ca' ? 'Best Buy Canada' : country === 'au' ? 'JB Hi-Fi' : 'Best Buy',
        merchantLogo: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=64&h=64&fit=crop&q=80',
        merchantRating: 4.7,
        price: Math.round(bestPrice * 1.04),
        originalPrice: origPrice,
        currency,
        inStock: true,
        shippingInfo: 'Free Curbside Pickup & Shipping',
        deliveryDays: '1-2 Days',
        condition: 'Brand New',
        url: `https://www.bestbuy.com/site/${productId}.p`,
        lastCheckedAt: '42 minutes ago',
      },
      {
        id: `off-${productId}-walmart-us`,
        productId,
        merchantId: 'merch-walmart-us',
        merchantName: country === 'uk' ? 'Argos' : country === 'au' ? 'Harvey Norman' : 'Walmart',
        merchantLogo: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=64&h=64&fit=crop&q=80',
        merchantRating: 4.5,
        price: Math.round(bestPrice * 1.06),
        originalPrice: origPrice,
        currency,
        inStock: true,
        shippingInfo: 'Standard 3-Day Shipping',
        deliveryDays: '3 Days',
        condition: 'Brand New',
        url: `https://www.walmart.com/ip/${productId}`,
        lastCheckedAt: '1 hour ago',
      },
    ];
  }

  return { currentBest: bestPrice, original: origPrice, currency, offers: offersList };
}

// Generate 90 days of realistic price history points
function generatePriceHistory(bestPrice: number, origPrice: number): PricePoint[] {
  const points: PricePoint[] = [];
  const days = [90, 75, 60, 45, 30, 20, 14, 7, 3, 1, 0];
  
  days.forEach((dayOffset) => {
    const d = new Date();
    d.setDate(d.getDate() - dayOffset);
    const dateStr = d.toISOString().split('T')[0];

    let p = origPrice;
    if (dayOffset <= 14) {
      p = bestPrice;
    } else if (dayOffset <= 30) {
      p = Math.round(bestPrice * 1.08);
    } else if (dayOffset <= 60) {
      p = Math.round(bestPrice * 1.14);
    } else {
      p = origPrice;
    }

    points.push({
      date: dateStr,
      price: p,
      merchantName: 'Amazon',
    });
  });

  return points;
}

interface RawProductDefinition {
  id: string;
  title: string;
  slug: string;
  brand: string;
  categoryId: string;
  categorySlug: string;
  categoryName: string;
  description: string;
  imageUrl: string;
  gallery: string[];
  specs: Record<string, string>;
  baseUsdPrice: number;
  originalUsdPrice: number;
  dealScore: number;
  isTrending?: boolean;
  isTopDeal?: boolean;
  aiSummary: {
    verdict: string;
    pros: string[];
    cons: string[];
    bestTimeToBuy: boolean;
  };
}

const RAW_PRODUCTS: RawProductDefinition[] = [
  // 1. PHONES
  {
    id: 'prod-iphone-16-pro-max',
    title: 'Apple iPhone 16 Pro Max (256GB, Desert Titanium)',
    slug: 'iphone-16-pro-max-256gb',
    brand: 'Apple',
    categoryId: 'cat-phones',
    categorySlug: 'phones',
    categoryName: 'Phones',
    description: 'The definitive flagship featuring titanium enclosure, A18 Pro silicon, Camera Control tactile button, and revolutionary battery endurance.',
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=800&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&h=800&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&h=800&fit=crop&q=80',
    ],
    specs: {
      'Display': '6.9-inch Super Retina XDR OLED ProMotion 120Hz',
      'Processor': 'Apple A18 Pro (3nm 2nd Gen)',
      'Storage': '256GB NVMe',
      'Main Camera': '48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto',
      'Battery': 'Up to 33 hours video playback',
      'Weight': '227 grams',
      'Connectivity': '5G, Wi-Fi 7, Bluetooth 5.3, USB-C 3.0 10Gbps',
    },
    baseUsdPrice: 1099,
    originalUsdPrice: 1199,
    dealScore: 92,
    isTrending: true,
    isTopDeal: true,
    aiSummary: {
      verdict: 'Excellent time to buy. The price is currently 8.3% below historical launch MSRP, matching its all-time lowest recorded mark across verified retailers.',
      pros: ['Grade-5 titanium chassis', 'Industry-leading battery life', 'Studio-quality audio microphones and 4K 120fps Dolby Vision'],
      cons: ['Substantial 6.9-inch footprint requires two hands', '25W wired charging is slower than Android competitors'],
      bestTimeToBuy: true,
    },
  },
  {
    id: 'prod-galaxy-s24-ultra',
    title: 'Samsung Galaxy S24 Ultra (512GB, Titanium Gray, AI Enabled)',
    slug: 'samsung-galaxy-s24-ultra-512gb',
    brand: 'Samsung',
    categoryId: 'cat-phones',
    categorySlug: 'phones',
    categoryName: 'Phones',
    description: 'Samsung’s premier flagship equipped with Snapdragon 8 Gen 3 for Galaxy, integrated S Pen, anti-reflective Gorilla Armor, and Galaxy AI suite.',
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=800&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&h=800&fit=crop&q=80',
    ],
    specs: {
      'Display': '6.8-inch Dynamic AMOLED 2X, QHD+, 1-120Hz, 2600 nits',
      'Processor': 'Snapdragon 8 Gen 3 for Galaxy',
      'Storage': '512GB UFS 4.0 / 12GB LPDDR5X',
      'Camera': '200MP Wide + 50MP 5x Periscope + 10MP 3x + 12MP Ultra-wide',
      'Battery': '5000mAh with 45W Fast Charging',
      'S-Pen': 'Built-in Bluetooth LE Stylus',
    },
    baseUsdPrice: 1149,
    originalUsdPrice: 1419,
    dealScore: 95,
    isTrending: true,
    isTopDeal: true,
    aiSummary: {
      verdict: 'Exceptional deal alert! The Galaxy S24 Ultra has plunged 19% below original retail price, with multiple merchants competing for inventory clearance.',
      pros: ['Revolutionary anti-reflective Gorilla Armor glass', 'Full 7 years of Android OS and security upgrades', 'Incomparable 200MP detail and 5x optical zoom clarity'],
      cons: ['Boxy corners can press into palms during long sessions'],
      bestTimeToBuy: true,
    },
  },
  {
    id: 'prod-pixel-9-pro-xl',
    title: 'Google Pixel 9 Pro XL (256GB, Obsidian, Gemini Nano)',
    slug: 'google-pixel-9-pro-xl-256gb',
    brand: 'Google',
    categoryId: 'cat-phones',
    categorySlug: 'phones',
    categoryName: 'Phones',
    description: 'Pure Google Android with custom Tensor G4 silicon, Super Actua display, pro cameras, and native multimodal Gemini AI assistance.',
    imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&h=800&fit=crop&q=80',
    ],
    specs: {
      'Display': '6.8-inch Super Actua LTPO OLED (1-120Hz, 3000 nits)',
      'Processor': 'Google Tensor G4 with Titan M2 Coprocessor',
      'Memory': '16GB RAM / 256GB Storage',
      'Cameras': '50MP Octa PD + 48MP Quad PD Ultra-wide + 48MP 5x Telephoto',
      'Battery': '5060mAh, 37W wired charging',
    },
    baseUsdPrice: 949,
    originalUsdPrice: 1099,
    dealScore: 88,
    isTrending: false,
    isTopDeal: false,
    aiSummary: {
      verdict: 'Good deal. Dropped $150 in the last 10 days. An ideal pickup if camera color fidelity and clean software updates are your top priority.',
      pros: ['Class-leading portrait photography & HDR skin tones', '16GB RAM standard ensures fast on-device Gemini inference', '7 years of Feature Drops guaranteed'],
      cons: ['Raw gaming benchmarks trail behind Snapdragon 8 Gen 3'],
      bestTimeToBuy: true,
    },
  },

  // 2. LAPTOPS
  {
    id: 'prod-macbook-pro-16-m3-max',
    title: 'Apple MacBook Pro 16" M3 Max (36GB Unified Memory, 1TB SSD, Space Black)',
    slug: 'macbook-pro-16-m3-max-1tb',
    brand: 'Apple',
    categoryId: 'cat-laptops',
    categorySlug: 'laptops',
    categoryName: 'Laptops',
    description: 'Extreme mobile workstation powered by M3 Max with a 14-core CPU, 30-core GPU, Liquid Retina XDR screen, and up to 22 hours battery run time.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&h=800&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&h=800&fit=crop&q=80',
    ],
    specs: {
      'Chip': 'Apple M3 Max (14-core CPU, 30-core GPU, 16-core Neural Engine)',
      'Display': '16.2-inch Liquid Retina XDR (3456x2234, 1600 nits peak, 120Hz)',
      'Memory': '36GB Unified Memory (300GB/s bandwidth)',
      'Storage': '1TB Superfast PCIe SSD',
      'Ports': '3x Thunderbolt 4, HDMI 2.1, SDXC Slot, MagSafe 3',
      'Battery': '100Wh Li-Po, 140W USB-C Power Adapter',
    },
    baseUsdPrice: 2999,
    originalUsdPrice: 3499,
    dealScore: 94,
    isTrending: true,
    isTopDeal: true,
    aiSummary: {
      verdict: 'Tremendous $500 discount across major tech retailers. The lowest price observed since release.',
      pros: ['Phenomenal performance on battery power without thermal throttling', '1600 nits HDR screen is unmatched for video grading', 'Space Black finish resists fingerprints'],
      cons: ['Substantial weight at 2.16 kg', 'Upgrades cannot be done after purchase'],
      bestTimeToBuy: true,
    },
  },
  {
    id: 'prod-macbook-air-15-m3',
    title: 'Apple MacBook Air 15" M3 (16GB Unified Memory, 512GB SSD, Midnight)',
    slug: 'macbook-air-15-m3-512gb',
    brand: 'Apple',
    categoryId: 'cat-laptops',
    categorySlug: 'laptops',
    categoryName: 'Laptops',
    description: 'Incredibly thin 11.5mm unibody housing a spacious 15.3-inch Liquid Retina screen, fanless silent operation, and all-day 18-hour battery.',
    imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=800&fit=crop&q=80',
    ],
    specs: {
      'Chip': 'Apple M3 chip (8-core CPU, 10-core GPU)',
      'Screen': '15.3-inch Liquid Retina with True Tone (2880x1864, 500 nits)',
      'RAM': '16GB Unified Memory',
      'Storage': '512GB SSD',
      'Weight': '1.51 kg',
      'Battery': 'Up to 18 hours battery life',
    },
    baseUsdPrice: 1299,
    originalUsdPrice: 1499,
    dealScore: 91,
    isTrending: true,
    isTopDeal: false,
    aiSummary: {
      verdict: 'Superb balance of screen size and ultra-portability. Now $200 below list price.',
      pros: ['Completely silent zero-fan operation', 'Stunning speaker system for a chassis this slim', 'Dual external monitor support in clamshell mode'],
      cons: ['Display limited to 60Hz without ProMotion'],
      bestTimeToBuy: true,
    },
  },
  {
    id: 'prod-dell-xps-16-oled',
    title: 'Dell XPS 16 (Intel Core Ultra 9 185H, 32GB RAM, 1TB SSD, RTX 4070, 4K OLED)',
    slug: 'dell-xps-16-core-ultra-9-rtx-4070-oled',
    brand: 'Dell',
    categoryId: 'cat-laptops',
    categorySlug: 'laptops',
    categoryName: 'Laptops',
    description: 'Futuristic CNC aluminum design with invisible haptic glass trackpad, capacitive touch function row, and 4K InfinityEdge OLED touch panel.',
    imageUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=800&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&h=800&fit=crop&q=80',
    ],
    specs: {
      'CPU': 'Intel Core Ultra 9 185H (16-cores, up to 5.1 GHz)',
      'GPU': 'NVIDIA GeForce RTX 4070 Laptop GPU 8GB GDDR6',
      'RAM': '32GB LPDDR5x 7467MHz Dual Channel',
      'Display': '16.3" 4K+ (3840 x 2400) OLED Touch, 400-nit, 100% DCI-P3',
      'Storage': '1TB M.2 PCIe NVMe SSD',
    },
    baseUsdPrice: 2499,
    originalUsdPrice: 2899,
    dealScore: 84,
    isTrending: false,
    isTopDeal: false,
    aiSummary: {
      verdict: 'Good discount on a high-tier creator laptop. Save $400 compared to official MSRP.',
      pros: ['Breathtaking 4K OLED color gamut', 'Ultra-modern monolithic aesthetic', 'Potent RTX 4070 graphics for 3D rendering and gaming'],
      cons: ['Touch function row has no physical tactile feedback', 'Requires USB-C dongles for legacy USB-A accessories'],
      bestTimeToBuy: true,
    },
  },

  // 3. GAMING
  {
    id: 'prod-ps5-pro-console',
    title: 'Sony PlayStation 5 Pro Console (2TB SSD, PSSR AI Upscaling)',
    slug: 'playstation-5-pro-2tb',
    brand: 'Sony',
    categoryId: 'cat-gaming',
    categorySlug: 'gaming',
    categoryName: 'Gaming',
    description: 'The ultimate console gaming hardware with PlayStation Spectral Super Resolution (PSSR), advanced ray tracing hardware, and 2TB high-speed storage.',
    imageUrl: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=800&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=800&fit=crop&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&h=800&fit=crop&q=80',
    ],
    specs: {
      'GPU': 'Enhanced RDNA 3 with 67% more compute units, 45% faster rendering',
      'Storage': '2TB Ultra-High Speed Custom NVMe SSD',
      'Ray Tracing': 'Advanced hardware ray tracing at 2x-3x PS5 speeds',
      'Upscaling': 'PlayStation Spectral Super Resolution (PSSR AI)',
      'Audio': 'Tempest 3D AudioTech',
      'Output': 'Supports 4K 120Hz, 8K output, and VRR',
    },
    baseUsdPrice: 679,
    originalUsdPrice: 749,
    dealScore: 87,
    isTrending: true,
    isTopDeal: true,
    aiSummary: {
      verdict: 'Rare price dip on Sony’s flagship console. In-stock across 4 major verified distributors.',
      pros: ['Double the internal SSD capacity at 2TB', 'Delivers stable 60fps in fidelity modes previously locked at 30fps', 'PSSR upscaling produces razor-sharp textures on 4K TVs'],
      cons: ['Disc drive and vertical stand sold separately'],
      bestTimeToBuy: true,
    },
  },
  {
    id: 'prod-steam-deck-oled-1tb',
    title: 'Valve Steam Deck OLED (1TB NVMe SSD, Anti-Glare Etched Glass)',
    slug: 'steam-deck-oled-1tb',
    brand: 'Valve',
    categoryId: 'cat-gaming',
    categorySlug: 'gaming',
    categoryName: 'Gaming',
    description: 'Handheld PC gaming redefined with a vibrant 90Hz HDR OLED screen, redesigned cooling, Wi-Fi 6E, and 50Wh extended battery life.',
    imageUrl: 'https://images.unsplash.com/photo-1612287233221-508543788220?w=800&h=800&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1612287233221-508543788220?w=800&h=800&fit=crop&q=80',
    ],
    specs: {
      'Display': '7.4" diagonal 90Hz HDR OLED, 1000 nits peak brightness, 110% DCI-P3',
      'APU': '6nm AMD Zen 2 (4c/8t) + 8 RDNA 2 CUs',
      'Storage': '1TB NVMe SSD + High-speed microSD expansion',
      'Battery': '50Wh (3 to 12 hours gameplay depending on title)',
      'Weight': '640 grams',
    },
    baseUsdPrice: 599,
    originalUsdPrice: 649,
    dealScore: 85,
    isTrending: false,
    isTopDeal: false,
    aiSummary: {
      verdict: 'Solid price drop on the top 1TB model. Lowest price seen in 60 days.',
      pros: ['True blacks and 90Hz smoothness elevate existing PC libraries', 'Significantly cooler and quieter than original LCD model', 'Premium anti-glare etched glass glass reduces outdoor reflections'],
      cons: ['Large footprint compared to Nintendo Switch'],
      bestTimeToBuy: true,
    },
  },

  // 4. TVS
  {
    id: 'prod-lg-oled-g4-65',
    title: 'LG 65" G4 Series OLED evo 4K Smart TV (OLED65G4, Alpha 11 AI Processor)',
    slug: 'lg-oled-65-g4-4k-smart-tv',
    brand: 'LG',
    categoryId: 'cat-tvs',
    categorySlug: 'tvs',
    categoryName: 'TVs',
    description: 'LG’s brightest OLED ever with Brightness Booster Max, Micro Lens Array (MLA) tech, zero-gap wall design, and 144Hz PC gaming certification.',
    imageUrl: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&h=800&fit=crop&q=80',
    ],
    specs: {
      'Screen Size': '65-inch 4K UHD (3840 x 2160) OLED evo',
      'Refresh Rate': '144Hz Native (G-Sync & FreeSync Premium certified)',
      'Processor': 'Alpha 11 AI Processor 4K',
      'HDR Support': 'Dolby Vision, HDR10, HLG, Filmmaker Mode',
      'HDMI Ports': '4x HDMI 2.1 (Full 48Gbps 4K 144Hz bandwidth on all 4)',
      'Audio': '60W 4.2 Channel with Dolby Atmos',
    },
    baseUsdPrice: 2296,
    originalUsdPrice: 2999,
    dealScore: 96,
    isTrending: true,
    isTopDeal: true,
    aiSummary: {
      verdict: 'All-time best deal alert! Dropped over $700 from launch price. The G4 sits at the absolute pinnacle of current display reviews.',
      pros: ['Micro Lens Array delivers blinding specular highlights without washing colors', 'Industry-best gaming features with 4 full HDMI 2.1 ports', '5-year manufacturer OLED panel warranty included'],
      cons: ['Includes flush wall mount in box; tabletop stand sold separately'],
      bestTimeToBuy: true,
    },
  },
  {
    id: 'prod-samsung-s95d-65',
    title: 'Samsung 65" S95D 4K QD-OLED TV (Glare-Free OLED, One Connect Box)',
    slug: 'samsung-65-s95d-qd-oled-glare-free',
    brand: 'Samsung',
    categoryId: 'cat-tvs',
    categorySlug: 'tvs',
    categoryName: 'TVs',
    description: 'Quantum Dot OLED brilliance paired with groundbreaking OLED Glare-Free matte coating that eliminates harsh room reflections.',
    imageUrl: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&h=800&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&h=800&fit=crop&q=80',
    ],
    specs: {
      'Display': '65-inch QD-OLED 4K (3840 x 2160)',
      'Anti-Glare': 'Samsung OLED Glare-Free Matte Coating',
      'Refresh Rate': 'Up to 144Hz Motion Xcelerator',
      'Processor': 'NQ4 AI Gen2 Processor',
      'Connectivity': 'Slim One Connect Box with single transparent cable',
    },
    baseUsdPrice: 2397,
    originalUsdPrice: 3099,
    dealScore: 93,
    isTrending: false,
    isTopDeal: true,
    aiSummary: {
      verdict: 'Substantial 22% price cut. Ideal if you have a sunlit living room where traditional glass reflections ruin daytime viewing.',
      pros: ['Uncanny anti-reflective surface kills harsh light reflections', 'Quantum Dot tech delivers wider, purer color volume', 'One Connect Box simplifies clean cable management'],
      cons: ['No native Dolby Vision format support (HDR10+ only)'],
      bestTimeToBuy: true,
    },
  },

  // 5. HEADPHONES
  {
    id: 'prod-sony-wh-1000xm5',
    title: 'Sony WH-1000XM5 Wireless Active Noise Canceling Headphones (Black)',
    slug: 'sony-wh-1000xm5-wireless-anc-headphones',
    brand: 'Sony',
    categoryId: 'cat-headphones',
    categorySlug: 'headphones',
    categoryName: 'Headphones',
    description: 'Dual processor Auto NC Optimizer, 8 microphone array for crystal calls, 30-hour battery, and lossless LDAC audio streaming.',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&h=800&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop&q=80',
    ],
    specs: {
      'Noise Cancellation': 'Dual Processor (V1 + QN1) with 8 microphones',
      'Driver Size': '30mm Carbon Fiber Composite',
      'Battery Life': '30 hours with ANC active (3 min charge gives 3 hours)',
      'Codecs': 'LDAC, AAC, SBC, Hi-Res Audio Wireless',
      'Bluetooth': 'Multipoint connection (switch between 2 devices simultaneously)',
      'Weight': '250 grams',
    },
    baseUsdPrice: 328,
    originalUsdPrice: 399,
    dealScore: 89,
    isTrending: true,
    isTopDeal: true,
    aiSummary: {
      verdict: 'Consistently the benchmark for flight travel and office focus. Currently $71 off retail price.',
      pros: ['Supreme active noise cancellation muffles both engine rumbles and vocal frequencies', 'Featherweight comfort for multi-hour flights', 'Exceptional microphone isolation during calls'],
      cons: ['Headband does not fold inward into a ball like older XM4 model'],
      bestTimeToBuy: true,
    },
  },
  {
    id: 'prod-airpods-max-usbc',
    title: 'Apple AirPods Max (USB-C, Midnight, Lossless Audio Ready)',
    slug: 'apple-airpods-max-usb-c-midnight',
    brand: 'Apple',
    categoryId: 'cat-headphones',
    categorySlug: 'headphones',
    categoryName: 'Headphones',
    description: 'Apple-designed 40mm dynamic driver, computational audio with H1 chip in each ear cup, knit mesh canopy, and modern USB-C charging.',
    imageUrl: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&h=800&fit=crop&q=80',
    ],
    specs: {
      'Driver': '40mm Apple-designed dynamic driver with dual neodymium ring magnets',
      'Chassis': 'Anodized aluminum ear cups with stainless steel frame',
      'Charging': 'USB-C charging connector',
      'Battery': '20 hours listening time with ANC / Spatial Audio enabled',
      'Weight': '386.2 grams',
    },
    baseUsdPrice: 499,
    originalUsdPrice: 549,
    dealScore: 81,
    isTrending: false,
    isTopDeal: false,
    aiSummary: {
      verdict: 'Modest $50 drop. First time USB-C version has seen verified retailer discounts.',
      pros: ['Best-in-class transparency mode feels completely natural', 'Stainless steel and aluminum build exudes luxury', 'Spatial Audio tracking is unmatched for movies on iPad/Mac'],
      cons: ['Heavy at 386g', 'Included Smart Case offers minimal travel protection'],
      bestTimeToBuy: false,
    },
  },

  // 6. SMARTWATCHES
  {
    id: 'prod-apple-watch-ultra-2',
    title: 'Apple Watch Ultra 2 (49mm Titanium, Black Ocean Band, GPS + Cellular)',
    slug: 'apple-watch-ultra-2-49mm-titanium',
    brand: 'Apple',
    categoryId: 'cat-smartwatches',
    categorySlug: 'smartwatches',
    categoryName: 'Smartwatches',
    description: 'Rugged aerospace-grade titanium, 3000 nits sapphire display, dual-frequency precision GPS, dive computer certification, and up to 72h low power battery.',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&h=800&fit=crop&q=80',
    ],
    specs: {
      'Case': '49mm Aerospace-grade titanium, raised edges to protect sapphire crystal',
      'Display': 'Always-On Retina OLED, up to 3000 nits brightness',
      'Water Resistance': '100m water resistant, EN13319 certified dive computer to 40m',
      'GPS': 'Precision dual-frequency GPS (L1 and L5)',
      'Battery': '36 hours normal use, up to 72 hours in Low Power Mode',
    },
    baseUsdPrice: 719,
    originalUsdPrice: 799,
    dealScore: 88,
    isTrending: true,
    isTopDeal: false,
    aiSummary: {
      verdict: 'Good deal. $80 lower than Apple Store price across verified authorized dealers.',
      pros: ['Readable under direct noon sunlight at 3000 nits', 'Titanium case handles knocks, scrapes, and underwater pressure with ease', 'Customizable orange Action Button for one-touch workouts'],
      cons: ['Substantial 49mm case can look oversized on smaller wrists'],
      bestTimeToBuy: true,
    },
  },
  {
    id: 'prod-galaxy-watch-ultra',
    title: 'Samsung Galaxy Watch Ultra (47mm Titanium Silver, LTE, BioActive Sensor)',
    slug: 'samsung-galaxy-watch-ultra-47mm',
    brand: 'Samsung',
    categoryId: 'cat-smartwatches',
    categorySlug: 'smartwatches',
    categoryName: 'Smartwatches',
    description: 'Cushion design titanium smartwatch built for extreme endurance with dual-frequency GPS, Multi-Sports tile, Energy Score, and 100-hour power saving mode.',
    imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=800&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&h=800&fit=crop&q=80',
    ],
    specs: {
      'Case': '47mm Titanium Grade 4 with cushion design, 10ATM + IP68 + MIL-STD-810H',
      'Display': '1.5-inch Super AMOLED (480 x 480), up to 3000 nits',
      'Battery': '590mAh, up to 100 hours in Power Saving mode',
      'Sensors': 'Samsung BioActive Sensor (Heart Rate, ECG, BIA body composition)',
      'Connectivity': 'LTE, Bluetooth 5.3, Wi-Fi, NFC, Dual-frequency GPS',
    },
    baseUsdPrice: 549,
    originalUsdPrice: 649,
    dealScore: 90,
    isTrending: false,
    isTopDeal: true,
    aiSummary: {
      verdict: 'Top value Android rugged watch. Dropped $100 across major electronics stores.',
      pros: ['Grade-4 titanium construction with 10ATM ocean durability', 'Accurate dual-frequency GPS tracking in dense urban canyons', 'Multi-day battery longevity compared to regular smartwatches'],
      cons: ['Distinct cushion case styling is polarizing'],
      bestTimeToBuy: true,
    },
  },
];

// Helper to convert raw definition to localized Product object
export function getProductForCountry(raw: RawProductDefinition, country: CountryCode): Product {
  const { currentBest, original, currency, offers } = generateOffersForCountry(
    raw.id,
    raw.baseUsdPrice,
    raw.originalUsdPrice,
    country
  );

  const history = generatePriceHistory(currentBest, original);
  const lowestPrice = Math.min(...history.map((h) => h.price), currentBest);
  const highestPrice = Math.max(...history.map((h) => h.price), original);
  const avg30 = Math.round(history.slice(-5).reduce((acc, h) => acc + h.price, 0) / 5);
  const avg90 = Math.round(history.reduce((acc, h) => acc + h.price, 0) / history.length);

  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    brand: raw.brand,
    categoryId: raw.categoryId,
    categorySlug: raw.categorySlug,
    categoryName: raw.categoryName,
    description: raw.description,
    imageUrl: raw.imageUrl,
    gallery: raw.gallery,
    specs: raw.specs,
    currentBestPrice: currentBest,
    originalPrice: original,
    currency,
    country,
    dealScore: raw.dealScore,
    isTrending: raw.isTrending,
    isTopDeal: raw.isTopDeal,
    offersCount: offers.length,
    bestMerchantName: offers[0]?.merchantName || 'Amazon',
    priceLastChecked: offers[0]?.lastCheckedAt || '15 minutes ago',
    priceStats: {
      currentPrice: currentBest,
      lowestPrice,
      highestPrice,
      average30Days: avg30,
      average90Days: avg90,
      allTimeLowestDate: '3 days ago',
    },
    priceHistory: history,
    offers,
    aiSummary: raw.aiSummary,
  };
}

export function getAllProducts(country: CountryCode = 'ae'): Product[] {
  return RAW_PRODUCTS.map((raw) => getProductForCountry(raw, country));
}

export function getProductBySlug(slug: string, country: CountryCode = 'ae'): Product | undefined {
  const raw = RAW_PRODUCTS.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
  if (!raw) return undefined;
  return getProductForCountry(raw, country);
}

export function getTopDeals(country: CountryCode = 'ae', limit: number = 6): Product[] {
  return getAllProducts(country)
    .filter((p) => p.isTopDeal || p.dealScore >= 88)
    .sort((a, b) => b.dealScore - a.dealScore)
    .slice(0, limit);
}

export function getBiggestDrops(country: CountryCode = 'ae', limit: number = 6): Product[] {
  return getAllProducts(country)
    .sort((a, b) => {
      const dropA = (a.originalPrice - a.currentBestPrice) / a.originalPrice;
      const dropB = (b.originalPrice - b.currentBestPrice) / b.originalPrice;
      return dropB - dropA;
    })
    .slice(0, limit);
}

export function getTrendingProducts(country: CountryCode = 'ae', limit: number = 6): Product[] {
  return getAllProducts(country)
    .filter((p) => p.isTrending)
    .slice(0, limit);
}

export function getProductsByCategory(
  categorySlug: string,
  country: CountryCode = 'ae'
): Product[] {
  return getAllProducts(country).filter(
    (p) => p.categorySlug.toLowerCase() === categorySlug.toLowerCase()
  );
}
