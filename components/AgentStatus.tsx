import React from 'react';
import { AgentTask } from '../types';

interface AgentStatusProps {
  tasks: AgentTask[];
}

const AgentStatus: React.FC<AgentStatusProps> = ({ tasks }) => {
  return (
    <div className="mt-4 bg-[#0c0c0e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
      <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 animate-pulse">
          <i className="fa-solid fa-microchip"></i>
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">AI WORKERS</h4>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider">{tasks.length} AJAN ÇALIŞIYOR</p>
        </div>
      </div>
      
      <div className="p-2 space-y-1">
        {tasks.map(task => (
          <div key={task.id} className="flex items-center gap-3 p-3 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl border border-white/5 transition-all group">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs shadow-lg ${
              task.status === 'working' ? 'bg-amber-500/20 text-amber-400 animate-spin-slow' :
              task.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
              task.status === 'failed' ? 'bg-rose-500/20 text-rose-400' :
              'bg-gray-500/20 text-gray-400'
            }`}>
              <i className={`fa-solid ${
                task.agent === 'planner' ? 'fa-magnifying-glass-chart' :
                task.agent === 'generator' ? 'fa-code' :
                task.agent === 'reviewer' ? 'fa-shield-halved' :
                task.agent === 'tester' ? 'fa-vial' : 'fa-robot'
              }`}></i>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-black text-white uppercase tracking-widest">{task.agent}</span>
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  task.status === 'working' ? 'bg-amber-500/10 text-amber-400 animate-pulse' :
                  task.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                  task.status === 'failed' ? 'bg-rose-500/10 text-rose-400' :
                  'bg-gray-500/10 text-gray-500'
                }`}>{task.status}</span>
              </div>
              <p className="text-xs text-gray-400 truncate group-hover:text-gray-300 transition-colors">{task.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentStatus;
