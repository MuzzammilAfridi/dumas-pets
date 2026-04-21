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
  gpvRatio?: string;
  vegetables?: string[];
  preparationInstructions?: string;
  freeSoup?: number;
  extraSoup?: number;
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
    console.log("QUOTATION ID:", quotationId);

    const res = await getCart(quotationId);

    console.log("FULL ERP RESPONSE:", res.data);

    const erpItems = res.data.data.items;

    console.log("ERP ITEMS FROM QUOTATION:", erpItems);

    const BASE_URL = "https://dumas.frappe.cloud";

    const detailedItems = await Promise.all(
      erpItems.map(async (i) => {
        console.log("SINGLE ERP ITEM:", i);

        try {
          const itemRes = await fetch(
            `/api/resource/Item/${encodeURIComponent(i.item_code)}`
          );

          const itemData = await itemRes.json();

          console.log("ITEM MASTER DATA:", itemData);

          const finalItem = {
            productId: i.item_code,
            name: i.item_name,
            price: i.rate,
            quantity: i.qty,

            image: itemData.data.image
              ? `${BASE_URL}${itemData.data.image}`
              : "/placeholder.png",

            category: itemData.data.item_group,

            purchaseType: i.custom_purchase_type || "onetime",

            customization: {
              meatType: i.custom_meat_type || "",
              grainType: i.custom_grain_type || "",
              grainPercentage: i.custom_grain_percentage || 0,
              gpvRatio: i.custom_gpv_ratio || "",
              vegetables: i.custom_vegetables
                ? i.custom_vegetables.split(", ")
                : [],
              preparationInstructions:
                i.custom_preparation_instructions || "",
              freeSoup: i.custom_free_soup || 0,
              extraSoup: i.custom_extra_soup || 0,
            },

            subscription: {
              frequency:
                i.custom_purchase_type === "subscription"
                  ? "weekly"
                  : "once",

              date: i.custom_delivery_date
                ? new Date(i.custom_delivery_date)
                : undefined,

              startDate: i.custom_subscription_start
                ? new Date(i.custom_subscription_start)
                : undefined,

              endDate: i.custom_subscription_end
                ? new Date(i.custom_subscription_end)
                : undefined,

              timeSlot: i.custom_delivery_time_slot || "",

              deliveryDays: i.custom_delivery_days
                ? i.custom_delivery_days.split(", ")
                : [],
            },
          };

          console.log("FINAL CART ITEM AFTER MAPPING:", finalItem);

          return finalItem;
        } catch (err) {
          console.error("ITEM FETCH FAILED:", err);

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

    console.log("FINAL CART AFTER REFRESH:", detailedItems);

    setItems(detailedItems);
  } catch (err) {
    console.error("FAILED TO LOAD ERP CART:", err.response?.data || err);
  }
};

    loadCart();
  }, [quotationId]);

  const syncWithERP = async (updatedItems) => {
  try {
    // ✅ IMPORTANT FIX: if last item removed
    if (updatedItems.length === 0) {
      console.log("Last item removed → clearing quotation");

      // clear frontend cart state
      localStorage.removeItem("quotation_id");
      setQuotationId(null);

      // OPTIONAL:
      // if backend supports delete quotation then use:
      // await axios.delete(`/api/resource/Quotation/${quotationId}`);

      return;
    }

    // const payload = {
    //   quotation_to: "Customer",
    //   party_name: "Aanchal Sagar Jain",

    //   items: updatedItems.map((item) => ({
    //     item_code: item.productId,
    //     qty: item.quantity,

    //     custom_meat_type:
    //       item.customization?.meatType || "",

    //     custom_grain_type:
    //       item.customization?.grainType || "",

    //     custom_grain_percentage:
    //       item.customization?.grainPercentage || 0,

    //     custom_gpv_ratio:
    //       item.customization?.gpvRatio || "",

    //     custom_vegetables:
    //       item.customization?.vegetables?.join(", ") || "",

    //     custom_preparation_instructions:
    //       item.customization?.preparationInstructions || "",

    //     custom_free_soup:
    //       item.customization?.freeSoup || 0,

    //     custom_extra_soup:
    //       item.customization?.extraSoup || 0,

    //     custom_purchase_type:
    //       item.purchaseType || "onetime",

    //     custom_delivery_date:
    //       item.subscription?.date || null,

    //     custom_delivery_time_slot:
    //       item.subscription?.timeSlot || "",

    //     custom_subscription_start:
    //       item.subscription?.startDate || null,

    //     custom_subscription_end:
    //       item.subscription?.endDate || null,

    //     custom_delivery_days:
    //       item.subscription?.deliveryDays?.join(", ") || "",
    //   })),
    // };


const payload = {
  customer: "Anand Sharma",
  transaction_date: new Date().toISOString().split("T")[0],

  items: updatedItems.map((item) => ({
    item_code: item.productId,
    qty: item.quantity,

    // ✅ Required field for Sales Order
    delivery_date: item.subscription?.date
      ? new Date(item.subscription.date)
          .toISOString()
          .split("T")[0]
      : new Date().toISOString().split("T")[0],
  })),
};
    
    console.log("PAYLOAD SENT TO ERP:", payload);

    if (!quotationId) {
      const res = await createCart(payload);

      console.log("ERP RESPONSE:", res.data);

      const id = res.data.data.name;
      setQuotationId(id);
      localStorage.setItem("quotation_id", id);
    } else {
      await updateCart(quotationId, payload);

      console.log("ERP UPDATED SUCCESSFULLY");
    }
  } catch (err) {
    console.error(
      "ERP Sync Failed:",
      err.response?.data || err
    );
  }
};

