import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { MenuItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

interface MenuItemDetailProps {
  item: MenuItem;
  onClose: () => void;
}

const MenuItemDetail: React.FC<MenuItemDetailProps> = ({ item, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedModifiers, setSelectedModifiers] = useState<{ [key: string]: string[] }>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const { addToCart } = useCart();
  const { toast } = useToast();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const calculateTotal = () => {
    let basePrice = item.price;
    
    if (item.modifiers) {
      item.modifiers.forEach((modifier) => {
        const selected = selectedModifiers[modifier.id] || [];
        selected.forEach((optionId) => {
          const option = modifier.options.find((opt) => opt.id === optionId);
          if (option) {
            basePrice += option.price;
          }
        });
      });
    }
    
    return basePrice * quantity;
  };

  const handleModifierChange = (modifierId: string, optionId: string, isRadio: boolean) => {
    if (isRadio) {
      setSelectedModifiers({ ...selectedModifiers, [modifierId]: [optionId] });
    } else {
      const current = selectedModifiers[modifierId] || [];
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      setSelectedModifiers({ ...selectedModifiers, [modifierId]: updated });
    }
  };

  const handleAddToCart = () => {
    // Validate required modifiers
    if (item.modifiers) {
      for (const modifier of item.modifiers) {
        if (modifier.required && (!selectedModifiers[modifier.id] || selectedModifiers[modifier.id].length === 0)) {
          toast({
            title: "Required selection",
            description: `Please select ${modifier.name}`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    addToCart(item, quantity, selectedModifiers);
    
    toast({
      title: "Added to cart!",
      description: `${quantity} × ${item.name}`,
    });
    
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-primary text-primary-foreground p-4 shadow-lg z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">{item.name}</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            <X className="h-6 w-6" />
          </Button>
        </div>
      </div>

      <div className="p-4 pb-32">
        {/* Item Info */}
        <Card className="p-4 mb-4">
          <p className="text-muted-foreground mb-3">{item.description}</p>
          
          <div className="flex items-center justify-between mb-3">
            <p className="text-2xl font-bold text-primary">{formatPrice(item.price)}</p>
            {item.stockStatus === 'low-stock' && (
              <Badge className="bg-warning text-warning-foreground">Low Stock</Badge>
            )}
          </div>

          {item.allergens && item.allergens.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Allergens:</span>
              {item.allergens.map((allergen) => (
                <Badge key={allergen} variant="outline">
                  {allergen}
                </Badge>
              ))}
            </div>
          )}

          {item.comboDeal && (
            <div className="mt-3 p-3 bg-secondary/20 rounded-lg">
              <div className="flex items-center gap-2 text-secondary-foreground">
                <Tag className="h-5 w-5" />
                <span className="font-semibold">Combo Deal - Save {formatPrice(item.comboDeal.savings)}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Includes: {item.comboDeal.items.join(', ')}
              </p>
            </div>
          )}
        </Card>

        {/* Modifiers */}
        {item.modifiers && item.modifiers.map((modifier) => (
          <Card key={modifier.id} className="p-4 mb-4">
            <div className="mb-3">
              <Label className="text-base font-semibold">
                {modifier.name}
                {modifier.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              {modifier.maxSelections && (
                <p className="text-sm text-muted-foreground">
                  Select up to {modifier.maxSelections}
                </p>
              )}
            </div>

            {modifier.maxSelections === 1 || modifier.required ? (
              <RadioGroup
                value={selectedModifiers[modifier.id]?.[0] || ''}
                onValueChange={(value) => handleModifierChange(modifier.id, value, true)}
              >
                <div className="space-y-2">
                  {modifier.options.map((option) => (
                    <div key={option.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center space-x-3">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label htmlFor={option.id} className="font-normal cursor-pointer">
                          {option.name}
                        </Label>
                      </div>
                      {option.price > 0 && (
                        <span className="text-sm text-muted-foreground">
                          +{formatPrice(option.price)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </RadioGroup>
            ) : (
              <div className="space-y-2">
                {modifier.options.map((option) => (
                  <div key={option.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={option.id}
                        checked={(selectedModifiers[modifier.id] || []).includes(option.id)}
                        onCheckedChange={() => handleModifierChange(modifier.id, option.id, false)}
                      />
                      <Label htmlFor={option.id} className="font-normal cursor-pointer">
                        {option.name}
                      </Label>
                    </div>
                    {option.price > 0 && (
                      <span className="text-sm text-muted-foreground">
                        +{formatPrice(option.price)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}

        {/* Special Instructions */}
        <Card className="p-4 mb-4">
          <Label htmlFor="instructions" className="text-base font-semibold mb-2 block">
            Special Instructions (Optional)
          </Label>
          <Textarea
            id="instructions"
            placeholder="Any special requests or dietary needs?"
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            className="min-h-[80px]"
          />
        </Card>

        {/* Quantity Selector */}
        <Card className="p-4">
          <Label className="text-base font-semibold mb-3 block">Quantity</Label>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                variant="outline"
                size="icon"
                className="h-12 w-12"
              >
                <Minus className="h-5 w-5" />
              </Button>
              <span className="text-2xl font-bold min-w-[3ch] text-center">{quantity}</span>
              <Button
                onClick={() => setQuantity(quantity + 1)}
                variant="outline"
                size="icon"
                className="h-12 w-12"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xl font-bold text-primary">
              {formatPrice(calculateTotal())}
            </p>
          </div>
        </Card>
      </div>

      {/* Add to Cart Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
        <Button
          onClick={handleAddToCart}
          variant="hero"
          size="lg"
          className="w-full"
          disabled={item.stockStatus === 'out-of-stock'}
        >
          <ShoppingCart className="h-5 w-5" />
          Add to Cart • {formatPrice(calculateTotal())}
        </Button>
      </div>
    </div>
  );
};

export default MenuItemDetail;