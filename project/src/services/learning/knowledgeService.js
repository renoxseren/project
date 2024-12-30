import { createClient } from '@supabase/supabase-js';

export class KnowledgeService {
  constructor(encoder) {
    this.encoder = encoder;
    // Burada URL ve API Anahtarını doğrudan tanımlıyoruz
    this.supabase = createClient(
      'https://gcmgykxkieixzpttoecr.supabase.co',  // Supabase URL
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjbWd5a3hraWVpeHpwdHRvZWNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1NjU5NDksImV4cCI6MjA1MTE0MTk0OX0.tluVZkPdfeGsLseqbz3xg1hgi6LIR0SQzZ6rW4F76yM' // Supabase API Key
    );
  }

  async learnFromConversation(userMessage, aiResponse, topics) {
    try {
      const embedding = await this.encoder.embed([userMessage]);
      const embeddingArray = Array.from(await embedding.array())[0];

      // Conversation kaydını Supabase'e ekliyoruz
      await this.supabase
        .from('conversations')
        .insert({
          user_message: userMessage,
          ai_response: aiResponse,
          embedding: embeddingArray,
          topics
        });

      // Bilgi bankasını güncelliyoruz
      if (topics && topics.length > 0) {
        await this.updateKnowledgeBase(userMessage, aiResponse, topics, embeddingArray);
      }
    } catch (error) {
      console.error('Öğrenme hatası:', error);
    }
  }

  async findSimilarConversations(query, limit = 5) {
    try {
      const embedding = await this.encoder.embed([query]);
      const embeddingArray = Array.from(await embedding.array())[0];

      const { data: conversations } = await this.supabase.rpc('match_conversations', {
        query_embedding: embeddingArray,
        match_threshold: 0.7,
        match_count: limit
      });

      return conversations;
    } catch (error) {
      console.error('Benzer konuşma arama hatası:', error);
      return [];
    }
  }

  async updateKnowledgeBase(userMessage, aiResponse, topics, embedding) {
    try {
      for (const topic of topics) {
        const { data: existing } = await this.supabase
          .from('knowledge_base')
          .select()
          .eq('topic', topic)
          .single();

        if (existing) {
          // Mevcut bilgiyi güncelle
          await this.supabase
            .from('knowledge_base')
            .update({
              content: this.mergeContent(existing.content, aiResponse),
              last_used: new Date().toISOString(),
              use_count: existing.use_count + 1,
              confidence: Math.min(existing.confidence + 0.1, 1.0)
            })
            .eq('id', existing.id);
        } else {
          // Yeni bilgi ekle
          await this.supabase
            .from('knowledge_base')
            .insert({
              topic,
              content: aiResponse,
              embedding,
              confidence: 0.5,
              source: 'conversation'
            });
        }
      }
    } catch (error) {
      console.error('Bilgi bankası güncelleme hatası:', error);
    }
  }

  mergeContent(existingContent, newContent) {
    // Mevcut ve yeni içeriği akıllıca birleştir
    return `${existingContent}\n\nEk Bilgi: ${newContent}`;
  }

  async searchKnowledge(query, limit = 5) {
    try {
      const embedding = await this.encoder.embed([query]);
      const embeddingArray = Array.from(await embedding.array())[0];

      const { data: knowledge } = await this.supabase.rpc('match_knowledge', {
        query_embedding: embeddingArray,
        match_threshold: 0.7,
        match_count: limit
      });

      return knowledge;
    } catch (error) {
      console.error('Bilgi arama hatası:', error);
      return [];
    }
  }
}