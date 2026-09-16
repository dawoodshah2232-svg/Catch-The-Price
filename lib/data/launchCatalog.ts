import { CountryCode, Product, Offer, PricePoint } from '@/lib/types';

type LaunchSeed = {
  title: string;
  brand: string;
  categorySlug: string;
  categoryName: string;
  usd: number;
};

const SEEDS: LaunchSeed[] = [
  { title: "Apple iPhone 17 Pro Max 256GB", brand: "Apple", categorySlug: "phones", categoryName: "Phones", usd: 699 },
  { title: "Apple iPhone 17 Pro 256GB", brand: "Apple", categorySlug: "phones", categoryName: "Phones", usd: 799 },
  { title: "Apple iPhone 17 256GB", brand: "Apple", categorySlug: "phones", categoryName: "Phones", usd: 899 },
  { title: "Apple iPhone 17 Air 256GB", brand: "Apple", categorySlug: "phones", categoryName: "Phones", usd: 999 },
  { title: "Apple iPhone 16 Pro Max 256GB", brand: "Apple", categorySlug: "phones", categoryName: "Phones", usd: 1099 },
  { title: "Apple iPhone 16 Pro 256GB", brand: "Apple", categorySlug: "phones", categoryName: "Phones", usd: 1199 },
  { title: "Apple iPhone 16 Plus 128GB", brand: "Apple", categorySlug: "phones", categoryName: "Phones", usd: 1299 },
  { title: "Apple iPhone 16 128GB", brand: "Apple", categorySlug: "phones", categoryName: "Phones", usd: 1399 },
  { title: "Samsung Galaxy S26 Ultra 512GB", brand: "Samsung", categorySlug: "phones", categoryName: "Phones", usd: 699 },
  { title: "Samsung Galaxy S26+ 256GB", brand: "Samsung", categorySlug: "phones", categoryName: "Phones", usd: 799 },
  { title: "Samsung Galaxy S26 256GB", brand: "Samsung", categorySlug: "phones", categoryName: "Phones", usd: 899 },
  { title: "Samsung Galaxy Z Fold7 512GB", brand: "Samsung", categorySlug: "phones", categoryName: "Phones", usd: 999 },
  { title: "Samsung Galaxy Z Flip7 256GB", brand: "Samsung", categorySlug: "phones", categoryName: "Phones", usd: 1099 },
  { title: "Samsung Galaxy S25 Ultra 512GB", brand: "Samsung", categorySlug: "phones", categoryName: "Phones", usd: 1199 },
  { title: "Samsung Galaxy S25+ 256GB", brand: "Samsung", categorySlug: "phones", categoryName: "Phones", usd: 1299 },
  { title: "Samsung Galaxy S25 256GB", brand: "Samsung", categorySlug: "phones", categoryName: "Phones", usd: 1399 },
  { title: "Google Pixel 10 Pro XL 256GB", brand: "Google", categorySlug: "phones", categoryName: "Phones", usd: 699 },
  { title: "Google Pixel 10 Pro 256GB", brand: "Google", categorySlug: "phones", categoryName: "Phones", usd: 799 },
  { title: "Google Pixel 10 128GB", brand: "Google", categorySlug: "phones", categoryName: "Phones", usd: 899 },
  { title: "Google Pixel 10 Pro Fold 256GB", brand: "Google", categorySlug: "phones", categoryName: "Phones", usd: 999 },
  { title: "OnePlus 15 256GB", brand: "OnePlus", categorySlug: "phones", categoryName: "Phones", usd: 1099 },
  { title: "OnePlus 13 256GB", brand: "OnePlus", categorySlug: "phones", categoryName: "Phones", usd: 1199 },
  { title: "OnePlus 13R 256GB", brand: "OnePlus", categorySlug: "phones", categoryName: "Phones", usd: 1299 },
  { title: "Xiaomi 16 Ultra 512GB", brand: "Xiaomi", categorySlug: "phones", categoryName: "Phones", usd: 1399 },
  { title: "Xiaomi 16 Pro 512GB", brand: "Xiaomi", categorySlug: "phones", categoryName: "Phones", usd: 699 },
  { title: "Xiaomi 16 256GB", brand: "Xiaomi", categorySlug: "phones", categoryName: "Phones", usd: 799 },
  { title: "Xiaomi 15 Ultra 512GB", brand: "Xiaomi", categorySlug: "phones", categoryName: "Phones", usd: 899 },
  { title: "Xiaomi 15 256GB", brand: "Xiaomi", categorySlug: "phones", categoryName: "Phones", usd: 999 },
  { title: "ASUS ROG Phone 10 Pro 512GB", brand: "ASUS", categorySlug: "phones", categoryName: "Phones", usd: 1099 },
  { title: "ASUS ROG Phone 9 Pro 512GB", brand: "ASUS", categorySlug: "phones", categoryName: "Phones", usd: 1199 },
  { title: "REDMAGIC 11 Pro 512GB", brand: "REDMAGIC", categorySlug: "phones", categoryName: "Phones", usd: 1299 },
  { title: "REDMAGIC 10 Pro 256GB", brand: "REDMAGIC", categorySlug: "phones", categoryName: "Phones", usd: 1399 },
  { title: "Honor Magic8 Pro 512GB", brand: "Honor", categorySlug: "phones", categoryName: "Phones", usd: 699 },
  { title: "Honor Magic7 Pro 512GB", brand: "Honor", categorySlug: "phones", categoryName: "Phones", usd: 799 },
  { title: "Honor Magic V5 512GB", brand: "Honor", categorySlug: "phones", categoryName: "Phones", usd: 899 },
  { title: "OPPO Find X9 Pro 512GB", brand: "OPPO", categorySlug: "phones", categoryName: "Phones", usd: 999 },
  { title: "OPPO Find X8 Pro 512GB", brand: "OPPO", categorySlug: "phones", categoryName: "Phones", usd: 1099 },
  { title: "OPPO Find N5 512GB", brand: "OPPO", categorySlug: "phones", categoryName: "Phones", usd: 1199 },
  { title: "vivo X300 Pro 512GB", brand: "vivo", categorySlug: "phones", categoryName: "Phones", usd: 1299 },
  { title: "vivo X200 Pro 512GB", brand: "vivo", categorySlug: "phones", categoryName: "Phones", usd: 1399 },
  { title: "Nothing Phone (3) 256GB", brand: "Nothing", categorySlug: "phones", categoryName: "Phones", usd: 699 },
  { title: "Nothing Phone (3a) Pro 256GB", brand: "Nothing", categorySlug: "phones", categoryName: "Phones", usd: 799 },
  { title: "Motorola Razr Ultra 2026 512GB", brand: "Motorola", categorySlug: "phones", categoryName: "Phones", usd: 899 },
  { title: "Motorola Edge 70 Ultra 512GB", brand: "Motorola", categorySlug: "phones", categoryName: "Phones", usd: 999 },
  { title: "Sony Xperia 1 VII 256GB", brand: "Sony", categorySlug: "phones", categoryName: "Phones", usd: 1099 },
  { title: "ASUS ROG Zephyrus G16 2026 RTX 5090", brand: "ASUS", categorySlug: "laptops", categoryName: "Laptops", usd: 1099 },
  { title: "ASUS ROG Zephyrus G14 2026 RTX 5080", brand: "ASUS", categorySlug: "laptops", categoryName: "Laptops", usd: 1299 },
  { title: "ASUS ROG Strix G16 2026 RTX 5080", brand: "ASUS", categorySlug: "laptops", categoryName: "Laptops", usd: 1499 },
  { title: "ASUS ROG Strix SCAR 18 2026 RTX 5090", brand: "ASUS", categorySlug: "laptops", categoryName: "Laptops", usd: 1699 },
  { title: "Lenovo Legion Pro 7i Gen 11 RTX 5090", brand: "Lenovo", categorySlug: "laptops", categoryName: "Laptops", usd: 1899 },
  { title: "Lenovo Legion Pro 5i Gen 11 RTX 5070 Ti", brand: "Lenovo", categorySlug: "laptops", categoryName: "Laptops", usd: 2099 },
  { title: "Lenovo Legion 7i Gen 11 RTX 5080", brand: "Lenovo", categorySlug: "laptops", categoryName: "Laptops", usd: 2299 },
  { title: "Lenovo LOQ 15 2026 RTX 5060", brand: "Lenovo", categorySlug: "laptops", categoryName: "Laptops", usd: 2499 },
  { title: "MSI Titan 18 HX AI RTX 5090", brand: "MSI", categorySlug: "laptops", categoryName: "Laptops", usd: 2699 },
  { title: "MSI Raider 18 HX AI RTX 5090", brand: "MSI", categorySlug: "laptops", categoryName: "Laptops", usd: 2899 },
  { title: "MSI Vector 16 HX AI RTX 5080", brand: "MSI", categorySlug: "laptops", categoryName: "Laptops", usd: 1099 },
  { title: "MSI Stealth A16 AI+ RTX 5070 Ti", brand: "MSI", categorySlug: "laptops", categoryName: "Laptops", usd: 1299 },
  { title: "Razer Blade 18 2026 RTX 5090", brand: "Razer", categorySlug: "laptops", categoryName: "Laptops", usd: 1499 },
  { title: "Razer Blade 16 2026 RTX 5090", brand: "Razer", categorySlug: "laptops", categoryName: "Laptops", usd: 1699 },
  { title: "Alienware Area-51 18 RTX 5090", brand: "Alienware", categorySlug: "laptops", categoryName: "Laptops", usd: 1899 },
  { title: "Alienware 16 Aurora RTX 5070", brand: "Alienware", categorySlug: "laptops", categoryName: "Laptops", usd: 2099 },
  { title: "Acer Predator Helios 18 AI RTX 5090", brand: "Acer", categorySlug: "laptops", categoryName: "Laptops", usd: 2299 },
  { title: "Acer Predator Helios Neo 16S AI RTX 5070 Ti", brand: "Acer", categorySlug: "laptops", categoryName: "Laptops", usd: 2499 },
  { title: "HP OMEN MAX 16 RTX 5090", brand: "HP", categorySlug: "laptops", categoryName: "Laptops", usd: 2699 },
  { title: "HP OMEN 16 2026 RTX 5070", brand: "HP", categorySlug: "laptops", categoryName: "Laptops", usd: 2899 },
  { title: "Gigabyte AORUS MASTER 18 RTX 5090", brand: "Gigabyte", categorySlug: "laptops", categoryName: "Laptops", usd: 1099 },
  { title: "Gigabyte AERO X16 RTX 5070", brand: "Gigabyte", categorySlug: "laptops", categoryName: "Laptops", usd: 1299 },
  { title: "Samsung Galaxy Book5 Pro 16", brand: "Samsung", categorySlug: "laptops", categoryName: "Laptops", usd: 1499 },
  { title: "Samsung Galaxy Book5 360", brand: "Samsung", categorySlug: "laptops", categoryName: "Laptops", usd: 1699 },
  { title: "Apple MacBook Pro 16 M5 Max", brand: "Apple", categorySlug: "laptops", categoryName: "Laptops", usd: 1899 },
  { title: "Apple MacBook Pro 14 M5 Pro", brand: "Apple", categorySlug: "laptops", categoryName: "Laptops", usd: 2099 },
  { title: "Apple MacBook Air 15 M5", brand: "Apple", categorySlug: "laptops", categoryName: "Laptops", usd: 2299 },
  { title: "Apple MacBook Air 13 M5", brand: "Apple", categorySlug: "laptops", categoryName: "Laptops", usd: 2499 },
  { title: "Dell XPS 14 2026", brand: "Dell", categorySlug: "laptops", categoryName: "Laptops", usd: 2699 },
  { title: "Dell XPS 16 2026", brand: "Dell", categorySlug: "laptops", categoryName: "Laptops", usd: 2899 },
  { title: "Microsoft Surface Laptop 7 15-inch", brand: "Microsoft", categorySlug: "laptops", categoryName: "Laptops", usd: 1099 },
  { title: "Microsoft Surface Laptop 7 13.8-inch", brand: "Microsoft", categorySlug: "laptops", categoryName: "Laptops", usd: 1299 },
  { title: "ASUS Zenbook S 16 OLED 2026", brand: "ASUS", categorySlug: "laptops", categoryName: "Laptops", usd: 1499 },
  { title: "ASUS Vivobook Pro 16X OLED 2026", brand: "ASUS", categorySlug: "laptops", categoryName: "Laptops", usd: 1699 },
  { title: "Lenovo Yoga Pro 9i 16 2026", brand: "Lenovo", categorySlug: "laptops", categoryName: "Laptops", usd: 1899 },
  { title: "Lenovo Yoga Slim 9i 14 2026", brand: "Lenovo", categorySlug: "laptops", categoryName: "Laptops", usd: 2099 },
  { title: "HP Spectre x360 16 2026", brand: "HP", categorySlug: "laptops", categoryName: "Laptops", usd: 2299 },
  { title: "Acer Swift X 14 AI 2026", brand: "Acer", categorySlug: "laptops", categoryName: "Laptops", usd: 2499 },
  { title: "Framework Laptop 16 2026", brand: "Framework", categorySlug: "laptops", categoryName: "Laptops", usd: 2699 },
  { title: "LG gram Pro 17 2026", brand: "LG", categorySlug: "laptops", categoryName: "Laptops", usd: 2899 },
  { title: "NVIDIA GeForce RTX 5090", brand: "NVIDIA", categorySlug: "pc-components", categoryName: "PC Components", usd: 349 },
  { title: "NVIDIA GeForce RTX 5080", brand: "NVIDIA", categorySlug: "pc-components", categoryName: "PC Components", usd: 499 },
  { title: "NVIDIA GeForce RTX 5070 Ti", brand: "NVIDIA", categorySlug: "pc-components", categoryName: "PC Components", usd: 649 },
  { title: "NVIDIA GeForce RTX 5070", brand: "NVIDIA", categorySlug: "pc-components", categoryName: "PC Components", usd: 799 },
  { title: "NVIDIA GeForce RTX 5060 Ti 16GB", brand: "NVIDIA", categorySlug: "pc-components", categoryName: "PC Components", usd: 949 },
  { title: "NVIDIA GeForce RTX 5060", brand: "NVIDIA", categorySlug: "pc-components", categoryName: "PC Components", usd: 1099 },
  { title: "AMD Radeon RX 9070 XT", brand: "AMD", categorySlug: "pc-components", categoryName: "PC Components", usd: 1249 },
  { title: "AMD Radeon RX 9070", brand: "AMD", categorySlug: "pc-components", categoryName: "PC Components", usd: 1399 },
  { title: "AMD Radeon RX 9060 XT 16GB", brand: "AMD", categorySlug: "pc-components", categoryName: "PC Components", usd: 1549 },
  { title: "AMD Radeon RX 9060 XT 8GB", brand: "AMD", categorySlug: "pc-components", categoryName: "PC Components", usd: 1699 },
  { title: "ASUS ROG Astral RTX 5090 OC", brand: "ASUS", categorySlug: "pc-components", categoryName: "PC Components", usd: 349 },
  { title: "ASUS TUF Gaming RTX 5080 OC", brand: "ASUS", categorySlug: "pc-components", categoryName: "PC Components", usd: 499 },
  { title: "MSI Suprim SOC RTX 5090", brand: "MSI", categorySlug: "pc-components", categoryName: "PC Components", usd: 649 },
  { title: "MSI Gaming Trio RTX 5080", brand: "MSI", categorySlug: "pc-components", categoryName: "PC Components", usd: 799 },
  { title: "Gigabyte AORUS RTX 5090 Master", brand: "Gigabyte", categorySlug: "pc-components", categoryName: "PC Components", usd: 949 },
  { title: "ZOTAC Gaming RTX 5070 Ti AMP Extreme", brand: "ZOTAC", categorySlug: "pc-components", categoryName: "PC Components", usd: 1099 },
  { title: "Sapphire NITRO+ RX 9070 XT", brand: "Sapphire", categorySlug: "pc-components", categoryName: "PC Components", usd: 1249 },
  { title: "PowerColor Red Devil RX 9070 XT", brand: "PowerColor", categorySlug: "pc-components", categoryName: "PC Components", usd: 1399 },
  { title: "XFX Mercury RX 9070 XT", brand: "XFX", categorySlug: "pc-components", categoryName: "PC Components", usd: 1549 },
  { title: "ASRock Taichi RX 9070 XT", brand: "ASRock", categorySlug: "pc-components", categoryName: "PC Components", usd: 1699 },
  { title: "AMD Ryzen 9 9950X3D", brand: "AMD", categorySlug: "pc-components", categoryName: "PC Components", usd: 229 },
  { title: "AMD Ryzen 9 9900X3D", brand: "AMD", categorySlug: "pc-components", categoryName: "PC Components", usd: 309 },
  { title: "AMD Ryzen 7 9800X3D", brand: "AMD", categorySlug: "pc-components", categoryName: "PC Components", usd: 389 },
  { title: "AMD Ryzen 7 9700X", brand: "AMD", categorySlug: "pc-components", categoryName: "PC Components", usd: 469 },
  { title: "AMD Ryzen 5 9600X", brand: "AMD", categorySlug: "pc-components", categoryName: "PC Components", usd: 549 },
  { title: "AMD Ryzen 9 9950X", brand: "AMD", categorySlug: "pc-components", categoryName: "PC Components", usd: 629 },
  { title: "AMD Ryzen 9 9900X", brand: "AMD", categorySlug: "pc-components", categoryName: "PC Components", usd: 709 },
  { title: "Intel Core Ultra 9 285K", brand: "Intel", categorySlug: "pc-components", categoryName: "PC Components", usd: 789 },
  { title: "Intel Core Ultra 7 265K", brand: "Intel", categorySlug: "pc-components", categoryName: "PC Components", usd: 229 },
  { title: "Intel Core Ultra 5 245K", brand: "Intel", categorySlug: "pc-components", categoryName: "PC Components", usd: 309 },
  { title: "Intel Core Ultra 9 285", brand: "Intel", categorySlug: "pc-components", categoryName: "PC Components", usd: 389 },
  { title: "Intel Core Ultra 7 265", brand: "Intel", categorySlug: "pc-components", categoryName: "PC Components", usd: 469 },
  { title: "Intel Core i9-14900K", brand: "Intel", categorySlug: "pc-components", categoryName: "PC Components", usd: 549 },
  { title: "Intel Core i7-14700K", brand: "Intel", categorySlug: "pc-components", categoryName: "PC Components", usd: 629 },
  { title: "Intel Core i5-14600K", brand: "Intel", categorySlug: "pc-components", categoryName: "PC Components", usd: 709 },
  { title: "Sony PlayStation 5 Pro", brand: "Sony", categorySlug: "gaming", categoryName: "Gaming", usd: 299 },
  { title: "Sony PlayStation 5 Slim Disc", brand: "Sony", categorySlug: "gaming", categoryName: "Gaming", usd: 399 },
  { title: "Sony PlayStation 5 Slim Digital", brand: "Sony", categorySlug: "gaming", categoryName: "Gaming", usd: 499 },
  { title: "Microsoft Xbox Series X 2TB", brand: "Microsoft", categorySlug: "gaming", categoryName: "Gaming", usd: 599 },
  { title: "Microsoft Xbox Series X 1TB", brand: "Microsoft", categorySlug: "gaming", categoryName: "Gaming", usd: 699 },
  { title: "Microsoft Xbox Series S 1TB", brand: "Microsoft", categorySlug: "gaming", categoryName: "Gaming", usd: 799 },
  { title: "Nintendo Switch 2", brand: "Nintendo", categorySlug: "gaming", categoryName: "Gaming", usd: 899 },
  { title: "Nintendo Switch OLED", brand: "Nintendo", categorySlug: "gaming", categoryName: "Gaming", usd: 299 },
  { title: "Valve Steam Deck OLED 1TB", brand: "Valve", categorySlug: "gaming", categoryName: "Gaming", usd: 399 },
  { title: "ASUS ROG Ally X", brand: "ASUS", categorySlug: "gaming", categoryName: "Gaming", usd: 499 },
  { title: "Lenovo Legion Go S", brand: "Lenovo", categorySlug: "gaming", categoryName: "Gaming", usd: 599 },
  { title: "MSI Claw 8 AI+", brand: "MSI", categorySlug: "gaming", categoryName: "Gaming", usd: 699 },
  { title: "Meta Quest 3 512GB", brand: "Meta", categorySlug: "gaming", categoryName: "Gaming", usd: 799 },
  { title: "Meta Quest 3S 256GB", brand: "Meta", categorySlug: "gaming", categoryName: "Gaming", usd: 899 },
  { title: "PlayStation VR2", brand: "PlayStation", categorySlug: "gaming", categoryName: "Gaming", usd: 299 },
  { title: "Samsung Neo QLED 8K QN990F 85-inch", brand: "Samsung", categorySlug: "tvs", categoryName: "TVs", usd: 799 },
  { title: "Samsung OLED S95F 77-inch", brand: "Samsung", categorySlug: "tvs", categoryName: "TVs", usd: 1099 },
  { title: "Samsung OLED S90F 65-inch", brand: "Samsung", categorySlug: "tvs", categoryName: "TVs", usd: 1399 },
  { title: "Samsung The Frame Pro 65-inch", brand: "Samsung", categorySlug: "tvs", categoryName: "TVs", usd: 1699 },
  { title: "LG OLED G5 77-inch", brand: "LG", categorySlug: "tvs", categoryName: "TVs", usd: 1999 },
  { title: "LG OLED C5 65-inch", brand: "LG", categorySlug: "tvs", categoryName: "TVs", usd: 2299 },
  { title: "LG QNED evo 86-inch", brand: "LG", categorySlug: "tvs", categoryName: "TVs", usd: 2599 },
  { title: "Sony BRAVIA 9 75-inch Mini LED", brand: "Sony", categorySlug: "tvs", categoryName: "TVs", usd: 2899 },
  { title: "Sony BRAVIA 8 II 65-inch OLED", brand: "Sony", categorySlug: "tvs", categoryName: "TVs", usd: 3199 },
  { title: "Sony BRAVIA 7 65-inch Mini LED", brand: "Sony", categorySlug: "tvs", categoryName: "TVs", usd: 3499 },
  { title: "TCL QM8K 75-inch Mini LED", brand: "TCL", categorySlug: "tvs", categoryName: "TVs", usd: 799 },
  { title: "TCL C8K 65-inch Mini LED", brand: "TCL", categorySlug: "tvs", categoryName: "TVs", usd: 1099 },
  { title: "Hisense U8QG 75-inch Mini LED", brand: "Hisense", categorySlug: "tvs", categoryName: "TVs", usd: 1399 },
  { title: "Hisense U7QG 65-inch Mini LED", brand: "Hisense", categorySlug: "tvs", categoryName: "TVs", usd: 1699 },
  { title: "Panasonic Z95B 65-inch OLED", brand: "Panasonic", categorySlug: "tvs", categoryName: "TVs", usd: 1999 },
  { title: "Philips OLED+950 65-inch", brand: "Philips", categorySlug: "tvs", categoryName: "TVs", usd: 2299 },
  { title: "Samsung QN90F 65-inch Neo QLED", brand: "Samsung", categorySlug: "tvs", categoryName: "TVs", usd: 2599 },
  { title: "LG OLED B5 65-inch", brand: "LG", categorySlug: "tvs", categoryName: "TVs", usd: 2899 },
  { title: "Sony BRAVIA 5 65-inch", brand: "Sony", categorySlug: "tvs", categoryName: "TVs", usd: 3199 },
  { title: "TCL QM7K 65-inch", brand: "TCL", categorySlug: "tvs", categoryName: "TVs", usd: 3499 },
  { title: "Sony WH-1000XM6", brand: "Sony", categorySlug: "headphones", categoryName: "Headphones", usd: 149 },
  { title: "Sony WF-1000XM6", brand: "Sony", categorySlug: "headphones", categoryName: "Headphones", usd: 199 },
  { title: "Apple AirPods Max USB-C", brand: "Apple", categorySlug: "headphones", categoryName: "Headphones", usd: 249 },
  { title: "Apple AirPods Pro 3", brand: "Apple", categorySlug: "headphones", categoryName: "Headphones", usd: 299 },
  { title: "Bose QuietComfort Ultra Headphones", brand: "Bose", categorySlug: "headphones", categoryName: "Headphones", usd: 349 },
  { title: "Bose QuietComfort Ultra Earbuds", brand: "Bose", categorySlug: "headphones", categoryName: "Headphones", usd: 399 },
  { title: "Sennheiser Momentum 4 Wireless", brand: "Sennheiser", categorySlug: "headphones", categoryName: "Headphones", usd: 449 },
  { title: "Sennheiser Momentum True Wireless 4", brand: "Sennheiser", categorySlug: "headphones", categoryName: "Headphones", usd: 499 },
  { title: "Beats Studio Pro", brand: "Beats", categorySlug: "headphones", categoryName: "Headphones", usd: 149 },
  { title: "Beats Powerbeats Pro 2", brand: "Beats", categorySlug: "headphones", categoryName: "Headphones", usd: 199 },
  { title: "Samsung Galaxy Buds3 Pro", brand: "Samsung", categorySlug: "headphones", categoryName: "Headphones", usd: 249 },
  { title: "Google Pixel Buds Pro 2", brand: "Google", categorySlug: "headphones", categoryName: "Headphones", usd: 299 },
  { title: "JBL Tour One M3", brand: "JBL", categorySlug: "headphones", categoryName: "Headphones", usd: 349 },
  { title: "JBL Live Beam 3", brand: "JBL", categorySlug: "headphones", categoryName: "Headphones", usd: 399 },
  { title: "Nothing Ear (3)", brand: "Nothing", categorySlug: "headphones", categoryName: "Headphones", usd: 449 },
  { title: "Apple Watch Ultra 3", brand: "Apple", categorySlug: "smartwatches", categoryName: "Smartwatches", usd: 249 },
  { title: "Apple Watch Series 11", brand: "Apple", categorySlug: "smartwatches", categoryName: "Smartwatches", usd: 349 },
  { title: "Samsung Galaxy Watch8 Ultra", brand: "Samsung", categorySlug: "smartwatches", categoryName: "Smartwatches", usd: 449 },
  { title: "Samsung Galaxy Watch8 Classic", brand: "Samsung", categorySlug: "smartwatches", categoryName: "Smartwatches", usd: 549 },
  { title: "Google Pixel Watch 4 45mm", brand: "Google", categorySlug: "smartwatches", categoryName: "Smartwatches", usd: 649 },
  { title: "Garmin Fenix 8 AMOLED", brand: "Garmin", categorySlug: "smartwatches", categoryName: "Smartwatches", usd: 749 },
  { title: "Garmin Forerunner 970", brand: "Garmin", categorySlug: "smartwatches", categoryName: "Smartwatches", usd: 249 },
  { title: "Huawei Watch 5 Pro", brand: "Huawei", categorySlug: "smartwatches", categoryName: "Smartwatches", usd: 349 },
  { title: "OnePlus Watch 3", brand: "OnePlus", categorySlug: "smartwatches", categoryName: "Smartwatches", usd: 449 },
  { title: "Amazfit Balance 2", brand: "Amazfit", categorySlug: "smartwatches", categoryName: "Smartwatches", usd: 549 },
  { title: "Dyson V15 Detect Absolute", brand: "Dyson", categorySlug: "home-appliances", categoryName: "Home Appliances", usd: 199 },
  { title: "Dyson Gen5detect", brand: "Dyson", categorySlug: "home-appliances", categoryName: "Home Appliances", usd: 349 },
  { title: "Dyson Airwrap i.d.", brand: "Dyson", categorySlug: "home-appliances", categoryName: "Home Appliances", usd: 499 },
  { title: "Dyson Supersonic Nural", brand: "Dyson", categorySlug: "home-appliances", categoryName: "Home Appliances", usd: 649 },
  { title: "iRobot Roomba Combo 10 Max", brand: "iRobot", categorySlug: "home-appliances", categoryName: "Home Appliances", usd: 799 },
  { title: "Roborock Saros 10R", brand: "Roborock", categorySlug: "home-appliances", categoryName: "Home Appliances", usd: 949 },
  { title: "Roborock Qrevo Curv", brand: "Roborock", categorySlug: "home-appliances", categoryName: "Home Appliances", usd: 1099 },
  { title: "Dreame X50 Ultra", brand: "Dreame", categorySlug: "home-appliances", categoryName: "Home Appliances", usd: 1249 },
  { title: "Ninja DoubleStack XL Air Fryer", brand: "Ninja", categorySlug: "home-appliances", categoryName: "Home Appliances", usd: 1399 },
  { title: "Ninja Creami Deluxe", brand: "Ninja", categorySlug: "home-appliances", categoryName: "Home Appliances", usd: 1549 },
  { title: "Instant Pot Pro Plus", brand: "Instant", categorySlug: "home-appliances", categoryName: "Home Appliances", usd: 199 },
  { title: "Breville Barista Touch Impress", brand: "Breville", categorySlug: "home-appliances", categoryName: "Home Appliances", usd: 349 },
  { title: "De'Longhi La Specialista Maestro", brand: "De'Longhi", categorySlug: "home-appliances", categoryName: "Home Appliances", usd: 499 },
  { title: "Samsung Bespoke AI Refrigerator", brand: "Samsung", categorySlug: "home-appliances", categoryName: "Home Appliances", usd: 649 },
  { title: "LG InstaView French Door Refrigerator", brand: "LG", categorySlug: "home-appliances", categoryName: "Home Appliances", usd: 799 },
  { title: "Samsung Bespoke AI Laundry Combo", brand: "Samsung", categorySlug: "home-appliances", categoryName: "Home Appliances", usd: 949 },
  { title: "LG WashTower", brand: "LG", categorySlug: "home-appliances", categoryName: "Home Appliances", usd: 1099 },
  { title: "Philips 5400 LatteGo", brand: "Philips", categorySlug: "home-appliances", categoryName: "Home Appliances", usd: 1249 },
  { title: "KitchenAid Artisan Stand Mixer", brand: "KitchenAid", categorySlug: "home-appliances", categoryName: "Home Appliances", usd: 1399 },
  { title: "Nespresso Vertuo Creatista", brand: "Nespresso", categorySlug: "home-appliances", categoryName: "Home Appliances", usd: 1549 }
];

