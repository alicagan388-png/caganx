
import React from 'react';

interface WelcomeScreenProps {
  onQuickPrompt: (text: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onQuickPrompt }) => {
  const workflows = [
    { title: "Oyun Yap", cmd: "Bana eğlenceli bir HTML5 oyunu yap. Kodları verme, doğrudan oynamamı sağla.", icon: "fa-gamepad", color: "text-emerald-400" },
    { title: "Site Yap", cmd: "Modern ve animasyonlu bir portfolyo web sitesi tasarla. Kodları verme, önizlemeyi göster.", icon: "fa-globe", color: "text-blue-400" },
    { title: "Müzik Yap", cmd: "30 saniyelik epik bir siberpunk müzik yap", icon: "fa-music", color: "text-purple-400" },
    { title: "Video Yap", cmd: "Geleceğin İstanbulunu gösteren sinematik bir video üret", icon: "fa-video", color: "text-rose-400" },
    { title: "Görsel Düzenle", cmd: "Bu görseli fütüristik bir sanat eserine dönüştür", icon: "fa-wand-magic-sparkles", color: "text-amber-400" },
    { title: "Nöral Eğitim", cmd: "Bana yeni bir yazılım mimarisi öğret", icon: "fa-brain", color: "text-indigo-400" }
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-center px-6 max-w-6xl mx-auto">
      <div className="relative mb-12">
        <div className="absolute -inset-10 bg-indigo-600/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative w-28 h-28 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-center shadow-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00f3ff]/20 to-transparent h-1/2 w-full animate-scan"></div>
          <i className="fa-solid fa-brain text-4xl text-indigo-400 animate-pulse relative z-10"></i>
        </div>
      </div>

      <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-none flex flex-col items-center">
        <span className="text-white">CAGANX</span>
        <span className="chromatic-name uppercase text-4xl md:text-5xl mt-2">Neural Nexus v5.0</span>
      </h1>
      
      <p className="text-gray-500 mb-16 max-w-2xl text-xl font-medium leading-relaxed">
        Gelişmiş Yazılım Mimarisi ve Nöral Kod Üretim Sistemi.
        Sınırları zorlayan, üretim odaklı yapay zeka deneyimi.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {workflows.map((wf, idx) => (
          <button 
            key={idx} 
            onClick={() => onQuickPrompt(wf.cmd)}
            className="holo-card rounded-[2rem] p-8 text-left hover:border-[#00f3ff]/30 transition-all group flex flex-col items-start"
          >
            <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl ${wf.color} mb-6 group-hover:scale-110 transition-transform`}>
              <i className={`fa-solid ${wf.icon}`}></i>
            </div>
            <h3 className="text-lg font-black text-white mb-2 uppercase tracking-tighter">{wf.title}</h3>
            <p className="text-xs text-gray-600 leading-relaxed italic line-clamp-2">"{wf.cmd}"</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;
