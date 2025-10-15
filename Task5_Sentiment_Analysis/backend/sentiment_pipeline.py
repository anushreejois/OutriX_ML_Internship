import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score, classification_report
import re
import pickle
import warnings
warnings.filterwarnings('ignore')

class SentimentAnalysisPipeline:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=5000, stop_words='english')
        self.nb_model = MultinomialNB()
        self.lr_model = LogisticRegression(max_iter=1000)
    
    def preprocess_text(self, text):
        """Simple preprocessing without NLTK"""
        # Convert to lowercase
        text = text.lower()
        
        # Remove special characters and digits
        text = re.sub(r'[^a-zA-Z\s]', '', text)
        
        # Remove extra whitespace
        text = ' '.join(text.split())
        
        return text
    
    def load_and_prepare_data(self):
        """Load sample dataset"""
        sample_data = {
            'text': [
                "I love this product, it's amazing!",
                "This is the worst experience ever",
                "The movie was okay, nothing special",
                "Absolutely fantastic service!",
                "I hate waiting in long queues",
                "The food was decent",
                "Outstanding performance by the team",
                "This is terrible quality",
                "Not bad, could be better",
                "Excellent customer support!",
                "The app crashes frequently",
                "Average experience overall",
                "I'm so happy with my purchase",
                "Disappointing results",
                "It's alright, nothing extraordinary",
                "Brilliant implementation!",
                "Poor customer service",
                "Satisfactory but not great",
                "Love the new features!",
                "Waste of time and money"
            ],
            'sentiment': [
                'positive', 'negative', 'neutral', 'positive', 'negative',
                'neutral', 'positive', 'negative', 'neutral', 'positive',
                'negative', 'neutral', 'positive', 'negative', 'neutral',
                'positive', 'negative', 'neutral', 'positive', 'negative'
            ]
        }
        return pd.DataFrame(sample_data)
    
    def train_models(self, df):
        """Train both models"""
        print("Preprocessing text data...")
        df['processed_text'] = df['text'].apply(self.preprocess_text)
        
        X_train, X_test, y_train, y_test = train_test_split(
            df['processed_text'], df['sentiment'], test_size=0.2, random_state=42
        )
        
        print("Vectorizing text using TF-IDF...")
        X_train_tfidf = self.vectorizer.fit_transform(X_train)
        X_test_tfidf = self.vectorizer.transform(X_test)
        
        print("Training Naive Bayes model...")
        self.nb_model.fit(X_train_tfidf, y_train)
        nb_predictions = self.nb_model.predict(X_test_tfidf)
        nb_accuracy = accuracy_score(y_test, nb_predictions)
        
        print("Training Logistic Regression model...")
        self.lr_model.fit(X_train_tfidf, y_train)
        lr_predictions = self.lr_model.predict(X_test_tfidf)
        lr_accuracy = accuracy_score(y_test, lr_predictions)
        
        print(f"\nNaive Bayes Accuracy: {nb_accuracy:.4f}")
        print(f"Logistic Regression Accuracy: {lr_accuracy:.4f}")
        
        return {
            'nb_accuracy': nb_accuracy,
            'lr_accuracy': lr_accuracy
        }
    
    def predict_sentiment(self, text, model_type='nb'):
        """Predict sentiment"""
        processed_text = self.preprocess_text(text)
        text_tfidf = self.vectorizer.transform([processed_text])
        
        if model_type == 'nb':
            prediction = self.nb_model.predict(text_tfidf)[0]
            confidence = np.max(self.nb_model.predict_proba(text_tfidf))
        else:
            prediction = self.lr_model.predict(text_tfidf)[0]
            confidence = np.max(self.lr_model.predict_proba(text_tfidf))
        
        return {
            'text': text,
            'sentiment': prediction,
            'confidence': confidence,
            'model': model_type
        }

if __name__ == "__main__":
    pipeline = SentimentAnalysisPipeline()
    df = pipeline.load_and_prepare_data()
    print(f"Loaded dataset with {len(df)} samples")
    
    results = pipeline.train_models(df)
    
    test_texts = [
        "I absolutely love this new phone!",
        "The service was terrible and slow",
        "It's an okay product, nothing special"
    ]
    
    print("\n" + "="*50)
    print("SAMPLE PREDICTIONS")
    print("="*50)
    
    for text in test_texts:
        nb_result = pipeline.predict_sentiment(text, 'nb')
        lr_result = pipeline.predict_sentiment(text, 'lr')
        
        print(f"\nText: {text}")
        print(f"Naive Bayes: {nb_result['sentiment']} (confidence: {nb_result['confidence']:.3f})")
        print(f"Logistic Regression: {lr_result['sentiment']} (confidence: {lr_result['confidence']:.3f})")
