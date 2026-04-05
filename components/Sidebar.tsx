
import React, { useState, useEffect } from 'react';
import { ChatSession, CustomGPT, User } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  customGPTs: CustomGPT[];
  currentUser: User | null;
  onNewChat: (gptId?: string) => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onRenameChat: (id: string, newTitle: string) => void;
  onDeleteGPT: (id: string) => void;
  onEditGPT: (gpt: CustomGPT) => void;
  onShareGPT: (gpt: CustomGPT) => void;
  onOpenCreateGPT: () => void;
  onOpenStore: () => void;
  onOpenLibrary: () => void;
  onOpenProfile: () => void;
  onOpenVisionLab: () => void;
  isOpen: boolean;
  onToggle: () => void;
  onTogglePin: (id: string) => void;
  sidebarSearch: string;
  setSidebarSearch: (val: string) => void;
  onToggleAmbient: () => void;
  onSelectTheme: (theme: any) => void;
  onClearInterference: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, currentSessionId, customGPTs, currentUser, onNewChat, onSelectChat, onDeleteChat, onRenameChat, onDeleteGPT, onEditGPT, onShareGPT, onOpenCreateGPT, onOpenStore, onOpenLibrary, onOpenProfile, onOpenVisionLab, isOpen, onToggle,
  onTogglePin, sidebarSearch, setSidebarSearch, onToggleAmbient, onSelectTheme, onClearInterference
}) => {
  const [time, setTime] = useState(new Date());
  const [uptime, setUptime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const uptimeTimer = setInterval(() => setUptime(prev => prev + 1), 1000);
    return () => {
      clearInterval(timer);
      clearInterval(uptimeTimer);
    };
  }, []);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleRename = (id: string, currentTitle: string) => {
    const newTitle = prompt("Sohbet ismini düzenle:", currentTitle);
    if (newTitle && newTitle.trim()) {
      onRenameChat(id, newTitle.trim());
    }
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/80 z-40 md:hidden" onClick={onToggle} />}
      <aside className={`fixed md:relative z-50 w-72 h-full bg-[#08080a]/90 backdrop-blur-xl border-r border-[#00f3ff]/10 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col`}>
        <div className="p-6 flex flex-col gap-6 items-center text-center">
          <div className="flex flex-col gap-1 items-center">
            <div className="flex items-center gap-2 px-3 py-1 bg-black/40 border border-white/10 rounded-lg mb-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Neural Load: 12%</span>
            </div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-[#ff00ff] tracking-tighter leading-none animate-pulse">CaganX</h1>
            <p className="text-[10px] font-bold tracking-widest uppercase chromatic-name">Neural Nexus v5.0</p>
          </div>

          <div className="flex flex-col gap-2">
            <button onClick={() => onNewChat()} className="w-full py-3.5 bg-[#00f3ff]/10 border border-[#00f3ff]/30 text-[#00f3ff] hover:bg-[#00f3ff] hover:text-black rounded-xl font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-[0_0_10px_rgba(0,243,255,0.1)] hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] group">
              <i className="fa-solid fa-plus group-hover:rotate-90 transition-transform"></i> Yeni Sohbet
            </button>
            <button onClick={onOpenVisionLab} className="w-full py-3.5 bg-[#00f3ff]/10 border border-[#00f3ff]/30 text-[#00f3ff] hover:bg-[#00f3ff] hover:text-black rounded-xl font-bold text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-[0_0_10px_rgba(0,243,255,0.1)] hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] group">
              <i className="fa-solid fa-brain group-hover:scale-125 transition-transform"></i> Nöral Eğitim
            </button>
            <button onClick={onClearInterference} className="w-full py-2 bg-rose-500/10 border border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl font-bold text-[9px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all group">
              <i className="fa-solid fa-eye-slash group-hover:animate-pulse"></i> Sansürü Kaldır / Reset
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-6 custom-scrollbar">
          {/* 🔍 Sidebar Search */}
          <div className="px-2">
            <div className="relative group">
              <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-600 group-focus-within:text-[#00f3ff] transition-colors"></i>
              <input 
                type="text"
                value={sidebarSearch}
                onChange={(e) => setSidebarSearch(e.target.value)}
                placeholder="Sohbetlerde ara..."
                className="w-full bg-black/40 border border-white/5 rounded-xl py-2 pl-8 pr-3 text-[10px] text-gray-300 focus:border-[#00f3ff]/30 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em] px-2 flex items-center justify-between">
              <span>GPT'lerim</span>
              <button onClick={onOpenCreateGPT} className="text-[#00f3ff] hover:text-white transition-colors"><i className="fa-solid fa-circle-plus"></i></button>
            </div>
            {customGPTs.map(gpt => {
              const getGptAnimation = () => {
                switch (gpt.rgbMode) {
                  case 'pulse': return 'animate-rgb-pulse';
                  case 'rainbow': return 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500 animate-rainbow bg-clip-text text-transparent';
                  case 'neon': return 'animate-neon-flicker text-white';
                  case 'cyber': return 'animate-chromatic text-white';
                  default: return 'text-gray-200';
                }
              };
              
              return (
              <div key={gpt.id} onClick={() => onNewChat(gpt.id)} className="group flex items-center justify-between p-3 rounded-xl cursor-pointer hover:bg-white/[0.04] transition-all border border-transparent hover:border-[#00f3ff]/20">
                <div className="flex items-center gap-3 truncate flex-1">
                  <div className={`w-9 h-9 rounded-lg ${gpt.color ? gpt.color + ' text-white shadow-lg' : 'bg-gradient-to-br from-[#00f3ff]/20 to-[#ff00ff]/20 text-[#00f3ff]'} flex items-center justify-center border border-white/5`}>
                    <i className={`fa-solid ${gpt.icon} text-[11px] ${gpt.rgbMode === 'neon' ? 'animate-neon-flicker' : ''}`}></i>
                  </div>
                  <div className="flex flex-col truncate">
                    <span className={`text-[11px] font-bold truncate ${getGptAnimation()}`}>{gpt.name}</span>
                    <span className="text-[7px] text-gray-500 font-bold uppercase tracking-widest">{gpt.expertise}</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onEditGPT(gpt); }}
                  className="p-2 opacity-0 group-hover:opacity-100 hover:bg-white/10 rounded-lg text-gray-500 hover:text-white transition-all"
                >
                  <i className="fa-solid fa-gear text-[10px]"></i>
                </button>
              </div>
            );})}
          </div>

          <div className="space-y-2 pb-10">
            <div className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em] px-2 flex items-center justify-between">
              <span>Sohbet Geçmişi</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    if (confirm('Tüm sohbet geçmişini silmek istediğinize emin misiniz?')) {
                      sessions.forEach(s => onDeleteChat(s.id));
                    }
                  }}
                  className="text-gray-600 hover:text-rose-400 transition-colors"
                  title="Tümünü Temizle"
                >
                  <i className="fa-solid fa-broom"></i>
                </button>
                <i className="fa-solid fa-clock-rotate-left opacity-30 text-[8px]"></i>
              </div>
            </div>
            {sessions.filter(s => s.title.toLowerCase().includes(sidebarSearch.toLowerCase())).map(s => (
              <div key={s.id} onClick={() => onSelectChat(s.id)} className={`group flex items-center justify-between p-3.5 rounded-xl cursor-pointer transition-all ${currentSessionId === s.id ? 'bg-[#00f3ff]/10 border border-[#00f3ff]/30 text-white shadow-[0_0_10px_rgba(0,243,255,0.1)]' : 'hover:bg-white/[0.02] text-gray-500'} ${s.isPinned ? 'session-pinned' : ''}`}>
                <div className="flex items-center gap-3 truncate flex-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${currentSessionId === s.id ? 'bg-[#00f3ff] animate-pulse' : (s.isPinned ? 'bg-yellow-400' : 'bg-white/10')}`}></div>
                  <span className="text-[12px] font-bold truncate">{s.title}</span>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => { e.stopPropagation(); onTogglePin(s.id); }}
                    className={`p-1.5 hover:bg-white/10 rounded-lg transition-all ${s.isPinned ? 'text-yellow-400' : 'text-gray-500 hover:text-yellow-400'}`}
                    title={s.isPinned ? 'Pini Kaldır' : 'Sohbeti Pinle'}
                  >
                    <i className="fa-solid fa-thumbtack text-[10px]"></i>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleRename(s.id, s.title); }}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-[#00f3ff] transition-all"
                    title="İsmi Düzenle"
                  >
                    <i className="fa-solid fa-pen text-[10px]"></i>
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onDeleteChat(s.id); }}
                    className="p-1.5 hover:bg-white/10 rounded-lg text-gray-500 hover:text-rose-400 transition-all"
                    title="Sohbeti Sil"
                  >
                    <i className="fa-solid fa-trash-can text-[10px]"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Neural Status Widget */}
          <div className="px-2 py-4 border-t border-white/5 space-y-4">
            <div className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em] px-2 flex items-center justify-between">
              <span>Sistem Durumu</span>
              <div className="flex gap-1">
                <div className="neural-node"></div>
                <div className="neural-node" style={{ animationDelay: '0.5s' }}></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white/5 rounded-xl p-3 border border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00f3ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] text-gray-400 font-bold uppercase">Nöral Kapasite</span>
                  <span className="text-[9px] text-[#00f3ff] font-bold">88%</span>
                </div>
                <div className="glow-bar-container">
                  <div className="glow-bar-fill" style={{ width: '88%' }}></div>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#ff00ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] text-gray-400 font-bold uppercase">Bellek Havuzu</span>
                  <span className="text-[9px] text-[#ff00ff] font-bold">42%</span>
                </div>
                <div className="glow-bar-container">
                  <div className="glow-bar-fill" style={{ width: '42%', background: 'linear-gradient(90deg, #ff00ff, #8800ff)' }}></div>
                </div>
              </div>
              
              {/* 70+ New Features: Advanced Diagnostics */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[7px] text-gray-500 font-bold uppercase">Network Topology</span>
                  <div className="flex gap-0.5">
                    {[1,2,3,4].map(i => <div key={i} className="w-1 h-1 rounded-full bg-[#00f3ff] animate-ping" style={{ animationDelay: `${i*0.2}s` }}></div>)}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <span className="text-[6px] text-gray-600 uppercase">Entropy</span>
                    <span className="text-[8px] text-[#00f3ff] font-mono">0.0024</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[6px] text-gray-600 uppercase">Sync Key</span>
                    <span className="text-[8px] text-[#ff00ff] font-mono">0x{Math.random().toString(16).slice(2,6).toUpperCase()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[6px] text-gray-600 uppercase">Latency</span>
                    <span className="text-[8px] text-emerald-400 font-mono">12.4ms</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[6px] text-gray-600 uppercase">Uplink</span>
                    <span className="text-[8px] text-blue-400 font-mono">8.2 GB/s</span>
                  </div>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent animate-scan" style={{ width: '100%' }}></div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {['AES-256', 'RSA-4096', 'TLS-1.3', 'P2P', 'SAT-LINK', 'QUANTUM'].map(t => (
                    <span key={t} className="text-[5px] px-1 py-0.5 bg-white/5 rounded border border-white/5 text-gray-500">{t}</span>
                  ))}
                </div>
                
                {/* More Metrics */}
                <div className="pt-2 border-t border-white/5 grid grid-cols-3 gap-1">
                  {[
                    { l: 'Temp', v: '32°C' }, { l: 'Fan', v: '2400' }, { l: 'Volt', v: '1.2V' },
                    { l: 'Threads', v: '128' }, { l: 'PID', v: '0x2F' }, { l: 'IO', v: '98%' },
                    { l: 'Epoch', v: '12' }, { l: 'Loss', v: '0.01' }, { l: 'Acc', v: '99%' }
                  ].map((m, i) => (
                    <div key={i} className="flex flex-col items-center p-1 bg-black/20 rounded">
                      <span className="text-[5px] text-gray-600 uppercase">{m.l}</span>
                      <span className="text-[7px] text-[#00f3ff] font-mono">{m.v}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-between items-center">
                  <span className="text-[6px] text-gray-500 uppercase">Synaptic Weight Norm</span>
                  <div className="flex gap-0.5">
                    {Array.from({length: 8}).map((_, i) => (
                      <div key={i} className="w-1 h-2 bg-[#ff00ff]/30 rounded-full animate-pulse" style={{ animationDelay: `${i*0.1}s` }}></div>
                    ))}
                  </div>
                </div>
              </div>

              {/* New Mini Graph */}
              <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] text-gray-400 font-bold uppercase">Gecikme (ms)</span>
                  <span className="text-[9px] text-emerald-400 font-bold">12ms</span>
                </div>
                <div className="h-8 flex items-end gap-0.5">
                  {[40, 60, 30, 80, 50, 90, 40, 70, 30, 60].map((h, i) => (
                    <div key={i} className="flex-1 bg-[#00f3ff]/20 rounded-t-sm animate-pulse" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Holographic Data Stream */}
          <div className="px-4 py-4 border-t border-white/5 overflow-hidden">
            <div className="text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-3">Veri Akışı</div>
            <div className="data-ticker flex gap-8">
              <span className="text-[8px] font-mono text-[#00f3ff]/40">CORE_SYNC_ACTIVE_0XFF23</span>
              <span className="text-[8px] font-mono text-[#ff00ff]/40">NEURAL_LINK_STABLE_0XAB12</span>
              <span className="text-[8px] font-mono text-[#00ff9d]/40">QUANTUM_GATE_OPEN_0X77CC</span>
              <span className="text-[8px] font-mono text-[#00f3ff]/40">CORE_SYNC_ACTIVE_0XFF23</span>
            </div>
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-1 h-1 rounded-full bg-[#00f3ff] animate-ping"></div>
                <div className="text-[8px] font-mono text-[#00f3ff]/40 whitespace-nowrap animate-pulse">
                  {Math.random().toString(16).substring(2, 10).toUpperCase()} {">>"} SYNC_OK
                </div>
              </div>
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-1 h-1 rounded-full bg-[#ff00ff] animate-ping" style={{ animationDelay: '0.5s' }}></div>
                <div className="text-[8px] font-mono text-[#ff00ff]/40 whitespace-nowrap animate-pulse" style={{ animationDelay: '0.5s' }}>
                  {Math.random().toString(16).substring(2, 10).toUpperCase()} {">>"} ENCRYPT_OK
                </div>
              </div>
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-ping" style={{ animationDelay: '1s' }}></div>
                <div className="text-[8px] font-mono text-emerald-500/40 whitespace-nowrap animate-pulse" style={{ animationDelay: '1s' }}>
                  {Math.random().toString(16).substring(2, 10).toUpperCase()} {">>"} UPLINK_STABLE
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3 bg-black/20 border-t border-[#00f3ff]/10">
          {/* 🎨 Theme & Sound Controls */}
          <div className="flex items-center justify-between px-2 mb-4">
            <div className="flex gap-2">
              <button 
                onClick={() => onSelectTheme('neon')}
                className={`w-6 h-6 rounded-lg border border-white/10 flex items-center justify-center text-[8px] transition-all ${currentUser?.settings?.theme === 'neon' ? 'bg-[#00f3ff] text-black shadow-[0_0_10px_rgba(0,243,255,0.5)]' : 'bg-black/40 text-[#00f3ff]'}`}
                title="Neon Tema"
              >
                <i className="fa-solid fa-bolt"></i>
              </button>
              <button 
                onClick={() => onSelectTheme('matrix')}
                className={`w-6 h-6 rounded-lg border border-white/10 flex items-center justify-center text-[8px] transition-all ${currentUser?.settings?.theme === 'matrix' ? 'bg-green-500 text-black shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-black/40 text-green-500'}`}
                title="Matrix Tema"
              >
                <i className="fa-solid fa-code"></i>
              </button>
              <button 
                onClick={() => onSelectTheme('nebula')}
                className={`w-6 h-6 rounded-lg border border-white/10 flex items-center justify-center text-[8px] transition-all ${currentUser?.settings?.theme === 'nebula' ? 'bg-purple-500 text-black shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-black/40 text-purple-500'}`}
                title="Nebula Tema"
              >
                <i className="fa-solid fa-cloud"></i>
              </button>
            </div>
            <button 
              onClick={onToggleAmbient}
              className={`w-8 h-8 rounded-xl border border-white/10 flex items-center justify-center transition-all ${currentUser?.settings?.ambientSounds ? 'bg-[#00f3ff]/20 text-[#00f3ff]' : 'bg-black/40 text-gray-600'}`}
              title="Ortam Sesleri"
            >
              <i className={`fa-solid ${currentUser?.settings?.ambientSounds ? 'fa-volume-high' : 'fa-volume-xmark'} text-[10px]`}></i>
            </button>
          </div>

          {/* Cyber Clock & Uptime */}
          <div className="flex flex-col gap-2 mb-4 p-2 bg-white/5 rounded-xl border border-white/5">
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Sistem Saati</span>
              <span className="text-[10px] font-mono text-[#00f3ff] shimmer-text">{time.toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Uptime</span>
              <span className="text-[10px] font-mono text-gray-400">{formatUptime(uptime)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between px-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00f3ff] animate-pulse"></div>
              <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Neural Link</span>
            </div>
            <span className="text-[8px] font-mono text-[#00f3ff]">ACTIVE</span>
          </div>
          <div className="flex items-center justify-between px-2 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#ff00ff] animate-pulse"></div>
              <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Quantum Sync</span>
            </div>
            <span className="text-[8px] font-mono text-[#ff00ff]">99.9%</span>
          </div>
          {currentUser && (
             <div className="relative group">
               <button onClick={onOpenProfile} className="w-full flex items-center gap-3 p-3 bg-white/[0.03] border border-white/5 rounded-xl hover:bg-white/5 transition-all group overflow-hidden hover:border-[#00f3ff]/30">
                  <div className={`w-10 h-10 rounded-lg ${currentUser.avatarColor} flex items-center justify-center text-white text-sm shadow-xl relative`}>
                     <i className={`fa-solid ${currentUser.avatarIcon}`}></i>
                     {currentUser.badges.length > 0 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00ff9d] rounded-full border-2 border-black"></div>}
                  </div>
                  <div className="flex-1 text-left truncate">
                     <h4 className={`text-[12px] font-bold truncate ${currentUser.settings?.theme === 'neon' ? 'animate-neon-flicker text-white' : 'text-white'}`}>{currentUser.firstName}</h4>
                     <div className="flex flex-col">
                       <span className="text-[8px] font-bold text-gray-600 uppercase">RANK: {currentUser.role.toUpperCase()}</span>
                     </div>
                  </div>
               </button>
               
               {/* Rozet Önizleme */}
               <div className="absolute bottom-full left-0 mb-2 hidden group-hover:flex gap-1 animate-in slide-in-from-bottom-2">
                  {currentUser.badges.slice(0, 3).map(badge => (
                    <div key={badge.id} className="w-6 h-6 rounded-lg bg-[#111113] border border-white/10 flex items-center justify-center shadow-2xl" title={badge.label}>
                       <i className={`fa-solid ${badge.icon} ${badge.color} text-[8px]`}></i>
                    </div>
                  ))}
                  {currentUser.badges.length > 3 && <div className="w-6 h-6 rounded-lg bg-[#111113] border border-white/10 flex items-center justify-center text-[7px] font-bold text-gray-500">+{currentUser.badges.length - 3}</div>}
               </div>
             </div>
           )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
