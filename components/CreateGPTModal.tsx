
import React, { useState } from 'react';
import { CustomGPT, AIModel, AIExpertise, StyleLock } from '../types';
import { generateUUID } from '../utils';

interface CreateGPTModalProps {
  onClose: () => void;
  onSave: (gpt: CustomGPT) => void;
  onDelete?: (id: string) => void;
  initialGPT?: CustomGPT | null;
}

const STYLE_LOCKS: StyleLock[] = [
  { id: 'no-emoji', label: 'Emoji Yasakla', instruction: 'Asla emoji kullanma, ciddi ve profesyonel kal.' },
  { id: 'cinematic', label: 'Sinematik Dil', instruction: 'Betimlemeleri artır, adeta bir film sahnesi gibi anlat.' },
  { id: 'tech-only', label: 'Teknik Odak', instruction: 'Sadece teknik ve veriye dayalı bilgi ver, gereksiz yorum yapma.' },
  { id: 'creative-chaos', label: 'Yaratıcı Kaos', instruction: 'Sıra dışı, provokatif ve alışılmadık fikirler üret.' }
];

const EXPERTISE_ROLES: { id: AIExpertise; label: string; icon: string }[] = [
  { id: 'designer', label: 'Görsel Tasarımcı', icon: 'fa-palette' },
  { id: 'developer', label: 'Yazılım Mimarı', icon: 'fa-code' },
  { id: 'analyst', label: 'Veri Analisti', icon: 'fa-chart-pie' },
  { id: 'critic', label: 'Sert Eleştirmen', icon: 'fa-gavel' },
  { id: 'strategist', label: 'Strateji Uzmanı', icon: 'fa-chess-knight' },
  { id: 'architect', label: 'Sistem Mimarı', icon: 'fa-microchip' },
  { id: 'general', label: 'Genel Asistan', icon: 'fa-robot' }
];

