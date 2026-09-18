import type { SpecGroup } from '../../types';

export const IPHONE_16_PRO_MAX_SPEC_GROUPS: SpecGroup[] = [
  {
    category: 'Display',
    specs: [
      { name: 'Display Type', value: 'LTPO Super Retina XDR OLED, 120Hz ProMotion adaptive refresh' },
      { name: 'Size', value: '6.9 inches, 115.6 cm² (~91.4% screen-to-body ratio)' },
      { name: 'Resolution', value: '2868 × 1320 pixels at 460 ppi, 19.5:9 ratio' },
      { name: 'Refresh Rate', value: '120Hz ProMotion (1Hz to 120Hz dynamic adaptive)' },
      { name: 'Peak Brightness', value: '1,000 nits (typical); 1,600 nits (HDR); 2,000 nits (outdoor); 1 nit (min)' },
      { name: 'Contrast Ratio', value: '2,000,000:1 contrast ratio (typical)' },
      { name: 'Protection', value: 'Latest-generation Ceramic Shield front (2x tougher than any smartphone glass)' },
      { name: 'Features', value: 'Dynamic Island, Always-On display, True Tone, Wide color (P3), Haptic Touch' },
    ],
  },
  {
    category: 'Platform & Chip',
    specs: [
      { name: 'Operating System', value: 'iOS 18, upgradable with Apple Intelligence' },
      { name: 'Chipset', value: 'Apple A18 Pro (second-generation 3-nanometer architecture)' },
      { name: 'CPU', value: '6-core CPU with 2 performance cores and 4 efficiency cores' },
      { name: 'GPU', value: 'Apple-designed 6-core GPU with hardware-accelerated ray tracing' },
      { name: 'Neural Engine', value: '16-core Neural Engine (nearly 35 trillion operations per second)' },
      { name: 'Internal Storage', value: '256GB NVMe high-speed flash storage' },
      { name: 'RAM (Memory)', value: '8GB unified memory' },
      { name: 'Card Slot', value: 'No (External direct recording via USB-C up to 10Gb/s supported)' },
    ],
  },
  {
    category: 'Camera',
    specs: [
      { name: 'Camera System', value: 'Pro triple camera: 48MP Fusion + 48MP Ultra Wide + 12MP 5x Telephoto' },
      { name: '48MP Fusion (Wide)', value: '48 MP, f/1.78, 24mm, 2nd-gen sensor-shift OIS, 100% Focus Pixels' },
      { name: '12MP Telephoto (5x)', value: '12 MP, f/2.8, 120mm periscope, 5x optical zoom, 3D sensor-shift OIS' },
      { name: '48MP Ultra Wide', value: '48 MP, f/2.2, 13mm, 120° FOV, Hybrid Focus Pixels, Super-macro' },
      { name: 'Camera Control', value: 'Dedicated tactile sapphire-crystal Camera Control button with force sensor & swipe gestures' },
      { name: 'LiDAR Scanner', value: 'TOF 3D LiDAR scanner for Night mode portraits and instant autofocus in low light' },
      { name: 'Video Recording', value: '4K Dolby Vision at 24/25/30/60/100/120 fps; ProRes up to 4K@120fps; Spatial Video' },
      { name: 'Selfie Camera', value: '12 MP TrueDepth, f/1.9 aperture, autofocus with Focus Pixels, 4K Dolby Vision' },
    ],
  },
  {
    category: 'Battery & Power',
    specs: [
      { name: 'Battery Capacity', value: '4685 mAh built-in rechargeable lithium-ion battery' },
      { name: 'Video Playback', value: 'Up to 33 hours video playback; up to 29 hours streamed video' },
      { name: 'Audio Playback', value: 'Up to 105 hours audio playback' },
      { name: 'Wired Fast Charging', value: 'Up to 50% charge in ~30 minutes with 20W adapter or higher (USB-PD)' },
      { name: 'MagSafe Wireless', value: 'MagSafe wireless charging up to 25W with 30W adapter or higher' },
      { name: 'Qi2 Wireless', value: 'Qi2 wireless charging up to 15W' },
      { name: 'Reverse Charging', value: 'Up to 4.5W reverse wired charging via USB-C to AirPods or Apple Watch' },
    ],
  },
  {
    category: 'Body & Build',
    specs: [
      { name: 'Dimensions', value: '163 x 77.6 x 8.25 mm (6.42 x 3.06 x 0.32 in)' },
      { name: 'Weight', value: '227 g (8.01 oz)' },
      { name: 'Frame Material', value: 'Grade 5 Titanium frame with fine microblasted satin finish' },
      { name: 'Front & Back', value: 'Ceramic Shield front, textured matte glass back' },
      { name: 'Water & Dust Resistance', value: 'IP68 (maximum depth of 6m up to 30 mins) under IEC standard 60529' },
      { name: 'Available Finishes', value: 'Desert Titanium, Natural Titanium, White Titanium, Black Titanium' },
      { name: 'SIM Support', value: 'Nano-SIM and eSIM (International / UAE regional model)' },
      { name: 'Action Button', value: 'Customizable Action button (Silent, Focus, Camera, Flashlight, Shortcut)' },
    ],
  },
  {
    category: 'Connectivity',
    specs: [
      { name: 'Cellular Technology', value: '5G (sub-6 GHz) with 4x4 MIMO, Gigabit LTE' },
      { name: 'Wi-Fi', value: 'Wi-Fi 7 (802.11be) with 2x2 MIMO' },
      { name: 'Bluetooth', value: 'Bluetooth 5.3 wireless technology' },
      { name: 'Positioning', value: 'Precision dual-frequency GPS (GPS, GLONASS, Galileo, QZSS, BeiDou, NavIC)' },
      { name: 'NFC', value: 'NFC with reader mode & Apple Pay certification' },
      { name: 'Ultra Wideband', value: 'Second-generation Ultra Wideband chip' },
      { name: 'USB Interface', value: 'USB-C connector supporting USB 3.2 Gen 2 (up to 10Gb/s) & DisplayPort out' },
      { name: 'Audio & Speakers', value: 'Spatial Audio playback, stereo speakers, studio-quality 4-mic array with Audio Mix' },
      { name: 'Sensors & Safety', value: 'Face ID, Dual ambient light sensors, Barometer, Crash Detection, Emergency SOS via satellite' },
    ],
  },
];
