import * as tf from '@tensorflow/tfjs';
import { TopicProcessor } from './knowledge/topicProcessor';
import { DialogueManager } from './conversation/dialogueManager';
import { ResearchService } from './research/researchService';
import { KnowledgeService } from './learning/knowledgeService';

export class MessageService {
  constructor(encoder, model) {
    this.encoder = encoder;
    this.model = model;
    this.knowledgeService = new KnowledgeService(encoder);
    this.topicProcessor = new TopicProcessor();
    this.dialogueManager = new DialogueManager();
    this.researchService = new ResearchService(encoder, this.knowledgeService);
  }

  async processMessage(text) {
    try {
      // Konuları çıkar
      const topics = this.topicProcessor.extractTopics(text);
      
      // Araştırma yap
      const researchResponse = await this.researchService.research(text);
      
      // Diyalog yöneticisi ile yanıt oluştur
      const dialogueResponse = await this.dialogueManager.processUserInput(
        text,
        this.topicProcessor
      );

      // Yanıtları birleştir
      const finalResponse = this.combineResponses(dialogueResponse, researchResponse);

      // Öğrenme sistemine kaydet
      await this.knowledgeService.learnFromConversation(
        text,
        finalResponse,
        topics.map(t => t.topic)
      );

      return finalResponse;
    } catch (error) {
      console.error('Message processing error:', error);
      return 'Üzgünüm, mesajınızı işlerken bir hata oluştu. Lütfen tekrar dener misiniz?';
    }
  }

  combineResponses(dialogueResponse, researchResponse) {
    if (dialogueResponse.includes(researchResponse)) {
      return dialogueResponse;
    }
    return `${researchResponse}\n\n${dialogueResponse}`;
  }
}