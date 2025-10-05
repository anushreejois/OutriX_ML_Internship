import tensorflow as tf
import keras
import matplotlib.pyplot as plt
import os
from data_preprocessing import DataPreprocessor
from model import CNNClassifier

class Trainer:
    def __init__(self):
        self.preprocessor = DataPreprocessor()
        self.classifier = CNNClassifier()
        self.history = None
    
    def setup_callbacks(self):
        """Setup training callbacks for better training"""
        # Create models directory if it doesn't exist
        os.makedirs('../data/models', exist_ok=True)
        
        callbacks = [
            keras.callbacks.EarlyStopping(
                monitor='val_accuracy',
                patience=10,
                restore_best_weights=True,
                verbose=1
            ),
            keras.callbacks.ModelCheckpoint(
                '../data/models/best_cnn_model.h5',
                monitor='val_accuracy',
                save_best_only=True,
                verbose=1
            ),
            keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.2,
                patience=5,
                min_lr=1e-7,
                verbose=1
            )
        ]
        return callbacks
    
    def train_model(self, epochs=30, batch_size=32):
        """Train the CNN model"""
        print("=== Starting CNN Training Process ===")
        
        # Load and preprocess data
        (x_train, y_train), (x_test, y_test) = self.preprocessor.load_data()
        
        # Build and compile model
        print("\nBuilding CNN model...")
        model = self.classifier.build_model()
        self.classifier.compile_model()
        
        # Display model summary
        print("\nModel Architecture:")
        self.classifier.model_summary()
        
        # Setup callbacks
        callbacks = self.setup_callbacks()
        
        # Train model
        print(f"\nStarting training for {epochs} epochs with batch size {batch_size}")
        self.history = model.fit(
            x_train, y_train,
            batch_size=batch_size,
            epochs=epochs,
            validation_data=(x_test, y_test),
            callbacks=callbacks,
            verbose="auto"
        )
        
        return self.history
    
    def evaluate_model(self, x_test, y_test):
        """Evaluate the trained model"""
        if self.classifier.model is None:
            print("No trained model found!")
            return
            
        test_loss, test_accuracy = self.classifier.model.evaluate(x_test, y_test, verbose="auto") # pyright: ignore[reportFunctionMemberAccess]
        print(f"\nFinal Test Results:")
        print(f"Test Loss: {test_loss:.4f}")
        print(f"Test Accuracy: {test_accuracy:.4f}")
        
        return test_loss, test_accuracy
    
    def plot_training_history(self):
        """Plot training and validation metrics"""
        if self.history is None:
            print("No training history found!")
            return
            
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
        
        # Plot accuracy
        ax1.plot(self.history.history['accuracy'], label='Training Accuracy', color='blue')
        ax1.plot(self.history.history['val_accuracy'], label='Validation Accuracy', color='red')
        ax1.set_title('Model Accuracy Over Epochs')
        ax1.set_xlabel('Epoch')
        ax1.set_ylabel('Accuracy')
        ax1.legend()
        ax1.grid(True)
        
        # Plot loss
        ax2.plot(self.history.history['loss'], label='Training Loss', color='blue')
        ax2.plot(self.history.history['val_loss'], label='Validation Loss', color='red')
        ax2.set_title('Model Loss Over Epochs')
        ax2.set_xlabel('Epoch')
        ax2.set_ylabel('Loss')
        ax2.legend()
        ax2.grid(True)
        
        plt.tight_layout()
        plt.show()
        
        # Save the plot
        plt.savefig('../data/models/training_history.png', dpi=300, bbox_inches='tight')
        print("Training history plot saved to: ../data/models/training_history.png")
