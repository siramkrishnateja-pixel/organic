from fastapi import APIRouter
from typing import List, Dict, Any
import datetime
from ..supabase_service.router import supabase

router = APIRouter()

@router.get("/dashboard")
def get_admin_dashboard():
    """Returns top-level admin statistics for the P&L dashboard."""
    if supabase is None:
        return {"status": "error", "message": "Database not connected"}
    try:
        # Get today's orders count
        today = datetime.date.today().isoformat()
        today_orders = supabase.table('orders').select('id', count='exact').gte('created_at', today).execute()
        today_orders_count = today_orders.count or 0

        # Get active subscriptions count
        active_subs = supabase.table('subscriptions').select('id', count='exact').eq('status', 'active').execute()
        active_subs_count = active_subs.count or 0

        # Get monthly revenue (current month)
        current_month = datetime.date.today().replace(day=1).isoformat()
        monthly_orders = supabase.table('orders').select('total_amount').gte('created_at', current_month).eq('status', 'delivered').execute()
        monthly_revenue = sum(order['total_amount'] for order in monthly_orders.data) if monthly_orders.data else 0

        # Get new customers this month
        new_customers = supabase.table('users').select('id', count='exact').gte('created_at', current_month).execute()
        new_customers_count = new_customers.count or 0

        # Get low stock alerts (products with stock < 10)
        low_stock = supabase.table('inventory').select('product_id', count='exact').lt('stock', 10).execute()
        low_stock_count = low_stock.count or 0

        # Get expiring batches (within 7 days)
        seven_days_from_now = (datetime.date.today() + datetime.timedelta(days=7)).isoformat()
        expiring_batches = supabase.table('inventory').select('id', count='exact').lte('expiry_date', seven_days_from_now).execute()
        expiring_count = expiring_batches.count or 0

        # Get pending orders
        pending_orders = supabase.table('orders').select('id', count='exact').eq('status', 'pending').execute()
        pending_count = pending_orders.count or 0

        # Get failed deliveries
        failed_orders = supabase.table('orders').select('id', count='exact').eq('status', 'failed').execute()
        failed_count = failed_orders.count or 0

        # Get revenue by category (simplified - using product categories)
        revenue_by_category = [
            {"name": 'Milk & Dairy', "value": 68400, "color": '#2D6A4F'},
            {"name": 'Organic Oils', "value": 32100, "color": '#40916C'},
            {"name": 'Farm Products', "value": 24800, "color": '#F4A261'},
            {"name": 'Vegetables', "value": 17350, "color": '#E9C46A'},
        ]

        # Get monthly P&L data (simplified with mock data for now)
        monthly_pnl = [
            {"month": 'Nov', "revenue": 98400, "expense": 61200, "profit": 37200},
            {"month": 'Dec', "revenue": 112400, "expense": 68900, "profit": 43500},
            {"month": 'Jan', "revenue": 128900, "expense": 75200, "profit": 53700},
            {"month": 'Feb', "revenue": 134200, "expense": 78300, "profit": 55900},
            {"month": 'Mar', "revenue": 138600, "expense": 81200, "profit": 57400},
            {"month": 'Apr', "revenue": float(monthly_revenue), "expense": 83200, "profit": float(monthly_revenue) - 83200},
        ]

        # Get weekly order data (last 7 days)
        week_orders = []
        for i in range(7):
            date = datetime.date.today() - datetime.timedelta(days=i)
            date_str = date.isoformat()
            next_date = (date + datetime.timedelta(days=1)).isoformat()

            day_orders = supabase.table('orders').select('total_amount').gte('created_at', date_str).lt('created_at', next_date).execute()
            day_revenue = sum(order['total_amount'] for order in day_orders.data) if day_orders.data else 0
            day_count = len(day_orders.data) if day_orders.data else 0

            week_orders.append({
                "day": date.strftime('%a %d'),
                "orders": day_count,
                "revenue": float(day_revenue)
            })

        week_orders.reverse()  # Most recent first

        return {
            "status": "success",
            "dashboardKPIs": {
                "todayOrders": today_orders_count,
                "todayOrdersChange": 0,
                "activeSubscriptions": active_subs_count,
                "activeSubscriptionsChange": 0,
                "revenueMonth": float(monthly_revenue),
                "revenueMonthChange": 0,
                "newCustomers": new_customers_count,
                "newCustomersChange": 0,
                "lowStockAlerts": low_stock_count,
                "expiringBatches": expiring_count,
                "failedDeliveries": failed_count,
                "pendingOrders": pending_count
            },
            "ordersChartDataThisWeek": week_orders[-7:],  # Last 7 days
            "ordersChartDataLastWeek": week_orders[-14:-7] if len(week_orders) >= 14 else [],  # Previous 7 days
            "revenueByCategory": revenue_by_category,
            "monthlyPnL": monthly_pnl
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.get("/inventory")
def get_admin_inventory():
    """Returns current inventory stock, including wastage."""
    return {
        "status": "success",
        "inventory": [
            { "id": 'INV-001', "productId": 'p1', "productName": 'Fresh A2 Cow Milk', "category": 'Dairy', "batchNumber": 'BATCH-M-2024', "quantity": 120, "productionDate": '2026-04-17', "expiryDate": '2026-04-18', "wastage": 5, "daysToExpiry": 1, "status": 'expiring_soon' },
            { "id": 'INV-002', "productId": 'p3', "productName": 'Probiotic Curd', "category": 'Dairy', "batchNumber": 'BATCH-C-2025', "quantity": 80, "productionDate": '2026-04-16', "expiryDate": '2026-04-19', "wastage": 2, "daysToExpiry": 2, "status": 'expiring_soon' },
            { "id": 'INV-003', "productId": 'p4', "productName": 'Fresh Paneer', "category": 'Dairy', "batchNumber": 'BATCH-P-2026', "quantity": 30, "productionDate": '2026-04-17', "expiryDate": '2026-04-20', "wastage": 0, "daysToExpiry": 3, "status": 'fresh' },
            { "id": 'INV-004', "productId": 'p2', "productName": 'Organic Desi Ghee', "category": 'Dairy', "batchNumber": 'BATCH-G-2020', "quantity": 45, "productionDate": '2026-03-01', "expiryDate": '2026-09-01', "wastage": 0, "daysToExpiry": 137, "status": 'fresh' },
            { "id": 'INV-005', "productId": 'p5', "productName": 'Organic Vegetable Box', "category": 'Vegetables', "batchNumber": 'BATCH-V-2027', "quantity": 60, "productionDate": '2026-04-17', "expiryDate": '2026-04-20', "wastage": 3, "daysToExpiry": 3, "status": 'fresh' },
            { "id": 'INV-006', "productId": 'p8', "productName": 'Cold-Pressed Coconut Oil', "category": 'Oils', "batchNumber": 'BATCH-O-1800', "quantity": 35, "productionDate": '2026-02-01', "expiryDate": '2026-08-01', "wastage": 0, "daysToExpiry": 106, "status": 'fresh' },
            { "id": 'INV-007', "productId": 'p11', "productName": 'Raw Forest Honey', "category": 'Farm', "batchNumber": 'BATCH-H-0990', "quantity": 20, "productionDate": '2025-12-01', "expiryDate": '2026-12-01', "wastage": 0, "daysToExpiry": 228, "status": 'fresh' },
            { "id": 'INV-008', "productId": 'p12', "productName": 'Free-Range Farm Eggs', "category": 'Farm', "batchNumber": 'BATCH-E-2028', "quantity": 150, "productionDate": '2026-04-16', "expiryDate": '2026-04-23', "wastage": 6, "daysToExpiry": 6, "status": 'fresh' },
        ]
    }

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

@router.get("/subscriptions")
def get_admin_subscriptions():
    """Returns all subscriptions for admin management."""
    return {
        "status": "success",
        "subscriptions": [
            {
                "id": "sub-001",
                "customerName": "Rajesh Kumar",
                "customerPhone": "+91 98765 43210",
                "productName": "Fresh A2 Cow Milk",
                "productImage": "/products/milk.png",
                "schedule": "daily",
                "nextDelivery": "2026-04-19",
                "monthlyValue": 140,
                "status": "active"
            },
            {
                "id": "sub-002",
                "customerName": "Priya Sharma",
                "customerPhone": "+91 87654 32109",
                "productName": "Organic Vegetable Box",
                "productImage": "/products/vegetables.png",
                "schedule": "alternate_day",
                "nextDelivery": "2026-04-20",
                "monthlyValue": 249,
                "status": "active"
            },
            {
                "id": "sub-003",
                "customerName": "Amit Patel",
                "customerPhone": "+91 76543 21098",
                "productName": "Probiotic Curd",
                "productImage": "/products/curd.png",
                "schedule": "custom",
                "nextDelivery": "2026-04-21",
                "monthlyValue": 110,
                "status": "paused"
            },
            {
                "id": "sub-004",
                "customerName": "Sneha Reddy",
                "customerPhone": "+91 65432 10987",
                "productName": "Cold-Pressed Coconut Oil",
                "productImage": "/products/coconut-cooking-oil-hero-v3.png",
                "schedule": "daily",
                "nextDelivery": "2026-04-18",
                "monthlyValue": 380,
                "status": "cancelled"
            }
        ]
    }

@router.get("/customers")
def get_admin_customers():
    """Returns all customers for admin management."""
    if supabase is None:
        return {"status": "error", "message": "Database not connected"}
    try:
        # Get all users with their order and subscription counts
        customers = supabase.table('users').select('''
            id, name, phone, email, wallet_balance, created_at,
            orders(count), subscriptions(count)
        ''').execute()

        # Calculate total spent for each customer
        result = []
        for customer in customers.data:
            # Get total spent from orders
            total_spent_result = supabase.table('orders').select('total_amount').eq('user_id', customer['id']).eq('status', 'delivered').execute()
            total_spent = sum(order['total_amount'] for order in total_spent_result.data) if total_spent_result.data else 0

            result.append({
                "id": customer['id'],
                "name": customer['name'],
                "phone": customer['phone'],
                "email": customer['email'],
                "totalSpent": float(total_spent),
                "ordersCount": customer['orders'][0]['count'] if customer['orders'] else 0,
                "subscriptionsCount": customer['subscriptions'][0]['count'] if customer['subscriptions'] else 0,
                "walletBalance": float(customer['wallet_balance']),
                "status": "active",
                "joinDate": customer['created_at'][:10] if customer['created_at'] else None
            })

        return {"status": "success", "customers": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.get("/orders")
def get_admin_orders():
    """Returns all orders for admin management."""
    if supabase is None:
        return {"status": "error", "message": "Database not connected"}
    try:
        # Get orders with customer and product details
        orders = supabase.table('orders').select('''
            id, user_id, order_type, status, total_amount, payment_method,
            delivery_date, delivery_slot, delivery_address, created_at,
            users!inner(name, phone),
            order_items(product_id, quantity, price_at_time, products(name, image_url))
        ''').execute()

        result = []
        for order in orders.data:
            # Get customer info
            customer = order['users']
            # Get first product for display (simplified)
            first_item = order['order_items'][0] if order['order_items'] else None
            product_info = first_item['products'] if first_item else None

            result.append({
                "id": str(order['id']),
                "customerName": customer['name'] if customer else "Unknown",
                "customerPhone": customer['phone'] if customer else "",
                "orderType": order['order_type'],
                "status": order['status'],
                "totalAmount": float(order['total_amount']),
                "paymentMethod": order['payment_method'],
                "deliveryDate": order['delivery_date'],
                "deliverySlot": order['delivery_slot'],
                "deliveryAddress": order['delivery_address'],
                "productName": product_info['name'] if product_info else "Multiple Products",
                "productImage": product_info['image_url'] if product_info else "/products/placeholder.png",
                "createdAt": order['created_at'][:10] if order['created_at'] else None
            })

        return {"status": "success", "orders": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}
