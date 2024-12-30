import React, { useState, useEffect } from 'react';
import { ChatInterface } from './components/ChatInterface';
import { initializeModels } from './services/modelService';
import { MessageService } from './services/messageService';

export default function App() {
  const [messageService, setMessageService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    async function setup() {
      try {
        setLoading(true);
        setError(null);
        const { encoder, model } = await initializeModels();
        setMessageService(new MessageService(encoder, model));
      } catch (error) {
        console.error('Model yüklenirken hata:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    setup();
  }, []);

  const handleUserMessage = async (userMessage) => {
    if (!messageService) {
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: 'Üzgünüm, sistem henüz hazır değil. Lütfen biraz bekleyin.' 
      }]);
      return;
    }

    setMessages(prev => [...prev, { type: 'user', content: userMessage }]);

    try {
      const response = await messageService.processMessage(userMessage);
      setMessages(prev => [...prev, { type: 'assistant', content: response }]);
    } catch (error) {
      console.error('Mesaj işlenirken hata:', error);
      setMessages(prev => [...prev, { 
        type: 'assistant', 
        content: 'Üzgünüm, mesajınızı işlerken bir hata oluştu.' 
      }]);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Sistem hazırlanıyor...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">
          Hata: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <ChatInterface 
        messages={messages} 
        onSendMessage={handleUserMessage} 
      />
    </div>
  );
}