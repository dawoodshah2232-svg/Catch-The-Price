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

async function enrichSpecs() {
  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, brand, specs, categories(slug, name)');

  console.log(`Checking and enriching specs for ${products.length} products...`);

  let updatedCount = 0;

  for (const p of products) {
    const specs = { ...(p.specs || {}) };
    const cat = p.categories?.slug || 'products';
    const name = p.name;
    const brand = p.brand;

    // Ensure Brand and Model
    specs.Brand = specs.Brand || brand;
    specs.Model = specs.Model || name;

    // Ensure Warranty
    if (!specs.Warranty) {
      if (brand === 'Apple') {
        specs.Warranty = '1-Year Apple Official International & UAE Warranty with AppleCare eligibility';
      } else if (brand === 'Samsung') {
        specs.Warranty = '1-Year Official Samsung Gulf Electronics UAE Warranty';
      } else if (brand === 'Sony') {
        specs.Warranty = '1-Year Official Sony Middle East & Africa UAE Warranty';
      } else {
        specs.Warranty = `1-Year Official Manufacturer Warranty supported by authorized UAE service centers`;
      }
    }

    // Ensure category-specific core specs (Display, Chipset, RAM, Storage, Battery, Camera)
    if (cat === 'phones' || cat === 'tablets') {
      if (!specs.Display) specs.Display = 'High-Resolution OLED / AMOLED Touchscreen with 120Hz adaptive refresh rate';
      if (!specs.Chipset && !specs.Processor) specs.Chipset = 'Advanced Flagship High-Efficiency Octa-Core Processor';
      if (!specs.RAM) specs.RAM = '8GB - 12GB High-Speed LPDDR5X Memory';
      if (!specs.Storage) specs.Storage = name.match(/\d+GB|\d+TB/)?.[0] || '256GB High-Speed Internal Storage';
      if (!specs.Battery) specs.Battery = 'All-day endurance battery with USB-PD Fast Charging';
      if (!specs.Camera) specs.Camera = 'Ultra-HD Multi-Lens Camera System with Optical Image Stabilization & 4K Video';
    } else if (cat === 'laptops') {
      if (!specs.Display) specs.Display = 'Anti-Glare High-Resolution Retina / IPS Display with wide color gamut';
      if (!specs.Chipset && !specs.Processor) specs.Processor = 'Multi-Core High-Performance Processor with dedicated AI acceleration';
      if (!specs.RAM) specs.RAM = '16GB - 32GB High-Speed Unified / DDR5 Memory';
      if (!specs.Storage) specs.Storage = name.match(/\d+GB|\d+TB/)?.[0] || '512GB PCIe 4.0 NVMe SSD';
      if (!specs.Battery) specs.Battery = 'Up to 18 hours battery life with USB-C Fast Charging';
      if (!specs.Camera) specs.Camera = '1080p Full HD Webcam with Studio-Quality Noise Reduction Microphones';
    } else if (cat === 'headphones') {
      if (!specs.Display) specs.Display = 'LED Battery & Pairing Status Indicator';
      if (!specs.Chipset && !specs.Processor) specs.Chipset = 'Custom Ultra-Low Latency High-Definition Audio DSP';
      if (!specs.RAM) specs.RAM = 'Integrated Audio Processing Buffer';
      if (!specs.Storage) specs.Storage = 'Firmware flash memory with over-the-air updates';
      if (!specs.Battery) specs.Battery = 'Up to 30 hours listening time with quick-charge USB-C case';
      if (!specs.Camera) specs.Camera = 'Not applicable (Beamforming Environmental Microphones for Clear Voice)';
    } else if (cat === 'smartwatches') {
      if (!specs.Display) specs.Display = 'Always-On Retina / AMOLED Sapphire Crystal Touch Display (up to 3000 nits)';
      if (!specs.Chipset && !specs.Processor) specs.Chipset = 'High-efficiency dual/penta-core wearable processor';
      if (!specs.RAM) specs.RAM = '2GB - 4GB Wearable Memory';
      if (!specs.Storage) specs.Storage = '32GB - 64GB Onboard Storage for Apps & Music';
      if (!specs.Battery) specs.Battery = 'Multi-day battery life with fast magnetic wireless charging';
      if (!specs.Camera) specs.Camera = 'Not applicable (Optical & Bioelectrical Health Sensor Array)';
    } else if (cat === 'gaming') {
      if (!specs.Display) specs.Display = name.includes('OLED') ? '7.0-inch OLED 60Hz/120Hz' : 'Up to 4K 120Hz / 8K Video Output via HDMI 2.1';
      if (!specs.Chipset && !specs.Processor) specs.Processor = 'Custom High-Performance AMD / NVIDIA Gaming SoC';
      if (!specs.RAM) specs.RAM = '16GB GDDR6 Unified High-Bandwidth Memory';
      if (!specs.Storage) specs.Storage = name.match(/\d+TB|\d+GB/)?.[0] || '1TB Custom Ultra-High-Speed NVMe SSD';
      if (!specs.Battery) specs.Battery = name.includes('Handheld') || name.includes('Switch') || name.includes('Deck') ? 'Up to 8 hours handheld gameplay' : 'AC 100-240V Internal Power Supply';
      if (!specs.Camera) specs.Camera = 'Optional external PlayStation / Xbox HD Camera accessory supported';
    } else if (cat === 'tvs' || cat === 'monitors') {
      if (!specs.Display) specs.Display = name.match(/\d{2}-inch/)?.[0] ? `${name.match(/\d{2}-inch/)[0]} 4K Ultra HD Display` : '4K Ultra HD High Refresh Display';
      if (!specs.Chipset && !specs.Processor) specs.Processor = 'Neural AI Picture & Audio Quantum Processor';
      if (!specs.RAM) specs.RAM = '4GB Dedicated Smart TV / Display Memory';
      if (!specs.Storage) specs.Storage = '16GB - 32GB Onboard App Storage';
      if (!specs.Battery) specs.Battery = 'Eco-friendly Low Power AC Standby (<0.5W)';
      if (!specs.Camera) specs.Camera = 'Optional video conferencing USB camera supported';
    } else {
      // Accessories, Chargers, Storage, Networking
      if (!specs.Display) specs.Display = 'Digital LED Status / Wattage Display Indicator';
      if (!specs.Chipset && !specs.Processor) specs.Processor = 'Intelligent GaN / NVMe Controller with Thermal Protection';
      if (!specs.RAM) specs.RAM = 'High-Speed Controller Cache Memory';
      if (!specs.Storage) specs.Storage = name.match(/\d+TB|\d+GB/)?.[0] || 'High-capacity storage / output';
      if (!specs.Battery) specs.Battery = name.includes('Power Bank') ? name.match(/[\d,]+mAh/)?.[0] || '24,000 mAh' : 'USB-C Power Delivery / Wall Plug';
      if (!specs.Camera) specs.Camera = 'Not applicable (Pure Hardware Accessory)';
    }

    const { error: upErr } = await supabase.from('products').update({ specs }).eq('id', p.id);
    if (!upErr) updatedCount++;
  }

  console.log(`Successfully enriched specification plates for ${updatedCount} products.`);
}

enrichSpecs();
