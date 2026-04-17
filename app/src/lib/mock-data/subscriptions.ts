export interface Subscription {
  id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  schedule: 'daily' | 'alternate_day' | 'custom';
  status: 'active' | 'paused' | 'cancelled';
  startDate: string;
  nextDelivery: string;
  deliveryAddress: string;
  monthlyValue: number;
}

export const subscriptions: Subscription[] = [
  { id: 'SUB-001', userId: 'u1', customerName: 'Priya Sharma', customerPhone: '9876543210', productId: 'p1', productName: 'Fresh A2 Cow Milk', productImage: '/products/milk.png', quantity: 2, schedule: 'daily', status: 'active', startDate: '2026-01-15', nextDelivery: '2026-04-18', deliveryAddress: '12 MG Road, Bangalore', monthlyValue: 4200 },
  { id: 'SUB-002', userId: 'u3', customerName: 'Ananya Patel', customerPhone: '9988776655', productId: 'p1', productName: 'Fresh A2 Cow Milk', productImage: '/products/milk.png', quantity: 1, schedule: 'daily', status: 'active', startDate: '2026-02-01', nextDelivery: '2026-04-18', deliveryAddress: '8 Koregaon Park, Pune', monthlyValue: 2100 },
  { id: 'SUB-003', userId: 'u5', customerName: 'Meera Krishnan', customerPhone: '9001234567', productId: 'p2', productName: 'Organic Desi Ghee', productImage: '/products/ghee.png', quantity: 1, schedule: 'alternate_day', status: 'active', startDate: '2026-03-10', nextDelivery: '2026-04-19', deliveryAddress: '33 T Nagar, Chennai', monthlyValue: 9750 },
  { id: 'SUB-004', userId: 'u2', customerName: 'Rahul Menon', customerPhone: '9123456789', productId: 'p5', productName: 'Organic Vegetable Box', productImage: '/products/vegetables.png', quantity: 1, schedule: 'alternate_day', status: 'paused', startDate: '2026-02-20', nextDelivery: '2026-04-25', deliveryAddress: '45 Anna Nagar, Chennai', monthlyValue: 3735 },
  { id: 'SUB-005', userId: 'u7', customerName: 'Divya Iyer', customerPhone: '8890123456', productId: 'p8', productName: 'Cold-Pressed Coconut Oil', productImage: '/products/coconut-oil.png', quantity: 1, schedule: 'alternate_day', status: 'active', startDate: '2026-03-01', nextDelivery: '2026-04-19', deliveryAddress: '7 Velachery, Chennai', monthlyValue: 5700 },
  { id: 'SUB-006', userId: 'u6', customerName: 'Arjun Reddy', customerPhone: '9765432109', productId: 'p12', productName: 'Free-Range Farm Eggs', productImage: 'https://images.unsplash.com/photo-1518569656558-1f25e69d2221?w=400&q=80', quantity: 2, schedule: 'alternate_day', status: 'cancelled', startDate: '2026-01-05', nextDelivery: '-', deliveryAddress: '15 Jubilee Hills, Hyderabad', monthlyValue: 0 },
];

// User's own subscriptions (for user profile view)
export const mySubscriptions = subscriptions.filter(s => s.userId === 'u1');
