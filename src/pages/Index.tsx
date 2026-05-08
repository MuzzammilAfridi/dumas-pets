import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import FeaturedProducts from "@/components/FeaturedProducts";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Resources from "@/components/Resources";
import Contact from "@/components/Contact";
import Templates from "@/components/Templates";
import TrendingItems from "@/components/TrendingItems";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      {/* <FeaturedProducts /> */}
      <Templates />
      <TrendingItems/>
      <Testimonials />
      <Resources />
      <Contact />

      <footer className="bg-foreground text-background py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2024 Dumas 'N' Bismi. All rights reserved. | Premium Pet Nutrition
            Scheme
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
