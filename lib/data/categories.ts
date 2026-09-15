import { Category } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'cat-phones',
    name: 'Phones',
    slug: 'phones',
    icon: 'Smartphone',
    description: 'Compare flagship smartphones, foldables, gaming phones and value-focused models.',
  },
  {
    id: 'cat-laptops',
    name: 'Laptops',
    slug: 'laptops',
    icon: 'Laptop',
    description: 'Compare gaming laptops, MacBooks, ultrabooks, creator laptops and workstations.',
  },
  {
    id: 'cat-gaming',
    name: 'Gaming',
    slug: 'gaming',
    icon: 'Gamepad2',
    description: 'Discover consoles, handhelds, gaming accessories and complete gaming setups.',
  },
  {
    id: 'cat-pc-components',
    name: 'PC Components',
    slug: 'pc-components',
    icon: 'Cpu',
    description: 'Compare GPUs, graphics cards, CPUs, processors and other core PC hardware.',
  },
  {
    id: 'cat-tvs',
    name: 'TVs',
    slug: 'tvs',
    icon: 'Tv',
    description: 'Compare OLED, QLED, Mini-LED, 4K and gaming-focused televisions.',
  },
  {
    id: 'cat-headphones',
    name: 'Headphones',
    slug: 'headphones',
    icon: 'Headphones',
    description: 'Compare noise-cancelling headphones, gaming headsets, earbuds and portable audio.',
  },
  {
    id: 'cat-smartwatches',
    name: 'Smartwatches',
    slug: 'smartwatches',
    icon: 'Watch',
    description: 'Compare Apple Watch, Galaxy Watch, Garmin and other wearable devices.',
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
}
