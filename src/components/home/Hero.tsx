
import React from 'react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <div className="relative bg-gray-800 text-white min-h-[70vh] flex items-center justify-center">
      {/* Placeholder for background image/video. Current: dark gray solid color */}
      {/* You can replace this div with an img tag or a video element */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40" 
        style={{ backgroundImage: "url('https://placehold.co/1920x1080/212121/e0e0e0?text=Your+Awesome+Designs')" }}
      ></div>
      <div className="relative z-10 text-center p-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
          Custom Prints, <span className="block">Uniquely Yours.</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl mb-10 max-w-2xl mx-auto">
          High-quality apparel and promotional items, personalized with your design. Fast, reliable, and affordable.
        </p>
        <Button size="lg" className="text-lg px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground">
          Start Your Project
        </Button>
      </div>
    </div>
  );
};

export default Hero;

