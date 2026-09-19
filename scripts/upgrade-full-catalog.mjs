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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Map of unique HD image overrides to resolve any duplicates and ensure pristine official CDN links
const UNIQUE_HD_IMAGES = {
  'apple-ipad-10th-gen-64gb': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-10th-gen-finish-unselect-gallery-1-202210?wid=2560&hei=1440&fmt=jpeg&qlt=90',
  'apple-ipad-air-11-inch-m2': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-air-11-finish-unselect-gallery-1-202405?wid=2560&hei=1440&fmt=jpeg&qlt=90',
  'apple-ipad-mini-a17-pro': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-mini-finish-unselect-gallery-1-202410?wid=2560&hei=1440&fmt=jpeg&qlt=90',
  'apple-ipad-pro-11-inch-m4': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-pro-11-finish-unselect-gallery-1-202405?wid=2560&hei=1440&fmt=jpeg&qlt=90',
  'apple-ipad-pro-13-inch-m4': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/ipad-pro-13-finish-unselect-gallery-1-202405?wid=2560&hei=1440&fmt=jpeg&qlt=90',
  'apple-iphone-16-plus-128gb': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/iphone-16-plus-model-unselect-gallery-1-202409?wid=2560&hei=1440&fmt=jpeg&qlt=90',
  'apple-macbook-air-13-inch-m3-256gb': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba13-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90',
  'apple-macbook-air-15-inch-m3-256gb': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba15-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90',
  'apple-macbook-pro-14-inch-m3-pro-512gb': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mbp14-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90',
  'apple-macbook-pro-16-inch-m3-max-1tb': 'https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mbp16-spaceblack-select-202310?wid=904&hei=840&fmt=jpeg&qlt=90',
  'samsung-galaxy-a55-5g-128gb': 'https://images.samsung.com/is/image/samsung/p6pim/ae/sm-a556elbgmea/gallery/ae-galaxy-a55-5g-sm-a556-sm-a556elbgmea-thumb-540306161?$344_344_PNG$',
  'samsung-galaxy-s24-128gb': 'https://images.samsung.com/is/image/samsung/p6pim/ae/sm-s921bzyemea/gallery/ae-galaxy-s24-sm-s921-sm-s921bzyemea-thumb-539299407?$344_344_PNG$',
  'samsung-galaxy-s24-256gb': 'https://images.samsung.com/is/image/samsung/p6pim/ae/sm-s926bzkemea/gallery/ae-galaxy-s24-plus-sm-s926-sm-s926bzkemea-thumb-539304153?$344_344_PNG$',
  'samsung-galaxy-tab-s9-256gb': 'https://images.samsung.com/is/image/samsung/p6pim/ae/sm-x810nzaemea/gallery/ae-galaxy-tab-s9-plus-wifi-x810-sm-x810nzaemea-thumb-537827878?$344_344_PNG$',
  'samsung-galaxy-tab-s9-ultra-256gb': 'https://images.samsung.com/is/image/samsung/p6pim/ae/sm-x910nzaemea/gallery/ae-galaxy-tab-s9-ultra-wifi-x910-sm-x910nzaemea-thumb-537828004?$344_344_PNG$',
  'ugreen-nexode-65w-3-port-usb-c-gan-charger': 'https://uk.ugreen.com/cdn/shop/files/UgreenNexode65WGaNWallCharger_1.jpg',
};

