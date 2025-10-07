import React, { useState } from 'react';
import { Utensils, Coffee, Package, Search, ShoppingCart, AlertCircle, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { menuItems } from '@/data/mockData';
import { MenuItem } from '@/types';
import MenuItemDetail from './MenuItemDetail';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

const MenuBrowse: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'food' | 'drinks' | 'combos'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const { itemCount, cartTotal, addToCart, items } = useCart();
  const { toast } = useToast();

  const getItemQuantityInCart = (itemId: string) => {
    return items.filter(cartItem => cartItem.menuItem.id === itemId)
      .reduce((sum, item) => sum + item.quantity, 0);
  };

  const categories = [
    { id: 'all', name: 'All Items', icon: Package },
    { id: 'food', name: 'Food', icon: Utensils },
    { id: 'drinks', name: 'Drinks', icon: Coffee },
    { id: 'combos', name: 'Combos', icon: Package },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStockBadge = (status: MenuItem['stockStatus']) => {
    switch (status) {
      case 'low-stock':
        return <Badge className="bg-warning text-warning-foreground">Low Stock</Badge>;
      case 'out-of-stock':
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return null;
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    setQuantities(prev => ({
      ...prev,
      [itemId]: Math.max(0, (prev[itemId] || 0) + delta)
    }));
  };

  const handleAddToCart = (item: MenuItem) => {
    const quantity = quantities[item.id] || 1;
    
    // If item has modifiers, open detail view
    if (item.modifiers && item.modifiers.length > 0) {
      setSelectedItem(item);
      return;
    }

    // Simple add to cart for items without modifiers
    addToCart(item, quantity, {});

    toast({
      title: "Added to cart",
      description: `${quantity}x ${item.name}`,
    });

    // Reset quantity
    setQuantities(prev => ({ ...prev, [item.id]: 0 }));
  };

  if (selectedItem) {
    return (
      <MenuItemDetail
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="bg-gradient-primary text-primary-foreground p-4 pb-6">
        <h1 className="text-2xl font-bold text-center mb-4">Menu</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-primary-foreground/60" />
          <Input
            type="search"
            placeholder="Search menu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="bg-background sticky top-0 z-10 shadow-md">
        <div className="flex overflow-x-auto no-scrollbar p-2 gap-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id as any)}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                className="flex-shrink-0 gap-2"
              >
                <Icon className="h-4 w-4" />
                {category.name}
              </Button>
            );
          })}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="p-4 grid gap-4">
        {filteredItems.length === 0 ? (
          <Card className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No items found</p>
          </Card>
        ) : (
          filteredItems.map((item) => {
            const currentQty = quantities[item.id] || 0;
            const cartQty = getItemQuantityInCart(item.id);
            const isOutOfStock = item.stockStatus === 'out-of-stock';
            
            return (
              <Card
                key={item.id}
                className={`p-4 ${isOutOfStock ? 'opacity-60' : ''}`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground">{item.name}</h3>
                      {item.comboDeal && (
                        <Badge variant="secondary" className="mt-1">
                          Save {formatPrice(item.comboDeal.savings)}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-primary">{formatPrice(item.price)}</p>
                      {getStockBadge(item.stockStatus)}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  
                  {item.allergens && item.allergens.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {item.allergens.map((allergen) => (
                        <Badge key={allergen} variant="outline" className="text-xs">
                          {allergen}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Quantity Controls & Add Button */}
                  {!isOutOfStock && (
                    <div className="flex items-center gap-2">
                      {currentQty > 0 ? (
                        <>
                          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.id, -1)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="font-semibold w-8 text-center">{currentQty}</span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => handleQuantityChange(item.id, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <Button
                            onClick={() => handleAddToCart(item)}
                            className="flex-1"
                            variant="default"
                          >
                            {item.modifiers && item.modifiers.length > 0 
                              ? 'Customize & Add' 
                              : `Add ${formatPrice(item.price * currentQty)}`}
                          </Button>
                        </>
                      ) : (
                        <Button
                          onClick={() => {
                            handleQuantityChange(item.id, 1);
                          }}
                          className="w-full"
                          variant="outline"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      )}
                    </div>
                  )}

                  {cartQty > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {cartQty} in cart
                    </p>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Floating Cart Button */}
      {itemCount > 0 && (
        <div className="fixed bottom-4 left-4 right-4 max-w-[396px] mx-auto">
          <Button
            variant="cart"
            size="lg"
            className="rounded-full shadow-2xl w-full"
            onClick={() => window.location.href = '/cart'}
          >
            <ShoppingCart className="h-6 w-6" />
            <span className="ml-2">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} • {formatPrice(cartTotal)}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default MenuBrowse;