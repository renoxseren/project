// Intent classification for different types of questions
export const intents = {
  GREETING: 'greeting',
  FAREWELL: 'farewell',
  QUESTION: 'question',
  THANKS: 'thanks',
  GENERAL: 'general'
};

export function classifyIntent(text) {
  const lowerText = text.toLowerCase();
  
  if (isGreeting(lowerText)) return intents.GREETING;
  if (isFarewell(lowerText)) return intents.FAREWELL;
  if (isThanks(lowerText)) return intents.THANKS;
  if (isQuestion(lowerText)) return intents.QUESTION;
  
  return intents.GENERAL;
}

function isGreeting(text) {
  const patterns = ['merhaba', 'selam', 'hey', 'hi', 'günaydın', 'iyi günler'];
  return patterns.some(pattern => text.includes(pattern));
}

function isFarewell(text) {
  const patterns = ['güle güle', 'hoşça kal', 'görüşürüz', 'bay'];
  return patterns.some(pattern => text.includes(pattern));
}

function isThanks(text) {
  const patterns = ['teşekkür', 'sağol', 'teşekkürler', 'thank'];
  return patterns.some(pattern => text.includes(pattern));
}

function isQuestion(text) {
  return text.includes('?') || 
         text.includes('mi') || 
         text.includes('ne') || 
         text.includes('nasıl') || 
         text.includes('nerede') ||
         text.includes('neden');
}