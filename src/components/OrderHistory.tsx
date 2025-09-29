import React from 'react';
import { ArrowLeft, Receipt, Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useOrders } from '@/context/OrderContext';

interface OrderHistoryProps {
  onBack: () => void;
  onSelectOrder: (orderId: string) => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ onBack, onSelectOrder }) => {
  const { orders } = useOrders();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(new Date(date));
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
      case 'delivered':
        return 'default';
      case 'ready':
        return 'default';
      case 'preparing':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground p-4 shadow-lg">
        <div className="flex items-center gap-3">
          <Button
            onClick={onBack}
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold flex-1">Order History</h1>
          <Receipt className="h-6 w-6" />
        </div>
      </div>

      <div className="p-4">
        {orders.length === 0 ? (
          <Card className="p-8 text-center">
            <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">No orders yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Your order history will appear here
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Card
                key={order.id}
                className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => onSelectOrder(order.id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-lg">Order #{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(order.status) as any}>
                    {order.status.replace('-', ' ')}
                  </Badge>
                </div>

                <div className="space-y-1 mb-3">
                  {order.items.slice(0, 2).map((item, index) => (
                    <p key={index} className="text-sm text-muted-foreground">
                      {item.quantity}x {item.menuItem.name}
                    </p>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-sm text-muted-foreground">
                      +{order.items.length - 2} more items
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {order.deliveryMethod === 'delivery' ? 'Delivered to seat' : 'Pickup'}
                    </span>
                    {order.paymentMethod === 'cash' && (
                      <Badge variant="outline" className="text-xs">Cash</Badge>
                    )}
                  </div>
                  <p className="font-bold text-primary">{formatPrice(order.total)}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Quick Feedback */}
      {orders.length > 0 && orders[0].status === 'completed' && (
        <div className="fixed bottom-4 left-4 right-4">
          <Card className="p-4 bg-gradient-gold">
            <p className="text-sm font-semibold text-secondary-foreground mb-2">
              How was your experience?
            </p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant="ghost"
                  size="icon"
                  className="hover:scale-110"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle rating
                  }}
                >
                  <Star className={`h-6 w-6 ${rating <= 3 ? 'fill-current' : ''}`} />
                </Button>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;