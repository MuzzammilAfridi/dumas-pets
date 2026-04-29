import { useParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ProductGrid from "@/components/ProductGrid";
import { useNavigate } from "react-router-dom";
import { getTemplates } from "@/services/productService";

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronRight, Filter, ArrowUpDown, ShoppingCart } from "lucide-react";

import { useProducts } from "@/hooks/useProducts";
import axios from "axios";
import { useCategories } from "@/hooks/useCategories";
import { Card, CardContent } from "@/components/ui/card";

const PRODUCTS_PER_PAGE = 18;

const AllProducts = () => {
  // const { products, loading } = useProducts();
  // const { category } = useParams<{ category: string }>();

  const categories = useCategories();
  const { category } = useParams();

  const [templates, setTemplates] = useState([]);
const [loading, setLoading] = useState(true);

  const [sortBy, setSortBy] = useState<string>("name");
  const [displayCount, setDisplayCount] = useState(PRODUCTS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // console.log("produts in all products", products);

  const decodedCategory = category?.split("-").join(" ").toLowerCase();

  const displayName = decodedCategory
    ?.split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const normalize = (str = "") =>
  str.toLowerCase().trim().replace(/\s+/g, "-");

let filteredTemplates = templates.filter(
  (item) => item.item_group !== "All Item Groups"
);

if (category) {
  filteredTemplates = filteredTemplates.filter(
    (item) => normalize(item.item_group) === category
  );
}


useEffect(() => {
  const fetchTemplates = async () => {
    try {
      //  Using productService
      const res = await getTemplates();

      const rawData = Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setTemplates(rawData);

      console.log("Templates in all products:", rawData);
    } catch (err) {
      console.error("Error fetching templates:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchTemplates();
}, []);

  // Sort products
 if (sortBy === "name") {
  filteredTemplates = [...filteredTemplates].sort((a, b) =>
    a.item_name.localeCompare(b.item_name)
  );
}

const displayedTemplates = filteredTemplates.slice(0, displayCount);
const hasMore = displayCount < filteredTemplates.length;

  const loadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setDisplayCount((prev) => prev + PRODUCTS_PER_PAGE);
      setIsLoading(false);
    }, 500);
  };

  // Reset display count when category changes
  useEffect(() => {
    setDisplayCount(PRODUCTS_PER_PAGE);
  }, [category]);

  // const categories = [
  //   { name: "PET FOOD", slug: "pet-meals" },
  //   { name: "TREATS", slug: "treats" },
  //   { name: "CAKES", slug: "cakes" },
  // ];

const groupedTemplates = filteredTemplates.reduce((acc, item) => {
  const group = item.item_group || "Others";
  if (!acc[group]) acc[group] = [];
  acc[group].push(item);
  return acc;
}, {});

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header Section */}
      <section className="bg-primary py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground text-center">
            {displayName}
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
                  {categories.map((cat) => {
  const slug = cat.name.toLowerCase().replace(/\s+/g, "-");

  return (
    <Link
      key={cat.name}
      to={`/category/${slug}/all`}
      className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
        slug === category
          ? "bg-primary text-primary-foreground"
          : "hover:bg-muted"
      }`}
    >
      <span className="font-medium">{cat.name}</span>
      <ChevronRight className="w-4 h-4" />
    </Link>
  );
})}
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
                      <SelectItem value="price-low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price-high">
                        Price: High to Low
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quick Links */}
                <div className="pt-4 border-t border-border">
                  <Link
                    to="/shop"
                    className="text-sm text-primary hover:underline"
                  >
                    ← Back to Shop
                  </Link>
                </div>
              </div>
            </aside>

            {/* Products Area */}
<div className="flex-1 overflow-x-hidden">

  {/* Count */}
  <div className="flex justify-between items-center mb-6">
    <p className="text-muted-foreground">
     Showing {filteredTemplates.length} templates
    </p>
  </div>

  {/* 🔥 Grouped Horizontal Sections */}
  <div className="space-y-12">
    {Object.entries(groupedTemplates).map(([group, items]) => (
      <div key={group}>

        {/* 🔥 Header */}
        {/* <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{group}</h2>
          <span
            onClick={() =>
              navigate(`/category/${group.toLowerCase().replace(/\s+/g, "-")}/all`)
            }
            className="text-sm text-primary cursor-pointer hover:underline"
          >
            View All →
          </span>
        </div> */}

{/* 👉 Responsive + Reduced Height Card UI */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-3">
  {items.map((item) => (
    <div
      key={item.item_code}
      onClick={() => navigate(`/template/${item.item_code}`)}
      className="cursor-pointer"
    >
      {/* <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.01] border"> */}
             <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all hover:scale-[1.02] border-2">
        
        {/* Image - Reduced Height */}
            <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
          <img
            src={
              item.image
                ? `https://dumas.frappe.cloud${item.image}`
                : "/placeholder.png"
            }
            alt={item.item_name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Content */}
       <CardContent className="p-4 space-y-3 flex flex-col justify-between flex-1">
          <div className="">
            <p className="text-xs sm:text-sm text-primary font-medium uppercase">
              {group}
            </p>

            <h3 className="font-semibold text-base sm:text-lg line-clamp-2 min-h-[48px]">
              {item.item_name}
            </h3>

            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
              Premium healthy food template for your lovely pets.
            </p>
          </div>

          <Button
            className="w-full mt-4"
            size="default"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/template/${item.item_code}`);
            }}
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            View Variant
          </Button>
        </CardContent>
      </Card>
    </div>
  ))}
</div>

      </div>
    ))}
  </div>

</div>
          </div>
        </div>
      </section>

      <footer className="bg-foreground text-background py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2024 Dumas 'N' Bismi. All rights reserved. | Premium Pet Nutrition
            Scheme
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AllProducts;
