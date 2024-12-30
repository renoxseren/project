import { intents } from './intentClassifier';

const responses = {
  [intents.GREETING]: [
    'Merhaba! Size nasıl yardımcı olabilirim?',
    'Selam! Bugün size nasıl yardımcı olabilirim?',
    'Merhaba! Hoş geldiniz!'
  ],
  [intents.FAREWELL]: [
    'Güle güle! İyi günler dilerim.',
    'Görüşmek üzere! İyi günler.',
    'Hoşça kalın!'
  ],
  [intents.THANKS]: [
    'Rica ederim!',
    'Ne demek, her zaman!',
    'Bir şey değil!'
  ],
  [intents.QUESTION]: [
    'Bu konuda size yardımcı olmaya çalışayım.',
    'İlginç bir soru. Düşüneyim...',
    'Bu soruyu yanıtlamak için elimden geleni yapacağım.'
  ],
  [intents.GENERAL]: [
    'Anlıyorum. Başka nasıl yardımcı olabilirim?',
    'İlginç bir konu. Devam edin lütfen.',
    'Size daha fazla nasıl yardımcı olabilirim?'
  ]
};

export function generateBasicResponse(intent) {
  const possibleResponses = responses[intent];
  const randomIndex = Math.floor(Math.random() * possibleResponses.length);
  return possibleResponses[randomIndex];
}

export function generateContextualResponse(text, intent, sentiment) {
  // Combine intent, sentiment and context for better responses
  let response = generateBasicResponse(intent);
  
  if (sentiment < -0.3) {
    response += ' Üzgün görünüyorsunuz, size nasıl yardımcı olabilirim?';
  } else if (sentiment > 0.3) {
    response += ' Pozitif yaklaşımınız çok güzel!';
  }
  
  return response;
}