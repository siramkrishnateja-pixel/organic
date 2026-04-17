from fastapi import APIRouter
from typing import List, Dict, Any
import datetime

router = APIRouter()

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
    return [
        {
            "id": "order-12345",
            "user_id": user_id,
            "order_type": "one-time",
            "status": "delivered",
            "total_amount": 450.00,
            "payment_method": "upi",
            "delivery_date": (datetime.datetime.now() - datetime.timedelta(days=2)).strftime("%Y-%m-%d"),
            "delivery_slot": "morning",
            "delivery_address": "123 Organic Lane, Green City",
            "created_at": (datetime.datetime.now() - datetime.timedelta(days=3)).isoformat(),
            "items": [
                { "productId": "prod-1", "name": "A2 Cow Milk (1L)", "quantity": 2, "price": 90.0, "subtotal": 180.0 },
                { "productId": "prod-2", "name": "Organic Eggs (Dozen)", "quantity": 1, "price": 120.0, "subtotal": 120.0 }
            ]
        },
        {
            "id": "order-12346",
            "user_id": user_id,
            "order_type": "subscription",
            "status": "pending",
            "total_amount": 120.00,
            "payment_method": "wallet",
            "delivery_date": (datetime.datetime.now() + datetime.timedelta(days=1)).strftime("%Y-%m-%d"),
            "delivery_slot": "evening",
            "delivery_address": "123 Organic Lane, Green City",
            "created_at": datetime.datetime.now().isoformat(),
            "items": [
                { "productId": "prod-3", "name": "Raw Forest Honey", "quantity": 1, "price": 450.0, "subtotal": 450.0 }
            ]
        }
    ]

@router.get("/{user_id}/subscriptions")
def get_user_subscriptions(user_id: str) -> List[Dict[str, Any]]:
    """Returns all active subscriptions for the user."""
    return [
        {
            "id": "sub-111",
            "user_id": user_id,
            "product_id": "prod-1",
            "product_name": "A2 Cow Milk",
            "schedule": "daily",
            "quantity": 2,
            "status": "active",
            "next_delivery_date": (datetime.datetime.now() + datetime.timedelta(days=1)).strftime("%Y-%m-%d"),
            "created_at": (datetime.datetime.now() - datetime.timedelta(days=30)).isoformat()
        },
        {
            "id": "sub-112",
            "user_id": user_id,
            "product_id": "prod-2",
            "product_name": "Organic Eggs (Dozen)",
            "schedule": "alternate_day",
            "quantity": 1,
            "status": "active",
            "next_delivery_date": (datetime.datetime.now() + datetime.timedelta(days=2)).strftime("%Y-%m-%d"),
            "created_at": (datetime.datetime.now() - datetime.timedelta(days=15)).isoformat()
        }
    ]

@router.get("/{user_id}/profile")
def get_user_profile(user_id: str):
    """Returns basic profile information."""
    return {
        "user_id": user_id,
        "name": "Organic Customer",
        "email": "customer@example.com",
        "phone": "1234567890",
        "role": "customer",
        "wallet_balance": 150.50,
        "saved_addresses": [
            "123 Organic Lane, Green City",
            "Apt 4B, Sunny Side Apartments, Green City"
        ]
    }
