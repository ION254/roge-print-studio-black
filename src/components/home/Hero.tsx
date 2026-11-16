import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import hero from '@/assets/custom-hoodie-mockup.jpg';
import tee from '@/assets/custom-tshirt-mockup.jpg';

const Hero = () => (
  <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
    <div className="grid lg:grid-cols-12 gap-6 items-stretch">
      <div className="lg:col-span-5 flex flex-col justify-center py-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-5">Print on demand · Made for creators</span>
        <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black leading-[0.95] text-foreground">
          Dream it.<br />Make it.<br />Wear it.
        </h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-md">
          Design premium heavyweight apparel and merch in minutes. We print, pack and deliver — starting from a single piece.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="rounded-full px-8">
            <Link to="/designer">Start designing <ArrowRight className="ml-1 h-4 w-4" /></Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-8">
            <a href="#products">Browse catalog</a>
          </Button>
        </div>
        <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-border pt-6 max-w-md">
          {[['1 pc', 'Minimum order'], ['250+', 'GSM fabrics'], ['3–7d', 'Production']].map(([v, l]) => (
            <div key={l}><dt className="font-display text-2xl font-extrabold">{v}</dt><dd className="text-xs text-muted-foreground mt-1">{l}</dd></div>
          ))}
        </dl>
      </div>
      <div className="lg:col-span-7 grid grid-cols-5 gap-4 min-h-[420px]">
        <div className="col-span-3 rounded-2xl overflow-hidden bg-muted relative">
          <img src={hero} alt="Heavyweight custom hoodie" className="absolute inset-0 w-full h-full object-cover" />
          <span className="absolute bottom-4 left-4 bg-background text-foreground text-xs font-semibold px-3 py-1.5 rounded-full">Heavyweight Hoodie · 430 GSM</span>
        </div>
        <div className="col-span-2 grid grid-rows-2 gap-4">
          <div className="rounded-2xl overflow-hidden bg-muted relative">
            <img src={tee} alt="Oversized custom tee" className="absolute inset-0 w-full h-full object-cover" />
          </div>
          <div className="rounded-2xl bg-primary text-primary-foreground p-6 flex flex-col justify-between">
            <p className="text-sm opacity-80">Your brand, your label</p>
            <p className="font-display text-2xl font-extrabold leading-tight">Custom neck tags & branded packaging</p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
