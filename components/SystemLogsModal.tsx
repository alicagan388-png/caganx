
import React from 'react';

interface SystemLogsModalProps {
  logs: {id: string, text: string, type: string, time: number}[];
  onClose: () => void;
}

const SystemLogsModal: React.FC<SystemLogsModalProps> = ({ logs, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 backdrop-blur-xl">
      <div className="w-full max-w-3xl bg-[#0a0a0c] border border-[#00f3ff]/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden flex flex-col h-[80vh]">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00f3ff] to-transparent"></div>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00f3ff]/10 flex items-center justify-center text-[#00f3ff] text-xl border border-[#00f3ff]/20">
              <i className="fa-solid fa-terminal"></i>
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Sistem Logları</h2>
              <p className="text-[10px] font-bold text-[#00f3ff]/70 tracking-widest uppercase">Nöral Nexus Operasyon Geçmişi</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[10px] custom-scrollbar pr-2">
          {logs.map(log => (
            <div key={log.id} className="flex gap-4 p-2 rounded-lg bg-white/[0.02] border border-white/5 group hover:bg-white/[0.04] transition-colors">
              <span className="text-gray-600">[{new Date(log.time).toLocaleTimeString()}]</span>
              <span className={`font-bold uppercase ${
                log.type === 'error' ? 'text-rose-500' : 
                log.type === 'warn' ? 'text-yellow-500' : 
                log.type === 'success' ? 'text-emerald-500' : 'text-[#00f3ff]'
              }`}>
                {log.type}
              </span>
              <span className="text-gray-300 flex-1">{log.text}</span>
              <span className="text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity">0x{log.id.substring(0, 8)}</span>
            </div>
          ))}
          {logs.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-4">
              <i className="fa-solid fa-ghost text-4xl opacity-20"></i>
              <p className="uppercase tracking-widest font-bold">Henüz bir log kaydı bulunmuyor.</p>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-[8px] font-bold text-gray-500 uppercase">Sistem: Stabil</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#00f3ff] animate-pulse"></div>
              <span className="text-[8px] font-bold text-gray-500 uppercase">Sync: Aktif</span>
            </div>
          </div>
          <button className="px-6 py-2 bg-white/5 text-gray-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">
            Logları Dışa Aktar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemLogsModal;
