
interface UserPreference {
  key: string;
  value: string;
  confidence: number;
  lastUpdated: number;
}

interface MemoryCore {
  preferences: UserPreference[];
  interactionCount: number;
  lastActive: number;
}

const MEMORY_KEY = 'caganx_memory_core';

export const memoryService = {
  getMemory: (): MemoryCore => {
    const stored = localStorage.getItem(MEMORY_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return {
      preferences: [],
      interactionCount: 0,
      lastActive: Date.now()
    };
  },

  saveMemory: (memory: MemoryCore) => {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  },

  learnFromInteraction: (prompt: string, feedback?: 'positive' | 'negative') => {
    const memory = memoryService.getMemory();
    memory.interactionCount++;
    memory.lastActive = Date.now();

    // Simple keyword extraction logic (simulation of learning)
    const keywords = [
      { key: 'style', match: ['cyberpunk', 'dark', 'minimalist', 'retro', 'neon'] },
      { key: 'tone', match: ['professional', 'funny', 'casual', 'academic'] },
      { key: 'format', match: ['code', 'list', 'essay', 'json'] }
    ];

    keywords.forEach(category => {
      category.match.forEach(word => {
        if (prompt.toLowerCase().includes(word)) {
          const existingIndex = memory.preferences.findIndex(p => p.key === category.key && p.value === word);
          
          if (existingIndex >= 0) {
            // Reinforce existing preference
            memory.preferences[existingIndex].confidence = Math.min(1.0, memory.preferences[existingIndex].confidence + 0.1);
            memory.preferences[existingIndex].lastUpdated = Date.now();
          } else {
            // New preference
            memory.preferences.push({
              key: category.key,
              value: word,
              confidence: 0.2, // Start with low confidence
              lastUpdated: Date.now()
            });
          }
        }
      });
    });

    memoryService.saveMemory(memory);
  },

  getSystemPromptInjection: (): string => {
    const memory = memoryService.getMemory();
    if (memory.preferences.length === 0) return '';

    // Filter for high confidence preferences
    const strongPrefs = memory.preferences.filter(p => p.confidence > 0.5);
    
    if (strongPrefs.length === 0) return '';

    const prefString = strongPrefs.map(p => `${p.key}: ${p.value}`).join(', ');
    return `\n[MEMORY CORE ACTIVE]\nUser Preferences: ${prefString}\nAdjust your response style accordingly.`;
  },

  clearMemory: () => {
    localStorage.removeItem(MEMORY_KEY);
  }
};
