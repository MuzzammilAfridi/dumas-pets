import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Navigation from "@/components/Navigation";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import heroDog from "@/assets/hero-dog.jpg";
import nutritionDog from "@/assets/nutrition-dog.jpg";
import team1 from "@/assets/team-1.jpg";
import team2 from "@/assets/team-2.jpg";
import team3 from "@/assets/team-3.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

const galleryImages = [
  {
    id: 1,
    src: heroDog,
    alt: "Happy dog enjoying meal",
    category: "Pets",
    title: "Pure Joy at Mealtime",
    description:
      "A happy companion enjoying a freshly prepared, nutrient-rich meal crafted with love. Every wag tells the story of wholesome ingredients and balanced nutrition.",
  },
  {
    id: 2,
    src: nutritionDog,
    alt: "Healthy dog nutrition",
    category: "Nutrition",
    title: "Nutrition That Cares",
    description:
      "Carefully portioned grain, protein, and veggies — designed by experts to support your pet's growth, energy, and long-term well-being.",
  },
  {
    id: 3,
    src: team1,
    alt: "Team at work",
    category: "Team",
    title: "Behind the Bowl",
    description:
      "Our dedicated kitchen team preparing fresh meals daily with the highest hygiene and quality standards.",
  },
  {
    id: 4,
    src: product1,
    alt: "Premium pet food",
    category: "Products",
    title: "Premium Pet Food",
    description:
      "Signature recipes packed with real meat, fresh vegetables, and wholesome grains — no fillers, no preservatives.",
  },
  {
    id: 5,
    src: team2,
    alt: "Community event",
    category: "Events",
    title: "Community Pawsitivity",
    description:
      "Bringing pet parents together through adoption drives, awareness camps, and fun-filled welfare events.",
  },
  {
    id: 6,
    src: product2,
    alt: "Delicious treats",
    category: "Products",
    title: "Treat Time Favourites",
    description:
      "Handcrafted, oven-baked treats your pet will love — perfect for training rewards and happy moments.",
  },
  {
    id: 7,
    src: team3,
    alt: "Welfare activity",
    category: "Events",
    title: "Welfare in Action",
    description:
      "Partnering with the welfare trust to feed, rescue, and care for stray and shelter animals across the city.",
  },
  {
    id: 8,
    src: product3,
    alt: "Birthday cake for pets",
    category: "Products",
    title: "Pawty Time Cakes",
    description:
      "Celebrate your pet's special day with our healthy, customizable birthday cakes made with pet-safe ingredients.",
  },
];

const Gallery = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const prev = useCallback(
    () =>
      setActiveIndex((i) =>
        i === null ? i : (i - 1 + galleryImages.length) % galleryImages.length
      ),
    []
  );
  const next = useCallback(
    () =>
      setActiveIndex((i) =>
        i === null ? i : (i + 1) % galleryImages.length
      ),
    []
  );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex, prev, next, close]);

  const active = activeIndex !== null ? galleryImages[activeIndex] : null;

  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Our Gallery
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Moments of joy, health, and happiness from our community
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image, index) => (
              <button
                type="button"
                key={image.id}
                onClick={() => setActiveIndex(index)}
                className={`relative overflow-hidden rounded-2xl group cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-primary ${
                  index === 0 || index === 5 ? "md:col-span-2 md:row-span-2" : ""
                }`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover aspect-square group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-end">
                  <div className="p-4 text-background opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="inline-block px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full mb-1">
                      {image.category}
                    </span>
                    <p className="text-sm font-medium">{image.alt}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Dialog */}
      <Dialog open={active !== null} onOpenChange={(open) => !open && close()}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-2xl border-0 bg-background">
          {active && (
            <div className="flex flex-col">
              {/* Image area */}
              <div className="relative bg-foreground/95">
                <img
                  src={active.src}
                  alt={active.alt}
                  className="w-full max-h-[60vh] object-contain"
                />

                {/* Nav arrows */}
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/90 hover:bg-background flex items-center justify-center shadow"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-background/90 hover:bg-background flex items-center justify-center shadow"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Counter */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-background/90 text-xs font-medium">
                  {(activeIndex ?? 0) + 1} / {galleryImages.length}
                </div>
              </div>

              {/* Description */}
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="inline-block px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                    {active.category}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-foreground">
                  {active.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {active.description}
                </p>

                <div className="flex items-center justify-between pt-2">
                  <Button variant="outline" onClick={prev}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  <Button onClick={next}>
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <footer className="bg-foreground text-background py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2024 Dumas 'N' Bismi. All rights reserved. | Premium Pet Nutrition Scheme</p>
        </div>
      </footer>
    </div>
  );
};

export default Gallery;
