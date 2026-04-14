import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { Product } from "@/data/products";

interface ProductGridProps {
  products: Product[];
  showAddToCart?: boolean;
  slug?: string;
}

const ProductGrid = ({ products, showAddToCart = false }: ProductGridProps) => {
  const navigate = useNavigate();



  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} >
          <ProductCard
            image={product.image}
            name={product.name}
            price={product.price}
            originalPrice={product.originalPrice}
            category={product.category}
              slug={product.slug} 
          />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
