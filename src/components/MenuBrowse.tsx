import React, { useState } from 'react';
import { Utensils, Coffee, Package, Search, ShoppingCart, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { menuItems } from '@/data/mockData';
import { MenuItem } from '@/types';
import MenuItemDetail from './MenuItemDetail';
import { useCart } from '@/context/CartContext';

const MenuBrowse: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'food' | 'drinks' | 'combos'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const { itemCount, cartTotal } = useCart();

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
          filteredItems.map((item) => (
            <Card
              key={item.id}
              className={`p-4 ${item.stockStatus === 'out-of-stock' ? 'opacity-60' : ''}`}
            >
              <button
                onClick={() => item.stockStatus !== 'out-of-stock' && setSelectedItem(item)}
                disabled={item.stockStatus === 'out-of-stock'}
                className="w-full text-left"
              >
                <div className="flex justify-between items-start mb-2">
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
                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                {item.allergens && item.allergens.length > 0 && (
                  <div className="flex gap-2 flex-wrap">
                    {item.allergens.map((allergen) => (
                      <Badge key={allergen} variant="outline" className="text-xs">
                        {allergen}
                      </Badge>
                    ))}
                  </div>
                )}
              </button>
            </Card>
          ))
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