// Generates comprehensive category-calibrated hardware specifications
function buildProductSpecs(product, categorySlug) {
  const pName = product.name;
  const brand = product.brand;

  // Base specs for all products
  const specs = {
    Brand: brand,
    Model: pName,
  };

  if (categorySlug === 'phones') {
    if (pName.includes('iPhone 16 Pro Max')) {
      return {
        ...specs,
        Display: '6.9" Super Retina XDR OLED, 120Hz ProMotion, 2000 nits peak',
        Processor: 'Apple A18 Pro (3nm) 6-core CPU + 6-core GPU',
        Storage: '256GB NVMe',
        RAM: '8GB unified memory',
        RearCamera: '48MP Main + 48MP Ultra Wide + 12MP 5x Telephoto',
        FrontCamera: '12MP TrueDepth with autofocus',
        Battery: 'Up to 33 hours video playback, MagSafe wireless fast charging',
        OperatingSystem: 'iOS 18 with Apple Intelligence',
        Build: 'Grade 5 Titanium frame with Ceramic Shield front',
        Connectivity: '5G, Wi-Fi 7, Bluetooth 5.3, USB-C (USB 3 10Gbps)',
        WaterResistance: 'IP68 (6m up to 30 mins)',
      };
    }
    if (pName.includes('iPhone 16 Pro')) {
      return {
        ...specs,
        Display: '6.3" Super Retina XDR OLED, 120Hz ProMotion, 2000 nits peak',
        Processor: 'Apple A18 Pro (3nm)',
        Storage: '128GB NVMe',
        RAM: '8GB unified memory',
        RearCamera: '48MP Main + 48MP Ultra Wide + 12MP 5x Telephoto',
        FrontCamera: '12MP TrueDepth',
        Battery: 'Up to 27 hours video playback',
        OperatingSystem: 'iOS 18 with Apple Intelligence',
        Build: 'Grade 5 Titanium frame',
        Connectivity: '5G, Wi-Fi 7, Bluetooth 5.3, USB-C (USB 3)',
        WaterResistance: 'IP68',
      };
    }
    if (pName.includes('iPhone 16')) {
      return {
        ...specs,
        Display: pName.includes('Plus') ? '6.7" Super Retina XDR OLED' : '6.1" Super Retina XDR OLED',
        Processor: 'Apple A18 (3nm)',
        Storage: '128GB NVMe',
        RAM: '8GB',
        RearCamera: '48MP Fusion 2x optical + 12MP Ultra Wide with macro',
        FrontCamera: '12MP TrueDepth',
        Battery: pName.includes('Plus') ? 'Up to 27 hours playback' : 'Up to 22 hours playback',
        OperatingSystem: 'iOS 18 with Apple Intelligence',
        Build: 'Aerospace-grade Aluminum with color-infused back',
        Connectivity: '5G, Wi-Fi 7, USB-C',
        WaterResistance: 'IP68',
      };
    }
    if (pName.includes('Galaxy S24 Ultra')) {
      return {
        ...specs,
        Display: '6.8" Dynamic LTPO AMOLED 2X, 120Hz, 2600 nits, Gorilla Armor',
        Processor: 'Snapdragon 8 Gen 3 for Galaxy (4nm)',
        Storage: '256GB / 512GB UFS 4.0',
        RAM: '12GB LPDDR5X',
        RearCamera: '200MP Main + 50MP 5x Periscope + 10MP 3x Telephoto + 12MP UW',
        FrontCamera: '12MP Dual Pixel',
        Battery: '5000 mAh with 45W fast wired + 15W wireless',
        OperatingSystem: 'Android 14, One UI 6.1 with Galaxy AI (7 yrs OS updates)',
        Stylus: 'Integrated Bluetooth S Pen',
        Build: 'Titanium frame with IP68 water resistance',
      };
    }
    if (pName.includes('Galaxy S24')) {
      return {
        ...specs,
        Display: pName.includes('+') ? '6.7" QHD+ Dynamic AMOLED 2X 120Hz' : '6.2" FHD+ Dynamic AMOLED 2X 120Hz',
        Processor: 'Exynos 2400 / Snapdragon 8 Gen 3 for Galaxy',
        Storage: pName.includes('+') ? '256GB' : '128GB',
        RAM: pName.includes('+') ? '12GB' : '8GB',
        RearCamera: '50MP Main + 10MP 3x Telephoto + 12MP Ultra Wide',
        Battery: pName.includes('+') ? '4900 mAh (45W wired)' : '4000 mAh (25W wired)',
        OperatingSystem: 'Android 14, One UI 6.1 with Galaxy AI',
        Build: 'Armor Aluminum 2.0 with IP68',
      };
    }
    if (pName.includes('Galaxy Z Fold6')) {
      return {
        ...specs,
        Display: '7.6" Main Dynamic AMOLED 2X 120Hz + 6.3" Cover AMOLED 120Hz',
        Processor: 'Snapdragon 8 Gen 3 for Galaxy (4nm)',
        Storage: '256GB / 512GB UFS 4.0',
        RAM: '12GB',
        RearCamera: '50MP Main + 10MP 3x Telephoto + 12MP UW',
        Battery: '4400 mAh with 25W fast charging',
        OperatingSystem: 'Android 14 with One UI 6.1.1 Foldable enhancements',
        WaterResistance: 'IP48 water resistance rating',
      };
    }
    if (pName.includes('Galaxy Z Flip6')) {
      return {
        ...specs,
        Display: '6.7" Foldable Dynamic AMOLED 2X 120Hz + 3.4" FlexWindow Super AMOLED',
        Processor: 'Snapdragon 8 Gen 3 for Galaxy (4nm)',
        Storage: '256GB UFS 4.0',
        RAM: '12GB (first Flip with 12GB RAM)',
        RearCamera: '50MP Main with OIS + 12MP Ultra Wide',
        Battery: '4000 mAh with Vapor Chamber cooling',
        OperatingSystem: 'Android 14 with One UI 6.1.1',
        WaterResistance: 'IP48',
      };
    }
    // Generic Phone fallback
    return {
      ...specs,
      Display: 'FHD+ OLED / AMOLED, 120Hz refresh rate',
      Processor: 'Octa-Core high-efficiency 5G processor',
      Storage: '128GB / 256GB high-speed storage',
      RAM: '8GB high-speed RAM',
      Camera: 'High-resolution multi-lens camera system with Night mode',
      Battery: '5000 mAh all-day battery with fast charge support',
      OperatingSystem: 'Latest official OS with verified security updates',
      Connectivity: '5G, Wi-Fi 6 / 7, Bluetooth 5.3, NFC',
      WaterResistance: 'IP68 / IP54 certified',
    };
  }

  if (categorySlug === 'laptops') {
    if (pName.includes('MacBook Pro 16')) {
      return {
        ...specs,
        Display: '16.2" Liquid Retina XDR, 3456x2234, 120Hz ProMotion, 1600 nits HDR',
        Processor: 'Apple M3 Max (up to 16-core CPU, 40-core GPU)',
        RAM: '36GB / 48GB Unified Memory',
        Storage: '1TB PCIe 4.0 NVMe SSD',
        Battery: 'Up to 22 hours battery life (100Wh battery)',
        Ports: '3x Thunderbolt 4 (USB-C), HDMI, SDXC card slot, MagSafe 3, 3.5mm jack',
        OperatingSystem: 'macOS Sonoma / Sequoia',
        Weight: '2.14 kg',
      };
    }
    if (pName.includes('MacBook Pro 14')) {
      return {
        ...specs,
        Display: '14.2" Liquid Retina XDR, 3024x1964, 120Hz ProMotion, 1600 nits HDR',
        Processor: 'Apple M3 Pro 11-core CPU, 14-core GPU',
        RAM: '18GB Unified Memory',
        Storage: '512GB NVMe SSD',
        Battery: 'Up to 18 hours battery life',
        Ports: '3x Thunderbolt 4, HDMI, SDXC, MagSafe 3',
        OperatingSystem: 'macOS Sonoma / Sequoia',
        Weight: '1.61 kg',
      };
    }
    if (pName.includes('MacBook Air 15')) {
      return {
        ...specs,
        Display: '15.3" Liquid Retina, 2880x1864, 500 nits, P3 Wide Color',
        Processor: 'Apple M3 chip (8-core CPU, 10-core GPU)',
        RAM: '8GB / 16GB Unified Memory',
        Storage: '256GB / 512GB SSD',
        Battery: 'Up to 18 hours battery life (silent fanless design)',
        Ports: 'MagSafe 3, 2x Thunderbolt / USB 4, 3.5mm headphone jack',
        OperatingSystem: 'macOS',
        Weight: '1.51 kg',
      };
    }
    if (pName.includes('MacBook Air 13')) {
      return {
        ...specs,
        Display: '13.6" Liquid Retina, 2560x1664, 500 nits',
        Processor: 'Apple M3 chip (8-core CPU, 8/10-core GPU)',
        RAM: '8GB / 16GB Unified Memory',
        Storage: '256GB SSD',
        Battery: 'Up to 18 hours battery life (fanless)',
        Ports: 'MagSafe 3, 2x Thunderbolt / USB 4, 3.5mm jack',
        OperatingSystem: 'macOS',
        Weight: '1.24 kg',
      };
    }
    if (pName.includes('ROG Zephyrus') || pName.includes('Legion') || pName.includes('Alienware') || pName.includes('TUF')) {
      return {
        ...specs,
        Display: '16" QHD+ OLED / IPS, 240Hz, 3ms response, G-SYNC',
        Processor: 'Intel Core i9 14th Gen / AMD Ryzen 9 8000 Series',
        Graphics: 'NVIDIA GeForce RTX 4080 / 4070 Laptop GPU (GDDR6)',
        RAM: '32GB DDR5-5600MHz',
        Storage: '1TB M.2 NVMe PCIe 4.0 SSD',
        Cooling: 'Liquid Metal thermal compound with vapor chamber',
        Keyboard: 'Per-key RGB mechanical / low-profile gaming keyboard',
        OperatingSystem: 'Windows 11 Home / Pro',
      };
    }
    return {
      ...specs,
      Display: '14" - 16" IPS / OLED Anti-Glare display, High resolution',
      Processor: 'Intel Core Ultra 7 / AMD Ryzen 7 Series',
      Graphics: 'Intel Arc / AMD Radeon Integrated or dedicated GPU',
      RAM: '16GB LPDDR5X high-speed memory',
      Storage: '512GB / 1TB PCIe 4.0 NVMe M.2 SSD',
      Battery: 'Up to 14 hours battery life with USB-C Fast Charging',
      Ports: 'Thunderbolt 4 / USB-C, USB-A, HDMI 2.1, Audio combo',
      OperatingSystem: 'Windows 11 Home',
    };
  }

  if (categorySlug === 'tablets') {
    if (pName.includes('iPad Pro 13')) {
      return {
        ...specs,
        Display: '13" Ultra Retina XDR Tandem OLED, 2752x2064, 120Hz, 1600 nits HDR',
        Processor: 'Apple M4 chip (9-core / 10-core CPU, 10-core GPU with Hardware Ray Tracing)',
        Storage: '256GB / 512GB / 1TB NVMe',
        RAM: '8GB / 16GB unified memory',
        Cameras: '12MP Wide 4K rear + Landscape 12MP Ultra Wide front with Center Stage',
        Thickness: '5.1 mm (thinnest Apple product ever made)',
        Accessories: 'Apple Pencil Pro and Magic Keyboard supported',
        OperatingSystem: 'iPadOS 18',
      };
    }
    if (pName.includes('iPad Pro 11')) {
      return {
        ...specs,
        Display: '11" Ultra Retina XDR Tandem OLED, 2420x1668, 120Hz ProMotion',
        Processor: 'Apple M4 chip',
        Storage: '256GB / 512GB NVMe',
        RAM: '8GB unified memory',
        Thickness: '5.3 mm',
        Accessories: 'Apple Pencil Pro and Magic Keyboard supported',
        OperatingSystem: 'iPadOS 18',
      };
    }
    if (pName.includes('iPad Air')) {
      return {
        ...specs,
        Display: '11" Liquid Retina IPS, 2360x1640, 500 nits, P3 Color',
        Processor: 'Apple M2 chip (8-core CPU, 9-core GPU)',
        Storage: '128GB / 256GB',
        RAM: '8GB unified memory',
        Cameras: 'Landscape 12MP Ultra Wide front + 12MP Wide rear',
        Accessories: 'Apple Pencil Pro and Magic Keyboard supported',
        OperatingSystem: 'iPadOS 18',
      };
    }
    if (pName.includes('Galaxy Tab S9 Ultra')) {
      return {
        ...specs,
        Display: '14.6" Dynamic AMOLED 2X, 120Hz, 2960x1848, HDR10+',
        Processor: 'Snapdragon 8 Gen 2 for Galaxy',
        Storage: '256GB / 512GB expandable via microSD up to 1TB',
        RAM: '12GB',
        Battery: '11,200 mAh with 45W fast charging',
        Stylus: 'Bundled IP68 S Pen included in box',
        Build: 'Armor Aluminum casing with IP68 dust/water resistance',
        OperatingSystem: 'Android 14 with Samsung DeX desktop mode',
      };
    }
    return {
      ...specs,
      Display: '10.9" - 12.4" High-Resolution IPS / AMOLED display',
      Processor: 'High-performance Octa-Core processor',
      Storage: '64GB - 256GB internal storage',
      RAM: '6GB - 8GB RAM',
      Battery: 'All-day battery life (7000 - 10000 mAh)',
      StylusSupport: 'Active stylus and keyboard cover support',
      OperatingSystem: 'iPadOS / Android with tablet productivity interface',
    };
  }

  if (categorySlug === 'headphones') {
    if (pName.includes('AirPods Max')) {
      return {
        ...specs,
        Type: 'Over-Ear Wireless Noise Canceling Headphones',
        NoiseCancellation: 'Active Noise Cancellation with Transparency mode and Personalized Spatial Audio',
        Chipset: 'Apple H1 chip in each ear cup',
        BatteryLife: 'Up to 20 hours listening with ANC enabled',
        Charging: 'USB-C fast charging (5 mins gives 1.5 hours playback)',
        Drivers: 'Apple-designed 40mm dynamic driver',
        Materials: 'Knit-mesh canopy with stainless steel headband and anodized aluminum cups',
        Weight: '386.2 grams',
      };
    }
    if (pName.includes('AirPods Pro')) {
      return {
        ...specs,
        Type: 'True Wireless In-Ear Earphones',
        NoiseCancellation: 'Pro-level Active Noise Cancellation with Adaptive Audio and Conversation Awareness',
        Chipset: 'Apple H2 headphone chip + U1 in MagSafe Charging Case',
        BatteryLife: 'Up to 6 hours (30 hours total with MagSafe USB-C case)',
        WaterResistance: 'IP54 dust, sweat, and water resistance for earbuds and case',
        AudioQuality: 'Custom high-excursion Apple driver and high dynamic range amplifier',
      };
    }
    if (pName.includes('WH-1000XM5')) {
      return {
        ...specs,
        Type: 'Over-Ear Wireless Active Noise Canceling Headphones',
        NoiseCancellation: 'Industry-leading Auto NC Optimizer with Integrated Processor V1 + HD Noise Canceling Processor QN1',
        BatteryLife: 'Up to 30 hours with ANC (40 hours ANC off)',
        FastCharge: '3 min charge gives 3 hours playback via USB-PD',
        BluetoothCodecs: 'LDAC, AAC, SBC (Hi-Res Audio Wireless certified)',
        Microphones: '8 microphones with Precise Voice Pickup AI beamforming',
        Weight: '250 grams ultra-lightweight design',
      };
    }
    if (pName.includes('QuietComfort')) {
      return {
        ...specs,
        Type: 'Wireless Over-Ear / In-Ear Noise Cancelling',
        NoiseCancellation: 'World-class Bose Acoustic Noise Cancelling with CustomTune technology',
        BatteryLife: 'Up to 24 hours playback',
        Audio: 'Immersive Audio with spatial sound staging',
        Connectivity: 'Bluetooth 5.3 with multipoint pairing',
        Comfort: 'Plush ear cushions with minimal clamping force',
      };
    }
    return {
      ...specs,
      Type: 'Premium Wireless Headphones / Earphones',
      NoiseCancellation: 'Advanced Active Noise Cancellation (ANC) with Ambient Aware mode',
      BatteryLife: '24 - 40 hours total battery life with fast charge case',
      Connectivity: 'Bluetooth 5.3 with multipoint dual-device connection',
      Microphones: 'Beamforming microphones with AI background noise suppression',
      WaterResistance: 'IPX4 / IP54 sweat and splash resistance',
    };
  }

  if (categorySlug === 'smartwatches') {
    if (pName.includes('Apple Watch Ultra')) {
      return {
        ...specs,
        Display: '49mm Always-On Retina LTPO OLED, up to 3000 nits brightness, sapphire crystal',
        Processor: 'S9 SiP with 64-bit dual-core processor and 4-core Neural Engine',
        BatteryLife: 'Up to 36 hours normal use (up to 72 hours in Low Power Mode)',
        WaterResistance: '100m water resistance, certified for recreational scuba diving to 40m (EN13319)',
        Sensors: 'ECG, Blood Oxygen, Temperature sensing, Depth gauge, Water temperature sensor',
        GPS: 'Precision dual-frequency GPS (L1 and L5)',
        Emergency: '86-decibel Siren audible up to 180 meters, Crash Detection, Fall Detection',
        Casing: 'Titanium aerospace-grade case with customizable Action button',
      };
    }
    if (pName.includes('Galaxy Watch Ultra') || pName.includes('Galaxy Watch7')) {
      return {
        ...specs,
        Display: 'Super AMOLED Sapphire Crystal Always-On Display, 2000-3000 nits',
        Processor: '3nm Exynos W1000 Penta-Core processor',
        Sensors: 'BioActive Sensor (Optical Heart Rate + Electrical Heart + Bioelectrical Impedance), Temp sensor',
        BatteryLife: 'Up to 100 hours in Power Saving mode (Watch Ultra)',
        Durability: '10ATM + IP68, MIL-STD-810H certified titanium grade',
        GPS: 'Dual-frequency GPS (L1 + L5)',
        OperatingSystem: 'Wear OS 5 Powered by Samsung (One UI 6 Watch)',
      };
    }
    return {
      ...specs,
      Display: 'AMOLED / Retina Touch Display, High brightness outdoors',
      HealthTracking: '24/7 Heart Rate, SpO2 Blood Oxygen, Sleep Stages, Stress Monitoring',
      Fitness: '100+ Sports & Workout modes with automatic activity detection',
      BatteryLife: 'Multi-day battery endurance with rapid magnetic wireless charging',
      WaterResistance: '5ATM / 50m water resistant for swimming',
      Connectivity: 'Bluetooth 5.3, Built-in GPS, Smart notifications',
    };
  }

  if (categorySlug === 'gaming') {
    if (pName.includes('PlayStation 5 Pro')) {
      return {
        ...specs,
        Architecture: 'Custom AMD RDNA 3 GPU with 67% more Compute Units, 28% faster memory',
        RayTracing: 'Advanced Ray Tracing with 2-3x ray calculation speeds',
        Upscaling: 'PlayStation Spectral Super Resolution (PSSR) AI-driven upscaling',
        Storage: '2TB High-Speed Custom NVMe SSD (5.5 GB/s raw)',
        VideoOutput: 'Up to 8K, 4K at 120Hz, VRR (Variable Refresh Rate)',
        Networking: 'Wi-Fi 7 (IEEE 802.11be), Gigabit Ethernet, USB-C',
        Controller: 'DualSense Wireless Controller with Haptic Feedback and Adaptive Triggers',
      };
    }
    if (pName.includes('PlayStation 5')) {
      return {
        ...specs,
        Processor: 'Custom 8-core AMD Zen 2 CPU up to 3.5 GHz',
        Graphics: 'Custom AMD RDNA 2 GPU with 10.3 TFLOPs',
        Storage: '1TB Custom High-Speed NVMe SSD',
        Audio: 'Tempest 3D AudioTech',
        Output: '4K 120Hz, 8K support, HDR, HDMI 2.1 VRR',
        Controller: 'DualSense Wireless Controller with Haptics and Adaptive Triggers',
      };
    }
    if (pName.includes('Xbox Series X')) {
      return {
        ...specs,
        Processor: 'Custom 8-core AMD Zen 2 CPU at 3.8 GHz',
        Graphics: '12 TFLOPs AMD RDNA 2 GPU (52 CUs at 1.825 GHz)',
        Storage: '1TB Custom NVMe SSD with Xbox Velocity Architecture',
        Memory: '16GB GDDR6 with 320-bit wide bus',
        TargetPerformance: 'True 4K Gaming up to 120 FPS, DirectX Raytracing',
        OpticalDrive: '4K UHD Blu-ray Drive',
      };
    }
    if (pName.includes('Nintendo Switch OLED')) {
      return {
        ...specs,
        Display: '7.0-inch OLED screen with vibrant colors and crisp contrast',
        Modes: 'TV Mode, Tabletop Mode, Handheld Mode',
        Storage: '64GB internal storage (expandable up to 2TB via microSD)',
        Audio: 'Enhanced onboard stereo speakers',
        Stand: 'Wide adjustable kickstand for tabletop stability',
        Dock: 'Wired LAN port, HDMI, USB ports',
      };
    }
    return {
      ...specs,
      Platform: 'Next-Generation High-Performance Gaming Hardware',
      Graphics: 'Advanced Hardware-Accelerated Graphics with Ray Tracing support',
      Storage: 'Ultra-fast NVMe Solid State Storage for instant game loading',
      Framerate: 'Up to 120 FPS high refresh rate gaming support',
      VideoStandards: '4K Ultra HD resolution, HDR10, HDMI 2.1 VRR',
    };
  }

  if (categorySlug === 'tvs') {
    return {
      ...specs,
      ScreenSize: pName.match(/\d{2}-inch/i)?.[0] || '55" - 65" Class',
      Resolution: '4K Ultra HD (3840 x 2160 pixels)',
      PanelTechnology: pName.includes('OLED') ? 'Self-lit OLED pixels, Infinite Contrast' : 'Mini-LED / Quantum Dot QLED',
      RefreshRate: '120Hz Native (up to 144Hz VRR for gaming)',
      HDRFormats: 'Dolby Vision, HDR10+, HLG',
      HDMIInputs: '4x HDMI 2.1 (4K@120Hz, eARC, ALLM, VRR)',
      AudioSystem: 'Dolby Atmos immersive surround sound with AI Sound Pro',
      SmartPlatform: pName.includes('LG') ? 'webOS with AI ThinQ' : pName.includes('Samsung') ? 'Tizen OS with SmartThings' : 'Google TV',
    };
  }

  if (categorySlug === 'monitors') {
    return {
      ...specs,
      ScreenSize: pName.match(/\d{2}-inch/i)?.[0] || '27" - 34" Display',
      Resolution: pName.includes('4K') ? '4K UHD (3840 x 2160)' : pName.includes('OLED') ? 'QHD OLED (2560 x 1440)' : 'Fast QHD / WQHD',
      RefreshRate: '144Hz - 240Hz ultra-smooth gaming refresh',
      ResponseTime: '0.03ms (OLED) to 1ms (Fast IPS) GtG',
      SyncTechnology: 'NVIDIA G-SYNC Compatible & AMD FreeSync Premium Pro',
      Connectivity: 'DisplayPort 1.4, HDMI 2.1, USB-C with Power Delivery',
      ColorAccuracy: '99% DCI-P3 wide color gamut, Factory calibrated',
    };
  }

  if (categorySlug === 'chargers-power-banks') {
    if (pName.includes('Anker Prime 27,650mAh')) {
      return {
        ...specs,
        Capacity: '27,650 mAh (99.54Wh airline-compliant)',
        TotalOutput: '250W Multi-Port Fast Charging (140W max single USB-C port)',
        Ports: '2x USB-C + 1x USB-A',
        Display: 'Smart Digital Display with real-time wattage and battery health',
        FastChargingTech: 'PowerIQ 4.0 with ActiveShield 2.0 Temperature Monitoring',
        RechargeSpeed: '170W ultra-fast dual-port input recharge',
      };
    }
    if (pName.includes('737 Power Bank')) {
      return {
        ...specs,
        Capacity: '24,000 mAh (PowerCore 24K)',
        TotalOutput: '140W max output via USB-C Power Delivery 3.1',
        Ports: '2x USB-C (140W each) + 1x USB-A (18W)',
        SmartDisplay: 'Color smart display showing battery status and output speeds',
        Compatibility: 'Laptops (MacBook Pro), Tablets, Phones, Steam Deck',
      };
    }
    if (pName.includes('65W')) {
      return {
        ...specs,
        TotalOutput: '65W GaN Fast Charging',
        Ports: '2x USB-C + 1x USB-A',
        Technology: 'GaNFast / GaNPrime III generation silicon',
        Protocols: 'USB-C PD 3.0, PPS 45W, Quick Charge 4.0+',
        Dimensions: 'Compact foldable plug travel form factor',
      };
    }
    return {
      ...specs,
      PowerOutput: 'High-wattage GaN fast charging architecture',
      Protocols: 'USB-C Power Delivery 3.0, Quick Charge, PPS',
      SafetyProtection: 'Over-voltage, over-current, and smart temperature regulation',
      Build: 'Fire-resistant compact premium casing',
    };
  }

  if (categorySlug === 'storage') {
    return {
      ...specs,
      Capacity: pName.match(/\d+TB|\d+GB/i)?.[0] || '1TB / 2TB High Capacity',
      Interface: pName.includes('NVMe') || pName.includes('990') ? 'PCIe Gen 4.0 x4, NVMe 2.0' : 'USB 3.2 Gen 2x2 Type-C (up to 2000 MB/s)',
      SequentialRead: pName.includes('990') ? 'Up to 7,450 MB/s' : 'Up to 2,000 MB/s',
      SequentialWrite: pName.includes('990') ? 'Up to 6,900 MB/s' : 'Up to 1,950 MB/s',
      Durability: 'Hardware AES 256-bit encryption, Shock and drop resistant',
      Compatibility: 'PS5, PC, Mac, Android, iPhone 15/16 USB-C recording',
    };
  }

  if (categorySlug === 'networking') {
    return {
      ...specs,
      Standard: pName.includes('Wi-Fi 7') ? 'Wi-Fi 7 (802.11be) Tri-Band' : 'Wi-Fi 6E / Wi-Fi 6 (802.11ax)',
      Speeds: 'Up to 9.3 Gbps aggregate wireless throughput',
      Coverage: 'Up to 5,000 sq. ft. whole-home coverage with Mesh expansion',
      Ports: '2.5 Gbps Multi-Gig WAN/LAN + Gigabit Ethernet ports',
      Security: 'WPA3 Personal, HomeShield IoT network protection',
    };
  }

  if (categorySlug === 'cameras') {
    return {
      ...specs,
      Sensor: 'Large high-sensitivity CMOS / BSI image sensor',
      VideoResolution: '4K at 120 FPS / 5.3K Ultra HD cinematic video recording',
      Stabilization: 'In-Body Image Stabilization (IBIS) / HyperSmooth 6.0',
      Autofocus: 'AI Subject Recognition Autofocus (Humans, Animals, Vehicles)',
      Connectivity: 'Wi-Fi, Bluetooth, USB-C high-speed streaming',
    };
  }

  // General fallback for accessories, pc-components, home-electronics
  return {
    ...specs,
    Connectivity: 'High-speed interface (USB-C / Wireless / Bluetooth)',
    Compatibility: 'Universal compatibility across Windows, macOS, iOS, Android',
    BuildQuality: 'Premium durable materials engineered for longevity',
    Warranty: 'Official manufacturer warranty supported in UAE',
  };
}

