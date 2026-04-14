// hooks/useCategories.js
import { useEffect, useState } from "react";
import { getCategories } from "@/services/categoryService";

export const useCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();

        const data = res.data?.data || [];

        // ❌ remove "All Item Groups"
        const filtered = data.filter(
          (item) => item.name !== "All Item Groups"
        );

        setCategories(filtered);
      } catch (err) {
        console.error("Category fetch error:", err);
      }
    };

    fetchCategories();
  }, []);

  return categories;
};