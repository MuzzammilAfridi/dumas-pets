import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ProductGrid from "@/components/ProductGrid";
import { getProductsByCategory, ProductCategory } from "@/data/products";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronRight, Filter, ArrowUpDown } from "lucide-react";

const PRODUCTS_PER_PAGE = 18;

const AllProducts = () => {
  const { category } = useParams<{ category: string }>();
  const categoryName = category?.toUpperCase().replace('-', ' ') as ProductCategory;
  const [sortBy, setSortBy] = useState<string>("name");
  const [displayCount, setDisplayCount] = useState(PRODUCTS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);
  
  let products = getProductsByCategory(categoryName);

  // Sort products
  if (sortBy === "price-low") {
    products = [...products].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    products = [...products].sort((a, b) => b.price - a.price);
  } else if (sortBy === "name") {
    products = [...products].sort((a, b) => a.name.localeCompare(b.name));
  }

  const displayedProducts = products.slice(0, displayCount);
  const hasMore = displayCount < products.length;

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + PRODUCTS_PER_PAGE);
      setIsLoading(false);
    }, 500);
  };

  // Reset display count when category changes
  useEffect(() => {
    setDisplayCount(PRODUCTS_PER_PAGE);
  }, [category]);

  const categories = [
    { name: "PET FOOD", slug: "pet-food" },
    { name: "TREATS", slug: "treats" },
    { name: "CAKES", slug: "cakes" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Header Section */}
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground text-center">
            {categoryName}
          </h1>
          <p className="text-xl text-primary-foreground/90 text-center mt-4">
            Browse our complete collection
          </p>
        </div>
      </section>

      {/* Main Content with Sidebar */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-24 space-y-6">
                {/* Categories */}
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5" />
                    Categories
                  </h3>
                  <nav className="space-y-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/category/${cat.slug}/all`}
                        className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                          cat.slug === category
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        <span className="font-medium">{cat.name}</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    ))}
                  </nav>
                </div>

                {/* Sort Options */}
                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                    <ArrowUpDown className="w-5 h-5" />
                    Sort By
                  </h3>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quick Links */}
                <div className="pt-4 border-t border-border">
                  <Link to="/shop" className="text-sm text-primary hover:underline">
                    ← Back to Shop
                  </Link>
                </div>
              </div>
            </aside>

            {/* Products Area */}
            <div className="flex-1">
              {/* Product Count */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-muted-foreground">
                  Showing {displayedProducts.length} of {products.length} products
                </p>
              </div>

              {/* Product Grid */}
              <ProductGrid products={displayedProducts} />

              {/* Load More Button */}
              {hasMore && (
                <div className="text-center mt-12">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={loadMore}
                    disabled={isLoading}
                    className="px-12"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                        Loading...
                      </span>
                    ) : (
                      "Load More Products"
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
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
