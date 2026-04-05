
export type Role = 'user' | 'assistant';
export type UserRole = 'user' | 'admin';
export type Persona = 'creative' | 'balanced' | 'precise' | 'teacher' | 'gamer' | 'technical';
export type AIExpertise = 'designer' | 'analyst' | 'critic' | 'general' | 'game-dev' | 'modder' | 'developer' | 'strategist' | 'architect';
export type GameExpertise = 'fivem' | 'minecraft' | 'gta' | 'roblox' | 'general';
export type AgentType = 'planner' | 'generator' | 'reviewer' | 'tester';

export type AIModel = 
  | 'gemini-1.5-pro' | 'gpt-4o' | 'claude-3.5-sonnet' | 'llama-3.1-405b' 
  | 'gemini-1.5-flash' | 'gpt-4-turbo' | 'claude-3-opus' | 'mistral-large-2' 
  | 'deepseek-v2.5' | 'grok-2' | 'o1-preview' | 'o1-mini' | 'claude-3.5-haiku'
  | 'llama-3.2-90b-vision' | 'qwen-2.5-72b' | 'perplexity-sonar-huge' | 'command-r-plus'
  | 'pi-inflection-2.5' | 'deepseek-coder-v2' | 'mistral-pixtral-12b'
  | 'quantum-alpha' | 'turbo-pulse' | 'vision-matrix' | 'creative-spark' | 'neural-link' 
  | 'caganx-v4-prime' | 'caganx-v4-creative' | 'caganx-v4-dev' | 'caganx-neural-nexus-v5'
  | 'caganx-architect-pro' | 'caganx-security-sentinel';

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
export type ImageSize = '1K' | '2K' | '4K';

export interface Badge {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface UserStats {
  totalMessages: number;
  totalGpts: number;
  totalImages: number;
  topCategory: string;
}

export interface SecuritySettings {
  twoFactor: boolean;
  lastLogin: number;
  deviceInfo: string;
  accountProtected: boolean;
}

export interface UserSettings {
  theme: 'dark' | 'light' | 'system' | 'neon' | 'matrix' | 'nebula' | 'hex';
  language: 'tr' | 'en' | 'de' | 'es';
  voice: 'male' | 'female' | 'robot';
  developerMode: boolean;
  ambientSounds: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatarIcon: string;
  avatarColor: string;
  role: UserRole;
  preferredPersona: Persona;
  gameExpertise: GameExpertise;
  messageCountToday: number;
  credits: number;
  maxCredits: number;
  level: number;
  xp: number;
  createdAt: number;
  interests: string[];
  stats: UserStats;
  badges: Badge[];
  security: SecuritySettings;
  settings?: UserSettings;
}

export interface ProjectFile {
  path: string;
  content: string;
  language: string;
}

export interface ProjectArtifact {
  id: string;
  name: string;
  type: 'fivem' | 'minecraft' | 'website' | 'config' | 'game' | 'general' | 'music';
  files: ProjectFile[];
  audioUrl?: string;
  createdAt: number;
}

export interface AgentTask {
  id: string;
  agent: AgentType;
  status: 'pending' | 'working' | 'completed' | 'failed';
  message: string;
}

export interface Feedback {
  type: 'positive' | 'negative';
  reason?: string;
  timestamp: number;
}

export interface OrchestratorStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed';
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  image?: string;
  generatedImage?: string;
  audioUrl?: string;
  timestamp: number;
  sources?: { title: string; uri: string }[];
  suggestions?: string[];
  confidenceScore?: number;
  agentProcess?: AgentTask[];
  orchestratorSteps?: OrchestratorStep[];
  project?: ProjectArtifact;
  feedback?: Feedback;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  persona: Persona;
  selectedModel: AIModel;
  customGPTId?: string;
  isPinned?: boolean;
  modules: {
    search: boolean;
    imageGen: boolean;
    codeAssist: boolean;
  };
}

export interface LibraryItem {
  id: string;
  url?: string;
  text?: string;
  prompt: string;
  type: 'image' | 'chat' | 'code' | 'video';
  timestamp: number;
  isFavorite?: boolean;
  metadata?: {
    model?: string;
    persona?: string;
    tokens?: number;
  };
}

export type SystemTier = 'very-low' | 'low' | 'medium' | 'high' | 'ultra';

export type PerformanceMode = 'safe' | 'balanced' | 'quality';

export interface VideoProfile {
  tier: SystemTier;
  resolution: string;
  fps: number;
  duration: number;
  maxFrames: number;
  motionStrength: number;
  guidanceScale: number;
  camera: string;
  description: string;
}

export interface GameProfile {
  genre: 'arcade' | 'platformer' | 'puzzle' | 'shooter' | 'rpg' | 'clicker';
  perspective: '2d' | 'top-down' | 'isometric';
  artStyle: 'pixel' | 'vector' | 'retro' | 'modern' | 'neon';
  difficulty: 'easy' | 'medium' | 'hard';
  mobileReady: boolean;
}

export interface ImageGenConfig {
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
  style?: string;
  improvePrompt: boolean;
  mode: 'image' | 'video' | 'game';
  videoProfile?: VideoProfile;
  videoModel?: string;
  gameProfile?: GameProfile;
}

export interface CustomGPT {
  id: string;
  name: string;
  instruction: string;
  model: AIModel;
  icon: string;
  color?: string;
  expertise: AIExpertise;
  styleLocks: string[];
  createdAt: number;
  author?: string;
  rating?: number;
  isShared?: boolean;
  isSystem?: boolean;
  welcomeMessage?: string;
  conversationStarters?: string[];
  knowledgeBase?: string[];
  rgbMode?: 'static' | 'pulse' | 'rainbow' | 'neon' | 'cyber' | 'disco' | 'retro' | 'matrix' | 'fire';
}



export interface StyleLock {
  id: string;
  label: string;
  instruction: string;
}
