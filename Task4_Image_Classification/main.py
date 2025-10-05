import sys
import os

# Add src directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

from src.train import Trainer
from src.data_preprocessing import DataPreprocessor

def main():
    print("=== CNN Image Classification Project - Task 4 ===")
    print("OutriX ML Internship\n")
    
    # Initialize trainer
    trainer = Trainer()
    
    # Load and display basic dataset info
    print("Loading dataset and showing sample information...")
    (x_train, y_train), (x_test, y_test) = trainer.preprocessor.load_data()
    
    print(f"\nDataset Summary:")
    print(f"Number of classes: {trainer.preprocessor.num_classes}")
    print(f"Class names: {trainer.preprocessor.class_names}")
    print(f"Training samples: {x_train.shape[0]}")
    print(f"Test samples: {x_test.shape[0]}")
    print(f"Image dimensions: {x_train.shape[1:3]}")
    print(f"Color channels: {x_train.shape[3]}")
    
    # Show sample images
    print("\nDisplaying sample images from dataset...")
    trainer.preprocessor.visualize_samples(x_train, y_train, 16)
    
    # Show class distribution
    print("\nDisplaying class distribution...")
    trainer.preprocessor.get_class_distribution(y_train)
    
    # Train the model
    print("\nStarting CNN model training...")
    history = trainer.train_model(epochs=25, batch_size=32)
    
    # Evaluate final model
    print("\nEvaluating trained model...")
    trainer.evaluate_model(x_test, y_test)
    
    # Plot training results
    print("\nDisplaying training history...")
    trainer.plot_training_history()
    
    print("\n=== Task 4 Complete! ===")
    print("Model saved to: data/models/best_cnn_model.h5")
    print("Training plots saved to: data/models/training_history.png")

if __name__ == "__main__":
    main()
