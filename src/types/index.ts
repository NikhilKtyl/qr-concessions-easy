export interface Event {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  deliveryEnabled: boolean;
  pickupLocation: string;
  status: 'upcoming' | 'active' | 'past';
}

export interface SeatLocation {
  section: string;
  row: string;
  seat: string;
}

export interface MenuItem {
  id: string;
  category: 'food' | 'drinks' | 'combos';
  name: string;
  description: string;
  price: number;
  image?: string;
  stockStatus: 'in-stock' | 'low-stock' | 'out-of-stock';
  allergens?: string[];
  modifiers?: Modifier[];
  comboDeal?: {
    items: string[];
    savings: number;
  };
}

export interface Modifier {
  id: string;
  name: string;
  options: ModifierOption[];
  required: boolean;
  maxSelections?: number;
}

export interface ModifierOption {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  modifiers: { [modifierId: string]: string[] };
  specialInstructions?: string;
  subtotal: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  paymentMethod: 'cash' | 'card';
  deliveryMethod: 'pickup' | 'delivery';
  seat?: SeatLocation;
  status: OrderStatus;
  estimatedTime: string;
  createdAt: Date;
  qrCode?: string;
}

export type OrderStatus = 
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'out-for-delivery'
  | 'delivered'
  | 'completed';

export interface CheckoutFormData {
  deliveryMethod: 'pickup' | 'delivery';
  paymentMethod: 'cash' | 'card';
  tipAmount: number;
  tipPercentage?: number;
  seat?: SeatLocation;
  customerName?: string;
  customerPhone?: string;
  acceptTerms: boolean;
}