from fastapi import APIRouter
from typing import List, Dict, Any
import datetime

router = APIRouter()

@router.get("/dashboard")
def get_admin_dashboard():
    """Returns top-level admin statistics for the P&L dashboard."""
    return {
        "status": "success",
        "dashboardKPIs": {
            "todayOrders": 34, "todayOrdersChange": 12,
            "activeSubscriptions": 287, "activeSubscriptionsChange": 8,
            "revenueMonth": 142650, "revenueMonthChange": 18,
            "newCustomers": 23, "newCustomersChange": 5,
            "lowStockAlerts": 3, "expiringBatches": 2,
            "failedDeliveries": 1, "pendingOrders": 6
        },
        "ordersChartDataThisWeek": [
            { "day": 'Mon 13', "orders": 28, "revenue": 9800 },
            { "day": 'Tue 14', "orders": 35, "revenue": 12400 },
            { "day": 'Wed 15', "orders": 31, "revenue": 10900 },
            { "day": 'Thu 16', "orders": 42, "revenue": 15200 },
            { "day": 'Fri 17', "orders": 38, "revenue": 13600 },
            { "day": 'Sat 18', "orders": 52, "revenue": 18900 },
            { "day": 'Sun 19', "orders": 34, "revenue": 12100 },
        ],
        "ordersChartDataLastWeek": [
            { "day": 'Mon 06', "orders": 25, "revenue": 8700 },
            { "day": 'Tue 07', "orders": 30, "revenue": 11200 },
            { "day": 'Wed 08', "orders": 28, "revenue": 9900 },
            { "day": 'Thu 09', "orders": 36, "revenue": 13400 },
            { "day": 'Fri 10', "orders": 32, "revenue": 11800 },
            { "day": 'Sat 11', "orders": 45, "revenue": 16500 },
            { "day": 'Sun 12', "orders": 31, "revenue": 11000 },
        ],
        "revenueByCategory": [
            { "name": 'Milk & Dairy', "value": 68400, "color": '#2D6A4F' },
            { "name": 'Organic Oils', "value": 32100, "color": '#40916C' },
            { "name": 'Farm Products', "value": 24800, "color": '#F4A261' },
            { "name": 'Vegetables', "value": 17350, "color": '#E9C46A' },
        ],
        "monthlyPnL": [
            { "month": 'Nov', "revenue": 98400, "expense": 61200, "profit": 37200 },
            { "month": 'Dec', "revenue": 118600, "expense": 71000, "profit": 47600 },
            { "month": 'Jan', "revenue": 105200, "expense": 65800, "profit": 39400 },
            { "month": 'Feb', "revenue": 122800, "expense": 74100, "profit": 48700 },
            { "month": 'Mar', "revenue": 134500, "expense": 79600, "profit": 54900 },
            { "month": 'Apr', "revenue": 142650, "expense": 83200, "profit": 59450 },
        ],
        "lowStockAlerts": [
            { "product": 'Raw Forest Honey', "stock": 20, "threshold": 25, "category": 'Farm' },
            { "product": 'Fresh Paneer', "stock": 30, "threshold": 40, "category": 'Dairy' },
            { "product": 'Sesame Oil', "stock": 28, "threshold": 35, "category": 'Oils' },
        ],
        "expiringBatches": [
            { "product": 'Fresh A2 Cow Milk', "batch": 'BATCH-2024', "expiresIn": '1 day', "qty": 45 },
            { "product": 'Probiotic Curd', "batch": 'BATCH-2025', "expiresIn": '2 days', "qty": 30 },
        ]
    }

@router.get("/inventory")
def get_admin_inventory() -> List[Dict[str, Any]]:
    """Returns current inventory stock, including wastage."""
    return [
        {
            "product_id": "prod-1",
            "product_name": "A2 Cow Milk (1L)",
            "stock": 150,
            "wastage": 2,
            "batch_number": "BN-1001",
            "production_date": datetime.datetime.now().strftime("%Y-%m-%d"),
            "expiry_date": (datetime.datetime.now() + datetime.timedelta(days=3)).strftime("%Y-%m-%d")
        },
        {
            "product_id": "prod-2",
            "product_name": "Organic Eggs (Dozen)",
            "stock": 45,
            "wastage": 0,
            "batch_number": "BN-1002",
            "production_date": (datetime.datetime.now() - datetime.timedelta(days=1)).strftime("%Y-%m-%d"),
            "expiry_date": (datetime.datetime.now() + datetime.timedelta(days=14)).strftime("%Y-%m-%d")
        }
    ]

@router.get("/finance")
def get_admin_finance() -> List[Dict[str, Any]]:
    """Returns finance tracking records (P&L tracking)."""
    return [
        {
            "id": "fin-1",
            "record_type": "revenue",
            "amount": 12500.00,
            "category": "Sales",
            "sub_category": "Subscriptions",
            "description": "Weekly subscription revenue settling",
            "date": datetime.datetime.now().strftime("%Y-%m-%d")
        },
        {
            "id": "fin-2",
            "record_type": "expense",
            "amount": 3200.00,
            "category": "Logistics",
            "sub_category": "Delivery Partners",
            "description": "Payout to drivers",
            "date": datetime.datetime.now().strftime("%Y-%m-%d")
        }
    ]
