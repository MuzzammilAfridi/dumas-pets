import React, { createContext, useContext, useState,useEffect } from "react";



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
  updateCartItem: (
  index: number,
  item: CartItem
) => void;
  

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
 const [items, setItems] = useState<CartItem[]>(() => {
  const savedCart = localStorage.getItem("cart_items");

  return savedCart ? JSON.parse(savedCart) : [];
});

useEffect(() => {
  localStorage.setItem(
    "cart_items",
    JSON.stringify(items)
  );
}, [items]);

const clearCart = () => {
  setItems([]);
  localStorage.removeItem("cart_items");
};














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
    const existing = prev.find(
      (p) => p.productId === item.productId
    );

    if (existing) {
      return prev.map((p) =>
        p.productId === item.productId
          ? {
              ...p,
              quantity: p.quantity + item.quantity,
            }
          : p
      );
    }

    return [...prev, item];
  });
};

const updateCartItem = (
  index: number,
  updatedItem: CartItem
) => {
  setItems((prev) =>
    prev.map((item, i) =>
      i === index ? updatedItem : item
    )
  );
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



      return updated;
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) => {
      const updated = prev.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      );

    

      return updated;
    });
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
        updateCartItem,
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
