// Basit NLP işlemleri için yardımcı fonksiyonlar
export async function processUserInput(text, embedding, model) {
  // Basit kural tabanlı yanıtlar
  const lowerText = text.toLowerCase();
  
  // Selamlaşma kontrolü
  if (lowerText.includes('merhaba') || lowerText.includes('selam')) {
    return 'Merhaba! Size nasıl yardımcı olabilirim?';
  }

  // Teşekkür kontrolü
  if (lowerText.includes('teşekkür')) {
    return 'Rica ederim!';
  }

  // Basit duygu analizi
  const sentiment = await analyzeSentiment(embedding, model);
  if (sentiment > 0.5) {
    return 'Pozitif düşünceleriniz için teşekkür ederim!';
  } else if (sentiment < -0.5) {
    return 'Üzgünüm, size nasıl yardımcı olabilirim?';
  }

  // Varsayılan yanıt
  return 'Anlıyorum. Başka nasıl yardımcı olabilirim?';
}

async function analyzeSentiment(embedding, model) {
  // Basit bir duygu analizi skoru döndür
  const prediction = model.predict(embedding);
  return prediction.dataSync()[0];
}