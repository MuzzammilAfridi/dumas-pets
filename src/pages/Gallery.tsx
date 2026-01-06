import Navigation from "@/components/Navigation";
import heroDog from "@/assets/hero-dog.jpg";
import nutritionDog from "@/assets/nutrition-dog.jpg";
import team1 from "@/assets/team-1.jpg";
import team2 from "@/assets/team-2.jpg";
import team3 from "@/assets/team-3.jpg";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

const galleryImages = [
  { id: 1, src: heroDog, alt: "Happy dog enjoying meal", category: "Pets" },
  { id: 2, src: nutritionDog, alt: "Healthy dog nutrition", category: "Nutrition" },
  { id: 3, src: team1, alt: "Team at work", category: "Team" },
  { id: 4, src: product1, alt: "Premium pet food", category: "Products" },
  { id: 5, src: team2, alt: "Community event", category: "Events" },
  { id: 6, src: product2, alt: "Delicious treats", category: "Products" },
  { id: 7, src: team3, alt: "Welfare activity", category: "Events" },
  { id: 8, src: product3, alt: "Birthday cake for pets", category: "Products" },
];

const Gallery = () => {
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
              <div 
                key={image.id} 
                className={`relative overflow-hidden rounded-2xl group cursor-pointer ${
                  index === 0 || index === 5 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
              >
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-full object-cover aspect-square hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors flex items-end">
                  <div className="p-4 text-background opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="inline-block px-2 py-1 bg-primary text-primary-foreground text-xs rounded-full mb-1">
                      {image.category}
                    </span>
                    <p className="text-sm font-medium">{image.alt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-background py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2024 Dumas 'N' Bismi. All rights reserved. | Premium Pet Nutrition Scheme</p>
        </div>
      </footer>
    </div>
  );
};

export default Gallery;
