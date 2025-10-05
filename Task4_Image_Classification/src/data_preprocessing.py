import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt

class DataPreprocessor:
    def __init__(self):
        self.num_classes = 10
        self.class_names = ['airplane', 'automobile', 'bird', 'cat', 'deer',
                           'dog', 'frog', 'horse', 'ship', 'truck']
    
    def load_data(self):
        """Load and preprocess CIFAR-10 dataset"""
        print("Loading CIFAR-10 dataset...")
        (x_train, y_train), (x_test, y_test) = tf.keras.datasets.cifar10.load_data() # type: ignore
        
        # Normalize pixel values to 0-1 range
        x_train = x_train.astype('float32') / 255.0
        x_test = x_test.astype('float32') / 255.0
        
        # Convert labels to categorical one-hot encoding
        y_train = tf.keras.utils.to_categorical(y_train, self.num_classes) # type: ignore
        y_test = tf.keras.utils.to_categorical(y_test, self.num_classes) # type: ignore
        
        print(f"Training data shape: {x_train.shape}")
        print(f"Training labels shape: {y_train.shape}")
        print(f"Test data shape: {x_test.shape}")
        print(f"Test labels shape: {y_test.shape}")
        
        return (x_train, y_train), (x_test, y_test)
    
    def visualize_samples(self, x_data, y_data, num_samples=25):
        """Visualize sample images from dataset"""
        plt.figure(figsize=(10, 10))
        for i in range(num_samples):
            plt.subplot(5, 5, i + 1)
            plt.imshow(x_data[i])
            plt.title(self.class_names[np.argmax(y_data[i])])
            plt.axis('off')
        plt.tight_layout()
        plt.show()
        
    def get_class_distribution(self, y_data):
        """Display class distribution in dataset"""
        class_counts = np.sum(y_data, axis=0)
        
        plt.figure(figsize=(10, 6))
        plt.bar(self.class_names, class_counts)
        plt.title('Class Distribution in Dataset')
        plt.xlabel('Classes')
        plt.ylabel('Number of Samples')
        plt.xticks(rotation=45)
        plt.tight_layout()
        plt.show()
        
        return class_counts
