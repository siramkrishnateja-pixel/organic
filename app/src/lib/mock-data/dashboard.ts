// Mock dashboard KPI & chart data
export const dashboardKPIs = {
  todayOrders: 34,
  todayOrdersChange: +12,
  activeSubscriptions: 287,
  activeSubscriptionsChange: +8,
  revenueMonth: 142650,
  revenueMonthChange: +18,
  newCustomers: 23,
  newCustomersChange: +5,
  lowStockAlerts: 3,
  expiringBatches: 2,
  failedDeliveries: 1,
  pendingOrders: 6,
};

export const ordersChartDataThisWeek = [
  { day: 'Mon 13', orders: 28, revenue: 9800 },
  { day: 'Tue 14', orders: 35, revenue: 12400 },
  { day: 'Wed 15', orders: 31, revenue: 10900 },
  { day: 'Thu 16', orders: 42, revenue: 15200 },
  { day: 'Fri 17', orders: 38, revenue: 13600 },
  { day: 'Sat 18', orders: 52, revenue: 18900 },
  { day: 'Sun 19', orders: 34, revenue: 12100 },
];

export const ordersChartDataLastWeek = [
  { day: 'Mon 06', orders: 25, revenue: 8700 },
  { day: 'Tue 07', orders: 30, revenue: 11200 },
  { day: 'Wed 08', orders: 28, revenue: 9900 },
  { day: 'Thu 09', orders: 36, revenue: 13400 },
  { day: 'Fri 10', orders: 32, revenue: 11800 },
  { day: 'Sat 11', orders: 45, revenue: 16500 },
  { day: 'Sun 12', orders: 31, revenue: 11000 },
];

export const revenueByCategory = [
  { name: 'Milk & Dairy', value: 68400, color: '#2D6A4F' },
  { name: 'Organic Oils', value: 32100, color: '#40916C' },
  { name: 'Farm Products', value: 24800, color: '#F4A261' },
  { name: 'Vegetables', value: 17350, color: '#E9C46A' },
];

export const monthlyPnL = [
  { month: 'Nov', revenue: 98400, expense: 61200, profit: 37200 },
  { month: 'Dec', revenue: 118600, expense: 71000, profit: 47600 },
  { month: 'Jan', revenue: 105200, expense: 65800, profit: 39400 },
  { month: 'Feb', revenue: 122800, expense: 74100, profit: 48700 },
  { month: 'Mar', revenue: 134500, expense: 79600, profit: 54900 },
  { month: 'Apr', revenue: 142650, expense: 83200, profit: 59450 },
];

export const lowStockAlerts = [
  { product: 'Raw Forest Honey', stock: 20, threshold: 25, category: 'Farm' },
  { product: 'Fresh Paneer', stock: 30, threshold: 40, category: 'Dairy' },
  { product: 'Sesame Oil', stock: 28, threshold: 35, category: 'Oils' },
];

export const expiringBatches = [
  { product: 'Fresh A2 Cow Milk', batch: 'BATCH-2024', expiresIn: '1 day', qty: 45 },
  { product: 'Probiotic Curd', batch: 'BATCH-2025', expiresIn: '2 days', qty: 30 },
];
