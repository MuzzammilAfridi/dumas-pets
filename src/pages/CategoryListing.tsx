import { useParams, useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ProductGrid from "@/components/ProductGrid";
import { Button } from "@/components/ui/button";
import { getProductsByCategory, ProductCategory } from "@/data/products";

import { useProducts } from "@/hooks/useProducts";

const CategoryListing = () => {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();

  const { products, loading } = useProducts();

const decodedCategory = category
  ?.split("-")
  .join(" ")
  .toLowerCase();

// filter backend data
const allProducts = products.filter((p: any) =>
p.category?.trim().toLowerCase() === decodedCategory
);


const displayName = decodedCategory
  ?.split(" ")
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");

const displayedProducts = allProducts.slice(0, 12);

if (loading) return <p>Loading...</p>;

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Category Header - Orange Background */}
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground text-center">
            {displayName}
          </h1>
          <p className="text-xl text-primary-foreground/90 text-center mt-4">
            Premium quality {displayName.toLowerCase()} for your beloved pets
          </p>
        </div>
      </section>

      {/* First Product Section - White Background */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-8">Featured {displayName}</h2>
          <ProductGrid products={displayedProducts.slice(0, 6)} />
        </div>
      </section>

      {/* Second Product Section - Orange Background */}
      <section className="bg-primary/10 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-8">More Options</h2>
          <ProductGrid products={displayedProducts.slice(6, 12)} />
        </div>
      </section>

      {/* List More Button - White Background */}
      <section className="bg-background py-12">
        <div className="container mx-auto px-4 text-center">
          <Button
            size="xl"
            onClick={() => navigate(`/category/${category}/all`)}
            className="text-lg px-12"
          >
            List More Products
          </Button>
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

export default CategoryListing;
