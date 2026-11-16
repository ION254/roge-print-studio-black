import { Tag, Package, Leaf, Truck } from 'lucide-react';
import embroidery from '@/assets/showcase-embroidery.jpg';

const features = [
  { icon: Tag, title: 'Custom neck labels', text: 'Replace generic tags with your own brand label.' },
  { icon: Package, title: 'Branded packaging', text: 'Unboxing that looks like your brand, not ours.' },
  { icon: Leaf, title: 'Eco-friendly inks', text: 'Water-based DTG inks and responsibly made blanks.' },
  { icon: Truck, title: 'Delivered to the door', text: 'We pack and ship straight to you or your customer.' },
];

const BrandingFeatures = () => (
  <section className="bg-primary text-primary-foreground">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <span className="text-xs uppercase tracking-[0.2em] opacity-70">White-label ready</span>
        <h2 className="text-4xl sm:text-5xl font-black mt-3">Build a brand, not just a print.</h2>
        <div className="grid sm:grid-cols-2 gap-8 mt-10">
          {features.map(({ icon: Icon, title, text }) => (
            <div key={title}>
              <Icon className="h-6 w-6 mb-3" />
              <h3 className="font-bold text-lg">{title}</h3>
              <p className="text-sm opacity-70 mt-1">{text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden aspect-[4/3]">
        <img src={embroidery} alt="Embroidery detail" loading="lazy" className="w-full h-full object-cover" />
      </div>
    </div>
  </section>
);

export default BrandingFeatures;
