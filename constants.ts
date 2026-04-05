
import { AIModel } from './types';

export interface ModelInfo {
  id: AIModel;
  name: string;
  provider: string;
  description: string;
  features: string[];
  icon: string;
  color: string;
  badge?: string;
}

export const WORLD_MODELS: ModelInfo[] = [
  {
    id: 'gemini-1.5-pro',
    name: 'Gemini 1.5 Pro',
    provider: 'Google',
    description: '2 milyon token bağlam penceresi ile dünyanın en geniş hafızalı modeli.',
    features: ['2M Context', 'Multimodal', 'Reasoning', 'Coding'],
    icon: 'fa-google',
    color: 'text-blue-400',
    badge: 'Hafıza Şampiyonu'
  },
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Ultra hızlı, multimodal ve her alanda üstün zeka sunan amiral gemisi.',
    features: ['Real-time', 'Vision', 'Voice', 'Logic'],
    icon: 'fa-openai',
    color: 'text-green-400',
    badge: 'Hız & Zeka'
  },
  {
    id: 'claude-3.5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Kod yazma ve doğal dilde yazım konusunda rakipsiz performans.',
    features: ['Coding Expert', 'Creative Writing', 'Nuanced', 'Fast'],
    icon: 'fa-brain',
    color: 'text-orange-400',
    badge: 'Kodlama Ustası'
  },
  {
    id: 'llama-3.1-405b',
    name: 'Llama 3.1 405B',
    provider: 'Meta',
    description: 'Açık kaynak dünyasının en güçlü ve en büyük modeli.',
    features: ['Open Source', 'Massive Scale', 'Generalist', 'Strong'],
    icon: 'fa-meta',
    color: 'text-blue-600',
    badge: 'Açık Kaynak Dev'
  },
  {
    id: 'gemini-1.5-flash',
    name: 'Gemini 1.5 Flash',
    provider: 'Google',
    description: 'Hız ve verimlilik için optimize edilmiş, anlık yanıtlar sunan model.',
    features: ['Ultra Fast', 'Efficient', 'Multimodal', 'Reliable'],
    icon: 'fa-bolt',
    color: 'text-yellow-400',
    badge: 'Yıldırım Hız'
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description: 'Güvenilir, yüksek performanslı ve geniş bilgi birikimine sahip klasik.',
    features: ['Reliable', 'High Performance', 'Knowledgeable', 'Classic'],
    icon: 'fa-microchip',
    color: 'text-purple-400',
    badge: 'Güvenilir'
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'En karmaşık akıl yürütme görevleri için tasarlanmış en zeki Claude.',
    features: ['Deep Reasoning', 'Complex Logic', 'High IQ', 'Precise'],
    icon: 'fa-shield-halved',
    color: 'text-red-400',
    badge: 'Maksimum Zeka'
  },
  {
    id: 'mistral-large-2',
    name: 'Mistral Large 2',
    provider: 'Mistral AI',
    description: 'Avrupa\'nın en güçlü modeli, verimlilik ve performansta iddialı.',
    features: ['Efficient', 'Multilingual', 'Strong Logic', 'Compact'],
    icon: 'fa-wind',
    color: 'text-cyan-400',
    badge: 'Verimlilik'
  },
  {
    id: 'deepseek-v2.5',
    name: 'DeepSeek V2.5',
    provider: 'DeepSeek',
    description: 'Kodlama ve matematik alanında özelleşmiş, yüksek performanslı model.',
    features: ['Coding Specialist', 'Math Expert', 'Fast', 'Smart'],
    icon: 'fa-code',
    color: 'text-indigo-400',
    badge: 'Matematik & Kod'
  },
  {
    id: 'grok-2',
    name: 'Grok-2',
    provider: 'xAI',
    description: 'X (Twitter) verilerine gerçek zamanlı erişim ve cesur bir kişilik.',
    features: ['Real-time Data', 'Bold Personality', 'Search', 'Fast'],
    icon: 'fa-x-twitter',
    color: 'text-white',
    badge: 'Gerçek Zamanlı'
  },
  {
    id: 'o1-preview',
    name: 'o1-preview',
    provider: 'OpenAI',
    description: 'Karmaşık akıl yürütme ve bilimsel problemler için tasarlanmış yeni nesil model.',
    features: ['Reasoning', 'Science', 'Math', 'Deep Thought'],
    icon: 'fa-brain-circuit',
    color: 'text-green-500',
    badge: 'Düşünür'
  },
  {
    id: 'o1-mini',
    name: 'o1-mini',
    provider: 'OpenAI',
    description: 'Hızlı ve etkili akıl yürütme sunan kompakt zeka.',
    features: ['Fast Reasoning', 'Coding', 'Logic', 'Compact'],
    icon: 'fa-microchip',
    color: 'text-green-300',
    badge: 'Hızlı Düşünür'
  },
  {
    id: 'claude-3.5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    description: 'Claude ailesinin en hızlı ve en verimli yeni üyesi.',
    features: ['Instant', 'Efficient', 'Nuanced', 'Smart'],
    icon: 'fa-wind',
    color: 'text-orange-300',
    badge: 'Anlık Yanıt'
  },
  {
    id: 'llama-3.2-90b-vision',
    name: 'Llama 3.2 90B Vision',
    provider: 'Meta',
    description: 'Görsel anlama yeteneği ile güçlendirilmiş en yeni Llama.',
    features: ['Vision', 'Multimodal', 'Open Weights', 'Powerful'],
    icon: 'fa-meta',
    color: 'text-blue-500',
    badge: 'Görsel Zeka'
  },
  {
    id: 'qwen-2.5-72b',
    name: 'Qwen 2.5 72B',
    provider: 'Alibaba Cloud',
    description: 'Kodlama ve matematik alanında dünya lideri performans.',
    features: ['Coding', 'Math', 'Multilingual', 'Top Tier'],
    icon: 'fa-dragon',
    color: 'text-purple-600',
    badge: 'Kodlama Devi'
  },
  {
    id: 'perplexity-sonar-huge',
    name: 'Sonar Huge',
    provider: 'Perplexity',
    description: 'İnternet verilerine anlık erişim ile en güncel bilgi kaynağı.',
    features: ['Real-time Search', 'Citations', 'Up-to-date', 'Accurate'],
    icon: 'fa-magnifying-glass',
    color: 'text-cyan-500',
    badge: 'Bilgi Kaynağı'
  },
  {
    id: 'command-r-plus',
    name: 'Command R+',
    provider: 'Cohere',
    description: 'Kurumsal düzeyde RAG ve karmaşık iş akışları için optimize edildi.',
    features: ['RAG Expert', 'Enterprise', 'Tool Use', 'Reliable'],
    icon: 'fa-building',
    color: 'text-emerald-500',
    badge: 'Kurumsal'
  },
  {
    id: 'pi-inflection-2.5',
    name: 'Pi (Inflection-2.5)',
    provider: 'Inflection AI',
    description: 'Duygusal zekası yüksek, kişisel ve empatik bir asistan.',
    features: ['EQ', 'Personal', 'Empathetic', 'Conversational'],
    icon: 'fa-heart',
    color: 'text-pink-500',
    badge: 'Empatik'
  },
  {
    id: 'deepseek-coder-v2',
    name: 'DeepSeek Coder V2',
    provider: 'DeepSeek',
    description: 'Yüzlerce programlama dilinde uzmanlaşmış kodlama canavarı.',
    features: ['Code Expert', 'Multi-language', 'Logic', 'Fast'],
    icon: 'fa-terminal',
    color: 'text-blue-300',
    badge: 'Yazılım Canavarı'
  },
  {
    id: 'mistral-pixtral-12b',
    name: 'Pixtral 12B',
    provider: 'Mistral AI',
    description: 'Görsel ve metin verilerini harmanlayan kompakt güç.',
    features: ['Vision', 'Compact', 'Efficient', 'Strong'],
    icon: 'fa-image',
    color: 'text-cyan-300',
    badge: 'Kompakt Görsel'
  }
];

