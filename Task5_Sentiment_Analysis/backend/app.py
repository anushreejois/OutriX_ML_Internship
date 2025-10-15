from flask import Flask, request, jsonify
from flask_cors import CORS
from sentiment_pipeline import SentimentAnalysisPipeline
import json
import os

app = Flask(__name__)
CORS(app)

# Initialize the sentiment analysis pipeline
pipeline = SentimentAnalysisPipeline()
models_trained = False

@app.route('/')
def home():
    return jsonify({
        "message": "OutriX Task 5 - Sentiment Analysis API",
        "status": "running",
        "endpoints": [
            "/train - POST: Train the models",
            "/predict - POST: Predict sentiment for text",
            "/batch_predict - POST: Predict sentiment for multiple texts",
            "/model_info - GET: Get model information"
        ]
    })

@app.route('/train', methods=['POST'])
def train_models():
    global models_trained
    try:
        # Load and train models
        df = pipeline.load_and_prepare_data()
        results = pipeline.train_models(df)
        
        models_trained = True
        
        return jsonify({
            "status": "success",
            "message": "Models trained successfully",
            "results": {
                "naive_bayes_accuracy": float(results['nb_accuracy']),
                "logistic_regression_accuracy": float(results['lr_accuracy']),
                "dataset_size": len(df)
            }
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/predict', methods=['POST'])
def predict_sentiment():
    try:
        if not models_trained:
            return jsonify({
                "status": "error",
                "message": "Models not trained yet. Please train models first."
            }), 400
        
        data = request.get_json()
        text = data.get('text', '')
        model_type = data.get('model', 'nb')
        
        if not text:
            return jsonify({
                "status": "error",
                "message": "Text is required"
            }), 400
        
        result = pipeline.predict_sentiment(text, model_type)
        
        return jsonify({
            "status": "success",
            "prediction": result
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/batch_predict', methods=['POST'])
def batch_predict_sentiment():
    try:
        if not models_trained:
            return jsonify({
                "status": "error",
                "message": "Models not trained yet. Please train models first."
            }), 400
        
        data = request.get_json()
        texts = data.get('texts', [])
        model_type = data.get('model', 'nb')
        
        if not texts:
            return jsonify({
                "status": "error",
                "message": "Texts array is required"
            }), 400
        
        predictions = []
        for text in texts:
            result = pipeline.predict_sentiment(text, model_type)
            predictions.append(result)
        
        return jsonify({
            "status": "success",
            "predictions": predictions
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@app.route('/model_info', methods=['GET'])
def get_model_info():
    return jsonify({
        "status": "success",
        "info": {
            "models_trained": models_trained,
            "available_models": ["naive_bayes", "logistic_regression"],
            "features": "TF-IDF Vectorization",
            "preprocessing": [
                "Lowercase conversion",
                "Special character removal"
            ],
            "sentiment_classes": ["positive", "negative", "neutral"]
        }
    })

if __name__ == '__main__':
    print("Starting OutriX Task 5 - Sentiment Analysis API...")
    print("Available endpoints:")
    print("- POST /train - Train the sentiment analysis models")
    print("- POST /predict - Predict sentiment for single text")
    print("- POST /batch_predict - Predict sentiment for multiple texts")
    print("- GET /model_info - Get model information")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
