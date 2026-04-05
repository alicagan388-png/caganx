
import React, { useState } from 'react';
import { AIModel } from '../types';
import { ALL_MODELS, WORLD_MODELS, CAGANX_MODELS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';

interface ModelSelectorModalProps {
  selectedModel: AIModel;
  onSelect: (model: AIModel) => void;
  onClose: () => void;
}

const ModelSelectorModal: React.FC<ModelSelectorModalProps> = ({ selectedModel, onSelect, onClose }) => {
  const [tab, setTab] = useState<'world' | 'caganx'>('world');
  const [hoveredModel, setHoveredModel] = useState<AIModel | null>(null);

  const currentModels = tab === 'world' ? WORLD_MODELS : CAGANX_MODELS;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-5xl bg-[#0a0a0c] border border-[#00f3ff]/20 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-8 border-b border-[#00f3ff]/10 bg-gradient-to-r from-[#00f3ff]/5 to-transparent flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00f3ff]/10 flex items-center justify-center text-[#00f3ff] text-xl border border-[#00f3ff]/20">
              <i className="fa-solid fa-microchip"></i>
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tighter uppercase">Nöral Model Seçimi</h2>
              <p className="text-[10px] font-bold tracking-widest uppercase chromatic-name">CaganX Neural Nexus v5.0 Core</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-8 pt-6 gap-4">
          <button 
            onClick={() => setTab('world')}
            className={`px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${tab === 'world' ? 'bg-[#00f3ff] text-black shadow-[0_0_20px_rgba(0,243,255,0.3)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            Dünya Modelleri
          </button>
          <button 
            onClick={() => setTab('caganx')}
            className={`px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${tab === 'caganx' ? 'bg-[#00f3ff] text-black shadow-[0_0_20px_rgba(0,243,255,0.3)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            CaganX Özel
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 custom-scrollbar">
          {currentModels.map((model) => (
            <motion.div
              key={model.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setHoveredModel(model.id)}
              onMouseLeave={() => setHoveredModel(null)}
              onClick={() => {
                onSelect(model.id);
                onClose();
              }}
              className={`relative p-6 rounded-[2rem] border transition-all cursor-pointer group ${
                selectedModel === model.id 
                  ? 'bg-[#00f3ff]/10 border-[#00f3ff] shadow-[0_0_30px_rgba(0,243,255,0.15)]' 
                  : 'bg-white/5 border-white/10 hover:border-[#00f3ff]/50 hover:bg-white/[0.07]'
              }`}
            >
              {model.badge && (
                <div className="absolute top-4 right-4 px-2 py-1 rounded-md bg-[#00f3ff]/20 text-[8px] font-black text-[#00f3ff] uppercase tracking-tighter border border-[#00f3ff]/30">
                  {model.badge}
                </div>
              )}
              
              <div className={`w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center text-2xl mb-4 border border-white/10 ${model.color}`}>
                <i className={`fa-solid ${model.icon}`}></i>
              </div>

              <h3 className="text-lg font-black text-white mb-1 uppercase tracking-tight">{model.name}</h3>
              <p className="text-[10px] font-bold text-gray-500 uppercase mb-3">{model.provider}</p>
              
              <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem]">
                {model.description}
              </p>

              <div className="flex flex-wrap gap-1.5">
                {model.features.map((f, i) => (
                  <span key={i} className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-bold text-gray-400 border border-white/10 uppercase">
                    {f}
                  </span>
                ))}
              </div>

              {selectedModel === model.id && (
                <div className="absolute bottom-4 right-4 text-[#00f3ff]">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Footer Info */}
        <div className="p-6 bg-black/40 border-t border-white/5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] chromatic-name">
            CaganX Neural Nexus v5.0 • Tüm modeller en güncel API versiyonları ile çalışmaktadır
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ModelSelectorModal;
