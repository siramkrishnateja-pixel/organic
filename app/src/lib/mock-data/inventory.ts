export interface InventoryBatch {
  id: string;
  productId: string;
  productName: string;
  category: string;
  batchNumber: string;
  quantity: number;
  productionDate: string;
  expiryDate: string;
  wastage: number;
  daysToExpiry: number;
  status: 'fresh' | 'expiring_soon' | 'expired';
}

export const inventory: InventoryBatch[] = [
  { id: 'INV-001', productId: 'p1', productName: 'Fresh A2 Cow Milk', category: 'Dairy', batchNumber: 'BATCH-M-2024', quantity: 120, productionDate: '2026-04-17', expiryDate: '2026-04-18', wastage: 5, daysToExpiry: 1, status: 'expiring_soon' },
  { id: 'INV-002', productId: 'p3', productName: 'Probiotic Curd', category: 'Dairy', batchNumber: 'BATCH-C-2025', quantity: 80, productionDate: '2026-04-16', expiryDate: '2026-04-19', wastage: 2, daysToExpiry: 2, status: 'expiring_soon' },
  { id: 'INV-003', productId: 'p4', productName: 'Fresh Paneer', category: 'Dairy', batchNumber: 'BATCH-P-2026', quantity: 30, productionDate: '2026-04-17', expiryDate: '2026-04-20', wastage: 0, daysToExpiry: 3, status: 'fresh' },
  { id: 'INV-004', productId: 'p2', productName: 'Organic Desi Ghee', category: 'Dairy', batchNumber: 'BATCH-G-2020', quantity: 45, productionDate: '2026-03-01', expiryDate: '2026-09-01', wastage: 0, daysToExpiry: 137, status: 'fresh' },
  { id: 'INV-005', productId: 'p5', productName: 'Organic Vegetable Box', category: 'Vegetables', batchNumber: 'BATCH-V-2027', quantity: 60, productionDate: '2026-04-17', expiryDate: '2026-04-20', wastage: 3, daysToExpiry: 3, status: 'fresh' },
  { id: 'INV-006', productId: 'p8', productName: 'Cold-Pressed Coconut Oil', category: 'Oils', batchNumber: 'BATCH-O-1800', quantity: 35, productionDate: '2026-02-01', expiryDate: '2026-08-01', wastage: 0, daysToExpiry: 106, status: 'fresh' },
  { id: 'INV-007', productId: 'p11', productName: 'Raw Forest Honey', category: 'Farm', batchNumber: 'BATCH-H-0990', quantity: 20, productionDate: '2025-12-01', expiryDate: '2026-12-01', wastage: 0, daysToExpiry: 228, status: 'fresh' },
  { id: 'INV-008', productId: 'p12', productName: 'Free-Range Farm Eggs', category: 'Farm', batchNumber: 'BATCH-E-2028', quantity: 150, productionDate: '2026-04-16', expiryDate: '2026-04-23', wastage: 6, daysToExpiry: 6, status: 'fresh' },
];
