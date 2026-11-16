import { Link } from 'react-router-dom';
import tee from '@/assets/template-tshirt-basic.jpg';
import hoodie from '@/assets/template-hoodie-classic.jpg';
import zip from '@/assets/template-hoodie-zip.jpg';
import longsleeve from '@/assets/template-tshirt-longsleeve.jpg';
import cap from '@/assets/template-cap-baseball.jpg';
import bottle from '@/assets/template-water-bottle.jpg';
import bag from '@/assets/template-packaging-bag.jpg';
import card from '@/assets/template-business-card.jpg';

const categories = ['T-Shirts', 'Hoodies', 'Headwear', 'Merch', 'Print'];

const products = [
  { name: 'Essential Cotton Tee', spec: '260 GSM · Regular fit', price: 1000, img: tee, tag: 'Best seller' },
  { name: 'Heavyweight Hoodie', spec: '430 GSM · Oversized', price: 2800, img: hoodie, tag: 'New' },
  { name: 'Zip-Up Fleece Hoodie', spec: '350 GSM · Brushed fleece', price: 3000, img: zip },
  { name: 'Long Sleeve Tee', spec: '240 GSM · Boxy fit', price: 1300, img: longsleeve },
  { name: 'Classic Baseball Cap', spec: 'Cotton twill · Embroidery', price: 900, img: cap },
  { name: 'Steel Water Bottle', spec: '750 ml · Full wrap', price: 1200, img: bottle },
  { name: 'Branded Packaging Bag', spec: 'Sets of 5', price: 600, img: bag },
  { name: 'Business Cards', spec: 'Packs of 20', price: 500, img: card },
];

const CatalogGrid = () => (
  <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
      <div>
        <h2 className="text-4xl font-black">Shop the catalog</h2>
        <p className="text-muted-foreground mt-2">Premium blanks, ready for your artwork.</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => (
          <span key={c} className="text-sm border border-border rounded-full px-4 py-1.5 text-muted-foreground">{c}</span>
        ))}
      </div>
    </div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
      {products.map((p) => (
        <Link to="/designer" key={p.name} className="group">
          <div className="aspect-[4/5] rounded-xl overflow-hidden bg-muted relative">
            <img src={p.img} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            {p.tag && <span className="absolute top-3 left-3 bg-background text-foreground text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full">{p.tag}</span>}
            <span className="absolute inset-x-3 bottom-3 text-center bg-primary text-primary-foreground text-sm font-semibold rounded-full py-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">Customize</span>
          </div>
          <h3 className="mt-3 font-semibold text-base" style={{ fontFamily: 'Manrope' }}>{p.name}</h3>
          <p className="text-sm text-muted-foreground">{p.spec}</p>
          <p className="text-sm font-semibold mt-1">From KSh {p.price.toLocaleString()}</p>
        </Link>
      ))}
    </div>
  </section>
);

export default CatalogGrid;
