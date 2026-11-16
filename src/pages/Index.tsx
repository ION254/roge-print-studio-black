import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/home/Hero';
import CatalogGrid from '@/components/home/CatalogGrid';
import BrandingFeatures from '@/components/home/BrandingFeatures';
import FulfillmentSteps from '@/components/home/FulfillmentSteps';
import FaqSection from '@/components/home/FaqSection';

const Index = () => {
  const location = useLocation();
  useEffect(() => {
    const scrollTo = location.state?.scrollTo;
    if (scrollTo) {
      setTimeout(() => {
        document.querySelector(scrollTo)?.scrollIntoView({ behavior: 'smooth' });
        window.history.replaceState({}, document.title);
      }, 100);
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow">
        <Hero />
        <div id="products"><CatalogGrid /></div>
        <div id="branding"><BrandingFeatures /></div>
        <div id="how-it-works"><FulfillmentSteps /></div>
        <div id="faq"><FaqSection /></div>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
