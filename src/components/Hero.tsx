import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import heroVideo from "@/assets/hero-video.mp4";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const categories = [
    {
      title: "PET FOOD",
      image: product1,
      route: "/category/pet-meals/all",
    },
    {
      title: "TREATS",
      image: product2,
      route: "/category/desserts/all",
    },
    {
      title: "CAKES",
      image: product3,
      route: "/category/bakes/all",
    },
  ];

  return (
    <section className="bg-primary relative overflow-hidden min-h-[calc(100vh-4rem)] py-8 lg:py-12">
      <div className="container mx-auto px-4 h-full flex flex-col">
        {/* Row 1: Full-width title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-primary-foreground leading-tight italic">
            Healthy Pets, Happy Pets...
          </h1>
          <p className="text-xl lg:text-2xl text-primary-foreground/90 font-medium mt-2">
            Bakes 'N' Meals for Pets
          </p>
        </div>

        {/* Row 2: Two columns - Categories + Video */}
        <div className="grid lg:grid-cols-[1fr_1fr] gap-8 flex-1 items-center">
          {/* Left column: Categories */}
          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-3 gap-4">
              {categories.map((cat, idx) => (
                <div
                  key={idx}
                  onClick={() => navigate(cat.route)}
                  className="bg-background rounded-2xl p-3 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-105"
                >
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="w-full h-32 lg:h-40 object-cover rounded-xl mb-2.5"
                  />
                  <p className="font-bold text-center text-foreground text-lg lg:text-xl">
                    {cat.title}
                  </p>
                </div>
              ))}
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mt-2">
              <Button variant="subscribe" size="xl" onClick={() => navigate("/category/pet-food/all")}>
                SUBSCRIBE MONTHLY
              </Button>
              <Button variant="orderNow" size="xl" onClick={() => navigate("/category/pet-food/all")}>
                ORDER NOW
              </Button>
            </div>
          </div>

          {/* Right column: Video */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-background/20">
              <video
                src={heroVideo}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto max-h-[400px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;
