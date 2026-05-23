import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { SubscribeDialog } from "./SubscribeDialog";
import type { ErpItem } from "@/lib/erpnext/types";

export const ErpProductCard = ({ item }: { item: ErpItem }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();

  return (
    <Card className="rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full flex flex-col">
      <div className="aspect-square overflow-hidden bg-muted">
        <img src={item.image} alt={item.item_name} loading="lazy" className="w-full h-full object-cover" />
      </div>
      <CardContent className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-foreground line-clamp-1">{item.item_name}</h3>
          <span className="font-bold text-primary whitespace-nowrap">₹{item.standard_rate}</span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{item.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {item.goals.slice(0, 2).map((g) => (
            <Badge key={g} variant="secondary" className="text-xs capitalize">{g.replace("_", " ")}</Badge>
          ))}
          {item.food_preference === "veg" && <Badge variant="outline" className="text-xs text-green-700 border-green-300">Veg</Badge>}
        </div>
        <div className="mt-auto pt-3 flex gap-2">
          <Button
            size="sm"
            className="flex-1 rounded-xl"
            onClick={() => {
              addToCart({ id: item.item_code, name: item.item_name, price: item.standard_rate, image: item.image, category: item.item_group } as any);
              toast({ title: "Added to cart", description: item.item_name });
            }}
          >
            <ShoppingCart className="w-4 h-4 mr-1" /> Add
          </Button>
          {item.item_group === "PET FOOD" && <SubscribeDialog item={item} trigger={<Button size="sm" variant="outline" className="rounded-xl">Subscribe</Button>} />}
        </div>
      </CardContent>
    </Card>
  );
};
