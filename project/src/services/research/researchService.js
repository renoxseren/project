import * as tf from '@tensorflow/tfjs';

export class ResearchService {
  constructor(encoder, knowledgeService) {
    this.encoder = encoder;
    this.knowledgeService = knowledgeService;
  }

  async research(query) {
    try {
      // Önce bilgi bankasında ara
      const knowledgeResults = await this.knowledgeService.searchKnowledge(query);
      
      if (knowledgeResults.length > 0) {
        // Güven skoruna göre sırala
        const sortedResults = knowledgeResults.sort((a, b) => b.confidence - a.confidence);
        const bestMatch = sortedResults[0];
        
        // Kullanım sayısını ve son kullanım tarihini güncelle
        await this.knowledgeService.updateKnowledgeBase(
          query,
          bestMatch.content,
          [bestMatch.topic],
          bestMatch.embedding
        );

        return this.formatResponse(bestMatch);
      }

      // Benzer konuşmaları ara
      const similarConversations = await this.knowledgeService.findSimilarConversations(query);
      
      if (similarConversations.length > 0) {
        // En iyi eşleşmeyi kullan
        const bestMatch = similarConversations[0];
        return this.formatResponse({
          content: bestMatch.ai_response,
          confidence: 0.7,
          source: 'previous_conversation'
        });
      }

      // Hiç sonuç bulunamazsa
      return 'Bu konu hakkında henüz yeterli bilgim yok. Size daha iyi yardımcı olabilmek için öğrenmeye devam ediyorum.';
    } catch (error) {
      console.error('Araştırma hatası:', error);
      return 'Araştırma yaparken bir hata oluştu. Lütfen tekrar deneyin.';
    }
  }

  formatResponse(result) {
    const confidenceText = this.getConfidenceText(result.confidence);
    const sourceText = result.source ? `\n\nBu bilgi ${result.source} kaynağından alınmıştır.` : '';
    
    return `${confidenceText} ${result.content}${sourceText}`;
  }

  getConfidenceText(confidence) {
    if (confidence > 0.8) return 'Büyük bir güvenle söyleyebilirim ki:';
    if (confidence > 0.6) return 'Bildiğim kadarıyla:';
    return 'Araştırmalarıma göre:';
  }
}