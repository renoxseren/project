import * as tf from '@tensorflow/tfjs';
import { load as loadUSE } from '@tensorflow-models/universal-sentence-encoder';

export async function initializeModels() {
  try {
    // First load TensorFlow.js
    await tf.ready();
    console.log('TensorFlow.js initialized');

    // Load Universal Sentence Encoder
    const encoder = await loadUSE();
    console.log('Universal Sentence Encoder loaded');

    // Create local sentiment model
    const model = await createLocalModel();
    console.log('Local model created');

    return { encoder, model };
  } catch (error) {
    console.error('Model initialization failed:', error);
    throw new Error('Model yüklenirken bir hata oluştu: ' + error.message);
  }
}

async function createLocalModel() {
  const model = tf.sequential();
  
  // Input layer - matches USE embedding size (512)
  model.add(tf.layers.dense({
    units: 32,
    activation: 'relu',
    inputShape: [512]
  }));
  
  // Hidden layer
  model.add(tf.layers.dense({
    units: 16,
    activation: 'relu'
  }));
  
  // Output layer - sentiment score between -1 and 1
  model.add(tf.layers.dense({
    units: 1,
    activation: 'tanh'
  }));

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'meanSquaredError'
  });

  // Initialize with some weights
  await model.predict(tf.zeros([1, 512])).dispose();

  return model;
}