import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EventLanding from '@/components/EventLanding';
import SeatSelection from '@/components/SeatSelection';
import MenuBrowse from '@/components/MenuBrowse';
import Cart from '@/components/Cart';
import OrderConfirmation from '@/components/OrderConfirmation';
import OrderHistory from '@/components/OrderHistory';
import { useCart } from '@/context/CartContext';
import { useOrders } from '@/context/OrderContext';
import { currentEvent } from '@/data/mockData';
import { Order } from '@/types';

type AppScreen = 'landing' | 'seat' | 'menu' | 'cart' | 'confirmation' | 'history';

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('landing');
  const location = useLocation();
  const navigate = useNavigate();
  const { setSeat, clearCart, items, cartTotal, seat, deliveryMethod, setDeliveryMethod } = useCart();
  const { addOrder, currentOrder, getOrder, updateOrderStatus } = useOrders();

  useEffect(() => {
    if (location.pathname === '/cart') {
      setCurrentScreen('cart');
    } else if (location.pathname === '/history') {
      setCurrentScreen('history');
    }
  }, [location]);

  useEffect(() => {
    // Simulate order status updates
    if (currentOrder && currentOrder.status === 'confirmed') {
      const timer = setTimeout(() => {
        updateOrderStatus(currentOrder.id, 'preparing');
      }, 3000);
      return () => clearTimeout(timer);
    }
    
    if (currentOrder && currentOrder.status === 'preparing') {
      const timer = setTimeout(() => {
        updateOrderStatus(currentOrder.id, 'ready');
      }, 5000);
      return () => clearTimeout(timer);
    }
    
    if (currentOrder && currentOrder.status === 'ready' && currentOrder.deliveryMethod === 'delivery') {
      const timer = setTimeout(() => {
        updateOrderStatus(currentOrder.id, 'out-for-delivery');
      }, 3000);
      return () => clearTimeout(timer);
    }
    
    if (currentOrder && currentOrder.status === 'out-for-delivery') {
      const timer = setTimeout(() => {
        updateOrderStatus(currentOrder.id, 'delivered');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentOrder, updateOrderStatus]);

  const handleStartOrder = () => {
    if (currentEvent.deliveryEnabled) {
      setCurrentScreen('seat');
    } else {
      setCurrentScreen('menu');
    }
  };

  const handleSeatSubmit = (seatLocation: any) => {
    setSeat(seatLocation);
    setDeliveryMethod('delivery'); // Auto-set to delivery when seat is selected
    setCurrentScreen('menu');
  };

  const handleCheckout = (paymentMethod: 'cash' | 'card', tipAmount: number) => {
    const TAX_RATE = 0.08;
    const subtotal = cartTotal;
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax + tipAmount;

    const order: Order = {
      id: `order_${Date.now()}`,
      orderNumber: Math.random().toString(36).substring(2, 8).toUpperCase(),
      items: items,
      subtotal,
      tax,
      tip: tipAmount,
      total,
      paymentMethod,
      deliveryMethod,
      seat: seat || undefined,
      status: 'confirmed',
      estimatedTime: '10-15 minutes',
      createdAt: new Date(),
    };

    addOrder(order);
    clearCart();
    setCurrentScreen('confirmation');
    navigate('/');
  };

  const handleViewOrderFromHistory = (orderId: string) => {
    const order = getOrder(orderId);
    if (order) {
      setCurrentScreen('confirmation');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <EventLanding onStartOrder={handleStartOrder} />;
      case 'seat':
        return (
          <SeatSelection
            onSubmit={handleSeatSubmit}
            onSkip={() => setCurrentScreen('menu')}
            deliveryEnabled={currentEvent.deliveryEnabled}
          />
        );
      case 'menu':
        return <MenuBrowse />;
      case 'cart':
        return (
          <Cart
            onBack={() => {
              setCurrentScreen('menu');
              navigate('/');
            }}
            onCheckout={handleCheckout}
          />
        );
      case 'confirmation':
        return currentOrder ? (
          <OrderConfirmation
            order={currentOrder}
            onNewOrder={() => {
              setCurrentScreen('menu');
              navigate('/');
            }}
            onViewHistory={() => {
              setCurrentScreen('history');
              navigate('/history');
            }}
          />
        ) : null;
      case 'history':
        return (
          <OrderHistory
            onBack={() => {
              setCurrentScreen('landing');
              navigate('/');
            }}
            onSelectOrder={handleViewOrderFromHistory}
          />
        );
      default:
        return <EventLanding onStartOrder={handleStartOrder} />;
    }
  };

  return renderScreen();
};

export default Index;