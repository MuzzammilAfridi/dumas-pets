import { ShoppingCart } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface ProductCardProps {
  image: string;
  name: string;
  price: number;
  originalPrice?: number;
}

const ProductCard = ({ image, name, price, originalPrice }: ProductCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all hover:scale-105 cursor-pointer border-2">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-4 space-y-3">
        <h3 className="font-bold text-lg">{name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">${price.toFixed(2)}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        <Button className="w-full" size="lg">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Order
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
