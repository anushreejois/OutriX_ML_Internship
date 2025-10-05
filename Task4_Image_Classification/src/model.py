import tensorflow as tf
import keras


class CNNClassifier:
    def __init__(self, input_shape=(32, 32, 3), num_classes=10):
        self.input_shape = input_shape
        self.num_classes = num_classes
        self.model = None
    
    def build_model(self):
        """Build CNN architecture optimized for CIFAR-10"""
        model = keras.models.Sequential([
            # First Convolutional Block
            keras.layers.Conv2D(32, (3, 3), activation='relu', padding='same', 
                         input_shape=self.input_shape),
            keras.layers.BatchNormalization(),
            keras.layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
            keras.layers.MaxPooling2D((2, 2)),
            keras.layers.Dropout(0.25),
            
            # Second Convolutional Block
            keras.layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
            keras.layers.BatchNormalization(),
            keras.layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
            keras.layers.MaxPooling2D((2, 2)),
            keras.layers.Dropout(0.25),
            
            # Third Convolutional Block
            keras.layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
            keras.layers.BatchNormalization(),
            keras.layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
            keras.layers.MaxPooling2D((2, 2)),
            keras.layers.Dropout(0.25),
            
            # Classifier Head
            keras.layers.Flatten(),
            keras.layers.Dense(512, activation='relu'),
            keras.layers.BatchNormalization(),
            keras.layers.Dropout(0.5),
            keras.layers.Dense(self.num_classes, activation='softmax')
        ])
        
        self.model = model
        return model
    
    def compile_model(self, learning_rate=0.001):
        """Compile the model with optimizer and loss function"""
        if self.model is None:
            raise ValueError("Model not built yet. Call build_model() first.")
        
        # Create optimizer instance to avoid type warnings
        optimizer = keras.optimizers.Adam(learning_rate=learning_rate)
        
        self.model.compile( # pyright: ignore[reportFunctionMemberAccess]
            optimizer=optimizer, # pyright: ignore[reportArgumentType]
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        print("Model compiled successfully!")
    
    def model_summary(self):
        """Display model architecture summary"""
        if self.model is None:
            raise ValueError("Model not built yet. Call build_model() first.")
        
        return self.model.summary() # pyright: ignore[reportFunctionMemberAccess]
    
    def save_model(self, filepath):
        """Save the trained model"""
        if self.model is None:
            raise ValueError("Model not built yet.")
        
        self.model.save(filepath) # pyright: ignore[reportFunctionMemberAccess]
        print(f"Model saved to: {filepath}")
    
    def load_model(self, filepath):
        """Load a pre-trained model"""
        self.model = keras.models.load_model(filepath)
        print(f"Model loaded from: {filepath}")
        return self.model
