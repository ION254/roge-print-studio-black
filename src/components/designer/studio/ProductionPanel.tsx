import React from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { AlignCenterHorizontal, AlignCenterVertical, FlipHorizontal, FlipVertical } from 'lucide-react';
import { formatKsh } from '@/lib/pricing';
import { PLACEMENTS, Placement } from './StudioTopBar';

export const PRINT_METHODS = [
  { id: 'DTG', name: 'DTG', desc: 'Soft feel, photo-quality gradients' },
  { id: 'DTF', name: 'DTF', desc: 'Bold, crisp colours, slightly raised' },
  { id: 'Embroidery', name: 'Embroidery', desc: 'Stitched thread for logos and text' },
];

export const COLORWAYS = [
  { name: 'White', hex: '#ffffff' },
  { name: 'Washed Black', hex: '#1f1f1f' },
  { name: 'Bone', hex: '#e8e0d0' },
  { name: 'Heather Grey', hex: '#9ca3af' },
  { name: 'Forest', hex: '#1f3d2b' },
  { name: 'Sage', hex: '#9caf88' },
  { name: 'Navy', hex: '#1e2a44' },
  { name: 'Maroon', hex: '#6b1e2a' },
];

export const EXTRA_PLACEMENT_FEE = 200;

interface Props {
  fabricCanvas: FabricCanvas | null;
  printingMethod: string;
  onPrintingMethodChange: (m: string) => void;
  mockupColor: string;
  onMockupColorChange: (c: string) => void;
  designedPlacements: Placement[];
  basePrice: number;
  methodFee: number;
}

export const ProductionPanel: React.FC<Props> = ({
  fabricCanvas, printingMethod, onPrintingMethodChange, mockupColor, onMockupColorChange,
  designedPlacements, basePrice, methodFee,
}) => {
  const transform = (fn: (o: any) => void) => {
    const o = fabricCanvas?.getActiveObject();
    if (!o || !fabricCanvas) return;
    fn(o);
    o.setCoords();
    fabricCanvas.requestRenderAll();
  };
  const extras = Math.max(0, designedPlacements.length - 1);
  const total = basePrice + methodFee + extras * EXTRA_PLACEMENT_FEE;

  return (
    <div className="space-y-5">
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Print method</h3>
        <div className="space-y-2">
          {PRINT_METHODS.map((m) => (
            <button key={m.id} onClick={() => onPrintingMethodChange(m.id)}
              className={cn('w-full text-left rounded-lg border p-3 transition-colors',
                printingMethod === m.id ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50')}>
              <p className="text-sm font-medium text-foreground">{m.name}</p>
              <p className="text-xs text-muted-foreground">{m.desc}</p>
            </button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Garment colour</h3>
        <div className="flex flex-wrap gap-2">
          {COLORWAYS.map((c) => (
            <button key={c.hex} title={c.name} onClick={() => onMockupColorChange(c.hex)}
              style={{ backgroundColor: c.hex }}
              className={cn('h-8 w-8 rounded-full border border-border transition-transform',
                mockupColor.toLowerCase() === c.hex ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-110' : 'hover:scale-105')} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Align artwork</h3>
        <div className="grid grid-cols-4 gap-2">
          <Button variant="outline" size="icon" title="Centre horizontally" onClick={() => transform((o) => fabricCanvas?.centerObjectH(o))}><AlignCenterHorizontal className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" title="Centre vertically" onClick={() => transform((o) => fabricCanvas?.centerObjectV(o))}><AlignCenterVertical className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" title="Flip horizontally" onClick={() => transform((o) => o.set('flipX', !o.flipX))}><FlipHorizontal className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" title="Flip vertically" onClick={() => transform((o) => o.set('flipY', !o.flipY))}><FlipVertical className="h-4 w-4" /></Button>
        </div>
      </section>

      <section className="rounded-lg border border-border p-3 space-y-1.5 text-sm">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Price per piece</h3>
        <div className="flex justify-between"><span className="text-muted-foreground">Blank</span><span>{formatKsh(basePrice)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">{printingMethod} print</span><span>{formatKsh(methodFee)}</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">Extra sides ({extras})</span><span>{formatKsh(extras * EXTRA_PLACEMENT_FEE)}</span></div>
        <div className="flex justify-between font-semibold border-t border-border pt-1.5"><span>Total</span><span>{formatKsh(total)}</span></div>
        <p className="text-xs text-muted-foreground pt-1">
          Designed: {designedPlacements.length ? designedPlacements.map((p) => PLACEMENTS.find((x) => x.id === p)?.label).join(', ') : 'none yet'}
        </p>
      </section>
    </div>
  );
};
