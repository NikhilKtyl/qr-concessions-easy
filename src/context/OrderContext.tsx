import React, { createContext, useContext, useState, useEffect } from 'react';
import { Order } from '@/types';

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrder: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentOrder, setCurrentOrder] = useState<Order | null>(() => {
    const saved = localStorage.getItem('currentOrder');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('currentOrder', JSON.stringify(currentOrder));
  }, [currentOrder]);

  const addOrder = (order: Order) => {
    setOrders([order, ...orders]);
    setCurrentOrder(order);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map((order) => 
      order.id === orderId ? { ...order, status } : order
    ));
    
    if (currentOrder?.id === orderId) {
      setCurrentOrder({ ...currentOrder, status });
    }
  };

  const getOrder = (orderId: string) => {
    return orders.find((order) => order.id === orderId);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        addOrder,
        updateOrderStatus,
        getOrder
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};