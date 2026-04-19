from fastapi import APIRouter
import os
from pathlib import Path
from supabase import create_client, Client
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

# Optional: real supabase client initialization
url = os.environ.get("SUPABASE_URL", "")
key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
allow_test_otp = os.environ.get("ALLOW_TEST_OTP", "false").lower() in ("1", "true", "yes")

try:
    if url and key:
        supabase: Client = create_client(url, key)
    else:
        supabase = None
except Exception:
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
    method: str = "phone"
    requested_role: str = "user"
    allow_test_otp: bool = False
    allow_test_otp: bool = False

@router.post("/auth/send-otp")
def send_otp(request: SendOTPRequest):
    time.sleep(0.8)  # Simulated network delay
    
    # Test emails and phones - bypass real auth for demo/testing
    test_identifiers = [
        "test@example.com",
        "testuser@gmail.com",
        "demo@organic.local",
        "admin@organic.local",
        "customer@organic.local",
        "+91",  # Any Indian number for testing
    ]
    
    is_test_identifier = any(
        request.identifier.lower().endswith(t.lower()) or 
        request.identifier.startswith(t) 
        for t in test_identifiers
    )
    
    if is_test_identifier or not supabase:
        return {
            "status": "success",
            "message": f"Test mode: OTP ready for {request.identifier}. Use code 123456.",
            "allowTestOtp": True,
        }
    
    if supabase:
        try:
            credentials = {"email": request.identifier} if request.method == "email" else {"phone": request.identifier}
            response = supabase.auth.sign_in_with_otp(credentials)
            error = getattr(response, "error", None)
            if error:
                return {"status": "error", "message": str(error), "allowTestOtp": True}
            return {
                "status": "success",
                "message": f"OTP request sent to {request.identifier}.",
                "allowTestOtp": True,
            }
        except Exception as e:
            error_msg = str(e).lower()
            if "rate limit" in error_msg or "too many" in error_msg:
                return {
                    "status": "error",
                    "message": f"Rate limited. Use test code 123456 for demo.",
                    "allowTestOtp": True,
                }
            return {"status": "error", "message": str(e), "allowTestOtp": True}

    return {
        "status": "error",
        "message": "Supabase auth is not configured. Please provide SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
        "allowTestOtp": False,
    }

@router.post("/auth/verify-otp")
def verify_otp(request: VerifyOTPRequest):
    # Test emails and phones - bypass real auth for demo/testing
    test_identifiers = [
        "test@example.com",
        "testuser@gmail.com",
        "demo@organic.local",
        "admin@organic.local",
        "customer@organic.local",
        "+91",  # Any Indian number for testing
    ]
    
    is_test_identifier = any(
        request.identifier.lower().endswith(t.lower()) or 
        request.identifier.startswith(t) 
        for t in test_identifiers
    )
    
    # Accept test OTP code for test identifiers or when rate-limited (frontend flag)
    if (is_test_identifier or request.allow_test_otp) and request.otp == "123456":
        return {
            "status": "success",
            "message": "OTP verified in test mode.",
            "role": request.requested_role,
            "identifier": request.identifier,
            "user_id": request.identifier,
        }
    
    if supabase:
        try:
            params = {
                "token": request.otp,
                "type": "sms" if request.method == "phone" else "email",
            }
            if request.method == "email":
                params["email"] = request.identifier
            else:
                params["phone"] = request.identifier

            auth_response = supabase.auth.verify_otp(params)
            error = getattr(auth_response, "error", None)
            if error:
                return {"status": "error", "message": str(error)}

            user = getattr(auth_response, "user", None)
            user_id = None
            if user:
                if isinstance(user, dict):
                    user_id = user.get("id") or user.get("email") or user.get("phone")
                else:
                    user_id = getattr(user, "id", None) or getattr(user, "email", None) or getattr(user, "phone", None)

            return {
                "status": "success",
                "message": "OTP verified successfully.",
                "role": request.requested_role,
                "identifier": request.identifier,
                "user_id": user_id,
            }
        except Exception as e:
            return {"status": "error", "message": str(e)}

    return {"status": "error", "message": "Invalid OTP or authentication failed. Try code 123456 for demo mode."}


class ValidateSessionRequest(BaseModel):
    token: str

@router.post("/auth/validate-session")
def validate_session(request: ValidateSessionRequest):
    """Validate user session token"""
    token = request.token
    if not token:
        return {"status": "error", "message": "No token provided"}

    # In a real implementation, you would:
    # 1. Decode and verify JWT token
    # 2. Check if session exists in database
    # 3. Validate token hasn't expired
    # 4. Return user data if valid

    try:
        if len(token) > 10:  # Basic length check
            return {"status": "success", "message": "Session valid"}
        return {"status": "error", "message": "Invalid token"}
    except Exception:
        return {"status": "error", "message": "Session validation failed"}
