
import React from 'react';

interface KeyboardShortcutsModalProps {
  onClose: () => void;
}

const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({ onClose }) => {
  const shortcuts = [
    { key: 'Ctrl + K', label: 'Yeni Sohbet Başlat' },
    { key: 'Ctrl + /', label: 'Kısayolları Göster' },
    { key: 'Ctrl + S', label: 'Arama Çubuğuna Odaklan' },
    { key: 'Ctrl + L', label: 'Sistem Loglarını Aç' },
    { key: 'Ctrl + P', label: 'Profil Ayarlarını Aç' },
    { key: 'Ctrl + G', label: 'GPT Mağazasını Aç' },
    { key: 'Shift + Enter', label: 'Yeni Satır' },
    { key: 'Enter', label: 'Mesajı Gönder' },
    { key: 'Esc', label: 'Modalları Kapat' }
  ];

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-xl">
      <div className="w-full max-w-xl bg-[#0a0a0c] border border-[#00f3ff]/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent"></div>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00f3ff]/10 flex items-center justify-center text-[#00f3ff] text-xl border border-[#00f3ff]/20">
              <i className="fa-solid fa-keyboard"></i>
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Klavye Kısayolları</h2>
              <p className="text-[10px] font-bold text-[#00f3ff]/70 tracking-widest uppercase">Nöral Nexus Hızlı Erişim</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {shortcuts.map((s, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">{s.label}</span>
              <div className="flex gap-1">
                {s.key.split(' + ').map((k, ki) => (
                  <React.Fragment key={ki}>
                    <kbd className="px-2 py-1 bg-black/60 border border-white/10 rounded-lg text-[10px] font-mono text-[#00f3ff] shadow-lg">{k}</kbd>
                    {ki < s.key.split(' + ').length - 1 && <span className="text-gray-600 self-center">+</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
          <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest text-center">
            <i className="fa-solid fa-lightbulb mr-2"></i>
            Kısayollar, nöral nexus üzerindeki verimliliğinizi %40 artırır.
          </p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardShortcutsModal;
