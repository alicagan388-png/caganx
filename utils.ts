
import { User, UserRole, Persona } from './types';

export const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const safeJsonParse = (key: string, fallback: any) => {
  try {
    const item = localStorage.getItem(key);
    if (!item || item === "undefined" || item === "null") return fallback;
    const parsed = JSON.parse(item);
    return parsed || fallback;
  } catch (e) {
    console.warn(`Error parsing localStorage key "${key}":`, e);
    localStorage.removeItem(key);
    return fallback;
  }
};

export const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) return 'Mobil Cihaz (Apex Link)';
  if (/tablet/i.test(ua)) return 'Tablet (Quantum Touch)';
  return 'Desktop (Mainframe Access)';
};

export const DEFAULT_USER_DATA = {
  interests: ['Yapay Zeka', 'Teknoloji', 'Gelecek Tasarımı'],
  preferredPersona: 'balanced' as Persona,
  gameExpertise: 'none' as any,
  stats: {
    totalMessages: 0,
    totalGpts: 0,
    totalImages: 0,
    topCategory: 'Kurucu Erişimi'
  },
  badges: [
    { id: 'founder_badge', label: 'Kurucu Üye', icon: 'fa-crown', color: 'text-yellow-400' }
  ],
  security: {
    twoFactor: false,
    lastLogin: Date.now(),
    deviceInfo: getDeviceInfo(),
    accountProtected: true
  }
};

export const createAutoUser = (): User => ({
  id: generateUUID(),
  firstName: 'CaganX',
  lastName: 'Admin',
  role: 'admin' as UserRole,
  messageCountToday: 0,
  credits: 5000,
  maxCredits: 5000,
  level: 1,
  xp: 0,
  avatarIcon: 'fa-crown',
  avatarColor: 'bg-yellow-500',
  createdAt: Date.now(),
  settings: {
    theme: 'neon',
    language: 'tr',
    voice: 'male',
    developerMode: true,
    ambientSounds: false
  },
  ...DEFAULT_USER_DATA
});
