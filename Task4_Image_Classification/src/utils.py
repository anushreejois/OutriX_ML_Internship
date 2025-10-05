import numpy as np
import matplotlib.pyplot as plt

def plot_sample_predictions(model, x_test, y_test, class_names, num_samples=8):
    """Plot sample predictions"""
    predictions = model.predict(x_test[:num_samples])
    
    plt.figure(figsize=(12, 8))
    for i in range(num_samples):
        plt.subplot(2, 4, i + 1)
        plt.imshow(x_test[i])
        
        predicted_class = np.argmax(predictions[i])
        true_class = np.argmax(y_test[i])
        
        plt.title(f'True: {class_names[true_class]}\nPred: {class_names[predicted_class]}')
        plt.axis('off')
    plt.tight_layout()
    plt.show()

def calculate_accuracy(y_true, y_pred):
    """Calculate accuracy percentage"""
    return np.mean(np.argmax(y_true, axis=1) == np.argmax(y_pred, axis=1)) * 100
