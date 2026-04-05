import { SystemTier, VideoProfile, PerformanceMode } from '../types';

export const detectSystemTier = (): SystemTier => {
  // Simulated hardware detection
  // In a real app, we might use WebGL debug info or navigator.deviceMemory
  // navigator.deviceMemory is limited (0.25, 0.5, 1, 2, 4, 8)
  
  const memory = (navigator as any).deviceMemory || 4; // Default to 4GB if unsupported
  const cores = navigator.hardwareConcurrency || 4; // Default to 4 cores
  
  // Simulate VRAM based on RAM/Cores (rough heuristic)
  // This is purely for the "CaganX Video Engine" simulation experience
  
  if (memory <= 2 || cores <= 2) return 'very-low';
  if (memory <= 4 || cores <= 4) return 'low';
  if (memory <= 8 || cores <= 6) return 'medium';
  if (memory <= 16 || cores <= 8) return 'high';
  return 'ultra';
};

export const getVideoProfile = (tier: SystemTier, mode: PerformanceMode): VideoProfile => {
  // Adjust tier based on mode
  let adjustedTier = tier;
  if (mode === 'safe') {
    if (tier === 'ultra') adjustedTier = 'high';
    else if (tier === 'high') adjustedTier = 'medium';
    else if (tier === 'medium') adjustedTier = 'low';
    else if (tier === 'low') adjustedTier = 'very-low';
  } else if (mode === 'quality') {
    if (tier === 'very-low') adjustedTier = 'low'; // Risky but allowed
    else if (tier === 'low') adjustedTier = 'medium';
    else if (tier === 'medium') adjustedTier = 'high';
    else if (tier === 'high') adjustedTier = 'ultra';
  }

  switch (adjustedTier) {
    case 'very-low':
      return {
        tier: 'very-low',
        resolution: '512x512',
        fps: 8,
        duration: 2,
        maxFrames: 16,
        motionStrength: 0.3,
        guidanceScale: 5,
        camera: 'sabit',
        description: 'Basit, sabit sahne (Düşük Sistem)'
      };
    case 'low':
      return {
        tier: 'low',
        resolution: '640x360',
        fps: 10,
        duration: 2,
        maxFrames: 20,
        motionStrength: 0.4,
        guidanceScale: 6,
        camera: 'yavaş pan',
        description: 'Yavaş hareketli sahne (Orta-Düşük Sistem)'
      };
    case 'medium':
      return {
        tier: 'medium',
        resolution: '1280x720',
        fps: 12,
        duration: 3,
        maxFrames: 36,
        motionStrength: 0.6,
        guidanceScale: 7,
        camera: 'sinematik yavaş',
        description: 'Standart HD Video (Orta Sistem)'
      };
    case 'high':
      return {
        tier: 'high',
        resolution: '1920x1080',
        fps: 16,
        duration: 4,
        maxFrames: 64,
        motionStrength: 0.7,
        guidanceScale: 7.5,
        camera: 'sinematik',
        description: 'Yüksek Kalite FHD (Güçlü Sistem)'
      };
    case 'ultra':
      return {
        tier: 'ultra',
        resolution: '1920x1080', // Or 4K if supported
        fps: 24,
        duration: 5, // Up to 8
        maxFrames: 120,
        motionStrength: 0.8,
        guidanceScale: 8,
        camera: 'dinamik sinema',
        description: 'Ultra Kalite / 4K Hazır (Workstation)'
      };
    default:
      return getVideoProfile('medium', 'balanced');
  }
};
