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

        // console.log("DATA:", res.data);

        const rawData = Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        const mapCategory = (group, name) => {
          const g = (group || "").toLowerCase();
          const n = (name || "").toLowerCase();

          if (g.includes("meal") || n.includes("food")) return "PET FOOD";
          if (n.includes("treat")) return "TREATS";
          if (n.includes("cake")) return "CAKES";

          return "PET FOOD"; // default fallback
        };

        const createSlug = (str) => {
          return str
            ?.trim()                          // remove trailing spaces
            .replace(/\//g, "-")              // remove slash
            .replace(/%/g, "percent")         // replace %
            .replace(/[^a-zA-Z0-9]+/g, "-")   // remove all special chars
            .toLowerCase();
        };

        const formatted = rawData.map((item) => ({
          id: item.item_code,           // UI usage
          item_code: item.item_code,    // 🔥 ADD THIS (CRITICAL FIX)
          slug: createSlug(item.item_code),
          name: item.item_name,
          price: item.standard_rate,
          category: item.item_group,
          image: item.image
            ? `${BASE_URL}${item.image}`
            : "https://via.placeholder.com/150",
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