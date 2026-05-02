import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, ShoppingCart } from "lucide-react";
import { getTemplateVariants } from "@/services/productService";
import { getItemGroups, getTemplates } from "@/services/productService";

import { Link, useLocation } from "react-router-dom";



import { useCategories } from "@/hooks/useCategories";
import CategorySidebar from "@/components/CategorySidebar";
const TemplateDetails = () => {
  const { itemCode } = useParams();
  const [variants, setVariants] = useState<any[]>([]);
  const navigate = useNavigate();
  const [title, setTitle] = useState("Variants");

  const [openCategory, setOpenCategory] = useState(null);

  const { category } = useParams();

  const location = useLocation();
// const title = location.state?.name || "Variants";

const [categoryTree, setCategoryTree] = useState([]);
const attachTemplatesToCategories = (tree, templates) => {
  return tree.map((cat) => ({
    ...cat,
    templates: templates.filter(
      (t) => t.item_group === cat.name
    ),
  }));
};

const buildTree = (data) => {
  const map = {};
  const roots = [];

  data.forEach((item) => {
    map[item.name] = { ...item, children: [] };
  });

  data.forEach((item) => {
    if (item.parent_item_group && map[item.parent_item_group]) {
      map[item.parent_item_group].children.push(map[item.name]);
    } else {
      roots.push(map[item.name]);
    }
  });

  return roots;
};

const [templates, setTemplates] = useState([]);

useEffect(() => {
  const fetchTemplates = async () => {
    try {
      const res = await getTemplates();
      setTemplates(res.data?.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  fetchTemplates();
}, []);

useEffect(() => {
  if (!templates.length || !itemCode) return;

  const template = templates.find(
    (t) => t.item_code === itemCode
  );

  if (template) {
    setTitle(template.item_name); // ✅ REAL TITLE
  }
}, [templates, itemCode]);


const [currentCategory, setCurrentCategory] = useState("");

useEffect(() => {
  if (!templates.length || !itemCode) return;

  const template = templates.find(
    (t) => t.item_code === itemCode
  );

  if (template) {
    setCurrentCategory(template.item_group);
    setOpenCategory(
      template.item_group.toLowerCase().replace(/\s+/g, "-")
    );
  }
}, [templates, itemCode]);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await getItemGroups();
      const tree = buildTree(res.data.data);
     const filteredTree = tree.find(
  (item) => item.name === "All Item Groups"
)?.children || [];

setCategoryTree(filteredTree);
    } catch (err) {
      console.error(err);
    }
  };

  fetchCategories();
}, []);

  const BASE_URL = "https://dumas.frappe.cloud";

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const res = await getTemplateVariants(itemCode);
        const rawData = Array.isArray(res.data?.data) ? res.data.data : [];
        setVariants(rawData);
      } catch (err) {
        console.error("Error fetching variants:", err);
      }
    };

    fetchVariants();
  }, [itemCode]);



  const getSlug = (name = "") =>
  name.toLowerCase().replace(/\s+/g, "-");




  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="bg-primary py-12">
        <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-white text-center">
  {title}
</h1>

<p className="text-white/80 text-center mt-2">
  Browse our complete collection
</p>
        </div>
      </section>

     <section className="py-12">
  <div className="container mx-auto px-4">
    <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap mb-4 relative bottom-3">

  <Link to="/" className="hover:text-primary transition">
    Home
  </Link>

  <ChevronRight className="w-4 h-4" />

 <Link
  to={`/category/${getSlug(currentCategory)}/all`}
  className="hover:text-primary transition"
>
  {currentCategory}
</Link>

  <ChevronRight className="w-4 h-4" />

  <span className="text-foreground font-medium">
    {title}
  </span>

</div>
    <div className="flex flex-col lg:flex-row gap-8">

      {/* Left Sidebar */}
    <aside className="lg:w-64 shrink-0">
  <CategorySidebar
    categoryTree={attachTemplatesToCategories(categoryTree, templates)}
   
    openCategory={openCategory}
    setOpenCategory={setOpenCategory}
    activeCategory={openCategory}
      activeTemplate={itemCode} 
  />
</aside>

      {/* Right Side Products */}
      <div className="flex-1 overflow-x-hidden">

        

        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            Showing {variants.length} variants
          </p>
        </div>

        {variants.length === 0 ? (
          <p className="text-center text-muted-foreground py-10">
            No variants available
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-3">
            {variants.map((v) => (
              <div
                key={v.item_code}
                onClick={() => navigate(`/product/${v.item_code}`)}
                className="cursor-pointer"
              >
                <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all hover:scale-[1.02] border-2">

                  <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={
                        v.image
                          ? `${BASE_URL}${v.image}`
                          : "/placeholder.png"
                      }
                      alt={v.item_name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>

                  <CardContent className="p-4 space-y-3 flex flex-col justify-between flex-1">
                    <div>
                      <p className="text-xs sm:text-sm text-primary font-medium uppercase">
                        {v.item_group || "Variant"}
                      </p>

                      <h3 className="font-semibold text-base sm:text-lg line-clamp-2 min-h-[48px]">
                        {v.item_name}
                      </h3>

                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                        Premium healthy food template for your lovely pets.
                      </p>
                    </div>

                    <Button
                      className="w-full mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${v.item_code}`);
                      }}
                    >
                      Order
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
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

export default TemplateDetails;