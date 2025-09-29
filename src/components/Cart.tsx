import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, Trash2, Plus, Minus, CreditCard, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

interface CartProps {
  onBack: () => void;
  onCheckout: (paymentMethod: 'cash' | 'card', tipAmount: number) => void;
}

const Cart: React.FC<CartProps> = ({ onBack, onCheckout }) => {
  const { items, cartTotal, updateQuantity, removeFromCart, deliveryMethod, setDeliveryMethod, seat } = useCart();
  const [tipPercentage, setTipPercentage] = useState<number>(15);
  const [customTip, setCustomTip] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('card');
  const { toast } = useToast();

  const TAX_RATE = 0.08;
  const taxAmount = cartTotal * TAX_RATE;
  const tipAmount = customTip ? parseFloat(customTip) : (cartTotal * tipPercentage) / 100;
  const total = cartTotal + taxAmount + tipAmount;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to your cart before checking out",
        variant: "destructive",
      });
      return;
    }

    onCheckout(paymentMethod, tipAmount);
  };

  const getModifierText = (item: any) => {
    const texts: string[] = [];
    if (item.modifiers && Object.keys(item.modifiers).length > 0) {
      Object.entries(item.modifiers).forEach(([modifierId, optionIds]: [string, any]) => {
        const modifier = item.menuItem.modifiers?.find((m: any) => m.id === modifierId);
        if (modifier && optionIds.length > 0) {
          const optionNames = optionIds.map((id: string) => {
            const option = modifier.options.find((o: any) => o.id === id);
            return option?.name;
          }).filter(Boolean);
          if (optionNames.length > 0) {
            texts.push(optionNames.join(', '));
          }
        }
      });
    }
    return texts.join(' • ');
  };

  return (
    <div className="min-h-screen bg-background pb-32">
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
          <h1 className="text-xl font-bold flex-1">Your Cart</h1>
          <ShoppingCart className="h-6 w-6" />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {items.length === 0 ? (
          <Card className="p-8 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">Your cart is empty</p>
            <Button onClick={onBack} variant="default" className="mt-4">
              Browse Menu
            </Button>
          </Card>
        ) : (
          <>
            {/* Cart Items */}
            <Card className="p-4">
              <h2 className="font-semibold text-lg mb-3">Order Items</h2>
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="border-b pb-4 last:border-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.menuItem.name}</h3>
                        {getModifierText(item) && (
                          <p className="text-sm text-muted-foreground">{getModifierText(item)}</p>
                        )}
                      </div>
                      <Button
                        onClick={() => removeFromCart(item.id)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="min-w-[2ch] text-center font-semibold">{item.quantity}</span>
                        <Button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          variant="outline"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="font-semibold">{formatPrice(item.subtotal)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Delivery Method */}
            {seat && (
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="delivery-toggle" className="text-base font-semibold">
                      Delivery to Seat
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {seat.section} • Row {seat.row} • Seat {seat.seat}
                    </p>
                  </div>
                  <Switch
                    id="delivery-toggle"
                    checked={deliveryMethod === 'delivery'}
                    onCheckedChange={(checked) => setDeliveryMethod(checked ? 'delivery' : 'pickup')}
                  />
                </div>
                {deliveryMethod === 'pickup' && (
                  <div className="mt-3 p-3 bg-muted rounded-lg">
                    <p className="text-sm">Pickup at: <strong>Concessions Stand A - North Gate</strong></p>
                  </div>
                )}
              </Card>
            )}

            {/* Tip Selection */}
            <Card className="p-4">
              <h2 className="font-semibold text-lg mb-3">Add a Tip</h2>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[0, 10, 15, 20].map((percent) => (
                  <Button
                    key={percent}
                    onClick={() => {
                      setTipPercentage(percent);
                      setCustomTip('');
                    }}
                    variant={tipPercentage === percent && !customTip ? 'default' : 'outline'}
                    size="sm"
                  >
                    {percent === 0 ? 'None' : `${percent}%`}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Custom:</span>
                <div className="flex items-center">
                  <span className="text-muted-foreground mr-1">$</span>
                  <input
                    type="number"
                    value={customTip}
                    onChange={(e) => {
                      setCustomTip(e.target.value);
                      setTipPercentage(0);
                    }}
                    placeholder="0.00"
                    className="w-24 px-2 py-1 border rounded-md"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-4">
              <h2 className="font-semibold text-lg mb-3">Payment Method</h2>
              <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="h-5 w-5" />
                      <span>Credit/Debit Card</span>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="cash" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-2 cursor-pointer flex-1">
                      <DollarSign className="h-5 w-5" />
                      <span>Cash at Pickup</span>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </Card>

            {/* Order Summary */}
            <Card className="p-4">
              <h2 className="font-semibold text-lg mb-3">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{formatPrice(taxAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tip</span>
                  <span>{formatPrice(tipAmount)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-semibold text-lg">Total</span>
                  <span className="font-bold text-xl text-primary">{formatPrice(total)}</span>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {/* Checkout Button */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 max-w-[428px] mx-auto">
          <Button
            onClick={handleCheckout}
            variant="hero"
            size="lg"
            className="w-full"
          >
            {paymentMethod === 'cash' ? 'Place Order (Pay at Pickup)' : 'Pay Now'} • {formatPrice(total)}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;