// const syncWithERP = async (updatedItems) => {
//   try {
//     const payload = {
//       quotation_to: "Customer",
//       party_name: "Aanchal Sagar Jain",

//       items: updatedItems.map((item) => ({
//         item_code: item.productId,
//         qty: item.quantity,

//         // -------- Customization --------
//         custom_meat_type:
//           item.customization?.meatType || "",

//         custom_grain_type:
//           item.customization?.grainType || "",

//         custom_grain_percentage:
//           item.customization?.grainPercentage || 0,

//         custom_gpv_ratio:
//           item.customization?.gpvRatio || "",

//         custom_vegetables:
//           item.customization?.vegetables?.join(", ") || "",

//         custom_preparation_instructions:
//           item.customization?.preparationInstructions || "",

//         custom_free_soup:
//           item.customization?.freeSoup || 0,

//         custom_extra_soup:
//           item.customization?.extraSoup || 0,

//         // -------- Purchase Type --------
//         custom_purchase_type:
//           item.purchaseType || "onetime",

//         // -------- One Time Purchase --------
//         custom_delivery_date:
//           item.subscription?.date || null,

//         custom_delivery_time_slot:
//           item.subscription?.timeSlot || "",

//         // -------- Subscription --------
//         custom_subscription_start:
//           item.subscription?.startDate || null,

//         custom_subscription_end:
//           item.subscription?.endDate || null,

//         custom_delivery_days:
//           item.subscription?.deliveryDays?.join(", ") || "",
//       })),
//     };

//     console.log("PAYLOAD SENT TO ERP:", payload);

//     if (!quotationId) {
//       const res = await createCart(payload);
//       console.log("ERP RESPONSE:", res.data);

//       const id = res.data.data.name;
//       setQuotationId(id);
//       localStorage.setItem("quotation_id", id);
//     } else {
//       await updateCart(quotationId, payload);
//       console.log("ERP UPDATED SUCCESSFULLY");
//     }
//   } catch (err) {
//     console.error("ERP Sync Failed:", err.response?.data || err);
//   }
// };
  const getERPItems = () => {
    return items

      .filter((item) => item.productId)
      .map((item) => ({
        item_code: item.productId, // ✅ NO TRIM
        qty: item.quantity,
      }));
  };

const addToCart = (item) => {
  setItems((prev) => {
    let updated;

    const existing = prev.find((p) => p.productId === item.productId);

    if (existing) {
      updated = prev.map((p) =>
        p.productId === item.productId
          ? { ...p, quantity: p.quantity + item.quantity }
          : p
      );
    } else {
      updated = [...prev, item];
    }

    console.log("ITEM ADDED TO CART:", updated); // ✅ Debug log

    syncWithERP(updated);

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