const CATEGORY_IMAGES: Record<string, string[]> = {
  phones: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900&h=900&fit=crop&q=85',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=900&h=900&fit=crop&q=85',
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=900&h=900&fit=crop&q=85'
  ],
  laptops: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&h=900&fit=crop&q=85',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900&h=900&fit=crop&q=85',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=900&h=900&fit=crop&q=85'
  ],
  'pc-components': [
    'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=900&h=900&fit=crop&q=85',
    'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=900&h=900&fit=crop&q=85',
    'https://images.unsplash.com/photo-1562976540-1502c2145186?w=900&h=900&fit=crop&q=85'
  ],
  gaming: [
    'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?w=900&h=900&fit=crop&q=85',
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=900&h=900&fit=crop&q=85',
    'https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=900&h=900&fit=crop&q=85'
  ],
  tvs: [
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=900&h=900&fit=crop&q=85',
    'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=900&h=900&fit=crop&q=85',
    'https://images.unsplash.com/photo-1571415060716-baff5f717c37?w=900&h=900&fit=crop&q=85'
  ],
  headphones: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&h=900&fit=crop&q=85',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=900&h=900&fit=crop&q=85',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900&h=900&fit=crop&q=85'
  ],
  smartwatches: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&h=900&fit=crop&q=85',
    'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=900&h=900&fit=crop&q=85',
    'https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=900&h=900&fit=crop&q=85'
  ],
  'home-appliances': [
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=900&h=900&fit=crop&q=85',
    'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=900&h=900&fit=crop&q=85',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&h=900&fit=crop&q=85'
  ]
};

