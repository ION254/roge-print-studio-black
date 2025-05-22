
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const collectionItems = [
  { 
    id: 1, 
    name: "Roge Signature Tee", 
    imageUrl: "https://placehold.co/600x400/1a202c/ffffff?text=Signature+Tee", 
    description: "Our classic tee, embodying minimalist style and comfort. Made with 100% organic cotton.",
    price: "$29.99"
  },
  { 
    id: 2, 
    name: "Roge Artisan Hoodie", 
    imageUrl: "https://placehold.co/600x400/2d3748/ffffff?text=Artisan+Hoodie", 
    description: "A premium hoodie featuring a unique handcrafted design. Perfect for a stylish, relaxed look.",
    price: "$59.99"
  },
  { 
    id: 3, 
    name: "The Innovator Cap", 
    imageUrl: "https://placehold.co/600x400/4a5568/ffffff?text=Innovator+Cap", 
    description: "Sleek and modern, this cap is designed for the forward-thinkers. Adjustable fit.",
    price: "$24.99"
  },
   { 
    id: 4, 
    name: "Urban Explorer Jacket", 
    imageUrl: "https://placehold.co/600x400/718096/ffffff?text=Explorer+Jacket", 
    description: "Lightweight and versatile jacket for all your urban adventures. Water-resistant.",
    price: "$89.99"
  },
  { 
    id: 5, 
    name: "Canvas Creator Tote", 
    imageUrl: "https://placehold.co/600x400/a0aec0/000000?text=Creator+Tote", 
    description: "Durable canvas tote bag, spacious enough for all your creative essentials.",
    price: "$34.99"
  },
  { 
    id: 6, 
    name: "Visionary Varsity Jacket", 
    imageUrl: "https://placehold.co/600x400/cbd5e0/000000?text=Varsity+Jacket", 
    description: "A modern take on the classic varsity jacket, for those who lead with vision.",
    price: "$129.99"
  },
];

const CollectionPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-primary mb-4">
            Roge Exclusive Collection
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover unique pieces designed by Roge, blending creativity with quality for the modern individual.
          </p>
        </header>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {collectionItems.map(item => (
            <Card key={item.id} className="overflow-hidden flex flex-col">
              <div className="aspect-w-16 aspect-h-9">
                <img src={item.imageUrl} alt={item.name} className="w-full h-64 object-cover"/>
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="text-sm mb-3">{item.description}</CardDescription>
                <p className="font-semibold text-lg text-primary mb-4">{item.price}</p>
              </CardContent>
              <div className="p-6 pt-0">
                 <Button className="w-full" asChild>
                  {/* This would ideally link to a product detail page */}
                  <Link to={`/designer?template=${item.name}`}>Customize & Buy</Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CollectionPage;
