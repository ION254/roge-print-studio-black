
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import ProductShowcase from '@/components/home/ProductShowcase';
import HowItWorks from '@/components/home/HowItWorks';

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        <ProductShowcase />
        <HowItWorks />
        {/* Placeholder for other sections like Testimonials, About Us, etc. */}
      </main>
      <Footer />
    </div>
  );
};

export default Index;

