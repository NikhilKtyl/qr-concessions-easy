import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, MenuItem, SeatLocation } from '@/types';

interface CartContextType {
  items: CartItem[];
  seat: SeatLocation | null;
  deliveryMethod: 'pickup' | 'delivery';
  addToCart: (item: MenuItem, quantity: number, modifiers: { [key: string]: string[] }) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  setSeat: (seat: SeatLocation | null) => void;
  setDeliveryMethod: (method: 'pickup' | 'delivery') => void;
  cartTotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [seat, setSeat] = useState<SeatLocation | null>(() => {
    const saved = localStorage.getItem('seat');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>(() => {
    const saved = localStorage.getItem('deliveryMethod');
    return (saved as 'pickup' | 'delivery') || 'pickup';
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('seat', JSON.stringify(seat));
  }, [seat]);

  useEffect(() => {
    localStorage.setItem('deliveryMethod', deliveryMethod);
  }, [deliveryMethod]);

  const calculateItemSubtotal = (item: MenuItem, modifiers: { [key: string]: string[] }) => {
    let subtotal = item.price;
    
    if (item.modifiers) {
      item.modifiers.forEach((modifier) => {
        const selectedOptions = modifiers[modifier.id] || [];
        selectedOptions.forEach((optionId) => {
          const option = modifier.options.find((opt) => opt.id === optionId);
          if (option) {
            subtotal += option.price;
          }
        });
      });
    }
    
    return subtotal;
  };

  const addToCart = (item: MenuItem, quantity: number, modifiers: { [key: string]: string[] }) => {
    const subtotal = calculateItemSubtotal(item, modifiers) * quantity;
    
    const newItem: CartItem = {
      id: `${item.id}_${Date.now()}`,
      menuItem: item,
      quantity,
      modifiers,
      subtotal
    };
    
    setItems([...items, newItem]);
  };

  const removeFromCart = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    setItems(items.map((item) => {
      if (item.id === itemId) {
        const subtotal = calculateItemSubtotal(item.menuItem, item.modifiers) * quantity;
        return { ...item, quantity, subtotal };
      }
      return item;
    }));
  };

  const clearCart = () => {
    setItems([]);
    setSeat(null);
  };

  const cartTotal = items.reduce((total, item) => total + item.subtotal, 0);
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        seat,
        deliveryMethod,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setSeat,
        setDeliveryMethod,
        cartTotal,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};