
import React, { useState, useMemo } from 'react';
import { CustomGPT, AIExpertise } from '../types';

interface GPTStoreProps {
  onClose: () => void;
  onInstall: (gpt: CustomGPT) => void;
  installedIds: string[];
  sharedGPTs: CustomGPT[];
}

const SYSTEM_GPTS: CustomGPT[] = [
  { id: 'store-1', name: 'Logo Architect Ultra', icon: 'fa-compass-drafting', expertise: 'designer', instruction: 'Minimalist ve vektörel logo tasarımları üretir.', model: 'quantum-alpha', styleLocks: ['no-emoji'], createdAt: Date.now(), author: 'CaganX Team', rating: 4.9, isSystem: true, rgbMode: 'neon' },
  { id: 'store-4', name: 'Crypto Strategist', icon: 'fa-chart-line', expertise: 'analyst', instruction: 'Piyasa verilerini analiz eder ve strateji sunar.', model: 'turbo-pulse', styleLocks: ['tech-only'], createdAt: Date.now(), author: 'FinAI', rating: 4.5, isSystem: true, rgbMode: 'pulse' },
  { id: 'store-5', name: 'Prompt Engineer Pro', icon: 'fa-wand-magic-sparkles', expertise: 'strategist', instruction: 'Daha iyi AI çıktıları için promptları optimize eder.', model: 'quantum-alpha', styleLocks: [], createdAt: Date.now(), author: 'CaganX Elite', rating: 5.0, isSystem: true, rgbMode: 'rainbow' },
  { 
    id: 'store-7', 
    name: 'System Architect Pro', 
    icon: 'fa-microchip', 
    expertise: 'architect', 
    instruction: 'Karmaşık yazılım mimarileri, mikroservisler ve yüksek performanslı sistemler tasarlar.', 
    model: 'quantum-alpha', 
    styleLocks: ['tech-only'], 
    createdAt: Date.now(), 
    author: 'CaganX Elite', 
    rating: 5.0, 
    isSystem: true,
    rgbMode: 'neon'
  },
  { 
    id: 'store-9', 
    name: 'Neural Nexus Core', 
    icon: 'fa-brain', 
    expertise: 'architect', 
    instruction: 'CaganX Neural Nexus v5.0 ana çekirdeği. En karmaşık yazılım problemlerini çözer ve sistemleri optimize eder.', 
    model: 'caganx-v4-dev', 
    styleLocks: ['tech-only'], 
    createdAt: Date.now(), 
    author: 'CaganX Elite', 
    rating: 5.0, 
    isSystem: true,
    rgbMode: 'cyber'
  }
];

const GPTStore: React.FC<GPTStoreProps> = ({ onClose, onInstall, installedIds, sharedGPTs }) => {
  const [activeTab, setActiveTab] = useState<AIExpertise | 'all'>('all');

  const allGPTs = useMemo(() => {
    // Combine system and shared gpts, avoid duplicates
    const combined = [...SYSTEM_GPTS];
    sharedGPTs.forEach(shared => {
      if (!combined.find(c => c.id === shared.id)) {
        combined.push(shared);
      }
    });
    return combined;
  }, [sharedGPTs]);

  const filtered = allGPTs.filter(g => activeTab === 'all' || g.expertise === activeTab);

  return (
    <div className="fixed inset-0 z-[150] bg-black/95 flex flex-col backdrop-blur-3xl animate-in fade-in duration-500">
      <header className="h-24 flex items-center justify-between px-10 border-b border-[#00f3ff]/10 bg-black/40 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(0,243,255,0.05),transparent)] animate-scanline pointer-events-none"></div>
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-14 h-14 bg-gradient-to-br from-[#00f3ff]/20 to-[#ff00ff]/20 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.2)] border border-white/10">
            <i className="fa-solid fa-store text-[#00f3ff] text-2xl animate-pulse"></i>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-[#ff00ff] tracking-tighter">CaganX Market</h2>
            <p className="text-[10px] font-bold text-[#00f3ff] uppercase tracking-[0.3em]">Topluluk ve Sistem Modelleri</p>
          </div>
        </div>

        <div className="flex items-center gap-6 relative z-10">
          <div className="flex bg-white/5 p-1.5 rounded-xl border border-white/5">
            {['all', 'designer', 'developer', 'analyst'].map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#00f3ff] text-black shadow-[0_0_15px_rgba(0,243,255,0.4)]' : 'text-gray-500 hover:text-white'}`}
              >
                {tab === 'all' ? 'TÜMÜ' : tab === 'designer' ? 'TASARIM' : tab === 'developer' ? 'YAZILIM' : 'ANALİZ'}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="w-14 h-14 flex items-center justify-center bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/10 hover:border-[#00f3ff]/30">
            <i className="fa-solid fa-xmark text-xl text-gray-400 hover:text-white"></i>
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 custom-scrollbar relative">
        {filtered.map(gpt => (
          <div key={gpt.id} className="group relative bg-[#0c0c0e] border border-white/5 rounded-[2rem] p-8 hover:border-[#00f3ff]/40 transition-all flex flex-col hover:-translate-y-2 duration-300 shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(0,243,255,0.1)]">
             <div className="flex items-start justify-between mb-6">
                <div className={`w-16 h-16 rounded-2xl ${gpt.color ? gpt.color : 'bg-gradient-to-br from-[#00f3ff]/10 to-[#ff00ff]/10'} flex items-center justify-center text-2xl text-[#00f3ff] border border-white/5 group-hover:scale-110 transition-transform shadow-lg`}>
                   <i className={`fa-solid ${gpt.icon} ${gpt.rgbMode === 'neon' ? 'animate-neon-flicker' : ''}`}></i>
                </div>
                <div className="flex flex-col items-end">
                   <div className="flex items-center gap-1 text-[#ff00ff] text-[10px] font-bold">
                      <i className="fa-solid fa-star"></i> {gpt.rating || 'Yeni'}
                   </div>
                   {!gpt.isSystem && <span className="text-[7px] font-bold bg-[#00f3ff]/10 text-[#00f3ff] px-2 py-0.5 rounded-full uppercase tracking-tighter mt-1 border border-[#00f3ff]/20">Topluluk</span>}
                </div>
             </div>

             <h3 className={`text-xl font-bold text-white mb-2 tracking-tight ${gpt.rgbMode === 'neon' ? 'animate-neon-flicker' : ''}`}>{gpt.name}</h3>
             <p className="text-xs text-gray-500 leading-relaxed mb-6 line-clamp-2 h-10">{gpt.instruction.slice(0, 100)}...</p>
             
             <div className="mt-auto space-y-4">
                <div className="flex items-center justify-between text-[10px] font-bold">
                   <span className="text-gray-600 uppercase">Geliştirici:</span>
                   <span className="text-[#00f3ff]">{gpt.author || 'Anonim'}</span>
                </div>
                <button 
                  disabled={installedIds.includes(gpt.id)}
                  onClick={() => onInstall(gpt)}
                  className={`w-full py-4 rounded-xl font-bold text-[11px] uppercase tracking-[0.2em] transition-all ${installedIds.includes(gpt.id) ? 'bg-[#00ff9d]/10 text-[#00ff9d] cursor-not-allowed border border-[#00ff9d]/30' : 'bg-[#00f3ff] text-black hover:bg-[#00c2cc] shadow-[0_0_15px_rgba(0,243,255,0.3)] hover:shadow-[0_0_25px_rgba(0,243,255,0.5)]'}`}
                >
                  {installedIds.includes(gpt.id) ? 'SİSTEMDE YÜKLÜ' : 'KÜTÜPHANEYE EKLE'}
                </button>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GPTStore;
