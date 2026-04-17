from fastapi import APIRouter
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Optional: real supabase client initialization
url = os.environ.get("SUPABASE_URL", "")
key = os.environ.get("SUPABASE_KEY", "")

try:
    if url and key:
        supabase: Client = create_client(url, key)
    else:
        supabase = None
except Exception as e:
    supabase = None

@router.get("/status")
def get_supabase_status():
    if supabase:
        return {"connection": "active", "message": "Successfully initialized Supabase client.", "url": url}
    return {"connection": "mock", "message": "Supabase keys not found in .env, running in mock mode."}

@router.get("/health")
def health_check():
    return {"status": "healthy", "service": "Supabase Connection API"}

from pydantic import BaseModel
import time
import uuid

class SendOTPRequest(BaseModel):
    identifier: str
    method: str = "phone"

class VerifyOTPRequest(BaseModel):
    identifier: str
    otp: str
    requested_role: str = "user"

@router.post("/auth/send-otp")
def send_otp(request: SendOTPRequest):
    time.sleep(0.8) # Simulated network delay
    
    if supabase:
        # Pseudo real implementation (commented out until keys are available)
        # res = supabase.auth.sign_in_with_otp({"email": request.identifier} if request.method == "email" else {"phone": request.identifier})
        # return {"status": "success", "message": "OTP sent via real Supabase"}
        pass

    return {
        "status": "success", 
        "message": f"Simulated OTP sent to {request.identifier} via {request.method}."
    }

@router.post("/auth/verify-otp")
def verify_otp(request: VerifyOTPRequest):
    time.sleep(1.0)
    
    # 1. Verification Step
    if request.otp != "123456":
        # In real supabase: supabase.auth.verify_otp({"email": request.identifier, "token": request.otp, "type": "magiclink"})
        return {"status": "error", "message": "Invalid OTP code. Please use 123456 for testing."}

    # 2. Role Logic Step
    # Real logic: fetch user from `users` table
    # If using auto-registration simulation, anyone can be a 'customer'.
    # For 'admin', let's simulate checking a database. Assume only 'admin@organic.com' or '9999999999' are admins.
    
    granted_role = "customer" # Default fallback
    
    if request.requested_role == "admin":
        # Simulate simple DB check for admin rights
        admin_identifiers = ["admin@organic.com", "9999999999", "admin"]
        if any(admin_val in request.identifier for admin_val in admin_identifiers):
            granted_role = "admin"
        else:
            return {
                "status": "error", 
                "message": "Access Denied. Account does not have admin privileges."
            }
    else:
        granted_role = "customer"

    # Deterministically generate a UUID based on the identifier
    user_uuid = str(uuid.uuid5(uuid.NAMESPACE_URL, "organic://user/" + request.identifier))

    return {
        "status": "success",
        "message": "Authenticated successfully",
        "session": "mock_jwt_session_token",
        "role": granted_role,
        "identifier": request.identifier,
        "user_id": user_uuid
    }
