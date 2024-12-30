export class DialogueManager {
  constructor() {
    this.conversationState = {
      currentTopic: null,
      questionCount: 0,
      lastResponse: null,
      userPreferences: new Map()
    };
  }

  async processUserInput(text, topicProcessor) {
    this.updateConversationState(text);
    
    if (this.isGreeting(text)) {
      return this.handleGreeting();
    }
    
    if (this.isFarewell(text)) {
      return this.handleFarewell();
    }
    
    const response = await topicProcessor.processQuery(text);
    this.conversationState.lastResponse = response;
    
    return this.enhanceResponse(response);
  }

  updateConversationState(text) {
    this.conversationState.questionCount++;
    // Kullanıcı tercihlerini ve ilgi alanlarını analiz et
    this.analyzeUserPreferences(text);
  }

  analyzeUserPreferences(text) {
    const keywords = text.toLowerCase().split(' ');
    keywords.forEach(word => {
      const count = this.conversationState.userPreferences.get(word) || 0;
      this.conversationState.userPreferences.set(word, count + 1);
    });
  }

  isGreeting(text) {
    const greetings = ['merhaba', 'selam', 'hey', 'hi', 'günaydın'];
    return greetings.some(greeting => text.toLowerCase().includes(greeting));
  }

  isFarewell(text) {
    const farewells = ['güle güle', 'hoşça kal', 'görüşürüz', 'bay'];
    return farewells.some(farewell => text.toLowerCase().includes(farewell));
  }

  handleGreeting() {
    const greetings = [
      'Merhaba! Size nasıl yardımcı olabilirim?',
      'Selam! Bugün hangi konuda bilgi almak istersiniz?',
      'Merhaba! Birlikte öğrenmeye hazır mısınız?'
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  handleFarewell() {
    const farewells = [
      'Görüşmek üzere! Umarım yardımcı olabilmişimdir.',
      'İyi günler! Başka sorularınız olursa beklerim.',
      'Hoşça kalın! Yeni sorularınızla tekrar görüşmek üzere.'
    ];
    return farewells[Math.floor(Math.random() * farewells.length)];
  }

  enhanceResponse(response) {
    if (this.conversationState.questionCount === 1) {
      return `${response}\n\nBaşka sorularınız varsa sormaktan çekinmeyin.`;
    }
    
    const followUp = this.generateFollowUpPrompt();
    return `${response}\n\n${followUp}`;
  }

  generateFollowUpPrompt() {
    const prompts = [
      'Bu konuda başka ne öğrenmek istersiniz?',
      'Daha spesifik bir soru sormak ister misiniz?',
      'Size başka nasıl yardımcı olabilirim?'
    ];
    return prompts[Math.floor(Math.random() * prompts.length)];
  }
}