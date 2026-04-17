# Phase 1: Initial API Wiring - Prompts

## Prerequisites
Before starting this phase, ensure you have:
1. Both the FastAPI backend and Next.js frontend running locally without crashes.
2. Verified that the `.env` file in the FastAPI folder contains valid connection keys.
3. Successfully logged in via the frontend Login Modal to generate a backend UUID in your browser's Local Storage.

## Prompts to Complete Phase 1
Copy and paste these prompts to the AI sequentially:

**Prompt 1 (Backend Update):**
> "Please update the `fastapi_backend/api/admin_service/router.py` endpoint so that it returns the full chart mock data currently found in `lib/mock-data/dashboard.ts` (including `dashboardKPIs`, `ordersChartDataThisWeek`, `monthlyPnL`, and `revenueByCategory`). Make sure the output format exactly matches what the frontend components expect."

**Prompt 2 (API Client Creation):**
> "Please create a new utility file in the React frontend at `app/src/lib/api-client.ts`. It should export a robust `fetchFromAPI` helper function that automatically prepends `http://localhost:8000/api` to routes, handles JSON parsing, and catches HTTP errors so we can avoid rewriting standard fetch logic across pages."

**Prompt 3 (Frontend Wiring):**
> "Please refactor `app/admin/page.tsx` and `app/(user)/orders/page.tsx`. Remove the static mock-data imports, and replace them with `useEffect` blocks that fetch the data dynamically using our new `api-client.ts` utility. Display a generic loading spinner layout while the fetching occurs."

## Reviewing the Outcome
To verify this phase is complete and stable, use the following prompt:
> "Let's review Phase 1. If I navigate to the Admin Dashboard or User Orders page, does it momentarily show a loading spinner before correctly pulling the chart UI from the FastAPI backend? Are there any React hydration errors or missing data warnings in the web console?"