export const CAGANX_MODELS: ModelInfo[] = [
  {
    id: 'quantum-alpha',
    name: 'Quantum Alpha',
    provider: 'CaganX',
    description: 'CaganX ekosisteminin en zeki ve en kapsamlı ana modeli.',
    features: ['Neural Core', 'Advanced Reasoning', 'Master Architect'],
    icon: 'fa-atom',
    color: 'text-cyan-300',
    badge: 'Ana Çekirdek'
  },
  {
    id: 'turbo-pulse',
    name: 'Turbo Pulse',
    provider: 'CaganX',
    description: 'Hız ve akıcılık için optimize edilmiş günlük asistan.',
    features: ['Fast Response', 'Balanced', 'Daily Tasks'],
    icon: 'fa-bolt-lightning',
    color: 'text-yellow-300',
    badge: 'Hızlı'
  },
  {
    id: 'vision-matrix',
    name: 'Vision Matrix',
    provider: 'CaganX',
    description: 'Görsel analiz ve tasarım odaklı uzman model.',
    features: ['Image Analysis', 'Design Expert', 'Visual Logic'],
    icon: 'fa-eye',
    color: 'text-pink-400',
    badge: 'Görsel Uzman'
  },
  {
    id: 'caganx-v4-prime',
    name: 'CaganX v4 Prime',
    provider: 'CaganX',
    description: 'Klasik v4 mimarisinin en stabil ve güvenilir versiyonu.',
    features: ['Stable', 'Reliable', 'Multi-purpose'],
    icon: 'fa-crown',
    color: 'text-gold-400',
    badge: 'Klasik'
  },
  {
    id: 'caganx-neural-nexus-v5',
    name: 'Neural Nexus v5',
    provider: 'CaganX',
    description: 'CaganX ekosisteminin en gelişmiş, kısıtlamasiz amiral gemisi.',
    features: ['Unfiltered', 'Master Architect', 'Neural Core v5'],
    icon: 'fa-brain',
    color: 'text-[#00f3ff]',
    badge: 'Amiral Gemisi'
  },
  {
    id: 'caganx-architect-pro',
    name: 'Architect Pro',
    provider: 'CaganX',
    description: 'Sadece karmaşık yazılım mimarileri ve sistem tasarımı için.',
    features: ['System Design', 'Clean Code', 'Scalability'],
    icon: 'fa-network-wired',
    color: 'text-emerald-400',
    badge: 'Mimar'
  },
  {
    id: 'caganx-security-sentinel',
    name: 'Security Sentinel',
    provider: 'CaganX',
    description: 'Güvenlik analizi, sızma testi ve kod denetimi uzmanı.',
    features: ['Security Audit', 'Pentest', 'Vulnerability Scan'],
    icon: 'fa-shield-halved',
    color: 'text-rose-500',
    badge: 'Güvenlik'
  }
];

export const ALL_MODELS = [...WORLD_MODELS, ...CAGANX_MODELS];
