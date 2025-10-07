import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, MapPin, QrCode, Package, Truck, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Order } from '@/types';
import { QRCodeSVG } from 'qrcode.react';

interface OrderConfirmationProps {
  order: Order;
  onNewOrder: () => void;
  onViewHistory: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order, onNewOrder, onViewHistory }) => {
  const [showImHere, setShowImHere] = useState(false);

  useEffect(() => {
    // Simulate order status updates
    const timer = setTimeout(() => {
      if (order.status === 'ready' && order.deliveryMethod === 'pickup') {
        setShowImHere(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [order.status, order.deliveryMethod]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getStatusIcon = () => {
    switch (order.status) {
      case 'confirmed':
        return <CheckCircle className="h-8 w-8 text-success" />;
      case 'preparing':
        return <Clock className="h-8 w-8 text-warning animate-pulse" />;
      case 'ready':
        return <Package className="h-8 w-8 text-success" />;
      case 'out-for-delivery':
        return <Truck className="h-8 w-8 text-info animate-pulse" />;
      case 'delivered':
      case 'completed':
        return <CheckCircle className="h-8 w-8 text-success" />;
      default:
        return <Clock className="h-8 w-8 text-muted-foreground" />;
    }
  };

  const getStatusMessage = () => {
    switch (order.status) {
      case 'confirmed':
        return 'Order Confirmed!';
      case 'preparing':
        return 'Preparing Your Order...';
      case 'ready':
        return order.deliveryMethod === 'pickup' ? 'Order Ready for Pickup!' : 'Ready for Delivery!';
      case 'out-for-delivery':
        return 'On the Way to Your Seat!';
      case 'delivered':
        return 'Order Delivered to Your Seat!';
      case 'completed':
        return 'Order Complete!';
      default:
        return 'Processing Order...';
    }
  };

  const getStatusColor = () => {
    switch (order.status) {
      case 'ready':
      case 'delivered':
      case 'completed':
        return 'bg-success text-success-foreground';
      case 'preparing':
        return 'bg-warning text-warning-foreground';
      case 'out-for-delivery':
        return 'bg-info text-info-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="bg-background/95 backdrop-blur-sm p-6 text-center shadow-lg">
        {getStatusIcon()}
        <h1 className="text-2xl font-bold text-foreground mt-3">{getStatusMessage()}</h1>
        <p className="text-muted-foreground mt-2">Order #{order.orderNumber}</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Status Card */}
        <Card className="p-6">
          <div className="text-center mb-6">
            <Badge className={`${getStatusColor()} px-4 py-2 text-base`}>
              {order.status.replace('-', ' ').toUpperCase()}
            </Badge>
            <p className="text-sm text-muted-foreground mt-3">
              Estimated Time: <strong>{order.estimatedTime}</strong>
            </p>
          </div>

          {/* QR Code for order confirmation */}
          <div className="bg-muted rounded-lg p-8 flex flex-col items-center justify-center">
            <div className="bg-white p-4 rounded-lg">
              <QRCodeSVG 
                value={`ORDER:${order.orderNumber}`} 
                size={160}
                level="H"
              />
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">
              {order.deliveryMethod === 'pickup' 
                ? 'Show this code at pickup' 
                : 'Show this code to confirm delivery'}
            </p>
            <p className="font-mono font-bold text-xl mt-2">{order.orderNumber}</p>
          </div>
          
          {/* Delivery Info */}
          {order.deliveryMethod === 'delivery' && (
            <div className="bg-background rounded-lg p-4 text-center border">
              <Truck className="h-12 w-12 text-primary mx-auto mb-2" />
              <p className="font-semibold">Delivering to Your Seat</p>
              <p className="text-sm text-muted-foreground mt-1">
                {order.seat?.section} • Row {order.seat?.row} • Seat {order.seat?.seat}
              </p>
              <div className="mt-3 bg-muted rounded-lg p-2">
                <p className="text-xs text-muted-foreground">Estimated Delivery</p>
                <p className="font-bold text-lg text-primary">{order.estimatedTime}</p>
              </div>
            </div>
          )}
        </Card>

        {/* Delivery/Pickup Info */}
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-primary mt-1" />
            <div>
              {order.deliveryMethod === 'delivery' && order.seat ? (
                <>
                  <p className="font-semibold">Delivering to Your Seat</p>
                  <p className="text-sm text-muted-foreground">
                    {order.seat.section} • Row {order.seat.row} • Seat {order.seat.seat}
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold">Pickup Location</p>
                  <p className="text-sm text-muted-foreground">
                    Concessions Stand A - North Gate
                  </p>
                </>
              )}
            </div>
          </div>
        </Card>

        {/* Notifications */}
        {order.status === 'ready' && order.deliveryMethod === 'pickup' && (
          <Alert className="bg-success/10 border-success">
            <Package className="h-4 w-4" />
            <AlertDescription>
              Your order is ready! Please head to the pickup location.
            </AlertDescription>
          </Alert>
        )}

        {order.status === 'out-for-delivery' && (
          <Alert className="bg-info/10 border-info">
            <Truck className="h-4 w-4" />
            <AlertDescription>
              Your order is on the way! Our staff will arrive at your seat shortly.
            </AlertDescription>
          </Alert>
        )}

        {/* "I'm Here" Button */}
        {showImHere && order.deliveryMethod === 'pickup' && order.status === 'ready' && (
          <Card className="p-4">
            <Button
              onClick={() => {
                setShowImHere(false);
                // In a real app, this would notify the staff
              }}
              variant="gold"
              size="lg"
              className="w-full"
            >
              <Home className="h-5 w-5" />
              I'm Here - Ready to Pick Up
            </Button>
          </Card>
        )}

        {/* Order Summary */}
        <Card className="p-4">
          <h2 className="font-semibold text-lg mb-3">Order Summary</h2>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.quantity}x {item.menuItem.name}</span>
                <span>{formatPrice(item.subtotal)}</span>
              </div>
            ))}
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span>
                <span>{formatPrice(order.tax)}</span>
              </div>
              {order.tip > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Tip</span>
                  <span>{formatPrice(order.tip)}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-base mt-2">
                <span>Total {order.paymentMethod === 'cash' ? '(Cash)' : '(Paid)'}</span>
                <span className="text-primary">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button onClick={onNewOrder} variant="hero" size="lg" className="w-full">
            Order Again
          </Button>
          <Button onClick={onViewHistory} variant="outline" size="lg" className="w-full">
            View Order History
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;