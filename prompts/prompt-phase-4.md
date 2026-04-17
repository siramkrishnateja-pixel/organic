# Phase 4: Finance & Analytics Sync - Prompts

## Prerequisites
Before starting this phase, ensure you have:
1. Completed Phase 3, ensuring payments/checkouts are simulated in the backend successfully.
2. Verified the Admin dashboards from Phase 1 and 2 are active.

## Prompts to Complete Phase 4
Copy and paste these prompts sequentially:

**Prompt 1 (Finance Integration):**
> "In the frontend app, open `app/admin/finance/page.tsx`. Remove the static fallback imports. Replace the P&L ledger data arrays by fetching directly from `GET /api/admin/finance`. Ensure the math summing revenues and expenses works smoothly with the backend's data typings."

**Prompt 2 (Customer Analytics):**
> "Open `fastapi_backend/api/admin_service/router.py` and create a `GET /customers` endpoint returning an array of mock customer data items. Then, open `app/admin/customers/page.tsx` on the frontend, and wire the Next.js data grid to fetch that customer array, displaying their LTV and contact details."

**Prompt 3 (End-to-End Walkthrough):**
> "We have now connected all pages. Please do a quick E2E stability check of the Next.js app. Tell me if I am missing any React loading states, or if there are any CORS warnings occurring between `localhost:3000` (or `3001`) and `localhost:8000`. Suggest a final cleanup for obsolete files in `lib/mock-data`."

## Reviewing the Outcome
To verify this phase is complete and stable, use the following prompt:
> "Let's review Phase 4. Have all static `lib/mock-data` files been successfully detached from the React logic so we can safely delete the folder? Is the Finance board properly summing the live Python arrays?"
