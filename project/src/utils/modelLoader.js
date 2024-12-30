import * as tf from '@tensorflow/tfjs';

export async function loadLocalModel() {
  // Basit bir sinir ağı modeli oluştur
  const model = tf.sequential();
  
  model.add(tf.layers.dense({
    units: 32,
    activation: 'relu',
    inputShape: [512] // Universal Sentence Encoder embedding boyutu
  }));
  
  model.add(tf.layers.dense({
    units: 16,
    activation: 'relu'
  }));
  
  model.add(tf.layers.dense({
    units: 1,
    activation: 'tanh' // -1 ile 1 arasında duygu skoru
  }));

  // Modeli derle
  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'meanSquaredError'
  });

  return model;
}