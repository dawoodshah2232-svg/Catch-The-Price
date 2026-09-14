import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'cat-phones',
    name: 'Phones',
    slug: 'phones',
    icon: 'Smartphone',
    description: 'Compare best prices on flagship smartphones, foldables, and budget champions.',
    productCount: 42,
  },
  {
    id: 'cat-laptops',
    name: 'Laptops',
    slug: 'laptops',
    icon: 'Laptop',
    description: 'Track price drops on MacBooks, ultrabooks, creator laptops, and workstations.',
    productCount: 38,
  },
  {
    id: 'cat-gaming',
    name: 'Gaming',
    slug: 'gaming',
    icon: 'Gamepad2',
    description: 'Discover deals on PS5, Xbox Series X, Nintendo Switch, graphics cards, and consoles.',
    productCount: 29,
  },
  {
    id: 'cat-tvs',
    name: 'TVs',
    slug: 'tvs',
    icon: 'Tv',
    description: 'Unbeatable price tracking for OLED, QLED, 4K HDR displays, and home theater setups.',
    productCount: 24,
  },
  {
    id: 'cat-headphones',
    name: 'Headphones',
    slug: 'headphones',
    icon: 'Headphones',
    description: 'Noise-cancelling wireless headphones, audiophile earbuds, and portable audio deals.',
    productCount: 35,
  },
  {
    id: 'cat-smartwatches',
    name: 'Smartwatches',
    slug: 'smartwatches',
    icon: 'Watch',
    description: 'Track deals on Apple Watch, Samsung Galaxy Watch, Garmin, and fitness trackers.',
    productCount: 21,
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}
