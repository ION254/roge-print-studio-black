
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, description, imageUrl, link }) => {
  return (
    <div className="bg-card rounded-lg shadow-lg overflow-hidden flex flex-col">
      <img src={imageUrl} alt={title} className="w-full h-64 object-cover" />
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-2xl font-semibold text-foreground mb-3">{title}</h3>
        <p className="text-muted-foreground mb-4 flex-grow">{description}</p>
        <Button asChild variant="outline" className="mt-auto w-full group hover:bg-primary hover:text-primary-foreground transition-colors">
          <a href={link}>
            View Details <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;

