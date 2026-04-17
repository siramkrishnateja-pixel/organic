// Mock orders data
export type OrderStatus = 'pending' | 'confirmed' | 'out_for_delivery' | 'delivered' | 'failed' | 'cancelled' | 'refunded';

export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerPhone: string;
  status: OrderStatus;
  orderType: 'one_time' | 'subscription';
  items: OrderItem[];
  totalAmount: number;
  deliveryAddress: string;
  deliveryDate: string;
  deliverySlot: string;
  paymentMethod: 'wallet' | 'dummy' | 'cod';
  createdAt: string;
}

export const orders: Order[] = [
  { id: 'ORD-1001', userId: 'u1', customerName: 'Priya Sharma', customerPhone: '9876543210', status: 'delivered', orderType: 'subscription', items: [{ productId: 'p1', name: 'Fresh A2 Cow Milk', quantity: 2, unitPrice: 70, subtotal: 140 }], totalAmount: 140, deliveryAddress: '12 MG Road, Bangalore', deliveryDate: '2026-04-17', deliverySlot: '6AM-9AM', paymentMethod: 'wallet', createdAt: '2026-04-17T05:30:00Z' },
  { id: 'ORD-1002', userId: 'u2', customerName: 'Rahul Menon', customerPhone: '9123456789', status: 'out_for_delivery', orderType: 'one_time', items: [{ productId: 'p2', name: 'Organic Desi Ghee', quantity: 1, unitPrice: 650, subtotal: 650 }, { productId: 'p3', name: 'Probiotic Curd', quantity: 2, unitPrice: 55, subtotal: 110 }], totalAmount: 760, deliveryAddress: '45 Anna Nagar, Chennai', deliveryDate: '2026-04-17', deliverySlot: '9AM-12PM', paymentMethod: 'dummy', createdAt: '2026-04-17T07:00:00Z' },
  { id: 'ORD-1003', userId: 'u3', customerName: 'Ananya Patel', customerPhone: '9988776655', status: 'confirmed', orderType: 'subscription', items: [{ productId: 'p1', name: 'Fresh A2 Cow Milk', quantity: 1, unitPrice: 70, subtotal: 70 }, { productId: 'p6', name: 'Baby Spinach', quantity: 1, unitPrice: 45, subtotal: 45 }], totalAmount: 115, deliveryAddress: '8 Koregaon Park, Pune', deliveryDate: '2026-04-17', deliverySlot: '6AM-9AM', paymentMethod: 'wallet', createdAt: '2026-04-17T06:15:00Z' },
  { id: 'ORD-1004', userId: 'u4', customerName: 'Vikram Nair', customerPhone: '8765432100', status: 'pending', orderType: 'one_time', items: [{ productId: 'p8', name: 'Cold-Pressed Coconut Oil', quantity: 2, unitPrice: 380, subtotal: 760 }], totalAmount: 760, deliveryAddress: '22 Indiranagar, Bangalore', deliveryDate: '2026-04-18', deliverySlot: '9AM-12PM', paymentMethod: 'dummy', createdAt: '2026-04-17T09:30:00Z' },
  { id: 'ORD-1005', userId: 'u5', customerName: 'Meera Krishnan', customerPhone: '9001234567', status: 'delivered', orderType: 'subscription', items: [{ productId: 'p1', name: 'Fresh A2 Cow Milk', quantity: 1, unitPrice: 70, subtotal: 70 }], totalAmount: 70, deliveryAddress: '33 T Nagar, Chennai', deliveryDate: '2026-04-16', deliverySlot: '6AM-9AM', paymentMethod: 'wallet', createdAt: '2026-04-16T05:20:00Z' },
  { id: 'ORD-1006', userId: 'u6', customerName: 'Arjun Reddy', customerPhone: '9765432109', status: 'failed', orderType: 'subscription', items: [{ productId: 'p12', name: 'Free-Range Farm Eggs', quantity: 2, unitPrice: 90, subtotal: 180 }], totalAmount: 180, deliveryAddress: '15 Jubilee Hills, Hyderabad', deliveryDate: '2026-04-17', deliverySlot: '6AM-9AM', paymentMethod: 'wallet', createdAt: '2026-04-17T05:45:00Z' },
  { id: 'ORD-1007', userId: 'u7', customerName: 'Divya Iyer', customerPhone: '8890123456', status: 'delivered', orderType: 'one_time', items: [{ productId: 'p11', name: 'Raw Forest Honey', quantity: 1, unitPrice: 450, subtotal: 450 }, { productId: 'p4', name: 'Fresh Paneer', quantity: 2, unitPrice: 120, subtotal: 240 }], totalAmount: 690, deliveryAddress: '7 Velachery, Chennai', deliveryDate: '2026-04-16', deliverySlot: '9AM-12PM', paymentMethod: 'dummy', createdAt: '2026-04-16T08:00:00Z' },
  { id: 'ORD-1008', userId: 'u1', customerName: 'Priya Sharma', customerPhone: '9876543210', status: 'delivered', orderType: 'subscription', items: [{ productId: 'p1', name: 'Fresh A2 Cow Milk', quantity: 2, unitPrice: 70, subtotal: 140 }], totalAmount: 140, deliveryAddress: '12 MG Road, Bangalore', deliveryDate: '2026-04-16', deliverySlot: '6AM-9AM', paymentMethod: 'wallet', createdAt: '2026-04-16T05:30:00Z' },
];
