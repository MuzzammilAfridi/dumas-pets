import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { Product } from "@/data/products";

interface ProductGridProps {
  products: Product[];
  showAddToCart?: boolean;
}

const ProductGrid = ({ products, showAddToCart = false }: ProductGridProps) => {
  const navigate = useNavigate();

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} onClick={() => handleProductClick(product.id)}>
          <ProductCard
            image={product.image}
            name={product.name}
            price={product.price}
            originalPrice={product.originalPrice}
            category={product.category}
          />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