const CreateGPTModal: React.FC<CreateGPTModalProps> = ({ onClose, onSave, onDelete, initialGPT }) => {
  const [activeTab, setActiveTab] = useState<'general' | 'config' | 'knowledge' | 'appearance'>('general');
  const [name, setName] = useState(initialGPT?.name || '');
  const [instruction, setInstruction] = useState(initialGPT?.instruction || '');
  const [model, setModel] = useState<AIModel>(initialGPT?.model || 'quantum-alpha');
  const [expertise, setExpertise] = useState<AIExpertise>(initialGPT?.expertise || 'general');
  const [selectedLocks, setSelectedLocks] = useState<string[]>(initialGPT?.styleLocks || []);
  const [icon, setIcon] = useState(initialGPT?.icon || 'fa-brain');
  const [color, setColor] = useState(initialGPT?.color || 'bg-indigo-600');
  const [isShared, setIsShared] = useState(initialGPT?.isShared || false);
  const [welcomeMessage, setWelcomeMessage] = useState(initialGPT?.welcomeMessage || '');
  const [starters, setStarters] = useState<string[]>(initialGPT?.conversationStarters || ['', '', '']);
  const [files, setFiles] = useState<string[]>(initialGPT?.knowledgeBase || []);
  const [rgbMode, setRgbMode] = useState<'static' | 'pulse' | 'rainbow' | 'neon' | 'cyber' | 'disco' | 'retro' | 'matrix' | 'fire'>(initialGPT?.rgbMode || 'static');
  const [error, setError] = useState('');

  const colors = ['bg-indigo-600', 'bg-emerald-600', 'bg-rose-600', 'bg-amber-600', 'bg-purple-600', 'bg-cyan-600', 'bg-yellow-500', 'bg-fuchsia-600', 'bg-slate-600'];

  const rgbModes: { id: 'static' | 'pulse' | 'rainbow' | 'neon' | 'cyber' | 'disco' | 'retro' | 'matrix' | 'fire'; label: string; icon: string }[] = [
    { id: 'static', label: 'Statik', icon: 'fa-circle' },
    { id: 'pulse', label: 'RGB Pulse', icon: 'fa-heart-pulse' },
    { id: 'rainbow', label: 'Gökkuşağı', icon: 'fa-rainbow' },
    { id: 'neon', label: 'Neon Flicker', icon: 'fa-bolt' },
    { id: 'cyber', label: 'Cyber Glitch', icon: 'fa-bug' },
    { id: 'disco', label: 'Disco Party', icon: 'fa-compact-disc' },
    { id: 'retro', label: 'Retro Wave', icon: 'fa-gamepad' },
    { id: 'matrix', label: 'Matrix Code', icon: 'fa-terminal' },
    { id: 'fire', label: 'Alev Modu', icon: 'fa-fire' }
  ];

  const models: { id: AIModel; label: string; desc: string; features: string[] }[] = [
    { 
      id: 'quantum-alpha', 
      label: 'Quantum Alpha', 
      desc: 'En zeki, derin analiz yapan model.',
      features: ['Derin Mantık', 'Karmaşık Problem Çözme', 'Akademik Dil', 'Yavaş ama Kesin']
    },
    { 
      id: 'turbo-pulse', 
      label: 'Turbo Pulse', 
      desc: 'Süper hızlı ve seri yanıtlar.',
      features: ['Düşük Gecikme', 'Sohbet Odaklı', 'Günlük Kullanım', 'Hızlı Yanıt']
    },
    { 
      id: 'vision-matrix', 
      label: 'Vision Matrix', 
      desc: 'Görsel ve kod odaklı analiz.',
      features: ['Görsel Analiz', 'UI/UX Tasarım', 'Renk Teorisi', 'Multimodal']
    },
    { 
      id: 'caganx-v4-prime', 
      label: 'CaganX v4 Prime', 
      desc: 'En gelişmiş genel amaçlı model.',
      features: ['Dengeli Performans', 'Geniş Bilgi Tabanı', 'Yaratıcı Yazarlık', 'Kodlama Desteği']
    },
    { 
      id: 'caganx-v4-creative', 
      label: 'CaganX v4 Creative', 
      desc: 'Yaratıcı ve sanatsal içerik üretimi.',
      features: ['Hikaye Anlatımı', 'Şiirsel Dil', 'Soyut Düşünme', 'Sanatsal Vizyon']
    },
    { 
      id: 'caganx-v4-dev', 
      label: 'CaganX v4 Dev', 
      desc: 'Kodlama ve teknik analiz uzmanı.',
      features: ['Full-Stack Kodlama', 'Hata Ayıklama', 'Sistem Mimarisi', 'API Entegrasyonu']
    }
  ];

  const handleSave = () => {
    if (!name.trim()) {
      setError('Lütfen bir isim giriniz.');
      return;
    }
    onSave({
      id: initialGPT?.id || generateUUID(),
      name,
      instruction,
      model,
      icon,
      color,
      expertise,
      styleLocks: selectedLocks,
      createdAt: initialGPT?.createdAt || Date.now(),
      isShared,
      rating: isShared ? 5.0 : undefined,
      welcomeMessage,
      conversationStarters: starters.filter(s => s.trim()),
      knowledgeBase: files,
      rgbMode
    });
  };

  const handleDelete = () => {
    if (initialGPT && onDelete && confirm('Bu GPT\'yi silmek istediğinize emin misiniz?')) {
      onDelete(initialGPT.id);
    }
  };

  const getAnimationClass = () => {
    switch (rgbMode) {
      case 'pulse': return 'animate-rgb-pulse';
      case 'rainbow': return 'bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 via-purple-500 to-red-500 animate-rainbow bg-clip-text text-transparent';
      case 'neon': return 'animate-neon-flicker text-white';
      case 'cyber': return 'animate-chromatic text-white';
      case 'disco': return 'animate-disco text-white';
      case 'retro': return 'animate-retro text-white';
      case 'matrix': return 'animate-matrix text-green-500';
      case 'fire': return 'animate-fire text-red-500';
      default: return 'text-white';
    }
  };

  const handleStarterChange = (index: number, value: string) => {
    const newStarters = [...starters];
    newStarters[index] = value;
    setStarters(newStarters);
  };

  const handleFileUpload = () => {
    // Simulation
    const newFile = `knowledge_base_${files.length + 1}.pdf`;
    setFiles([...files, newFile]);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-500" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-[#0c0c0e] border border-white/10 rounded-[3rem] w-full max-w-5xl overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.1)] flex flex-col md:flex-row h-[90vh]">
        
        {/* Preview Sidebar */}
        <div className={`w-full md:w-80 ${color.replace('bg-', 'bg-')}/5 border-r border-white/5 p-8 flex flex-col items-center justify-center gap-6 relative overflow-hidden`}>
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50 pointer-events-none"></div>
           
           <div className={`w-32 h-32 rounded-[2.5rem] ${color} flex items-center justify-center text-4xl shadow-2xl shadow-indigo-600/40 relative z-10 group`}>
              <i className={`fa-solid ${icon} group-hover:scale-110 transition-transform duration-500 ${rgbMode === 'neon' ? 'animate-neon-flicker' : ''}`}></i>
              {isShared && <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-indigo-600 text-xs shadow-lg"><i className="fa-solid fa-globe"></i></div>}
           </div>
           
           <div className="text-center relative z-10 w-full">
              <h3 className={`text-2xl font-black truncate w-full ${getAnimationClass()}`}>{name || "GPT İsmi"}</h3>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mt-2 bg-indigo-500/10 px-3 py-1 rounded-full inline-block border border-indigo-500/20">{expertise}</p>
           </div>

           <div className="w-full space-y-2 mt-4 relative z-10">
              {starters.filter(s => s.trim()).map((s, i) => (
                <div key={i} className="p-3 bg-white/5 border border-white/10 rounded-xl text-[10px] text-gray-400 truncate text-center">
                  "{s}"
                </div>
              ))}
              {starters.every(s => !s.trim()) && <div className="text-[9px] text-gray-600 text-center italic">Sohbet başlatıcılar burada görünür...</div>}
           </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0c0c0e]">
          <header className="p-8 border-b border-white/5 flex items-center justify-between bg-black/20">
            <div>
               <h2 className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
                 GPT Builder <span className="text-indigo-500">v4.0</span>
               </h2>
               <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Gelişmiş Nöral Yapılandırma</p>
            </div>
            <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-white/5 flex items-center justify-center transition-all group">
              <i className="fa-solid fa-xmark text-gray-500 group-hover:text-white transition-colors"></i>
            </button>
          </header>

          {/* Tabs */}
          <div className="flex items-center gap-1 px-8 pt-6 border-b border-white/5 overflow-x-auto no-scrollbar">
            {[
              { id: 'general', label: 'GENEL', icon: 'fa-sliders' },
              { id: 'config', label: 'YAPILANDIRMA', icon: 'fa-code-branch' },
              { id: 'knowledge', label: 'BİLGİ TABANI', icon: 'fa-database' },
              { id: 'appearance', label: 'GÖRÜNÜM', icon: 'fa-palette' }
            ].map(t => (
              <button 
                key={t.id} 
                onClick={() => setActiveTab(t.id as any)}
                className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 flex-shrink-0 ${activeTab === t.id ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5' : 'border-transparent text-gray-600 hover:text-gray-400'}`}
              >
                <i className={`fa-solid ${t.icon}`}></i> {t.label}
              </button>
            ))}
          </div>

          <div className="p-8 overflow-y-auto custom-scrollbar flex-1">
            
            {activeTab === 'general' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">GPT İSMİ <span className="text-red-500">*</span></label>
                    <input 
                      value={name} 
                      onChange={e => { setName(e.target.value); setError(''); }} 
                      placeholder="Örn: Kod Mimarı" 
                      className={`w-full bg-white/5 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl p-4 text-white focus:border-indigo-500 outline-none transition-all font-bold placeholder:text-gray-700`} 
                    />
                    {error && <p className="text-[10px] text-red-400 font-bold">{error}</p>}
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">UZMANLIK ROLÜ</label>
                    <select value={expertise} onChange={e => setExpertise(e.target.value as any)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-indigo-500 outline-none appearance-none font-bold cursor-pointer">
                      {EXPERTISE_ROLES.map(r => <option key={r.id} value={r.id} className="bg-[#0c0c0e]">{r.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">AÇIKLAMA / BİYOGRAFİ</label>
                  <input placeholder="Bu GPT ne işe yarar? (Kısa açıklama)" className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-indigo-500 outline-none transition-all text-sm" />
                </div>

                <div className="flex items-center justify-between p-6 bg-indigo-500/5 rounded-[2rem] border border-indigo-500/10 group hover:border-indigo-500/30 transition-all cursor-pointer" onClick={() => setIsShared(!isShared)}>
                   <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isShared ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 text-gray-500'}`}>
                        <i className="fa-solid fa-store"></i>
                      </div>
                      <div>
                        <h4 className="text-[11px] font-black text-white uppercase tracking-tight">CaganX Store'da Yayınla</h4>
                        <p className="text-[9px] text-gray-500">Diğer kullanıcıların bu GPT'yi keşfetmesine izin ver.</p>
                      </div>
                   </div>
                   <div className={`w-14 h-8 rounded-full transition-all relative ${isShared ? 'bg-indigo-600' : 'bg-white/10'}`}>
                     <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all shadow-md ${isShared ? 'right-1' : 'left-1'}`}></div>
                   </div>
                </div>
              </div>
            )}

            {activeTab === 'config' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">MODEL SEÇİMİ</label>
                  <div className="grid grid-cols-1 gap-3">
                    {models.map(m => (
                      <button 
                        key={m.id} 
                        onClick={() => setModel(m.id)} 
                        className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${model === m.id ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-600/20' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                      >
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`text-[11px] font-black uppercase tracking-widest ${model === m.id ? 'text-white' : 'text-gray-300'}`}>{m.label}</span>
                            {model === m.id && <i className="fa-solid fa-check-circle text-white"></i>}
                          </div>
                          <p className={`text-[10px] mb-3 ${model === m.id ? 'text-indigo-200' : 'text-gray-500'}`}>{m.desc}</p>
                          
                          <div className="flex flex-wrap gap-2">
                            {m.features.map((f, i) => (
                              <span key={i} className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${model === m.id ? 'bg-white/20 text-white' : 'bg-white/5 text-gray-500'}`}>
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">SİSTEM TALİMATI (SYSTEM PROMPT)</label>
                  <textarea 
                    value={instruction} 
                    onChange={e => setInstruction(e.target.value)} 
                    placeholder="Sen bir Python uzmanısın. Kullanıcıya her zaman kod örnekleriyle yanıt ver..." 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white h-48 resize-none text-sm outline-none focus:border-indigo-500 transition-all font-mono leading-relaxed" 
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">SOHBET BAŞLATICI ÖNERİLER</label>
                  <div className="space-y-2">
                    {starters.map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-gray-600 w-4">{i+1}.</span>
                        <input 
                          value={s} 
                          onChange={e => handleStarterChange(i, e.target.value)}
                          placeholder="Örn: Bana bir React komponenti yaz..." 
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white text-xs focus:border-indigo-500 outline-none transition-all" 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'knowledge' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-10 border-2 border-dashed border-white/10 rounded-[2rem] flex flex-col items-center justify-center gap-4 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all cursor-pointer group" onClick={handleFileUpload}>
                   <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                      <i className="fa-solid fa-cloud-arrow-up text-2xl text-gray-500 group-hover:text-indigo-400 transition-colors"></i>
                   </div>
                   <div className="text-center">
                      <p className="text-xs font-black text-white uppercase tracking-widest">BİLGİ TABANI YÜKLE</p>
                      <p className="text-[10px] text-gray-500 mt-1">PDF, TXT, MD, JSON, CSV (Max 50MB)</p>
                   </div>
                </div>

                {files.length > 0 && (
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">YÜKLENEN DOSYALAR</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {files.map((f, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl group hover:border-white/20">
                          <div className="flex items-center gap-3">
                            <i className="fa-solid fa-file-lines text-indigo-400"></i>
                            <span className="text-xs text-gray-300 truncate max-w-[150px]">{f}</span>
                          </div>
                          <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-gray-600 hover:text-red-400 transition-colors"><i className="fa-solid fa-trash"></i></button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="space-y-4">
                   <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">İKON VE RENK</label>
                   <div className="flex flex-wrap gap-3">
                      {['fa-brain', 'fa-palette', 'fa-code', 'fa-shield', 'fa-robot', 'fa-ghost', 'fa-bolt', 'fa-fire'].map(i => (
                        <button key={i} onClick={() => setIcon(i)} className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all ${icon === i ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg' : 'bg-white/5 border-white/10 text-gray-500 hover:bg-white/10'}`}><i className={`fa-solid ${i}`}></i></button>
                      ))}
                   </div>
                   <div className="flex flex-wrap gap-3 pt-2">
                      {colors.map(c => (
                        <button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded-full transition-all ${c} ${color === c ? 'ring-4 ring-white/20 scale-110' : 'opacity-50 hover:opacity-100'}`}></button>
                      ))}
                   </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">RGB & ANİMASYON MODU</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {rgbModes.map(m => (
                      <button 
                        key={m.id} 
                        onClick={() => setRgbMode(m.id)} 
                        className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${rgbMode === m.id ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-600/20' : 'bg-white/5 border-white/5 hover:border-white/20'}`}
                      >
                        <i className={`fa-solid ${m.icon} ${rgbMode === m.id ? 'text-white' : 'text-gray-500'}`}></i>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${rgbMode === m.id ? 'text-white' : 'text-gray-400'}`}>{m.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          <footer className="p-8 border-t border-white/5 flex gap-4 bg-black/20 backdrop-blur-md">
            {initialGPT && (
              <button onClick={handleDelete} className="px-6 py-4 bg-red-500/10 border border-red-500/20 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all text-red-500 flex items-center gap-2">
                <i className="fa-solid fa-trash"></i> SİL
              </button>
            )}
            <button onClick={onClose} className="px-8 py-4 bg-white/5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-white/10 transition-all text-gray-400 hover:text-white">İPTAL</button>
            <button onClick={handleSave} className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:brightness-110 shadow-2xl shadow-indigo-600/20 transition-all text-white flex items-center justify-center gap-2">
              <i className="fa-solid fa-rocket"></i>
              {initialGPT ? 'GÜNCELLE' : 'GPT\'Yİ OLUŞTUR'}
            </button>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default CreateGPTModal;
