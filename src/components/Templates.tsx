import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTemplates } from "@/services/productService";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ShoppingCart } from "lucide-react";

const Templates = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState([]);

  const BASE_URL = "https://dumas.frappe.cloud";

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // 🔥 Using service instead of direct axios
        const res = await getTemplates();

        const rawData = Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        setTemplates(rawData);

        console.log("templates grouped:", rawData);
      } catch (err) {
        console.error("Error fetching templates:", err);
      }
    };

    fetchTemplates();
  }, []);

  // 🔥 Group templates by item_group
  const groupedTemplates = templates.reduce((acc, item) => {
    const group = item.item_group || "Others";

    if (!acc[group]) {
      acc[group] = [];
    }

    acc[group].push(item);

    return acc;
  }, {});

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">

        {/* 🔥 Dynamic Group Sections */}
        {Object.entries(groupedTemplates).map(([groupName, items], index) => (
          <div key={groupName} className="mb-14">

            {/* Header */}
            <section
              className="py-7 rounded-lg"
              style={{
                backgroundColor: index === 0 ? "#F97316" : "#FFD24C",
              }}
            >
              <div className="container mx-auto px-4">
                <h1 className="text-4xl md:text-5xl font-bold text-center text-white">
                  {groupName}
                </h1>

                <p className="text-xl text-center mt-4 text-white/90">
                  Browse our complete collection
                </p>
              </div>
            </section>

            {/* Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {items.slice(0, 3).map((item) => (
                <div
                  key={item.item_code}
                  onClick={() => navigate(`/product/${encodeURIComponent(item.item_code.trim())}`)}
                  className="cursor-pointer"
                >
                  <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all hover:scale-[1.02] border-2">

                    {/* Image */}
                    <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                      <img
                        src={
                          item.image
                            ? `${BASE_URL}${item.image}`
                            : "https://placehold.co/600x400?text=No+Image"
                        }
                        alt={item.item_name}
                        onError={(e) => {
                          e.currentTarget.src = "https://placehold.co/600x400?text=No+Image";
                        }}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>

                    {/* Content */}
                    <CardContent className="p-4 space-y-3 flex flex-col justify-between flex-1">
                      <div>
                        <p className="text-sm text-primary font-medium uppercase">
                          {item.item_group}
                        </p>

                        <h3 className="font-bold text-lg line-clamp-2 min-h-[2rem] mt-1">
                          {item.item_name}
                        </h3>

                        <p className="text-sm text-muted-foreground">
                          Premium healthy food template for your lovely pets.
                        </p>
                      </div>

                      <Button
                        className="w-full"
                        size="lg"
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

            {/* Load More */}
            {items.length > 3 && (
              <div className="text-center mt-8">
                <Button
                  size="lg"
                  onClick={() =>
                    navigate(
                      `/category/${groupName
                        .toLowerCase()
                        .replace(/\s+/g, "-")}/all`
                    )
                  }
                >
                  Load More {groupName} →
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Templates;