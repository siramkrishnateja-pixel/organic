# Phase 3: Subscriptions & Cart Flows - Prompts

## Prerequisites
Before starting this phase, ensure you have:
1. Familiarized yourself with the dummy `razorpay-dummy` endpoint logic already built in the backend.
2. Verified that Phase 2 components function so users can actually add items to their frontend cart.

## Prompts to Complete Phase 3
Copy and paste these prompts sequentially:

**Prompt 1 (Cart Checkout API Update):**
> "Please review the `fastapi_backend/api/payment_service/router.py`. Update the `create_dummy_payment` endpoint so it accepts detailed Cart payloads (array of items, user ID, total price). Ensure it returns a simulated 'Payment Successful' JSON block that the frontend can safely handle without breaking."

**Prompt 2 (Frontend Cart Integration):**
> "Open `app/(user)/cart/page.tsx`. Refactor the 'Checkout' button logic so that instead of just simulating a timeout, it performs a real network POST request to our FastAPI `/api/payment/razorpay-dummy` endpoint. Upon a successful HTTP 200 response, clear the frontend cart state and redirect the user to an Order Success screen."

**Prompt 3 (User Subscriptions List):**
> "In the frontend `app/(user)/subscriptions/page.tsx`, remove the fallback static arrays and connect the data grid to `GET /api/user/{user_id}/subscriptions`. Add interactive buttons (Pause/Cancel) that send `POST` requests to update the subscription status on the backend."

## Reviewing the Outcome
To verify this phase is complete and stable, use the following prompt:
> "Let's review Phase 3. Can I successfully press 'Checkout' in my shopping cart, have the FastAPI backend register a dummy payment, and then redirect to a clear success state? Are my active subscriptions properly reflecting the mock data returned from the Python endpoints?"
