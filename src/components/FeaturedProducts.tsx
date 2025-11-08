import ProductCard from "./ProductCard";
import { Button } from "./ui/button";
import { Shield, Wheat, Globe, Truck } from "lucide-react";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";
import nutritionDog from "@/assets/nutrition-dog.jpg";

const FeaturedProducts = () => {
  const products = [
    { image: product1, name: "Premium Bowl", price: 12.99, originalPrice: 15.99 },
    { image: product2, name: "Nutritious Treats", price: 8.99, originalPrice: 11.99 },
    { image: product3, name: "Special Cake", price: 24.99 },
    { image: product4, name: "Gourmet Fish", price: 14.99, originalPrice: 18.99 },
    { image: product5, name: "Premium Beef", price: 16.99, originalPrice: 19.99 },
    { image: product6, name: "Healthy Turkey", price: 13.99 },
  ];

  const features = [
    { icon: Shield, title: "No Preservatives Added", desc: "100% natural ingredients for better health" },
    { icon: Wheat, title: "100% Whole Grains", desc: "Nutritious whole grains in every meal" },
    { icon: Globe, title: "Order Online Anywhere", desc: "Shop from anywhere, anytime online" },
    { icon: Truck, title: "Free Shipping", desc: "Fast and free delivery to your door" },
  ];

  return (
    <section className="py-16 bg-background" style={{ minHeight: "100vh" }}>
      <div className="container mx-auto px-4 space-y-16">
        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, idx) => (
            <ProductCard key={idx} {...product} />
          ))}
        </div>

        {/* Nutrition Plan Banner */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-secondary to-accent shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
            <div className="space-y-6 flex flex-col justify-center">
              <h2 className="text-4xl lg:text-5xl font-black text-foreground italic">
                CUSTOMIZED PET NUTRITION PLAN
              </h2>
              <p className="text-lg text-foreground/80 leading-relaxed">
                Every pet is unique! Consider their age, breed, activity level, and any allergies 
                to create the perfect feeding plan for your beloved companion.
              </p>
              <Button variant="default" size="xl" className="w-fit shadow-lg">
                Create a personalized feeding plan
              </Button>
            </div>
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-80 h-80">
                <img
                  src={nutritionDog}
                  alt="Happy dog"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Brand Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="text-center space-y-4">
                <div className="mx-auto w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-lg">
                  <Icon className="w-12 h-12 text-primary-foreground" />
                </div>
                <h3 className="font-bold text-lg uppercase">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
