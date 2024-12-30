// Knowledge categories and their associated information
export const knowledgeBase = {
  technology: {
    topics: ['programming', 'web', 'mobile', 'ai', 'database'],
    sources: ['MDN', 'Stack Overflow', 'GitHub', 'Dev.to'],
  },
  science: {
    topics: ['physics', 'chemistry', 'biology', 'astronomy'],
    sources: ['Nature', 'Science Daily', 'Scientific American'],
  },
  general: {
    topics: ['history', 'geography', 'arts', 'literature'],
    sources: ['Wikipedia', 'Britannica', 'Educational Resources'],
  }
};

export function searchKnowledge(query) {
  // Implement knowledge search logic
  const relevantTopics = findRelevantTopics(query);
  return generateResearchedResponse(query, relevantTopics);
}

function findRelevantTopics(query) {
  const lowerQuery = query.toLowerCase();
  const relevantTopics = [];

  Object.entries(knowledgeBase).forEach(([category, data]) => {
    data.topics.forEach(topic => {
      if (lowerQuery.includes(topic)) {
        relevantTopics.push({ category, topic });
      }
    });
  });

  return relevantTopics;
}

function generateResearchedResponse(query, topics) {
  // Simulate researched response based on topics
  if (topics.length === 0) {
    return "Bu konu hakkında araştırma yapıyorum. Size en doğru bilgiyi vermek için biraz zamana ihtiyacım var.";
  }

  const responses = topics.map(({ category, topic }) => {
    return `${topic.charAt(0).toUpperCase() + topic.slice(1)} konusunda size yardımcı olabilirim. ${knowledgeBase[category].sources.slice(0, 2).join(' ve ')} kaynaklarından araştırma yapıyorum.`;
  });

  return responses.join('\n');
}