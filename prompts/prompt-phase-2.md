# Phase 2: Catalog & Inventory Integration - Prompts

## Prerequisites
Before starting this phase, ensure you have:
1. Completed Phase 1 (Initial API Wiring) ensuring the `api-client.ts` works flawlessly.
2. Understood the schema of the products and inventory (e.g. Milk & Dairy, Organic Oils, stock counts).

## Prompts to Complete Phase 2
Copy and paste these prompts sequentially:

**Prompt 1 (Backend Update):**
> "Please create a new file `fastapi_backend/api/product_service/router.py`. Inside it, create endpoints `GET /catalog` and `GET /catalog/{product_id}` returning our mock product catalog data. Then, update `main.py` to include this new `product_service` router mounted at `/api/product`."

**Prompt 2 (Frontend User Catalog):**
> "Update the Next.js frontend pages `app/(user)/products/page.tsx` and `app/(user)/products/[id]/page.tsx`. Currently, they rely on offline arrays. Refactor them to use `useEffect` and `fetchFromAPI` to dynamically pull the catalog items from the `/api/product/catalog` backend endpoint."

**Prompt 3 (Frontend Admin Inventory):**
> "Refactor `app/admin/inventory/page.tsx` and `app/admin/products/page.tsx`. Wire them to hit the `GET /api/admin/inventory` backend endpoint. Remove any offline static imports and insert a temporary loading skeleton in the tables while the data fetches."

## Reviewing the Outcome
To verify this phase is complete and stable, use the following prompt:
> "Let's review Phase 2. Is the user product browsing page successfully loading the product images and details purely from the FastAPI network response? Does clicking on an individual product page correctly fetch and render that specific product object? Verify that the console logs show successful 200 HTTP codes for the catalog routes."
