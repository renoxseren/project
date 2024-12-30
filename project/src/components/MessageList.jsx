import React from 'react';

export function MessageList({ messages }) {
  return (
    <div className="space-y-4 mb-4 h-[500px] overflow-y-auto">
      {messages.map((message, index) => (
        <div
          key={index}
          className={`p-3 rounded-lg ${
            message.type === 'user'
              ? 'bg-blue-100 ml-auto max-w-[80%]'
              : 'bg-gray-100 mr-auto max-w-[80%]'
          }`}
        >
          {message.content}
        </div>
      ))}
    </div>
  );
}