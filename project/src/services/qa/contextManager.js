// Manages conversation context and history
export class ContextManager {
  constructor() {
    this.conversationHistory = [];
    this.currentContext = {};
  }

  addMessage(message, type) {
    this.conversationHistory.push({
      content: message,
      type,
      timestamp: new Date()
    });
  }

  getLastNMessages(n = 5) {
    return this.conversationHistory.slice(-n);
  }

  updateContext(newContext) {
    this.currentContext = {
      ...this.currentContext,
      ...newContext
    };
  }

  getContext() {
    return this.currentContext;
  }

  reset() {
    this.conversationHistory = [];
    this.currentContext = {};
  }
}