const RATES: Record<CountryCode, { rate: number; currency: string }> = {
  ae: { rate: 3.67, currency: 'AED' },
  us: { rate: 1, currency: 'USD' },
  sa: { rate: 3.75, currency: 'SAR' },
  uk: { rate: 0.79, currency: 'GBP' },
  ca: { rate: 1.36, currency: 'CAD' },
  au: { rate: 1.52, currency: 'AUD' },
};

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function imageFor(seed: LaunchSeed, index: number) {
  const images = CATEGORY_IMAGES[seed.categorySlug] || CATEGORY_IMAGES.phones;
  return images[index % images.length];
}

function descriptionFor(seed: LaunchSeed) {
  const descriptors: Record<string, string> = {
    phones: 'Popular smartphone included in the CatchThePrice launch catalog for shoppers comparing current flagship and high-interest mobile devices.',
    laptops: 'High-interest laptop included in the launch catalog for gaming, work and creator-focused price comparison.',
    'pc-components': 'Popular PC component included for shoppers tracking enthusiast, gaming and upgrade pricing.',
    gaming: 'Popular gaming hardware included for console and handheld shoppers comparing launch-market pricing.',
    tvs: 'High-interest television model included for shoppers comparing premium and mainstream display options.',
    headphones: 'Popular audio product included for shoppers comparing wireless, ANC and premium listening options.',
    smartwatches: 'Popular wearable included for shoppers comparing health, fitness and smart features.',
    'home-appliances': 'Popular home appliance included for shoppers comparing high-interest household technology.'
  };
  return `${seed.title}. ${descriptors[seed.categorySlug] || 'Popular product included in the CatchThePrice launch catalog.'}`;
}

