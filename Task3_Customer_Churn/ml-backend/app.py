from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import uvicorn
from typing import List

app = FastAPI(
    title="Customer Churn Predictor API",
    description="OutriX ML Internship - Task 3 API",
    version="1.0.0"
)

# Enable CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CustomerInput(BaseModel):
    gender: str
    age: int
    tenure: int
    monthly_charges: float
    total_charges: float
    internet_service: str
    contract: str
    payment_method: str
    paperless_billing: str
    tech_support: str
    online_backup: str

class PredictionResponse(BaseModel):
    churn_probability: float
    risk_level: str
    confidence: float
    recommendations: List[str]

@app.get("/")
async def root():
    return {
        "message": "🎯 Customer Churn Predictor API",
        "status": "active",
        "project": "OutriX ML Internship - Task 3",
        "endpoints": {
            "predict": "/predict",
            "health": "/health",
            "docs": "/docs"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "churn-predictor"}

@app.post("/predict", response_model=PredictionResponse)
async def predict_churn(customer: CustomerInput):
    try:
        # Smart rule-based prediction algorithm
        risk_score = 0
        
        # Age factor
        if customer.age < 30 or customer.age > 65:
            risk_score += 0.2
        
        # Tenure factor (new customers more likely to churn)
        if customer.tenure < 12:
            risk_score += 0.3
        elif customer.tenure < 24:
            risk_score += 0.1
            
        # Contract factor
        if customer.contract == "Month-to-month":
            risk_score += 0.4
        elif customer.contract == "One year":
            risk_score += 0.1
            
        # Payment method factor
        if customer.payment_method == "Electronic check":
            risk_score += 0.2
            
        # Monthly charges factor
        if customer.monthly_charges > 80:
            risk_score += 0.15
        elif customer.monthly_charges < 30:
            risk_score += 0.1
            
        # Tech support factor
        if customer.tech_support == "No":
            risk_score += 0.1
            
        # Cap the risk score
        churn_probability = min(risk_score, 0.95)
        
        # Determine risk level and recommendations
        if churn_probability >= 0.7:
            risk_level = "HIGH"
            recommendations = [
                "🚨 Immediate retention call required",
                "💰 Offer loyalty discount (15-25%)",
                "📞 Assign dedicated account manager",
                "🎁 Consider contract upgrade incentives"
            ]
        elif churn_probability >= 0.4:
            risk_level = "MEDIUM" 
            recommendations = [
                "📞 Schedule proactive customer check-in",
                "📋 Send satisfaction survey",
                "🎯 Consider service upgrade offers",
                "💡 Provide usage optimization tips"
            ]
        else:
            risk_level = "LOW"
            recommendations = [
                "✅ Continue regular service",
                "📈 Consider upselling opportunities", 
                "👀 Monitor for usage pattern changes",
                "🎉 Maintain excellent service quality"
            ]
        
        confidence = abs(churn_probability - 0.5) * 2
        
        return PredictionResponse(
            churn_probability=round(churn_probability, 4),
            risk_level=risk_level,
            confidence=round(confidence, 4),
            recommendations=recommendations
        )
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
