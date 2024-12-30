import { knowledgeBase } from './knowledgeBase';

export class TopicProcessor {
  constructor() {
    this.conversationMemory = [];
  }

  processQuery(query) {
    const topics = this.extractTopics(query);
    const context = this.getConversationContext();
    return this.generateDetailedResponse(query, topics, context);
  }

  extractTopics(query) {
    const words = query.toLowerCase().split(' ');
    const topics = new Set();

    words.forEach(word => {
      Object.entries(knowledgeBase).forEach(([category, data]) => {
        if (data.topics.includes(word)) {
          topics.add({ category, topic: word });
        }
      });
    });

    return Array.from(topics);
  }

  getConversationContext() {
    return this.conversationMemory.slice(-5);
  }

  generateDetailedResponse(query, topics, context) {
    if (topics.length === 0) {
      return this.handleGeneralQuery(query, context);
    }

    return this.createTopicBasedResponse(topics, query);
  }

  handleGeneralQuery(query, context) {
    const isFollowUp = this.isFollowUpQuestion(query, context);
    if (isFollowUp) {
      return this.generateFollowUpResponse(query, context);
    }
    return this.generateNewTopicResponse(query);
  }

  isFollowUpQuestion(query, context) {
    const followUpIndicators = ['bu', 'şu', 'o', 'bunun', 'şunun', 'onun', 'nasıl', 'neden'];
    return followUpIndicators.some(indicator => query.toLowerCase().includes(indicator));
  }

  generateFollowUpResponse(query, context) {
    const lastTopic = context[context.length - 1]?.topic;
    if (!lastTopic) {
      return "Özür dilerim, tam olarak hangi konudan bahsettiğinizi anlayamadım. Lütfen sorunuzu detaylandırabilir misiniz?";
    }
    return `${lastTopic} hakkında daha detaylı bilgi vereyim. ${this.getDetailedInfo(lastTopic)}`;
  }

  generateNewTopicResponse(query) {
    return "Bu konu hakkında araştırma yapıyorum. Spesifik olarak neyi öğrenmek istersiniz?";
  }

  createTopicBasedResponse(topics, query) {
    const responses = topics.map(({ category, topic }) => {
      const sources = knowledgeBase[category].sources;
      const info = this.getDetailedInfo(topic);
      return `${topic.charAt(0).toUpperCase() + topic.slice(1)} konusunda şunları söyleyebilirim:\n${info}\n\nBu bilgiler ${sources.slice(0, 2).join(' ve ')} kaynaklarından derlenmiştir.`;
    });

    return responses.join('\n\n');
  }

  getDetailedInfo(topic) {
    // Simüle edilmiş detaylı bilgi
    const details = {
      programming: "Programlama, bilgisayarlara belirli görevleri yerine getirmelerini söylemek için kullanılan yapılandırılmış talimatlardır. Modern programlama dilleri arasında JavaScript, Python, Java ve C++ bulunur.",
      web: "Web geliştirme, internet siteleri ve web uygulamaları oluşturma sürecidir. Frontend ve backend geliştirme olmak üzere iki ana alana ayrılır.",
      ai: "Yapay zeka, insan zekasını taklit eden ve deneyimlerinden öğrenebilen sistemler geliştirme bilimidir. Makine öğrenimi ve derin öğrenme, yapay zekanın alt alanlarıdır.",
      // Diğer konular için detaylar eklenebilir
    };

    return details[topic] || "Bu konu hakkında daha detaylı araştırma yapıyorum.";
  }
}