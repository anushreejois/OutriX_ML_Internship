# CNN Image Classification - Task 4

## Project Overview

Convolutional Neural Network for CIFAR-10 image classification using TensorFlow/Keras.

## Dataset

- CIFAR-10: 60,000 32x32 color images in 10 classes
- Training: 50,000 images
- Testing: 10,000 images

## Model Architecture

- 3 Convolutional blocks with BatchNorm and Dropout
- MaxPooling for dimension reduction
- Dense classifier with 512 neurons
- Softmax output for 10 classes

## Results

- Training Accuracy: ~85-90%
- Validation Accuracy: ~75-80%
- Model saved: data/models/best_cnn_model.h5

## Files Structure
