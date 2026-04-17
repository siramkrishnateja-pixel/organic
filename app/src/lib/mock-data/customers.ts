export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  walletBalance: number;
  totalOrders: number;
  activeSubscriptions: number;
  totalSpent: number;
  joinedDate: string;
  lastOrder: string;
  status: 'active' | 'inactive';
}

export const customers: Customer[] = [
  { id: 'u1', name: 'Priya Sharma', phone: '9876543210', email: 'priya.sharma@gmail.com', walletBalance: 540, totalOrders: 48, activeSubscriptions: 1, totalSpent: 12400, joinedDate: '2026-01-10', lastOrder: '2026-04-17', status: 'active' },
  { id: 'u2', name: 'Rahul Menon', phone: '9123456789', email: 'rahul.m@outlook.com', walletBalance: 120, totalOrders: 22, activeSubscriptions: 0, totalSpent: 15800, joinedDate: '2026-02-05', lastOrder: '2026-04-17', status: 'active' },
  { id: 'u3', name: 'Ananya Patel', phone: '9988776655', email: 'ananya.p@gmail.com', walletBalance: 890, totalOrders: 35, activeSubscriptions: 1, totalSpent: 8900, joinedDate: '2026-01-22', lastOrder: '2026-04-17', status: 'active' },
  { id: 'u4', name: 'Vikram Nair', phone: '8765432100', email: 'vikram.nair@gmail.com', walletBalance: 0, totalOrders: 8, activeSubscriptions: 0, totalSpent: 4200, joinedDate: '2026-03-15', lastOrder: '2026-04-17', status: 'active' },
  { id: 'u5', name: 'Meera Krishnan', phone: '9001234567', email: 'meera.k@yahoo.com', walletBalance: 2100, totalOrders: 62, activeSubscriptions: 2, totalSpent: 28600, joinedDate: '2025-12-01', lastOrder: '2026-04-16', status: 'active' },
  { id: 'u6', name: 'Arjun Reddy', phone: '9765432109', email: 'arjun.r@gmail.com', walletBalance: 300, totalOrders: 15, activeSubscriptions: 0, totalSpent: 5400, joinedDate: '2026-01-30', lastOrder: '2026-04-10', status: 'inactive' },
  { id: 'u7', name: 'Divya Iyer', phone: '8890123456', email: 'divya.iyer@gmail.com', walletBalance: 650, totalOrders: 29, activeSubscriptions: 1, totalSpent: 18900, joinedDate: '2025-11-20', lastOrder: '2026-04-16', status: 'active' },
];
