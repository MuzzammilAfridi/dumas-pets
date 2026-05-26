import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: any[];
  showAddToCart?: boolean;
}

const ProductGrid = ({
  products,
  showAddToCart = false,
}: ProductGridProps) => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

      {products.map((product) => (

        <div key={product.item_code}>

          <ProductCard
            itemCode={product.item_code}
            image={product.image}
            name={product.item_name}
            price={product.standard_rate}
            category={product.item_group}
          />

        </div>

      ))}

    </div>
  );
};

export default ProductGrid;