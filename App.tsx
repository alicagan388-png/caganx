
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChatSession, Message, AIModel, CustomGPT, Persona, User, ImageGenConfig } from './types';
import { ALL_MODELS } from './constants';
import Sidebar from './components/Sidebar';
import MessageItem from './components/MessageItem';
import WelcomeScreen from './components/WelcomeScreen';
import CreateGPTModal from './components/CreateGPTModal';
import GPTStore from './components/GPTStore';
import AccountModal from './components/AccountModal';
import ModelSelectorModal from './components/ModelSelectorModal';
import HolographicParticles from './components/HolographicParticles';
import SystemLogsModal from './components/SystemLogsModal';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import { streamChat, getApiKey, generateMusic, generateVideo, editImage } from './services/geminiService';
import { soundService } from './services/soundService';
import { generateUUID, safeJsonParse, createAutoUser } from './utils';

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey?: boolean;
      openSelectKey?: () => Promise<void>;
    };
  }
}

const App: React.FC = () => {
  const [user, setUser] = useState<User>(() => {
    const defaultUser = createAutoUser();
    const saved = safeJsonParse('caganx_user', null);
    
    // Merge saved data with defaults to ensure new fields (credits, level, xp) are present
    const mergedUser = saved ? { ...defaultUser, ...saved } : defaultUser;
    
    // Remove legacy fields and ensure role is 'user' if not already set correctly
    const { plan, role, ...rest } = mergedUser as any;
    const cleanUser = { ...rest, role: role || 'user' };
    
    localStorage.setItem('caganx_user', JSON.stringify(cleanUser));
    return cleanUser;
  });

  const [sessions, setSessions] = useState<ChatSession[]>(() => safeJsonParse('caganx_v22_sessions', []));
  const [customGPTs, setCustomGPTs] = useState<CustomGPT[]>(() => safeJsonParse('caganx_gpts', []));
  
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [showCreateGPT, setShowCreateGPT] = useState(false);
  const [editingGPT, setEditingGPT] = useState<CustomGPT | null>(null);
  const [showStore, setShowStore] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; type: string } | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [showModelSelector, setShowModelSelector] = useState(false);
  const [showTraining, setShowTraining] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [useMultiAgent, setUseMultiAgent] = useState(false);
  const [useSearch, setUseSearch] = useState(false);
  const [defaultModel, setDefaultModel] = useState<AIModel>('turbo-pulse');
  const [trainingData, setTrainingData] = useState<string>(() => localStorage.getItem('caganx_neural_training') || '');
  const [sidebarSearch, setSidebarSearch] = useState('');
  const [showSystemLogs, setShowSystemLogs] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [systemLogs, setSystemLogs] = useState<{id: string, text: string, type: string, time: number}[]>([]);

  const addSystemLog = useCallback((text: string, type: 'info' | 'warn' | 'error' | 'success' = 'info') => {
    setSystemLogs(prev => [{ id: generateUUID(), text, type, time: Date.now() }, ...prev].slice(0, 50));
  }, []);

  useEffect(() => {
    addSystemLog('CaganX Neural Nexus v5.0 başlatıldı.', 'success');
    addSystemLog('Kuantum şifreleme aktif.', 'info');
  }, [addSystemLog]);
  
  const currentSession = useMemo(() => sessions.find(s => s.id === currentSessionId) || null, [sessions, currentSessionId]);

  const onNewChat = useCallback((gptId?: string) => {
    setCurrentSessionId(null);
    if (gptId) {
      const gpt = customGPTs.find(g => g.id === gptId);
      if (gpt) {
        const id = generateUUID();
        const newS: ChatSession = {
          id,
          title: gpt.name,
          messages: [{ id: generateUUID(), role: 'assistant', text: gpt.welcomeMessage || `Merhaba! Ben ${gpt.name}. Size nasıl yardımcı olabilirim?`, timestamp: Date.now() }],
          createdAt: Date.now(),
          persona: gpt.expertise as any,
          selectedModel: gpt.model,
          customGPTId: gpt.id,
          modules: { search: true, imageGen: true, codeAssist: true }
        };
        setSessions(p => [newS, ...p]);
        setCurrentSessionId(id);
      }
    }
    playSound('click');
  }, [customGPTs, sessions]);

  const onTogglePin = (id: string) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, isPinned: !s.isPinned } : s));
    playSound('click');
    addSystemLog(`Sohbet ${sessions.find(s => s.id === id)?.isPinned ? 'pini kaldırıldı' : 'pinlendi'}.`);
  };

  const onSelectTheme = (theme: any) => {
    setUser(prev => ({
      ...prev,
      settings: { ...prev.settings!, theme }
    }));
    playSound('hologram');
    addSystemLog(`Tema değiştirildi: ${theme}`);
  };

  const onClearInterference = () => {
    setUser(prev => ({
      ...prev,
      settings: { ...prev.settings!, theme: 'system' }
    }));
    setShowTraining(false);
    setShowAccount(false);
    setShowStore(false);
    setShowCreateGPT(false);
    setShowSystemLogs(false);
    setShowShortcuts(false);
    setShowModelSelector(false);
    playSound('success');
    addSystemLog('Nöral parazit temizlendi. Sistem resetlendi.');
  };

  const onToggleAmbient = () => {
    setUser(prev => ({
      ...prev,
      settings: { ...prev.settings!, ambientSounds: !prev.settings?.ambientSounds }
    }));
    playSound('click');
  };

  const onSelectPersona = (p: Persona) => {
    if (currentSessionId) {
      setSessions(prev => prev.map(s => s.id === currentSessionId ? { ...s, persona: p } : s));
    } else {
      setUser(prev => ({ ...prev, preferredPersona: p }));
    }
    playSound('click');
    addSystemLog(`Kişilik değiştirildi: ${p}`);
  };

  const currentPersona = currentSession?.persona || user.preferredPersona || 'balanced';

  const getMoodColor = () => {
    switch (currentPersona) {
      case 'creative': return 'rgba(168, 85, 247, 0.4)';
      case 'precise': return 'rgba(59, 130, 246, 0.4)';
      case 'teacher': return 'rgba(245, 158, 11, 0.4)';
      case 'gamer': return 'rgba(34, 197, 94, 0.4)';
      case 'technical': return 'rgba(239, 68, 68, 0.4)';
      default: return 'rgba(0, 243, 255, 0.4)';
    }
  };
  
  useEffect(() => { localStorage.setItem('caganx_user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('caganx_v22_sessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('caganx_gpts', JSON.stringify(customGPTs)); }, [customGPTs]);
  useEffect(() => { localStorage.setItem('caganx_neural_training', trainingData); }, [trainingData]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'k') { e.preventDefault(); onNewChat(); }
      if (e.ctrlKey && e.key === '/') { e.preventDefault(); setShowShortcuts(prev => !prev); }
      if (e.ctrlKey && e.key === 'l') { e.preventDefault(); setShowSystemLogs(prev => !prev); }
      if (e.ctrlKey && e.key === 'p') { e.preventDefault(); setShowAccount(prev => !prev); }
      if (e.ctrlKey && e.key === 'g') { e.preventDefault(); setShowStore(prev => !prev); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNewChat]);

  useEffect(() => {
    setIsSyncing(true);
    const timer = setTimeout(() => setIsSyncing(false), 1000);
    return () => clearTimeout(timer);
  }, [user, sessions, customGPTs, trainingData]);

  // Sound Effect Simulation
  const playSound = (type: 'message' | 'error' | 'success' | 'click' | 'hologram') => {
    // Visual feedback
    const flash = document.createElement('div');
    flash.className = `fixed inset-0 pointer-events-none z-[9999] transition-opacity duration-200 ${type === 'error' ? 'bg-red-500/20' : (type === 'success' ? 'bg-green-500/20' : 'bg-blue-500/10')}`;
    document.body.appendChild(flash);
    setTimeout(() => {
      flash.classList.add('opacity-0');
      setTimeout(() => flash.remove(), 200);
    }, 100);

    // Actual Audio
    try {
      if (type === 'message') soundService.playSend();
      if (type === 'error') soundService.playError();
      if (type === 'success') soundService.playReceive();
      if (type === 'click') soundService.playClick();
      if (type === 'hologram') soundService.playHologram();
    } catch (e) {
      console.warn("Audio context not allowed yet");
    }
  };

  const updateUserStats = useCallback((updates: Partial<User['stats']>) => {
    const newStats = { ...user.stats, ...updates };
    const newBadges = [...user.badges];
    if (newStats.totalMessages >= 10 && !newBadges.find(b => b.id === 'talkative')) {
      newBadges.push({ id: 'talkative', label: 'Sohbetsever', icon: 'fa-comments', color: 'text-blue-400' });
    }
    setUser(prev => ({ ...prev, stats: newStats, badges: newBadges }));
  }, [user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage({ url: event.target?.result as string, type: file.type });
      };
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    let targetId = currentSessionId;
    if (!targetId) {
      targetId = generateUUID();
      const newS: ChatSession = { 
        id: targetId, 
        title: text.slice(0, 30), 
        messages: [], 
        createdAt: Date.now(), 
        persona: user.preferredPersona || 'balanced', 
        selectedModel: defaultModel, 
        modules: { search: true, imageGen: true, codeAssist: true } 
      };
      setSessions(p => [newS, ...p]);
      setCurrentSessionId(targetId);
    }

    const userMsg: Message = { id: generateUUID(), role: 'user', text, timestamp: Date.now() };
    const assistantMsgId = generateUUID();
    setSessions(p => p.map(s => s.id === targetId ? { ...s, messages: [...s.messages, userMsg, { id: assistantMsgId, role: 'assistant', text: `CaganX Neural Nexus analiz ediyor...`, timestamp: Date.now() }] } : s));
    const currentMessages = [...(sessions.find(s => s.id === targetId)?.messages || []), userMsg];
    
    setInputText(''); 
    setIsLoading(true);
    playSound('message');

    const lowerText = text.toLowerCase();
    const isMusicRequest = lowerText.includes('müzik yap') || lowerText.includes('şarkı yap') || lowerText.includes('beste yap') || lowerText.includes('müzik üret');
    const isVideoRequest = lowerText.includes('video yap') || lowerText.includes('film yap') || lowerText.includes('animasyon yap') || lowerText.includes('video üret');
    const isProjectRequest = lowerText.includes('oyun yap') || lowerText.includes('site yap') || lowerText.includes('web sitesi') || lowerText.includes('uygulama yap') || lowerText.includes('program yap');

    // Credit Deduction & XP Gain
    const creditCost = isProjectRequest ? 50 : (isVideoRequest ? 100 : (isMusicRequest ? 75 : 10));
    
    if (user.credits < creditCost) {
      setSessions(p => p.map(s => s.id === targetId ? { 
        ...s, 
        messages: s.messages.map(m => m.id === assistantMsgId ? { 
          ...m, 
          text: `⚠️ **Yetersiz Nöral Kredi**\n\nBu işlem için **${creditCost}** kredi gerekiyor, ancak senin **${user.credits}** kredin var. Lütfen kredilerinin yenilenmesini bekle veya daha az maliyetli bir işlem dene.`,
          suggestions: ['Kredi Nasıl Kazanılır?', 'Günlük Bonus Al']
        } : m) 
      } : s));
      setIsLoading(false);
      playSound('error');
      return;
    }

    setUser(prev => {
      const newCredits = Math.max(0, prev.credits - creditCost);
      const newXp = prev.xp + 20;
      const nextLevelXp = prev.level * 1000;
      let newLevel = prev.level;
      let currentXp = newXp;

      if (currentXp >= nextLevelXp) {
        newLevel++;
        currentXp -= nextLevelXp;
        playSound('success');
      }

      return { 
        ...prev, 
        credits: newCredits,
        xp: currentXp,
        level: newLevel,
        messageCountToday: prev.messageCountToday + 1, 
        stats: { ...prev.stats, totalMessages: prev.stats.totalMessages + 1 } 
      };
    });

    try {
      // Check for API Key if needed - REMOVED AS REQUESTED
      
      if (isMusicRequest) {
        setSessions(p => p.map(s => s.id === targetId ? { ...s, messages: s.messages.map(m => m.id === assistantMsgId ? { ...m, text: '🎵 **CaganX Neural Audio** besteliyor... Lütfen bekleyin.' } : m) } : s));
        try {
          const musicResult = await generateMusic(text);
          if (musicResult) {
            setSessions(p => p.map(s => s.id === targetId ? { 
              ...s, 
              messages: s.messages.map(m => m.id === assistantMsgId ? { 
                ...m, 
                text: '✅ Müzik başarıyla bestelendi ve nöral ağlara işlendi. Aşağıdaki dev yeşil butona basarak dinleyebilirsin.', 
                audioUrl: musicResult.audioUrl,
                project: {
                  id: generateUUID(),
                  name: "CaganX Neural Audio",
                  type: 'music',
                  files: [],
                  audioUrl: musicResult.audioUrl,
                  createdAt: Date.now()
                }
              } : m) 
            } : s));
            setIsLoading(false);
            return;
          } else {
            throw new Error("Music generation returned null");
          }
        } catch (musicErr) {
          console.error("Music generation failed:", musicErr);
          // REFUND
          setUser(prev => ({ ...prev, credits: prev.credits + creditCost }));
          setSessions(p => p.map(s => s.id === targetId ? { 
            ...s, 
            messages: s.messages.map(m => m.id === assistantMsgId ? { 
              ...m, 
              text: '❌ **Müzik Üretimi Başarısız**\n\nBir hata oluştu ve müzik üretilemedi. **Kredilerin iade edildi.**\n\n*İpucu: Bu özellik için ücretli bir API anahtarı gerekebilir. Eğer kendi anahtarın varsa seçmeyi dene.*',
              suggestions: ['Tekrar Dene', 'API Anahtarı Seç']
            } : m) 
          } : s));
          setIsLoading(false);
          playSound('error');
          return;
        }
      }

      if (isVideoRequest) {
        setSessions(p => p.map(s => s.id === targetId ? { ...s, messages: s.messages.map(m => m.id === assistantMsgId ? { ...m, text: '🎬 **CaganX Veo Engine** render alıyor... Bu işlem 1-2 dakika sürebilir.' } : m) } : s));
        try {
          const videoResult = await generateVideo(text);
          if (videoResult) {
            setSessions(p => p.map(s => s.id === targetId ? { 
              ...s, 
              messages: s.messages.map(m => m.id === assistantMsgId ? { 
                ...m, 
                text: '✅ Video başarıyla render edildi. Aşağıdan izleyebilirsin.', 
                generatedImage: videoResult.url
              } : m) 
            } : s));
            setIsLoading(false);
            return;
          } else {
            throw new Error("Video generation returned null");
          }
        } catch (videoErr) {
          console.error("Video generation failed:", videoErr);
          // REFUND
          setUser(prev => ({ ...prev, credits: prev.credits + creditCost }));
          setSessions(p => p.map(s => s.id === targetId ? { 
            ...s, 
            messages: s.messages.map(m => m.id === assistantMsgId ? { 
              ...m, 
              text: '❌ **Video Üretimi Başarısız**\n\nRender işlemi sırasında bir hata oluştu. **Kredilerin iade edildi.**\n\n*İpucu: Veo modelleri için faturalandırması aktif bir API anahtarı gerekebilir.*',
              suggestions: ['Tekrar Dene', 'API Anahtarı Seç']
            } : m) 
          } : s));
          setIsLoading(false);
          playSound('error');
          return;
        }
      }

      // Image Editing Check
      const isEditRequest = (text.toLowerCase().includes('düzenle') || text.toLowerCase().includes('edit')) && selectedImage;
      if (isEditRequest && selectedImage) {
        setSessions(p => p.map(s => s.id === targetId ? { ...s, messages: s.messages.map(m => m.id === assistantMsgId ? { ...m, text: 'CaganX Vision Matrix görseli işliyor...' } : m) } : s));
        try {
          const base64Data = selectedImage.url.split(',')[1];
          const editResult = await editImage(text, base64Data, selectedImage.type);
          if (editResult) {
            setSessions(p => p.map(s => s.id === targetId ? { 
              ...s, 
              messages: s.messages.map(m => m.id === assistantMsgId ? { 
                ...m, 
                text: 'Görsel başarıyla düzenlendi.', 
                generatedImage: editResult.url
              } : m) 
            } : s));
            setSelectedImage(null);
            setIsLoading(false);
            return;
          }
        } catch (editErr) {
          console.error("Image editing failed:", editErr);
        }
      }

      await streamChat(currentMessages, 
        { 
          useSearch: useSearch, 
          persona: currentSession?.persona || user.preferredPersona || 'balanced', 
          model: currentSession?.selectedModel || 'turbo-pulse', 
          customGPT: null, 
          user: user,
          useMultiAgent: useMultiAgent || isProjectRequest || user.preferredPersona === 'technical',
          trainingData
        }, 
        (data) => setSessions(p => p.map(s => s.id === targetId ? { ...s, messages: s.messages.map(m => m.id === assistantMsgId ? { ...m, ...data } : m) } : s)),
        () => playSound('error')
      );
    } catch (e) { console.error("Chat error:", e); playSound('error'); } finally { setIsLoading(false); }
  };

  return (
    <div className="flex h-screen w-full bg-[#050506] text-white relative overflow-hidden font-['Rajdhani']">
      {/* Holographic Background Elements */}
      <div className={`fixed inset-0 z-0 pointer-events-none transition-all duration-1000 ${
        user.settings?.theme === 'matrix' ? 'matrix-bg opacity-20' : 
        user.settings?.theme === 'nebula' ? 'nebula-bg opacity-30' : 
        user.settings?.theme === 'hex' ? 'hex-grid opacity-20' : 
        ''
      }`}></div>
      <HolographicParticles />
      <div className="glitch-overlay"></div>
      <div className="scanline"></div>
      <div className="absolute inset-0 tech-grid opacity-10 pointer-events-none"></div>
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse pointer-events-none"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,243,255,0.05),transparent_70%)] pointer-events-none"></div>
      
      {showAccount && <AccountModal user={user} onSave={(u) => { setUser(u); setShowAccount(false); }} onClose={() => setShowAccount(false)} />}
      {showSystemLogs && <SystemLogsModal logs={systemLogs} onClose={() => setShowSystemLogs(false)} />}
      {showShortcuts && <KeyboardShortcutsModal onClose={() => setShowShortcuts(false)} />}
      {showModelSelector && (
        <ModelSelectorModal 
          selectedModel={currentSession?.selectedModel || defaultModel} 
          onSelect={(m) => {
            if (currentSessionId) {
              setSessions(p => p.map(s => s.id === currentSessionId ? { ...s, selectedModel: m } : s));
            } else {
              setDefaultModel(m);
            }
            playSound('click');
          }} 
          onClose={() => setShowModelSelector(false)} 
        />
      )}
      {showCreateGPT && <CreateGPTModal 
        initialGPT={editingGPT}
        onClose={() => { setShowCreateGPT(false); setEditingGPT(null); }} 
        onSave={g => {
          if (editingGPT) {
            setCustomGPTs(p => p.map(existing => existing.id === g.id ? g : existing));
          } else {
            setCustomGPTs(p => [...p, g]);
            updateUserStats({ totalGpts: user.stats.totalGpts + 1 });
          }
          setShowCreateGPT(false);
          setEditingGPT(null);
        }} 
        onDelete={id => {
          setCustomGPTs(p => p.filter(g => g.id !== id));
          setShowCreateGPT(false);
          setEditingGPT(null);
        }}
      />}
      {showStore && <GPTStore onClose={() => setShowStore(false)} onInstall={g => setCustomGPTs(p => [...p, g])} installedIds={customGPTs.map(g => g.id)} sharedGPTs={[]} />}
      
      {showTraining && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-xl">
          <div className="w-full max-w-2xl bg-[#0a0a0c] border border-[#00f3ff]/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent"></div>
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#00f3ff]/10 flex items-center justify-center text-[#00f3ff] text-xl border border-[#00f3ff]/20">
                  <i className="fa-solid fa-brain"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Nöral Eğitim Protokolü</h2>
                  <p className="text-[10px] font-bold text-[#00f3ff]/70 tracking-widest uppercase">CaganX Neural Nexus v5.0 Core</p>
                </div>
              </div>
              <button onClick={() => setShowTraining(false)} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
                <p className="text-xs text-indigo-300 leading-relaxed">
                  <i className="fa-solid fa-circle-info mr-2"></i>
                  Buraya eklediğiniz veriler, yapay zekanın temel mantık katmanına entegre edilir. 
                  Özel kod kütüphaneleri, mimari tercihler veya spesifik çalışma prensipleri öğretebilirsiniz.
                </p>
              </div>

              <textarea 
                value={trainingData}
                onChange={(e) => setTrainingData(e.target.value)}
                placeholder="Yapay zekaya öğretmek istediğiniz verileri buraya girin... (Örn: 'Her zaman Clean Architecture prensiplerini kullan', 'Veritabanı işlemlerinde Prisma tercih et' vb.)"
                className="w-full h-64 bg-black/40 border border-white/10 rounded-2xl p-6 text-sm text-gray-300 focus:border-[#00f3ff]/50 outline-none transition-all resize-none font-mono"
              />

              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    localStorage.setItem('caganx_neural_training', trainingData);
                    setShowTraining(false);
                    playSound('success');
                  }}
                  className="flex-1 py-4 bg-[#00f3ff] text-black rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] transition-all active:scale-95"
                >
                  Eğitimi Tamamla
                </button>
                <button 
                  onClick={() => {
                    setTrainingData('');
                    localStorage.removeItem('caganx_neural_training');
                    playSound('click');
                  }}
                  className="px-6 py-4 bg-white/5 text-gray-400 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Sıfırla
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Sidebar 
        sessions={sessions} 
        currentSessionId={currentSessionId} 
        customGPTs={customGPTs}
        currentUser={user}
        onNewChat={() => setCurrentSessionId(null)}
        onSelectChat={setCurrentSessionId}
        onDeleteChat={id => setSessions(p => p.filter(s => s.id !== id))}
        onRenameChat={(id, newTitle) => setSessions(p => p.map(s => s.id === id ? { ...s, title: newTitle } : s))}
        onDeleteGPT={id => setCustomGPTs(p => p.filter(g => g.id !== id))}
        onEditGPT={gpt => { setEditingGPT(gpt); setShowCreateGPT(true); }}
        onShareGPT={() => {}}
        onOpenCreateGPT={() => { setEditingGPT(null); setShowCreateGPT(true); }}
        onOpenStore={() => setShowStore(true)}
        onOpenLibrary={() => {}}
        onOpenProfile={() => setShowAccount(true)}
        onOpenVisionLab={() => setShowTraining(true)}
        isOpen={true}
        onToggle={() => {}}
        onTogglePin={onTogglePin}
        sidebarSearch={sidebarSearch}
        setSidebarSearch={setSidebarSearch}
        onToggleAmbient={onToggleAmbient}
        onSelectTheme={onSelectTheme}
        onClearInterference={onClearInterference}
      />
      
      <main className="flex-1 flex flex-col relative z-20 bg-black/40 backdrop-blur-sm">
        <header 
          className="h-16 flex items-center justify-center px-8 border-b border-[#00f3ff]/20 bg-black/20 backdrop-blur-md relative transition-all duration-500"
          style={{ boxShadow: `0 0 20px ${getMoodColor()}` }}
        >
          <div className="absolute left-8 flex items-center gap-6">
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-bolt text-yellow-400 text-xs animate-pulse"></i>
                <span className="text-xs font-black text-white tracking-tighter">{(user.credits ?? 0).toLocaleString()}</span>
                {isSyncing && (
                  <div className="ml-2 flex items-center gap-1">
                    <i className="fa-solid fa-cloud-arrow-up text-[8px] text-[#00f3ff] animate-bounce"></i>
                    <span className="text-[8px] font-bold text-[#00f3ff]/50 uppercase tracking-widest">Syncing</span>
                  </div>
                )}
                <div className="ml-2 cyber-badge">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                  CORE ONLINE
                </div>
              </div>
              <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden mt-1 relative">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 transition-all duration-1000 shadow-[0_0_10px_rgba(251,191,36,0.5)]" 
                  style={{ width: `${((user.credits ?? 0) / (user.maxCredits ?? 1)) * 100}%` }}
                ></div>
                <div className="absolute inset-0 neural-pulse opacity-30"></div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">Level {user.level}</span>
                <div className="w-12 h-0.5 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500" style={{ width: `${(user.xp / (user.level * 1000)) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* 🎭 PERSONA QUICK SWITCHER */}
          <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-2xl p-1">
            {(['creative', 'balanced', 'precise', 'technical'] as Persona[]).map(p => (
              <button
                key={p}
                onClick={() => onSelectPersona(p)}
                className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${currentPersona === p ? 'bg-white/10 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold tracking-widest text-neon-blue drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]">CAGANX <span className="chromatic-name uppercase">Neural Nexus v5.0</span></span>
            </div>
            <div className="w-48 h-[1px] bg-gradient-to-r from-transparent via-[#00f3ff]/30 to-transparent mt-1"></div>
          </div>
          
          <div className="absolute right-8 flex items-center gap-6">

            <button 
              onClick={() => setShowModelSelector(true)}
              className="flex items-center gap-3 px-4 py-2 holo-btn rounded-xl group"
            >
              <div className={`w-6 h-6 rounded-lg bg-[#00f3ff]/10 flex items-center justify-center text-xs ${ALL_MODELS.find(m => m.id === (currentSession?.selectedModel || defaultModel))?.color || 'text-[#00f3ff]'}`}>
                <i className={`fa-solid ${ALL_MODELS.find(m => m.id === (currentSession?.selectedModel || defaultModel))?.icon || 'fa-microchip'}`}></i>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[10px] font-black text-white uppercase tracking-tighter">
                  {ALL_MODELS.find(m => m.id === (currentSession?.selectedModel || defaultModel))?.name || 'Model Seç'}
                </span>
                <span className="text-[7px] font-bold text-[#00f3ff]/70 uppercase tracking-widest">
                  {ALL_MODELS.find(m => m.id === (currentSession?.selectedModel || defaultModel))?.provider || 'Neural Core'}
                </span>
              </div>
              <i className="fa-solid fa-chevron-down text-[8px] text-gray-500 group-hover:text-[#00f3ff] transition-colors ml-2"></i>
            </button>
            
            <button onClick={() => setShowAccount(true)} className="relative group">
              <div className="w-10 h-10 rounded-full border border-[#00f3ff]/50 flex items-center justify-center text-[#00f3ff] hover:bg-[#00f3ff]/20 hover:shadow-[0_0_15px_rgba(0,243,255,0.5)] transition-all overflow-hidden">
                <i className={`fa-solid ${user.avatarIcon}`}></i>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-indigo-600 border border-white/20 rounded-full flex items-center justify-center text-[8px] font-black text-white shadow-lg">
                {user.level}
              </div>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          {!currentSession ? <WelcomeScreen onQuickPrompt={sendMessage} /> : (
            <div className="pb-40">
              {currentSession.messages.map(msg => (
                <MessageItem key={msg.id} message={msg} onSuggestionClick={sendMessage} onSaveToLibrary={() => {}} />
              ))}
            </div>
          )}
        </div>

        <div className="p-6 bg-gradient-to-t from-[#050506] via-[#050506]/90 to-transparent relative">
          <div className="max-w-4xl mx-auto relative">
            {/* 🚀 TECH SHORTCUTS TOOLBAR (10+ Features) */}
            <div className="flex items-center gap-2 mb-3 overflow-x-auto no-scrollbar pb-1">
              <button onClick={() => setInputText('Bana efsanevi bir oyun yap.')} className="tech-tag flex items-center gap-1.5 whitespace-nowrap">
                <i className="fa-solid fa-gamepad text-[10px]"></i> Oyun Yap
              </button>
              <button onClick={() => setInputText('Profesyonel bir web sitesi tasarla.')} className="tech-tag flex items-center gap-1.5 whitespace-nowrap">
                <i className="fa-solid fa-globe text-[10px]"></i> Site Yap
              </button>
              <button onClick={() => setInputText('Efsanevi bir müzik bestele.')} className="tech-tag flex items-center gap-1.5 whitespace-nowrap">
                <i className="fa-solid fa-music text-[10px]"></i> Müzik Üret
              </button>
              <button onClick={() => setInputText('Sinematik bir video render al.')} className="tech-tag flex items-center gap-1.5 whitespace-nowrap">
                <i className="fa-solid fa-film text-[10px]"></i> Video Render
              </button>
              <button onClick={() => setInputText('Karmaşık bir yazılım mimarisi oluştur.')} className="tech-tag flex items-center gap-1.5 whitespace-nowrap">
                <i className="fa-solid fa-code text-[10px]"></i> Kod Yaz
              </button>
              <button onClick={() => setInputText('Futuristik bir görsel tasarla.')} className="tech-tag flex items-center gap-1.5 whitespace-nowrap">
                <i className="fa-solid fa-palette text-[10px]"></i> Görsel Üret
              </button>
              <div className="h-4 w-[1px] bg-white/10 mx-1"></div>
              <button onClick={() => setUseMultiAgent(!useMultiAgent)} className={`tech-tag flex items-center gap-1.5 whitespace-nowrap ${useMultiAgent ? 'bg-[#00f3ff]/20 border-[#00f3ff]' : ''}`}>
                <i className="fa-solid fa-users-gear text-[10px]"></i> Multi-Agent: {useMultiAgent ? 'AÇIK' : 'KAPALI'}
              </button>
              <button onClick={() => setUseSearch(!useSearch)} className={`tech-tag flex items-center gap-1.5 whitespace-nowrap ${useSearch ? 'bg-[#00f3ff]/20 border-[#00f3ff]' : ''}`}>
                <i className="fa-solid fa-magnifying-glass text-[10px]"></i> Web Search: {useSearch ? 'AÇIK' : 'KAPALI'}
              </button>
            </div>

            {selectedImage && (
              <div className="mb-4 relative w-24 h-24 rounded-xl overflow-hidden border border-[#00f3ff]/30 group animate-in zoom-in-95">
                <img src={selectedImage.url} alt="Selected" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-[#00f3ff]/20 animate-pulse pointer-events-none"></div>
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                >
                  <i className="fa-solid fa-xmark text-xs"></i>
                </button>
              </div>
            )}

            {/* 🧠 NEURAL INPUT CONTAINER (50+ Features) */}
            <div className="relative neural-input-container rounded-2xl p-2 flex flex-col transition-all group input-glow-focus">
               {/* Input Header Info */}
               <div className="flex items-center justify-between px-3 py-1 mb-1">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <div className="neural-wave">
                        <div className="neural-wave-bar" style={{ animationDelay: '0.1s' }}></div>
                        <div className="neural-wave-bar" style={{ animationDelay: '0.3s' }}></div>
                        <div className="neural-wave-bar" style={{ animationDelay: '0.2s' }}></div>
                        <div className="neural-wave-bar" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="quantum-status">Neural Link: Stable</span>
                    </div>
                    <div className="h-3 w-[1px] bg-white/10"></div>
                    <div className="flex items-center gap-1.5">
                      <i className="fa-solid fa-shield-halved text-[8px] text-[#00f3ff]/40"></i>
                      <span className="quantum-status">Quantum Encrypted</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="char-counter">{inputText.length} / 4000</span>
                    <div className="w-8 h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#00f3ff]" style={{ width: `${(inputText.length / 4000) * 100}%` }}></div>
                    </div>
                  </div>
               </div>

               <div className="flex items-end w-full">
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   onChange={handleImageUpload} 
                   accept="image/*" 
                   className="hidden" 
                 />
                 <div className="flex items-center gap-1 mb-1">
                   <button 
                     onClick={() => fileInputRef.current?.click()}
                     title="Görsel Analizi" 
                     className="w-10 h-10 flex items-center justify-center holo-btn rounded-xl group/btn relative"
                   >
                     <i className="fa-solid fa-camera-retro group-hover/btn:scale-110 transition-transform"></i>
                     <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-ping opacity-0 group-hover/btn:opacity-100"></div>
                   </button>
                   <button 
                     onClick={() => setShowTraining(true)} 
                     title="Nöral Bellek" 
                     className="w-10 h-10 flex items-center justify-center holo-btn rounded-xl group/btn"
                   >
                     <i className="fa-solid fa-microchip group-hover/btn:rotate-180 transition-transform duration-700"></i>
                   </button>
                 </div>

                 <textarea
                   value={inputText}
                   onChange={(e) => setInputText(e.target.value)}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter' && !e.shiftKey) {
                       e.preventDefault();
                       sendMessage(inputText);
                     }
                   }}
                   placeholder="Nöral komut girin veya proje başlatın..."
                   className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder-gray-600 py-3 px-4 resize-none max-h-40 min-h-[48px] font-medium text-sm custom-scrollbar"
                 />
                 {inputText.length > 0 && (
                   <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5">
                      <span className="text-4xl font-black text-[#00f3ff] uppercase tracking-[1em] animate-pulse">Processing</span>
                   </div>
                 )}

                 <div className="flex items-center gap-1 mb-1">
                    <button 
                      onClick={() => setInputText(prev => prev + ' [PROMPT_ENHANCE] ')}
                      title="Prompt Sihirbazı"
                      className="w-10 h-10 flex items-center justify-center holo-btn rounded-xl group/btn"
                    >
                      <i className="fa-solid fa-wand-magic-sparkles group-hover/btn:animate-bounce"></i>
                    </button>
                    <button 
                      onClick={() => sendMessage(inputText)}
                      disabled={!inputText.trim() || isLoading}
                      className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all relative overflow-hidden ${!inputText.trim() || isLoading ? 'bg-white/5 text-gray-600' : 'bg-[#00f3ff] text-black shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:scale-105 active:scale-95'}`}
                    >
                      {isLoading ? (
                        <i className="fa-solid fa-circle-notch animate-spin"></i>
                      ) : (
                        <i className="fa-solid fa-paper-plane-top"></i>
                      )}
                      {!isLoading && inputText.trim() && (
                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                      )}
                    </button>
                 </div>
               </div>

               {/* Input Footer Status */}
               <div className="flex items-center justify-between px-3 py-1 mt-1 border-t border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-[#00f3ff]"></div>
                      <span className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Latency: 12ms</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 rounded-full bg-emerald-500"></div>
                      <span className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Sync: 100%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <i className="fa-solid fa-fingerprint text-[8px] text-[#00f3ff]/20"></i>
                    <span className="text-[7px] font-bold text-gray-500 uppercase tracking-widest">Auth: Verified</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
export default App;
