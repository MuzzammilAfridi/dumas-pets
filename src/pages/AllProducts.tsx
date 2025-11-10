import { useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ProductGrid from "@/components/ProductGrid";
import { getProductsByCategory, ProductCategory } from "@/data/products";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AllProducts = () => {
  const { category } = useParams<{ category: string }>();
  const categoryName = category?.toUpperCase().replace('-', ' ') as ProductCategory;
  const [sortBy, setSortBy] = useState<string>("name");
  
  let products = getProductsByCategory(categoryName);

  // Sort products
  if (sortBy === "price-low") {
    products = [...products].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    products = [...products].sort((a, b) => b.price - a.price);
  } else if (sortBy === "name") {
    products = [...products].sort((a, b) => a.name.localeCompare(b.name));
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header Section */}
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground text-center">
            All {categoryName}
          </h1>
          <p className="text-xl text-primary-foreground/90 text-center mt-4">
            Browse our complete collection
          </p>
        </div>
      </section>

      {/* Filters and Products */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Sorting Controls */}
          <div className="flex justify-between items-center mb-8">
            <p className="text-muted-foreground">
              Showing {products.length} products
            </p>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium">Sort by:</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product Grid */}
          <ProductGrid products={products} />
        </div>
      </section>

      <footer className="bg-foreground text-background py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2024 Dumas 'N' Bismi. All rights reserved. | Premium Pet Nutrition Scheme</p>
        </div>
      </footer>
    </div>
  );
};

export default AllProducts;
