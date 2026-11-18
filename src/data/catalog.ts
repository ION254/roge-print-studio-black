import tee from '@/assets/template-tshirt-basic.jpg';
import vneck from '@/assets/template-tshirt-vneck.jpg';
import longsleeve from '@/assets/template-tshirt-longsleeve.jpg';
import hoodie from '@/assets/template-hoodie-classic.jpg';
import zip from '@/assets/template-hoodie-zip.jpg';
import crewneck from '@/assets/template-crewneck.jpg';
import sweatpants from '@/assets/template-sweatpants.jpg';
import shorts from '@/assets/template-shorts.jpg';
import jacket from '@/assets/template-jacket.jpg';
import cap from '@/assets/template-cap-baseball.jpg';
import bottle from '@/assets/template-water-bottle.jpg';
import bag from '@/assets/template-packaging-bag.jpg';
import card from '@/assets/template-business-card.jpg';

export type CatalogCategory = 'T-Shirts' | 'Hoodies & Sweats' | 'Bottoms' | 'Outerwear' | 'Headwear' | 'Merch';

export interface CatalogItem {
  id: string;
  name: string;
  category: CatalogCategory;
  spec: string;
  price: number; // KSh per piece, starting price
  productType: string;
  image: string;
  tag?: string;
}

export const CATALOG_CATEGORIES: CatalogCategory[] = ['T-Shirts', 'Hoodies & Sweats', 'Bottoms', 'Outerwear', 'Headwear', 'Merch'];

export const CATALOG: CatalogItem[] = [
  // T-Shirts & tops
  { id: 'tee-ultra-heavy-boxy', name: 'Ultra-Heavyweight Boxy Tee', category: 'T-Shirts', spec: '300 GSM · Boxy drop shoulder', price: 1200, productType: 'tee-heavy', image: tee, tag: 'Best seller' },
  { id: 'tee-acid-wash', name: 'Vintage Acid-Wash Tee', category: 'T-Shirts', spec: '240 GSM · Washed finish', price: 1300, productType: 'tee-heavy', image: tee },
  { id: 'tee-oversized', name: 'Oversized Streetwear Tee', category: 'T-Shirts', spec: '260 GSM · Relaxed fit', price: 1100, productType: 't-shirt', image: tee },
  { id: 'tee-classic-crew', name: 'Classic Crewneck Tee', category: 'T-Shirts', spec: '200 GSM · Regular fit', price: 1000, productType: 't-shirt', image: tee },
  { id: 'tee-vneck', name: 'V-Neck Tee', category: 'T-Shirts', spec: '190 GSM · Slim fit', price: 1000, productType: 't-shirt', image: vneck },
  { id: 'tee-boxy-longsleeve', name: 'Boxy Long Sleeve Tee', category: 'T-Shirts', spec: '240 GSM · Ribbed cuffs', price: 1300, productType: 'long-sleeve', image: longsleeve },
  { id: 'tee-baby', name: 'Cropped Baby Tee', category: 'T-Shirts', spec: '210 GSM · Stretch cotton', price: 1000, productType: 't-shirt', image: tee },
  { id: 'tank-ribbed', name: 'Ribbed Tank Top', category: 'T-Shirts', spec: '210 GSM · Fitted', price: 900, productType: 'tank-top', image: tee },
  // Hoodies & sweats
  { id: 'hoodie-heavy-boxy', name: 'Heavyweight Boxy Hoodie', category: 'Hoodies & Sweats', spec: '450 GSM · Double-layer hood', price: 2800, productType: 'hoodie', image: hoodie, tag: 'New' },
  { id: 'hoodie-full-zip', name: 'Full-Zip Fleece Hoodie', category: 'Hoodies & Sweats', spec: '370 GSM · Metal zipper', price: 3000, productType: 'hoodie', image: zip },
  { id: 'crewneck-heavy', name: 'Heavyweight Crewneck Sweatshirt', category: 'Hoodies & Sweats', spec: '400 GSM · Drop shoulder', price: 2500, productType: 'sweatshirt', image: crewneck },
  { id: 'quarter-zip', name: 'Quarter-Zip Fleece Pullover', category: 'Hoodies & Sweats', spec: '350 GSM · Stand collar', price: 2700, productType: 'sweatshirt', image: crewneck },
  // Bottoms
  { id: 'sweatpants-straight', name: 'Heavyweight Straight-Leg Sweatpants', category: 'Bottoms', spec: '400 GSM · Open hem', price: 2400, productType: 'sweatpants', image: sweatpants },
  { id: 'joggers-cuffed', name: 'Cuffed Fleece Joggers', category: 'Bottoms', spec: '380 GSM · Elastic cuff', price: 2300, productType: 'sweatpants', image: sweatpants },
  { id: 'joggers-cargo', name: 'Cargo Fleece Joggers', category: 'Bottoms', spec: '380 GSM · Side pockets', price: 2600, productType: 'sweatpants', image: sweatpants },
  { id: 'shorts-terry', name: 'French Terry Sweatshorts', category: 'Bottoms', spec: '320 GSM · Drawstring', price: 1600, productType: 'shorts', image: shorts },
  // Outerwear
  { id: 'jacket-coach', name: 'Streetwear Coach Jacket', category: 'Outerwear', spec: 'Nylon shell · Snap buttons', price: 3800, productType: 'jacket', image: jacket },
  { id: 'jacket-bomber', name: 'Padded Bomber Jacket', category: 'Outerwear', spec: 'Satin finish · Rib collar', price: 4500, productType: 'jacket', image: jacket },
  { id: 'jacket-windbreaker', name: 'Lightweight Windbreaker', category: 'Outerwear', spec: 'Hooded · Packable', price: 3500, productType: 'jacket', image: jacket },
  // Headwear
  { id: 'cap-dad', name: '6-Panel Dad Cap', category: 'Headwear', spec: 'Washed twill · Buckle strap', price: 900, productType: 'cap', image: cap },
  { id: 'cap-trucker', name: '5-Panel Foam Trucker Hat', category: 'Headwear', spec: 'Mesh back · Snapback', price: 1000, productType: 'cap', image: cap },
  { id: 'bucket-hat', name: 'Cotton Twill Bucket Hat', category: 'Headwear', spec: 'Stitched brim', price: 1100, productType: 'cap', image: cap },
  { id: 'beanie-cuffed', name: 'Cuffed Knit Beanie', category: 'Headwear', spec: 'Ribbed knit · Embroidery', price: 800, productType: 'cap', image: cap },
  // Merch
  { id: 'merch-bottle', name: 'Steel Water Bottle', category: 'Merch', spec: '750 ml · Full wrap', price: 1200, productType: 'water-bottle', image: bottle },
  { id: 'merch-bag', name: 'Branded Packaging Bag', category: 'Merch', spec: 'Sets of 5', price: 800, productType: 'packaging-bag', image: bag },
  { id: 'merch-card', name: 'Business Cards', category: 'Merch', spec: 'Packs of 20', price: 100, productType: 'business-card', image: card },
];

export const getCatalogItem = (id: string | null) => CATALOG.find((c) => c.id === id) || null;