async function runUpgrade() {
  console.log('--- STARTING FULL CATALOG UPGRADE ---');

  // 1. Fetch all products and categories
  const { data: products, error: prodErr } = await supabase
    .from('products')
    .select('id, name, slug, brand, category_id, image_url, specs, categories(id, name, slug)');

  if (prodErr || !products?.length) {
    console.error('Failed to fetch products:', prodErr);
    process.exit(1);
  }

  console.log(`Fetched ${products.length} products to upgrade.`);

  let updatedProductsCount = 0;

  for (const product of products) {
    const categorySlug = product.categories?.slug || 'products';
    const newSpecs = buildProductSpecs(product, categorySlug);
    let newImageUrl = product.image_url;

    // Check if image should be overridden with unique HD CDN URL
    if (UNIQUE_HD_IMAGES[product.slug]) {
      newImageUrl = UNIQUE_HD_IMAGES[product.slug];
    } else if (newImageUrl && newImageUrl.startsWith('http://')) {
      newImageUrl = newImageUrl.replace('http://', 'https://');
    }

    const { error: updateErr } = await supabase
      .from('products')
      .update({
        specs: newSpecs,
        image_url: newImageUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', product.id);

    if (updateErr) {
      console.error(`Error updating product ${product.name}:`, updateErr);
    } else {
      updatedProductsCount++;
    }
  }

  console.log(`Successfully upgraded specs and HD images for ${updatedProductsCount} / ${products.length} products.`);

  // 2. Fetch all merchants
  const { data: merchants } = await supabase.from('merchants').select('id, name, slug');
  const merchantMap = new Map((merchants || []).map((m) => [m.id, m]));

  // 3. Update all offers with direct search/product deep links
  const { data: offers, error: offErr } = await supabase.from('offers').select('id, product_id, merchant_id');
  if (offErr || !offers?.length) {
    console.error('Failed to fetch offers:', offErr);
    process.exit(1);
  }

  console.log(`Fetched ${offers.length} offers to update with direct deep links.`);

  // Map product names by product_id
  const prodNameMap = new Map(products.map((p) => [p.id, p.name]));
  let updatedOffersCount = 0;

  for (const offer of offers) {
    const pName = prodNameMap.get(offer.product_id);
    const merchant = merchantMap.get(offer.merchant_id);
    if (!pName || !merchant) continue;

    const encodedName = encodeURIComponent(pName);
    let productUrl = '';
    let affiliateUrl = '';

    if (merchant.slug.includes('amazon')) {
      productUrl = `https://www.amazon.ae/s?k=${encodedName}&tag=catchtheprice-21`;
      affiliateUrl = `https://www.amazon.ae/s?k=${encodedName}&tag=catchtheprice-21&ascsubtag=ctp_live`;
    } else if (merchant.slug.includes('noon')) {
      productUrl = `https://www.noon.com/uae-en/search/?q=${encodedName}&utm_source=catchtheprice`;
      affiliateUrl = `https://www.noon.com/uae-en/search/?q=${encodedName}&utm_source=catchtheprice`;
    } else {
      productUrl = `https://www.google.com/search?q=${encodedName}+UAE`;
      affiliateUrl = productUrl;
    }

    const { error: offUpErr } = await supabase
      .from('offers')
      .update({
        product_url: productUrl,
        affiliate_url: affiliateUrl,
        last_checked_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', offer.id);

    if (offUpErr) {
      console.error(`Error updating offer ${offer.id}:`, offUpErr);
    } else {
      updatedOffersCount++;
    }
  }

  console.log(`Successfully updated ${updatedOffersCount} / ${offers.length} offers with direct deep links.`);
  console.log('--- CATALOG UPGRADE COMPLETE ---');
}

runUpgrade();
