# Phase 3: Subscriptions & Cart Flows

**Objective**: Digitize user transaction pipelines logic via backend APIs.

## Key Tasks
1. **Cart Logic Update**: 
   - Ensure cart state maps to backend memory/database if persisting.
   - Refactor `app/(user)/cart/page.tsx` backend checkout submission mapping.
2. **Subscriptions Management**:
   - `app/(user)/subscriptions/page.tsx`: Connect active schedule viewing, pause, and cancel queries.
   - `app/admin/subscriptions/page.tsx`: Shift the admin tracking table to live endpoints.
3. **Razorpay Activation**: Fully implement the real Razorpay hook now that cart payload structures match perfectly.