function specsFor(seed: LaunchSeed): Record<string, string> {
  if (seed.categorySlug === 'phones') return { Segment: 'Smartphone', Brand: seed.brand, Focus: 'Camera, performance, battery and display' };
  if (seed.categorySlug === 'laptops') return { Segment: 'Laptop', Brand: seed.brand, Focus: 'Performance, display, thermals and portability' };
  if (seed.categorySlug === 'pc-components') return { Segment: 'PC Component', Brand: seed.brand, Focus: 'Gaming and creator performance' };
  if (seed.categorySlug === 'gaming') return { Segment: 'Gaming Hardware', Brand: seed.brand, Focus: 'Games, performance and ecosystem' };
  if (seed.categorySlug === 'tvs') return { Segment: 'Television', Brand: seed.brand, Focus: 'Picture quality, HDR and gaming features' };
  if (seed.categorySlug === 'headphones') return { Segment: 'Audio', Brand: seed.brand, Focus: 'Sound quality, ANC and battery life' };
  if (seed.categorySlug === 'smartwatches') return { Segment: 'Wearable', Brand: seed.brand, Focus: 'Fitness, health and smart features' };
  return { Segment: 'Home Appliance', Brand: seed.brand, Focus: 'Features, efficiency and convenience' };
}

function priceHistory(price: number): PricePoint[] {
  const multipliers = [1.16, 1.13, 1.11, 1.08, 1.05, 1.03, 1];
  return multipliers.map((m, index) => ({
    date: new Date(Date.now() - (multipliers.length - 1 - index) * 14 * 86400000).toISOString(),
    price: Math.round(price * m),
    merchantName: 'Launch catalog'
  }));
}

