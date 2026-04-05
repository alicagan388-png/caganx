import React, { useState } from 'react';
import { User, UserRole, Persona } from '../types';

interface AccountModalProps {
  user: User | null;
  onSave: (user: User) => void;
  onClose: () => void;
}

const AccountModal: React.FC<AccountModalProps> = ({ user, onSave, onClose }) => {
  const [tab, setTab] = useState<'profile' | 'security' | 'insights' | 'settings'>('profile');
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [avatarIcon, setAvatarIcon] = useState(user?.avatarIcon || 'fa-user-astronaut');
  const [avatarColor, setAvatarColor] = useState(user?.avatarColor || 'bg-indigo-600');
  const [role, setRole] = useState<UserRole>(user?.role || 'user');
  const [preferredPersona, setPreferredPersona] = useState<Persona>(user?.preferredPersona || 'balanced');
  const [isProtected, setIsProtected] = useState<boolean>(user?.security.accountProtected || true);
  const [theme, setTheme] = useState(user?.settings?.theme || 'dark');
  const [language, setLanguage] = useState(user?.settings?.language || 'tr');
  const [voice, setVoice] = useState(user?.settings?.voice || 'robot');
  const [ambientSounds, setAmbientSounds] = useState(user?.settings?.ambientSounds || false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !user) return;
    onSave({
      ...user,
      firstName, lastName, avatarIcon, avatarColor, role, preferredPersona,
      security: { ...user.security, accountProtected: isProtected },
      settings: { theme, language, voice, ambientSounds, developerMode: user?.settings?.developerMode || false }
    });
  };

  const personas: { id: Persona; label: string; icon: string }[] = [
    { id: 'balanced', label: 'Balanced', icon: 'fa-scale-balanced' },
    { id: 'teacher', label: 'Teacher', icon: 'fa-graduation-cap' },
    { id: 'gamer', label: 'Gamer', icon: 'fa-gamepad' },
    { id: 'creative', label: 'Creative', icon: 'fa-wand-magic-sparkles' }
  ];

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300">
      <div className="bg-[#0c0c0e] border border-[#00f3ff]/20 rounded-[2rem] w-full max-w-4xl overflow-hidden shadow-[0_0_50px_rgba(0,243,255,0.1)] flex flex-col h-[85vh] relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(0,243,255,0.05),transparent_50%)] pointer-events-none"></div>
        
        <header className="p-8 border-b border-[#00f3ff]/10 flex items-center justify-between bg-black/20 relative z-10">
           <div className="flex gap-6 overflow-x-auto no-scrollbar">
              {[
                { id: 'profile', label: 'PROFİL', icon: 'fa-user' },
                { id: 'insights', label: 'AKILLI ANALİZ', icon: 'fa-brain' },
                { id: 'security', label: 'GÜVENLİK', icon: 'fa-shield-halved' },
                { id: 'settings', label: 'AYARLAR', icon: 'fa-gear' }
              ].map(t => (
                <button 
                  key={t.id} onClick={() => setTab(t.id as any)} 
                  className={`text-[10px] font-bold uppercase tracking-widest pb-1 border-b-2 transition-all flex items-center gap-2 flex-shrink-0 ${tab === t.id ? 'border-[#00f3ff] text-[#00f3ff]' : 'border-transparent text-gray-600 hover:text-gray-400'}`}
                >
                  <i className={`fa-solid ${t.icon} text-[8px]`}></i>
                  {t.label}
                </button>
              ))}
           </div>
           <button onClick={onClose} className="text-gray-600 hover:text-white transition-colors ml-4"><i className="fa-solid fa-xmark text-xl"></i></button>
        </header>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar relative z-10">
          {tab === 'profile' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               <div className="space-y-10 text-center">
                  <div className="relative inline-block">
                    <div className={`w-32 h-32 rounded-[2rem] ${avatarColor} mx-auto flex items-center justify-center text-5xl text-white mb-6 shadow-[0_0_30px_rgba(0,243,255,0.2)] relative z-10 border border-white/10`}>
                        <i className={`fa-solid ${avatarIcon}`}></i>
                    </div>
                  </div>
                  <div>
                    <h2 className={`text-3xl font-bold tracking-tighter uppercase ${theme === 'neon' ? 'text-neon-blue animate-pulse' : 'text-white'}`}>{firstName} {lastName}</h2>
                    <div className="flex flex-col gap-1 mt-3">
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[#00f3ff] inline-block px-3 py-1 bg-[#00f3ff]/5 border border-[#00f3ff]/20 rounded-full self-center">OMNIMIND USER</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2">
                    {user?.badges.map(badge => (
                      <div key={badge.id} className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center gap-2 transition-transform hover:scale-105 group cursor-help" title={badge.label}>
                         <i className={`fa-solid ${badge.icon} ${badge.color} text-[10px]`}></i>
                         <span className="text-[8px] font-bold text-gray-500 uppercase group-hover:text-white">{badge.label}</span>
                      </div>
                    ))}
                  </div>
               </div>

               <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">İSİM</label>
                        <input required value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Ad" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#00f3ff] focus:shadow-[0_0_15px_rgba(0,243,255,0.1)] transition-all" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">SOYİSİM</label>
                        <input required value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Soyad" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-[#00f3ff] focus:shadow-[0_0_15px_rgba(0,243,255,0.1)] transition-all" />
                     </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest ml-1">AI MOD SEÇİMİ (DAVRANIŞ)</label>
                    <div className="flex flex-wrap gap-2">
                       {personas.map(p => (
                         <button 
                           key={p.id} type="button" onClick={() => setPreferredPersona(p.id)}
                           className={`px-4 py-2 rounded-xl text-[8px] font-bold uppercase border transition-all flex items-center gap-2 ${preferredPersona === p.id ? 'bg-[#00f3ff] border-[#00f3ff] text-black shadow-[0_0_15px_rgba(0,243,255,0.4)]' : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'}`}
                         >
                            <i className={`fa-solid ${p.icon}`}></i>
                            {p.label}
                         </button>
                       ))}
                    </div>
                  </div>

                  <button type="submit" className="w-full py-5 bg-[#00f3ff] text-black rounded-xl font-bold text-sm uppercase tracking-widest hover:bg-[#00c2cc] transition-all shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)]">PROFİLİ GÜNCELLE</button>
               </form>
            </div>
          )}

          {tab === 'insights' && user && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { label: 'SOHBET HACMİ', value: user.stats.totalMessages, icon: 'fa-comments', color: 'text-[#00f3ff]' },
                    { label: 'LAB ÜRETİMİ', value: user.stats.totalImages, icon: 'fa-palette', color: 'text-[#ff00ff]' },
                    { label: 'AKTİF MODELLER', value: user.stats.totalGpts, icon: 'fa-robot', color: 'text-[#00ff9d]' }
                  ].map(stat => (
                    <div key={stat.label} className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl text-center flex flex-col items-center gap-3 group hover:border-[#00f3ff]/30 transition-all">
                       <i className={`fa-solid ${stat.icon} ${stat.color} text-2xl group-hover:scale-110 transition-transform`}></i>
                       <span className="text-4xl font-bold text-white">{stat.value}</span>
                       <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">{stat.label}</span>
                    </div>
                  ))}
               </div>

               <div className="p-10 bg-[#00f3ff]/5 border border-[#00f3ff]/10 rounded-[3rem] space-y-8">
                  <header className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-[#00f3ff] flex items-center justify-center text-black"><i className="fa-solid fa-brain"></i></div>
                     <div>
                        <h3 className="text-xl font-bold text-white italic">CaganX Seni Tanıyor</h3>
                        <p className="text-[9px] font-bold text-[#00f3ff] uppercase tracking-widest">Kuantum Davranış Sentezi</p>
                     </div>
                  </header>
                  <div className="space-y-6">
                    <p className="text-sm text-gray-400 leading-relaxed font-medium italic">
                      "Analizlerime göre sen {user.stats.totalImages > user.stats.totalMessages ? 'görsel odaklı bir yaratıcısın' : 'stratejik ve veri odaklı bir kullanıcıya benziyorsun'}. 
                      Sıklıkla {preferredPersona} modunu kullanarak benden yanıt alıyorsun. Favori aracın: {user.stats.totalImages > 0 ? 'Vision Lab' : 'Apex Engine'}."
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <span className="text-[8px] font-bold text-gray-500 uppercase block mb-1">Favori Özellik</span>
                          <span className="text-[10px] font-bold text-white uppercase">{user.stats.totalImages > 0 ? 'Vision Lab (Görsel)' : 'Sohbet Derinliği'}</span>
                       </div>
                       <div className={`p-4 bg-white/5 rounded-2xl border border-white/5`}>
                          <span className="text-[8px] font-bold text-gray-500 uppercase block mb-1">Davranış Modu</span>
                          <span className="text-[10px] font-bold text-white uppercase">{preferredPersona}</span>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-bold text-gray-600 uppercase tracking-widest px-1">Aktif İlgi Alanların</label>
                       <div className="flex flex-wrap gap-2">
                          {user.interests.map(interest => (
                            <span key={interest} className="px-4 py-2 bg-[#00f3ff]/10 text-[#00f3ff] rounded-full text-[10px] font-bold uppercase border border-[#00f3ff]/20">{interest}</span>
                          ))}
                       </div>
                    </div>
                  </div>
               </div>
            </div>
          )}

          {tab === 'security' && user && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group hover:border-[#00f3ff]/30 transition-all">
                     <div className="flex items-center gap-4">
                        <i className="fa-solid fa-fingerprint text-3xl text-[#00f3ff]"></i>
                        <div>
                           <h4 className="text-sm font-bold text-white uppercase">2FA Koruması</h4>
                           <p className="text-[9px] text-gray-600 font-bold uppercase">Apex Key ile Giriş</p>
                        </div>
                     </div>
                     <button className="w-12 h-6 bg-white/10 rounded-full relative"><div className="absolute top-1 left-1 w-4 h-4 bg-white/20 rounded-full"></div></button>
                  </div>
                  <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group hover:border-[#00ff9d]/30 transition-all">
                     <div className="flex items-center gap-4">
                        <i className="fa-solid fa-shield-check text-3xl text-[#00ff9d]"></i>
                        <div>
                           <h4 className="text-sm font-bold text-white uppercase">Hesabı Koru</h4>
                           <p className="text-[9px] text-[#00ff9d]/60 font-bold uppercase">Otomatik Şifreleme</p>
                        </div>
                     </div>
                     <button 
                        onClick={() => setIsProtected(!isProtected)}
                        className={`w-12 h-6 rounded-full relative transition-all ${isProtected ? 'bg-[#00ff9d]' : 'bg-white/10'}`}
                     >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${isProtected ? 'right-1' : 'left-1'}`}></div>
                     </button>
                  </div>
               </div>

               <div className="p-10 bg-white/[0.01] border border-white/5 rounded-[3rem] space-y-6">
                  <header className="flex items-center justify-between">
                     <label className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">SİSTEM ERİŞİM GÜNLÜĞÜ</label>
                     <div className="flex items-center gap-2 text-[9px] font-bold text-gray-500">
                        <i className="fa-solid fa-desktop"></i>
                        {user.security.deviceInfo}
                     </div>
                  </header>
                  <div className="space-y-3">
                     {[1, 2, 3].map(i => (
                       <div key={i} className="flex items-center justify-between p-5 bg-black/40 rounded-2xl border border-white/5 group hover:bg-white/[0.02] transition-colors">
                          <div className="flex items-center gap-4">
                             <div className="w-2 h-2 rounded-full bg-[#00ff9d] animate-pulse"></div>
                             <div>
                                <span className="text-[10px] font-bold text-white uppercase">Giriş Başarılı</span>
                                <p className="text-[8px] text-gray-600 font-bold uppercase tracking-tighter">İşlem: Sentezleyici Erişimi</p>
                             </div>
                          </div>
                          <div className="text-right">
                             <span className="text-[9px] font-bold text-gray-500 uppercase">{new Date(user.security.lastLogin - i * 86400000).toLocaleDateString()}</span>
                             <p className="text-[7px] text-gray-700 font-bold">IP: 192.168.*.*</p>
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          )}

          {tab === 'settings' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                     <h4 className="text-sm font-bold text-white uppercase">Görünüm</h4>
                     <div className="flex gap-2">
                        {['dark', 'light', 'neon', 'matrix', 'nebula', 'hex'].map(t => (
                          <button key={t} onClick={() => setTheme(t as any)} className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase border transition-all ${theme === t ? 'bg-[#00f3ff] border-[#00f3ff] text-black' : 'bg-white/5 border-white/5 text-gray-500'}`}>
                             {t}
                          </button>
                        ))}
                     </div>
                  </div>
                  <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                     <h4 className="text-sm font-bold text-white uppercase">Dil</h4>
                     <div className="flex gap-2">
                        {['tr', 'en', 'de'].map(l => (
                          <button key={l} onClick={() => setLanguage(l as any)} className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase border transition-all ${language === l ? 'bg-[#00f3ff] border-[#00f3ff] text-black' : 'bg-white/5 border-white/5 text-gray-500'}`}>
                             {l.toUpperCase()}
                          </button>
                        ))}
                     </div>
                  </div>
               </div>
               <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl space-y-4">
                  <h4 className="text-sm font-bold text-white uppercase">Ses Asistanı</h4>
                  <div className="flex gap-2">
                     {['male', 'female', 'robot'].map(v => (
                       <button key={v} onClick={() => setVoice(v as any)} className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase border transition-all ${voice === v ? 'bg-[#00f3ff] border-[#00f3ff] text-black' : 'bg-white/5 border-white/5 text-gray-500'}`}>
                          {v.toUpperCase()}
                       </button>
                     ))}
                  </div>
               </div>

               <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl flex items-center justify-between group hover:border-[#00f3ff]/30 transition-all">
                  <div className="flex items-center gap-4">
                     <i className="fa-solid fa-volume-high text-3xl text-[#00f3ff]"></i>
                     <div>
                        <h4 className="text-sm font-bold text-white uppercase">Ortam Sesleri</h4>
                        <p className="text-[9px] text-gray-600 font-bold uppercase">Arka Plan Atmosferi</p>
                     </div>
                  </div>
                  <button 
                     type="button"
                     onClick={() => setAmbientSounds(!ambientSounds)}
                     className={`w-12 h-6 rounded-full relative transition-all ${ambientSounds ? 'bg-[#00f3ff]' : 'bg-white/10'}`}
                  >
                     <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${ambientSounds ? 'right-1' : 'left-1'}`}></div>
                  </button>
               </div>

               <button onClick={handleSubmit} className="w-full py-4 bg-[#00f3ff] text-black rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-[#00c2cc] shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all">AYARLARI KAYDET</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountModal;
