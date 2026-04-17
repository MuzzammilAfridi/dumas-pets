import React, { createContext, useContext, useState } from "react";

import { createCart, updateCart, getCart } from "../services/cartService.js";
import { useEffect } from "react";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  purchaseType?: "onetime" | "subscription";
  customization?: {
    meatType?: string;
    grainType?: string;
    grainPercentage?: number;
    vegetables?: string[];
    preparationInstructions?: string;
  };
  subscription?: {
    frequency: string;
    date?: Date;
    startDate?: Date;
    endDate?: Date;
    timeSlot?: string;
    deliveryDays?: string[];
  };
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;

  // ✅ ADD THIS
  getERPItems: () => {
    item_code: string;
    qty: number;
  }[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const [quotationId, setQuotationId] = useState<string | null>(
    localStorage.getItem("quotation_id"),
  );

  useEffect(() => {
   const loadCart = async () => {
  if (!quotationId) return;

  try {
    const res = await getCart(quotationId);
    const erpItems = res.data.data.items;

    const BASE_URL = "https://dumas.frappe.cloud";

    // 🔥 Fetch full item data (parallel)
    const detailedItems = await Promise.all(
      erpItems.map(async (i) => {
        try {
          const itemRes = await fetch(
            `/api/resource/Item/${encodeURIComponent(i.item_code)}`
          );

          const itemData = await itemRes.json();

          return {
            productId: i.item_code,
            name: i.item_name,
            price: i.rate,
            quantity: i.qty,
            image: itemData.data.image
              ? `${BASE_URL}${itemData.data.image}`
              : "/placeholder.png",
            category: itemData.data.item_group,
          };
        } catch {
          return {
            productId: i.item_code,
            name: i.item_name,
            price: i.rate,
            quantity: i.qty,
            image: "/placeholder.png",
          };
        }
      })
    );

    setItems(detailedItems);
  } catch (err) {
    console.error("Failed to load ERP cart");
  }
};

    loadCart();
  }, [quotationId]);

  const syncWithERP = async (updatedItems) => {
    try {
      console.log("udpatedItem in context", updatedItems);

      const payload = {
        quotation_to: "Customer",
        party_name: "Aanchal Sagar Jain", // TODO: dynamic user
        items: updatedItems.map((item) => ({
          item_code: item.productId.trim(),
          qty: item.quantity,
        })),
      };

      if (!quotationId) {
        // CREATE
        const res = await createCart(payload);
        const id = res.data.data.name;

        setQuotationId(id);
        localStorage.setItem("quotation_id", id);
      } else {
        // UPDATE
        await updateCart(quotationId, payload);
      }
    } catch (err) {
      console.error("ERP Sync Failed", err);
    }
  };

  const getERPItems = () => {
    return items

      .filter((item) => item.productId)
      .map((item) => ({
        item_code: item.productId, // ✅ NO TRIM
        qty: item.quantity,
      }));
  };

  const addToCart = (item: CartItem) => {
    setItems((prev) => {
      let updated;

      const existing = prev.find((p) => p.productId === item.productId);

      if (existing) {
        updated = prev.map((p) =>
          p.productId === item.productId
            ? { ...p, quantity: p.quantity + item.quantity }
            : p,
        );
      } else {
        updated = [...prev, item];
      }

      syncWithERP(updated); // 🔥 IMPORTANT

      return updated;
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => {
      const updated = prev
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0);

      syncWithERP(updated); // 🔥 IMPORTANT

      return updated;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) => {
      const updated = prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      );

      syncWithERP(updated); // 🔥 IMPORTANT

      return updated;
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getItemCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getItemCount,
        getERPItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};