export function getLaunchCatalog(country: CountryCode): Product[] {
  const fx = RATES[country] || RATES.ae;
  return SEEDS.map((seed, index) => {
    const current = Math.max(1, Math.round(seed.usd * fx.rate));
    const original = Math.round(current * (1.08 + (index % 5) * 0.025));
    const slug = slugify(seed.title);
    const image = imageFor(seed, index);
    const history = priceHistory(current);
    const offer: Offer = {
      id: `launch-offer-${index + 1}-${country}`,
      productId: `launch-${index + 1}`,
      merchantId: 'launch-market',
      merchantName: 'Market preview',
      merchantLogo: '',
      merchantRating: 0,
      price: current,
      originalPrice: original,
      currency: fx.currency,
      inStock: true,
      shippingInfo: 'Retailer availability will be connected to live feeds',
      condition: 'New',
      url: `/${country}/product/${slug}`,
      lastCheckedAt: 'Launch catalog preview',
      isBestPrice: true,
    };

    return {
      id: `launch-${index + 1}`,
      title: seed.title,
      slug,
      brand: seed.brand,
      categoryId: `cat-${seed.categorySlug}`,
      categorySlug: seed.categorySlug,
      categoryName: seed.categoryName,
      description: descriptionFor(seed),
      imageUrl: image,
      gallery: [image],
      specs: specsFor(seed),
      currentBestPrice: current,
      originalPrice: original,
      currency: fx.currency,
      country,
      dealScore: 78 + (index % 19),
      isTrending: index < 48 || index % 7 === 0,
      isTopDeal: index < 30 || index % 9 === 0,
      offersCount: 1,
      bestMerchantName: 'Market preview',
      priceLastChecked: 'Launch catalog preview',
      priceStats: {
        currentPrice: current,
        lowestPrice: current,
        highestPrice: original,
        average30Days: Math.round((current + original) / 2),
        average90Days: Math.round(original * 0.98),
      },
      priceHistory: history,
      offers: [offer],
      aiSummary: {
        verdict: 'Popular launch-catalog product. Live retailer comparison will replace preview pricing as approved feeds are connected.',
        pros: ['High shopper interest', 'Suitable for price tracking', 'Included in UAE and US launch catalog'],
        cons: ['Preview pricing is not a live retailer quote'],
        bestTimeToBuy: false,
      },
    };
  });
}
