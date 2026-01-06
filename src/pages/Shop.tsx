import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";

const categories = [
  {
    id: "pet-food",
    name: "Pet Food",
    description: "Fresh, nutritious meals made with human-grade ingredients",
    image: product1,
    productCount: 12
  },
  {
    id: "treats",
    name: "Treats",
    description: "Healthy and delicious treats your pet will love",
    image: product2,
    productCount: 8
  },
  {
    id: "cakes",
    name: "Cakes",
    description: "Custom birthday cakes and celebration treats",
    image: product3,
    productCount: 6
  }
];

const Shop = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Shop
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Premium nutrition for your beloved pets
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Browse By Category
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {categories.map((category) => (
              <Link 
                key={category.id}
                to={`/category/${category.id}`}
                className="group"
              >
                <div className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1">
                  <div className="aspect-square overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      {category.description}
                    </p>
                    <span className="text-sm text-primary font-medium">
                      {category.productCount} Products →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary-foreground text-center mb-12">
            Why Choose DumasBakesnMeals?
          </h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { title: "Human-Grade", desc: "Only the best quality ingredients" },
              { title: "No Preservatives", desc: "Fresh and natural always" },
              { title: "Vet Approved", desc: "Nutritionally balanced meals" },
              { title: "Made Fresh", desc: "Prepared with love daily" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-background rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">{index + 1}</span>
                </div>
                <h3 className="font-bold text-primary-foreground mb-2">{item.title}</h3>
                <p className="text-primary-foreground/80 text-sm">{item.desc}</p>
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

export default Shop;
