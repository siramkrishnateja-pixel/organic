# Phase 1: Initial API Wiring

**Objective**: Establish the core client-to-server communication bridge ensuring data seamlessly flows from the FastAPI backend into Next.js.

## Key Tasks
1. **Migrate Rich Data Structures**: Port complex structures (like `ordersChartDataThisWeek` and `monthlyPnL`) from `mock-data/dashboard.ts` directly into the Python backend (`api/admin_service/router.py`).
2. **API Client Utility**: Construct a centralized `lib/api-client.ts` fetch wrapper for handling loading states and errors robustly.
3. **Core Page Migration**: 
   - Convert `app/admin/page.tsx` (Admin Dashboard) to pull live stats.
   - Convert `app/(user)/orders/page.tsx` (User Orders) to fetch orders based on generated UUIDs.
4. **Verification**: Manually verify loading states function and charts render beautifully.
