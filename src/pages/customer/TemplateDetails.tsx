import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { getTemplateVariants } from "@/services/productService";

const TemplateDetails = () => {
  const { itemCode } = useParams();
  const [variants, setVariants] = useState([]);
  const navigate = useNavigate();

  const BASE_URL = "https://dumas.frappe.cloud";

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        // 🔥 Using service instead of direct axios
        const res = await getTemplateVariants(itemCode);

        const rawData = Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        setVariants(rawData);

        console.log("Data in template details:", rawData);
      } catch (err) {
        console.error("Error fetching variants:", err);
      }
    };

    fetchVariants();
  }, [itemCode]);

  return (
    <>
      <Navigation />

      <div className="min-h-screen bg-gray-50 py-10 px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">
          Choose Your Variant
        </h2>

        {variants.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No variants available
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {variants.map((v) => (
              <div
                key={v.item_code}
                onClick={() => navigate(`/product/${v.item_code}`)}
                className="cursor-pointer"
              >
                <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.01] border">

                  {/* Image */}
                  <div className="relative w-full h-[180px] sm:h-[200px] overflow-hidden bg-gray-100">
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

                  {/* Content */}
                  <CardContent className="p-4 flex flex-col justify-between flex-1">
                    <div className="space-y-2">
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

                    {/* Dynamic Buttons */}
                    <div className="mt-4">
                      {v.item_group?.toLowerCase().includes("meals") ||
                      v.item_group
                        ?.toLowerCase()
                        .includes("all item groups") ? (

                        /* Order + Subscribe */
                        <div className="grid grid-cols-2 gap-3">
                          <Button
                            className="w-full"
                            size="default"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/product/${v.item_code}`);
                            }}
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Order
                          </Button>

                          <Button
                            variant="outline"
                            className="w-full"
                            size="default"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/product/${v.item_code}`);
                            }}
                          >
                            Subscribe
                          </Button>
                        </div>
                      ) : (
                        /* Only Order */
                        <Button
                          className="w-full"
                          size="default"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${v.item_code}`);
                          }}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Order
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>

      <footer className="bg-foreground text-background py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">
            © 2024 Dumas 'N' Bismi. All rights reserved. |
            Premium Pet Nutrition Scheme
          </p>
        </div>
      </footer>
    </>
  );
};

export default TemplateDetails;