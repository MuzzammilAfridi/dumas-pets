import { Link, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { Button } from "./ui/button";
import { Shield, Wheat, Globe, Truck } from "lucide-react";
import { getProductsByCategory } from "@/data/products";
import nutritionDog from "@/assets/nutrition-dog.jpg";

const FeaturedProducts = () => {
  const navigate = useNavigate();
  const petFoodProducts = getProductsByCategory('PET FOOD').slice(0, 3);
  const treatsProducts = getProductsByCategory('TREATS').slice(0, 3);
  const cakesProducts = getProductsByCategory('CAKES').slice(0, 3);

  const features = [
    { icon: Shield, title: "No Preservatives Added", desc: "100% natural ingredients for better health" },
    { icon: Wheat, title: "100% Whole Grains", desc: "Nutritious whole grains in every meal" },
    { icon: Globe, title: "Order Online Anywhere", desc: "Shop from anywhere, anytime online" },
    { icon: Truck, title: "Free Shipping", desc: "Fast and free delivery to your door" },
  ];

  const categories = [
    {
      name: "PET FOOD",
      slug: "pet-food",
      products: petFoodProducts,
      description: "Nutritious & Home-Cooked Meals",
      bgClass: "bg-primary",
    },
    {
      name: "TREATS",
      slug: "treats",
      products: treatsProducts,
      description: "Delicious & Healthy Rewards",
      bgClass: "bg-secondary",
    },
    {
      name: "CAKES",
      slug: "cakes",
      products: cakesProducts,
      description: "Celebrate with Special Cakes",
      bgClass: "bg-accent",
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 space-y-16">
        {/* Category Sections */}
        {categories.map((category, index) => (
          <div key={category.slug} className="space-y-8">
            {/* Category Banner */}
            <div className={`${category.bgClass} rounded-2xl p-8 text-center`}>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
                {category.name}
              </h2>
              <p className="text-lg text-primary-foreground/90 mt-2">
                {category.description}
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  image={product.image}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  category={product.category}
                />
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center">
              <Link to={`/category/${category.slug}/all`}>
                <Button variant="outline" size="lg" className="px-8">
                  Load More {category.name}
                </Button>
              </Link>
            </div>

            {/* Divider - except for last category */}
            {index < categories.length - 1 && (
              <div className="border-t border-border/50 pt-8" />
            )}
          </div>
        ))}

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
              <Button variant="default" size="xl" className="w-fit shadow-lg" onClick={() => navigate("/nutrition-plan")}>
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
