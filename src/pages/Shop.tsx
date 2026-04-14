import Navigation from "@/components/Navigation";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PawPrint, ShieldCheck, Leaf, Heart } from "lucide-react";

import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import { useCategories } from "@/hooks/useCategories";

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

const features = [
  {
    icon: <PawPrint className="w-6 h-6" />,
    title: "Human-Grade",
    desc: "Only the best quality ingredients"
  },
  {
    icon: <Leaf className="w-6 h-6" />,
    title: "No Preservatives",
    desc: "Fresh and natural always"
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Vet Approved",
    desc: "Nutritionally balanced meals"
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Made Fresh",
    desc: "Prepared with love daily"
  }
];

const getCategoryImage = (name) => {
  const n = name.toLowerCase();

  if (n.includes("meal")) return product1;
  if (n.includes("bake")) return product3;
  if (n.includes("dessert")) return product3;

  return product2; // fallback
};

const Shop = () => {
  const categories = useCategories();
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* HERO */}
      {/* <section className="relative py-10 bg-gradient-to-r from-orange-500 to-orange-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-extrabold mb-4 tracking-tight">
            Shop Premium Pet Food
          </h1>
          <p className="text-lg opacity-90 max-w-xl mx-auto mb-6">
            Healthy, fresh, and delicious meals crafted with love for your pets.
          </p>

          
        </div>
      </section> */}

      {/* CATEGORY */}
      <section className="py-10">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">
            Browse By Category
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3">
           {categories.map((category) => (
  <Link
    key={category.name}
    to={`/category/${encodeURIComponent(category.name)}`}
  >
            <div className="group relative bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">

  {/* IMAGE */}
  <div className="relative h-64 overflow-hidden">
  <img
  src={getCategoryImage(category.name)}
  alt={category.name}
      className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
    />

    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />

    <span className="absolute top-3 right-3 bg-white text-orange-500 text-xs font-semibold px-3 py-1 rounded-full shadow">
      {category.productCount} items
    </span>
  </div>

  {/* CONTENT */}
  <div className="p-6 text-center flex flex-col flex-grow">
    <h3 className="text-xl font-bold mb-2 group-hover:text-orange-500 transition">
      {category.name}
    </h3>

    {/* FIXED HEIGHT DESCRIPTION */}
    <p className="text-gray-500 text-sm mb-4 min-h-[48px]">
      {category.description}
    </p>

    {/* PUSH BUTTON TO BOTTOM */}
    <div className="mt-auto">
      <span className="text-orange-500 font-medium">
        Shop Now →
      </span>
    </div>
  </div>
</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-orange-400 text-white">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-12">
            Why Choose DumasBakesnMeals?
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {features.map((item, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 hover:scale-105 transition"
              >
                <div className="flex items-center justify-center w-14 h-14 mx-auto mb-4 rounded-full bg-white text-orange-500">
                  {item.icon}
                </div>

                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm opacity-90">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center space-y-2">
          <p className="text-sm">
            © 2024 Dumas 'N' Bismi. All rights reserved.
          </p>

          <div className="flex justify-center gap-6 text-sm">
            <span className="hover:text-white cursor-pointer">Privacy</span>
            <span className="hover:text-white cursor-pointer">Terms</span>
            <span className="hover:text-white cursor-pointer">Contact</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Shop;