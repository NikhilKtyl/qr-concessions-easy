import { Event, MenuItem } from '@/types';

export const currentEvent: Event = {
  id: 'evt_001',
  name: 'Homecoming Game',
  date: 'Sept 15',
  time: '7:00 PM',
  venue: 'Wilson High School Stadium',
  deliveryEnabled: true,
  pickupLocation: 'Concessions Stand A - North Gate',
  status: 'active'
};

export const menuItems: MenuItem[] = [
  // Food Items
  {
    id: 'item_001',
    category: 'food',
    name: 'Stadium Hot Dog',
    description: 'All-beef hot dog with your choice of toppings',
    price: 5.50,
    stockStatus: 'in-stock',
    allergens: ['gluten'],
    modifiers: [
      {
        id: 'mod_001',
        name: 'Toppings',
        required: false,
        options: [
          { id: 'top_001', name: 'Ketchup', price: 0 },
          { id: 'top_002', name: 'Mustard', price: 0 },
          { id: 'top_003', name: 'Onions', price: 0 },
          { id: 'top_004', name: 'Relish', price: 0 },
          { id: 'top_005', name: 'Chili', price: 1.50 },
          { id: 'top_006', name: 'Cheese', price: 1.00 }
        ]
      }
    ]
  },
  {
    id: 'item_002',
    category: 'food',
    name: 'Loaded Nachos',
    description: 'Crispy tortilla chips with melted cheese, jalapeños, and salsa',
    price: 7.00,
    stockStatus: 'low-stock',
    allergens: ['dairy', 'gluten'],
    modifiers: [
      {
        id: 'mod_002',
        name: 'Add-ons',
        required: false,
        options: [
          { id: 'add_001', name: 'Extra Cheese', price: 1.50 },
          { id: 'add_002', name: 'Sour Cream', price: 0.75 },
          { id: 'add_003', name: 'Guacamole', price: 2.00 },
          { id: 'add_004', name: 'Ground Beef', price: 2.50 }
        ]
      }
    ]
  },
  {
    id: 'item_003',
    category: 'food',
    name: 'Chicken Tenders',
    description: 'Crispy chicken tenders with your choice of sauce',
    price: 8.50,
    stockStatus: 'in-stock',
    allergens: ['gluten'],
    modifiers: [
      {
        id: 'mod_003',
        name: 'Sauce',
        required: true,
        maxSelections: 2,
        options: [
          { id: 'sauce_001', name: 'BBQ', price: 0 },
          { id: 'sauce_002', name: 'Ranch', price: 0 },
          { id: 'sauce_003', name: 'Honey Mustard', price: 0 },
          { id: 'sauce_004', name: 'Buffalo', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'item_004',
    category: 'food',
    name: 'Soft Pretzel',
    description: 'Warm, salted soft pretzel',
    price: 4.50,
    stockStatus: 'in-stock',
    allergens: ['gluten'],
    modifiers: [
      {
        id: 'mod_004',
        name: 'Dipping Sauce',
        required: false,
        maxSelections: 1,
        options: [
          { id: 'dip_001', name: 'Cheese Sauce', price: 1.50 },
          { id: 'dip_002', name: 'Mustard', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'item_005',
    category: 'food',
    name: 'Popcorn',
    description: 'Fresh popped popcorn',
    price: 3.50,
    stockStatus: 'in-stock',
    modifiers: [
      {
        id: 'mod_005',
        name: 'Size',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'size_001', name: 'Small', price: 0 },
          { id: 'size_002', name: 'Large', price: 2.00 }
        ]
      }
    ]
  },
  // Drinks
  {
    id: 'item_006',
    category: 'drinks',
    name: 'Fountain Soda',
    description: 'Ice-cold fountain drink',
    price: 3.50,
    stockStatus: 'in-stock',
    modifiers: [
      {
        id: 'mod_006',
        name: 'Size',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'drink_size_001', name: 'Small (16oz)', price: 0 },
          { id: 'drink_size_002', name: 'Medium (24oz)', price: 1.00 },
          { id: 'drink_size_003', name: 'Large (32oz)', price: 2.00 }
        ]
      },
      {
        id: 'mod_007',
        name: 'Flavor',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'flavor_001', name: 'Coca-Cola', price: 0 },
          { id: 'flavor_002', name: 'Sprite', price: 0 },
          { id: 'flavor_003', name: 'Orange Fanta', price: 0 },
          { id: 'flavor_004', name: 'Root Beer', price: 0 },
          { id: 'flavor_005', name: 'Lemonade', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'item_007',
    category: 'drinks',
    name: 'Bottled Water',
    description: 'Ice-cold bottled water',
    price: 2.50,
    stockStatus: 'in-stock'
  },
  {
    id: 'item_008',
    category: 'drinks',
    name: 'Sports Drink',
    description: 'Gatorade or Powerade',
    price: 4.00,
    stockStatus: 'in-stock',
    modifiers: [
      {
        id: 'mod_008',
        name: 'Flavor',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'sport_001', name: 'Fruit Punch', price: 0 },
          { id: 'sport_002', name: 'Blue', price: 0 },
          { id: 'sport_003', name: 'Lemon-Lime', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'item_009',
    category: 'drinks',
    name: 'Hot Chocolate',
    description: 'Rich, creamy hot chocolate with marshmallows',
    price: 3.50,
    stockStatus: 'in-stock'
  },
  // Combos
  {
    id: 'item_010',
    category: 'combos',
    name: 'Game Day Combo',
    description: 'Hot dog, nachos, and a medium drink',
    price: 12.99,
    stockStatus: 'in-stock',
    comboDeal: {
      items: ['Hot Dog', 'Nachos', 'Medium Drink'],
      savings: 2.51
    },
    modifiers: [
      {
        id: 'mod_combo_001',
        name: 'Drink Choice',
        required: true,
        maxSelections: 1,
        options: [
          { id: 'combo_drink_001', name: 'Coca-Cola', price: 0 },
          { id: 'combo_drink_002', name: 'Sprite', price: 0 },
          { id: 'combo_drink_003', name: 'Lemonade', price: 0 }
        ]
      }
    ]
  },
  {
    id: 'item_011',
    category: 'combos',
    name: 'Family Pack',
    description: '4 Hot dogs, 2 large popcorns, 4 drinks',
    price: 29.99,
    stockStatus: 'in-stock',
    comboDeal: {
      items: ['4 Hot Dogs', '2 Large Popcorns', '4 Drinks'],
      savings: 8.00
    }
  }
];

export const seatSections = [
  'Home Side',
  'Visitor Side',
  'North End Zone',
  'South End Zone',
  'Student Section'
];

export const seatRows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K'];

export const pickupPoints = [
  {
    id: 'pickup_001',
    name: 'Concessions Stand A',
    location: 'North Gate',
    description: 'Main concessions near the north entrance'
  },
  {
    id: 'pickup_002',
    name: 'Concessions Stand B',
    location: 'South Gate',
    description: 'Secondary stand near visitor section'
  }
];