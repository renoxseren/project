import React from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export function ChatInterface({ messages, onSendMessage }) {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <MessageList messages={messages} />
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
}