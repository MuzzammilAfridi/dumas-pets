import { useEffect, useState } from "react";

import { getProducts } from "@/services/productService";

export const useProducts = () => {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://dumas.frappe.cloud";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProducts();

        const rawData = res.data?.data || [];

        const formatted = rawData.map((item) => ({
          item_code: item.item_code,

          item_name: item.item_name,

          item_group: item.item_group,

          standard_rate: item.standard_rate || 0,

          description: item.description || "",

          disabled: item.disabled,

          image: item.image
            ? `${BASE_URL}${item.image}`
            : "https://placehold.co/600x400?text=No+Image",
        }));

        setProducts(formatted);

      } catch (err) {
        console.error("Error fetching products:", err);

      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return {
    products,
    loading,
  };
};