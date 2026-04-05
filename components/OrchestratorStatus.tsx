import React from 'react';

interface OrchestratorStatusProps {
  steps: { id: string; label: string; status: 'pending' | 'active' | 'completed' }[];
}

const OrchestratorStatus: React.FC<OrchestratorStatusProps> = ({ steps }) => {
  return (
    <div className="mb-6 relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative bg-[#0c0c0e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-black/40 px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-lg shadow-indigo-500/10 animate-pulse">
              <i className="fa-solid fa-brain text-lg"></i>
            </div>
            <div>
              <h4 className="text-base font-black text-white tracking-widest italic">CAGANX ORCHESTRATOR</h4>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">MERKEZ BEYİN AKTİF</p>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Visualization */}
        <div className="p-6 space-y-4">
          {steps.map((step, idx) => (
            <div key={step.id} className={`flex items-center gap-4 transition-all duration-500 ${
              step.status === 'active' ? 'opacity-100 translate-x-2' : 
              step.status === 'completed' ? 'opacity-60' : 'opacity-30'
            }`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                step.status === 'active' ? 'border-indigo-500 bg-indigo-500/20 text-indigo-400 animate-pulse scale-110' :
                step.status === 'completed' ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400' :
                'border-gray-700 bg-transparent text-gray-700'
              }`}>
                {step.status === 'completed' ? <i className="fa-solid fa-check text-xs"></i> : <span className="text-xs font-bold">{idx + 1}</span>}
              </div>
              
              <div className={`flex-1 p-3 rounded-xl border transition-all ${
                step.status === 'active' ? 'bg-indigo-500/10 border-indigo-500/30 text-white shadow-lg shadow-indigo-500/10' :
                step.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/20 text-gray-300' :
                'bg-white/5 border-white/5 text-gray-600'
              }`}>
                <p className="text-xs font-bold uppercase tracking-wide">{step.label}</p>
                {step.status === 'active' && (
                  <div className="mt-2 h-1 w-full bg-indigo-500/20 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 animate-progress-indeterminate"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrchestratorStatus;
