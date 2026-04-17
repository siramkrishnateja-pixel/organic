# Phase 4: Finance & Analytics Sync

**Objective**: Tie the final complex analytics algorithms to the live endpoints.

## Key Tasks
1. **Finance Page Migration**: 
   - `app/admin/finance/page.tsx`: Shift P&L ledgers to live API response matrices mapping the latest `finance_records` SQL rows.
2. **Customer Data Integration**:
   - `app/admin/customers/page.tsx`: Connect to an `api/admin/users_list` tracking LTV (Lifetime Value).
3. **E2E Stability Checks**:
   - Ensure the Next.js cache behaves properly with live stats.
