import React, { createContext, useContext, useState } from 'react';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  category?: string;
  purchaseType?: 'onetime' | 'subscription';
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
    rate: number;
  }[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

const getERPItems = () => {
  return items
    .filter(item => item.price > 0) // 🚨 prevent bad data
    .map(item => ({
      item_code: item.productId,
      qty: item.quantity,
      rate: item.price,
    }));
};



 const addToCart = (item: CartItem) => {
  setItems(prev => {
    const existing = prev.find(p => p.productId === item.productId);

    if (existing) {
      // ✅ increase quantity instead of duplicate
      return prev.map(p =>
        p.productId === item.productId
          ? { ...p, quantity: p.quantity + item.quantity }
          : p
      );
    }

    return [...prev, item];
  });
};

const removeFromCart = (productId: string) => {
  setItems(prev =>
    prev
      .map(item =>
        item.productId === productId
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter(item => item.quantity > 0)
  );
};

  const updateQuantity = (productId: string, quantity: number) => {
    setItems(prev =>
      prev.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )
    );
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
        getERPItems
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
