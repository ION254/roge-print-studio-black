import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Save, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

export const PLACEMENTS = [
  { id: 'front', label: 'Front' },
  { id: 'back', label: 'Back' },
  { id: 'left-sleeve', label: 'Left sleeve' },
  { id: 'right-sleeve', label: 'Right sleeve' },
  { id: 'neck-label', label: 'Neck label' },
] as const;
export type Placement = typeof PLACEMENTS[number]['id'];

interface Props {
  productName: string;
  placement: Placement;
  designedPlacements: Placement[];
  onPlacementChange: (p: Placement) => void;
  onSave: () => void;
  onOrder: () => void;
  priceLabel: string;
}

export const StudioTopBar: React.FC<Props> = ({ productName, placement, designedPlacements, onPlacementChange, onSave, onOrder, priceLabel }) => (
  <div className="border-b border-border bg-card px-4 py-3 flex flex-wrap items-center gap-3 justify-between">
    <div className="flex items-center gap-3 min-w-0">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/"><ArrowLeft className="h-4 w-4 mr-1" />Catalog</Link>
      </Button>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Design studio</p>
        <h1 className="font-bold text-foreground truncate">{productName}</h1>
      </div>
    </div>
    <div className="flex items-center rounded-full border border-border p-1 bg-muted/40 overflow-x-auto">
      {PLACEMENTS.map((p) => (
        <button
          key={p.id}
          onClick={() => onPlacementChange(p.id)}
          className={cn(
            'relative px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors',
            placement === p.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
          )}
        >
          {p.label}
          {designedPlacements.includes(p.id) && (
            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-accent" />
          )}
        </button>
      ))}
    </div>
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onSave}><Save className="h-4 w-4 mr-1" />Save</Button>
      <Button size="sm" onClick={onOrder}><ShoppingBag className="h-4 w-4 mr-1" />Order · {priceLabel}</Button>
    </div>
  </div>
);
