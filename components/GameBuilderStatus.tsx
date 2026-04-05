import React, { useEffect, useState } from 'react';
import { AgentTask } from '../types';

interface GameBuilderStatusProps {
  tasks: AgentTask[];
}

const GameBuilderStatus: React.FC<GameBuilderStatusProps> = ({ tasks }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Calculate progress based on tasks
    const total = 4; // Planner, Generator, Reviewer, Tester
    const completed = tasks.filter(t => t.status === 'completed').length;
    const working = tasks.filter(t => t.status === 'working').length;
    
    // Base progress on completed tasks (25% each)
    let currentProgress = (completed / total) * 100;
    
    // Add a little bit for working task
    if (working > 0) {
      currentProgress += 10;
    }
    
    setProgress(Math.min(currentProgress, 100));
  }, [tasks]);

  const getStepIcon = (agent: string) => {
    switch (agent) {
      case 'planner': return 'fa-compass-drafting';
      case 'generator': return 'fa-code';
      case 'reviewer': return 'fa-bug-slash';
      case 'tester': return 'fa-gamepad';
      default: return 'fa-robot';
    }
  };

  const getStepLabel = (agent: string) => {
    switch (agent) {
      case 'planner': return 'OYUN TASARIMI';
      case 'generator': return 'KODLAMA';
      case 'reviewer': return 'DEBUGGING';
      case 'tester': return 'DERLEME';
      default: return agent.toUpperCase();
    }
  };

  return (
    <div className="mt-6 mb-6 relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-cyan-600 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
      <div className="relative bg-[#0c0c0e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="bg-black/40 px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-500/10 animate-pulse">
              <i className="fa-solid fa-layer-group text-lg"></i>
            </div>
            <div>
              <h4 className="text-base font-black text-white tracking-widest italic">CAGANX GAME ENGINE</h4>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">CANLI GELİŞTİRME MODU</p>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-white font-mono">{Math.round(progress)}%</div>
            <div className="text-[9px] text-gray-500 uppercase tracking-widest font-bold">TAMAMLANDI</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 w-full bg-white/5">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500 ease-out shadow-[0_0_10px_rgba(16,185,129,0.5)]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        
        {/* Steps Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task, idx) => (
            <div key={task.id || idx} className={`relative overflow-hidden rounded-xl border transition-all duration-300 ${
              task.status === 'working' ? 'bg-emerald-500/10 border-emerald-500/30 shadow-lg shadow-emerald-500/10 scale-[1.02]' :
              task.status === 'completed' ? 'bg-white/5 border-emerald-500/20 opacity-70' :
              task.status === 'failed' ? 'bg-rose-500/10 border-rose-500/30' :
              'bg-white/[0.02] border-white/5 opacity-50'
            }`}>
              {task.status === 'working' && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-shimmer"></div>
              )}
              
              <div className="p-4 flex items-start gap-4 relative z-10">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shadow-inner transition-colors ${
                  task.status === 'working' ? 'bg-emerald-500 text-black' :
                  task.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                  task.status === 'failed' ? 'bg-rose-500/20 text-rose-400' :
                  'bg-white/5 text-gray-500'
                }`}>
                  <i className={`fa-solid ${getStepIcon(task.agent)} ${task.status === 'working' ? 'animate-spin-slow' : ''}`}></i>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${
                      task.status === 'working' ? 'text-emerald-400' : 'text-gray-400'
                    }`}>
                      {getStepLabel(task.agent)}
                    </span>
                    {task.status === 'working' && (
                      <span className="flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    )}
                  </div>
                  <p className={`text-xs font-medium leading-relaxed ${
                    task.status === 'working' ? 'text-white' : 'text-gray-500'
                  }`}>
                    {task.message || 'Bekleniyor...'}
                  </p>
                  
                  {/* Console-like output for working task */}
                  {task.status === 'working' && (
                    <div className="mt-3 p-2 bg-black/50 rounded-lg border border-white/5 font-mono text-[9px] text-emerald-500/80 overflow-hidden">
                      <div className="animate-pulse">
                        &gt; {task.agent === 'generator' ? 'Compiling assets...' : 'Analyzing requirements...'}
                        <br />
                        &gt; _
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Status */}
        <div className="px-6 py-3 bg-black/40 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-gray-500 uppercase tracking-widest">
          <span>v4.2.0-DEV BUILD</span>
          <span className="flex items-center gap-2">
            <i className="fa-solid fa-server"></i>
            LOCAL SERVER: CONNECTED
          </span>
        </div>
      </div>
    </div>
  );
};

export default GameBuilderStatus;
