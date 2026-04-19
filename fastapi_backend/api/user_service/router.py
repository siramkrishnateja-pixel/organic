from fastapi import APIRouter
from typing import List, Dict, Any
import datetime
from pathlib import Path
from supabase import create_client, Client
import os
from dotenv import load_dotenv

# Try multiple paths for .env loading
BASE_DIR = Path(__file__).resolve().parents[3]
for env_path in [
    BASE_DIR / '.env.local',
    BASE_DIR / 'fastapi_backend' / '.env.local',
    Path.cwd() / '.env.local',
    Path.cwd() / 'fastapi_backend' / '.env.local',
]:
    if env_path.exists():
        load_dotenv(env_path)
        break

router = APIRouter()

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(supabase_url, supabase_key) if supabase_url and supabase_key else None

@router.get("/{user_id}/dashboard")
def get_user_dashboard(user_id: str):
    """Returns a summary for the user."""
    return {
        "user_id": user_id,
        "wallet_balance": 150.50,
        "active_subscriptions_count": 2,
        "recent_orders_count": 5
    }

@router.get("/{user_id}/orders")
def get_user_orders(user_id: str) -> List[Dict[str, Any]]:
    """Returns past and active orders for the user."""
    if supabase is None:
        return {"status": "error", "message": "Database not connected"}
    try:
        orders = supabase.table('orders').select('''
            id, order_type, status, total_amount, payment_method,
            delivery_date, delivery_slot, delivery_address, created_at,
            order_items(product_id, quantity, price_at_time, products(name, image_url))
        ''').eq('user_id', user_id).execute()

        result = []
        for order in orders.data:
            # Get order items with product details
            items = []
            for item in order['order_items']:
                product = item['products']
                items.append({
                    "productId": item['product_id'],
                    "productName": product['name'] if product else "Unknown Product",
                    "productImage": product['image_url'] if product else "/products/placeholder.png",
                    "quantity": item['quantity'],
                    "price": float(item['price_at_time'])
                })

            result.append({
                "id": str(order['id']),
                "orderType": order['order_type'],
                "status": order['status'],
                "totalAmount": float(order['total_amount']),
                "paymentMethod": order['payment_method'],
                "deliveryDate": order['delivery_date'],
                "deliverySlot": order['delivery_slot'],
                "deliveryAddress": order['delivery_address'],
                "items": items,
                "createdAt": order['created_at']
            })

        return {"status": "success", "orders": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.get("/{user_id}/subscriptions")
def get_user_subscriptions(user_id: str) -> List[Dict[str, Any]]:
    """Returns all active subscriptions for the user."""
    if supabase is None:
        return {"status": "error", "message": "Database not connected"}
    try:
        subs = supabase.table('subscriptions').select('''
            id, product_id, schedule, quantity, status, next_delivery_date, created_at,
            products(name, image_url, price, unit, farm_info)
        ''').eq('user_id', user_id).eq('status', 'active').execute()

        result = []
        for sub in subs.data:
            product = sub['products']
            result.append({
                "id": str(sub['id']),
                "productId": sub['product_id'],
                "productName": product['name'] if product else "Unknown Product",
                "productImage": product['image_url'] if product else "/products/placeholder.png",
                "schedule": sub['schedule'],
                "quantity": sub['quantity'],
                "status": sub['status'],
                "nextDeliveryDate": sub['next_delivery_date'],
                "monthlyValue": float(product['price'] * sub['quantity']) if product else 0,
                "farmInfo": product['farm_info'] if product else "",
                "createdAt": sub['created_at']
            })

        return {"status": "success", "subscriptions": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.get("/{user_id}/profile")
def get_user_profile(user_id: str):
    """Returns basic profile information."""
    if supabase is None:
        return {"user_id": user_id, "error": "Database not connected"}
    try:
        user = supabase.table('users').select('*').eq('id', user_id).execute()
        if not user.data:
            return {"user_id": user_id, "error": "User not found"}
        return user.data[0]
    except Exception as e:
        return {"user_id": user_id, "error": str(e)}
