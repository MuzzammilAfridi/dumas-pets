import { useEffect, useState } from "react";
import { getProductsWithAttributes } from "@/services/productService";

export const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = "https://dumas.frappe.cloud";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getProductsWithAttributes();

        console.log("API RESPONSE:", res.data);

        const rawData = res.data?.message?.data || [];

        const createSlug = (str) => {
          return str
            ?.trim()
            .replace(/\//g, "-")
            .replace(/%/g, "percent")
            .replace(/[^a-zA-Z0-9]+/g, "-")
            .toLowerCase();
        };

       const formatted = rawData.map((item) => ({
  id: item.item_code,

  item_code: item.item_code,

  slug: createSlug(item.item_code),

  name: item.item_name,

  category: item.item_group,

  price: item.standard_rate || 0,

  image: item.image
    ? `${BASE_URL}${item.image}`
    : "https://placehold.co/600x400?text=No+Image",

  hasVariants: item.has_variants,

  variantOf: item.variant_of,

  attributes: item.attributes || [],
}));

        setProducts(formatted);

        console.log("Formatted Products:", formatted);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, loading };
};