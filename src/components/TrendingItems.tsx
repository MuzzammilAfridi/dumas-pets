import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

interface Item {
  item_code: string;
  item_name: string;
  item_group: string;
  image: string;
}

const TrendingItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const BASE_URL = "https://dumas.frappe.cloud";

  useEffect(() => {
    fetchTrendingItems();
  }, []);

  const fetchTrendingItems = async () => {
    try {
      const res = await axios.get(
        "https://dumas.frappe.cloud/api/method/dumas_15.a3_dumas.api.get_items_dashboard"
      );

      setItems(res.data.message.data || []);
    } catch (error) {
      console.error("Failed to fetch trending items", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-primary/5 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
          <div>
            <h2 className="text-4xl font-black text-primary">
              Trending Items
            </h2>

            <p className="text-muted-foreground mt-2">
              Most popular fresh meals for your pets
            </p>
          </div>

          <Button onClick={() => navigate("/shop")}>
            View All Products
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-lg font-semibold">Loading trending items...</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-3">
  {items.map((item) => (
    <div
      key={item.item_code}
      onClick={() =>
        navigate(`/template/${item.item_code}`, {
          state: { name: item.item_name },
        })
      }
      className="cursor-pointer"
    >
 <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all hover:scale-[1.02] border-2">

                    {/* Image */}
                    <div className="relative w-full aspect-video overflow-hidden bg-gray-100">
                      <img
                        src={
                          item.image
                            ? `${BASE_URL}${item.image}`
                            : "/placeholder.png"
                        }
                        alt={item.item_name}
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
        )}
      </div>
    </section>
  );
};

export default TrendingItems;