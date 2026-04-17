# Phase 2: Catalog & Inventory Integration

**Objective**: Connect the core operational models (Products, Inventory) to the Python API.

## Key Tasks
1. **Products Catalog API**: Add `fastapi_backend/api/product_service/router.py` to dish out frontend products.
2. **Admin Inventory API Expand**: Update backend to return expiring batches alongside alerts.
3. **Frontend Conversion**:
   - `app/(user)/products/page.tsx` & `[id]/page.tsx`: Fetch all milk and organic product items dynamically from backend.
   - `app/admin/inventory/page.tsx` & `app/admin/products/page.tsx`: Shift management UI to the backend endpoints.
