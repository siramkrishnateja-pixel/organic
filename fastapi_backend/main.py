from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.supabase_service.router import router as supabase_router
from api.payment_service.router import router as payment_router
from api.user_service.router import router as user_router
from api.admin_service.router import router as admin_router
from api.product_service.router import router as product_router

app = FastAPI(
    title="Organic Platform Backend",
    description="FastAPI service for Supabase and Payment integrations",
    version="1.0.0"
)

# Enable CORS so Next.js frontend can communicate with it
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(supabase_router, prefix="/api/supabase", tags=["Supabase"])
app.include_router(payment_router, prefix="/api/payment", tags=["Payment"])
app.include_router(user_router, prefix="/api/user", tags=["User"])
app.include_router(admin_router, prefix="/api/admin", tags=["Admin"])
app.include_router(product_router, prefix="/api/product", tags=["Product"])

@app.get("/")
def root():
    return {"status": "ok", "message": "FastAPI Server is running successfully."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
