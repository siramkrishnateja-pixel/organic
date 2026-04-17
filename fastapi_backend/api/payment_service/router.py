from fastapi import APIRouter
from pydantic import BaseModel
import time
import uuid

router = APIRouter()
    
@router.get("/status")
def get_payment_status():
    return {"status": "active", "service": "Dummy Razorpay Payment API", "mode": "test"}

@router.get("/health")
def health_check():
    return {"status": "healthy"}

class PaymentRequest(BaseModel):
    amount: float
    currency: str = "INR"
    receipt: str
    user_id: str = "guest"

@router.post("/razorpay-dummy")
def create_dummy_payment(request: PaymentRequest):
    # Simulate a brief network delay for the fake external payment gateway
    time.sleep(1.0)
    
    return {
        "id": f"pay_dummy_{uuid.uuid4().hex[:12]}",
        "entity": "order",
        "amount": int(request.amount * 100), # Razorpay uses paise
        "amount_paid": 0,
        "amount_due": int(request.amount * 100),
        "currency": request.currency,
        "receipt": request.receipt,
        "status": "created",
        "attempts": 0,
        "notes": [],
        "created_at": int(time.time()),
        "test_mode": True
    }
