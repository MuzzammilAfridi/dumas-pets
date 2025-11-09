import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import heroDog from "@/assets/hero-dog.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [heroDog, heroDog, heroDog]; // Using same image for slideshow demo

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  const categories = [{
    title: "PET FOOD",
    image: product1
  }, {
    title: "TREATS",
    image: product2
  }, {
    title: "CAKES",
    image: product3
  }];
  return <section className="bg-primary relative overflow-hidden" style={{
    height: "calc(100vh - 4rem)"
  }}>
      <div className="container mx-auto px-4 h-full">
        <div className="grid lg:grid-cols-2 gap-8 h-full items-center py-12">
          <div className="flex flex-col justify-center gap-6 z-10">
            <div className="space-y-4">
              <div className="inline-block">
                <svg width="80" height="60" viewBox="0 0 80 60" className="text-primary-foreground">
                  <path d="M15 30 Q15 15, 25 15 Q35 15, 35 25 L35 45 Q35 55, 25 55 Q15 55, 15 40 Z" fill="currentColor" />
                  <path d="M45 30 Q45 15, 55 15 Q65 15, 65 25 L65 45 Q65 55, 55 55 Q45 55, 45 40 Z" fill="currentColor" />
                </svg>
              </div>
              <h1 className="text-6xl lg:text-7xl font-black text-primary-foreground leading-tight">
                dumas
              </h1>
              <p className="text-xl lg:text-2xl text-primary-foreground/90 font-medium">
                Bakes 'N' Meals for Pets
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 max-w-md">
              {categories.map((cat, idx) => <div key={idx} className="bg-background rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105">
                  <img src={cat.image} alt={cat.title} className="w-full h-40 object-cover rounded-xl mb-2.5 " />
                  <p className="text-xs font-bold text-center text-foreground">{cat.title}</p>
                </div>)}
            </div>

            <div className="flex gap-4">
              <Button variant="hero" size="xl">
                ORDER NOW
              </Button>
              <Button variant="heroOutline" size="xl">
                SHOP NOW
              </Button>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center relative">
            <div className="relative w-96 h-96">
              <div className="absolute inset-0 bg-background rounded-full"></div>
              <div className="absolute inset-4 bg-background/50 rounded-full overflow-hidden shadow-2xl">
                <img src={slides[currentSlide]} alt="Happy pet" className="w-full h-full object-cover transition-opacity duration-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
    </section>;
};
export default Hero;