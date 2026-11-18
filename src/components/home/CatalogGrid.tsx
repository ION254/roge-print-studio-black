import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CATALOG, CATALOG_CATEGORIES } from '@/data/catalog';

const CatalogGrid = () => {
  const [active, setActive] = useState<string>('All');
  const items = active === 'All' ? CATALOG : CATALOG.filter((p) => p.category === active);

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
        <div>
          <h2 className="text-4xl font-black">Shop the catalog</h2>
          <p className="text-muted-foreground mt-2">{CATALOG.length} premium blanks, ready for your artwork. Order from 1 piece.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['All', ...CATALOG_CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`text-sm border rounded-full px-4 py-1.5 transition-colors ${active === c ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10">
        {items.map((p) => (
          <Link to={`/designer?product=${p.id}`} key={p.id} className="group">
            <div className="aspect-[4/5] rounded-xl overflow-hidden bg-muted relative">
              <img src={p.image} alt={p.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
};

export default CatalogGrid;
