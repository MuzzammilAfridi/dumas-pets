import { ShoppingCart, CalendarCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

interface ProductCardProps {
  id?: string;
  image: string;
  name: string;
  price: number;
  originalPrice?: number;
  category?: string;
    slug?: string; 
}

const ProductCard = ({ id, image, name, price, originalPrice, category, slug }: ProductCardProps) => {
  const isPetFood = category === 'PET FOOD';

  console.log("item in product card", id, slug );
  

  const cardContent = (
 <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer border-2">
     <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={name}
        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
     <CardContent className="p-4 space-y-3 flex flex-col justify-between flex-1">
     <h3 className="font-bold text-lg line-clamp-2 min-h-[3rem]">
          {name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">₹{price.toFixed(2)}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        {isPetFood ? (
          <div className="flex gap-2">
            <Button className="flex-1" size="lg" variant="default">
              <ShoppingCart className="w-4 h-4 mr-1" />
              Order
            </Button>
            <Button className="flex-1" size="lg" variant="outline">
              <CalendarCheck className="w-4 h-4 mr-1" />
              Subscribe
            </Button>
          </div>
        ) : (
          <Button className="w-full" size="lg">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Order
          </Button>
        )}
      </CardContent>
    </Card>
  );

 if (slug) {
  return <Link to={`/product/${slug}`}>{cardContent}</Link>;
}

  return cardContent;
};

export default ProductCard;
