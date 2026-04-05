import React, { useState } from 'react';
import { ProjectArtifact } from '../types';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import CodePreview from './CodePreview';

interface ProjectViewProps {
  project: ProjectArtifact;
}

const ProjectView: React.FC<ProjectViewProps> = ({ project }) => {
  const [showPreview, setShowPreview] = useState(false);

  const handleDownload = async () => {
    const zip = new JSZip();
    
    project.files.forEach(file => {
      zip.file(file.path, file.content);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `${project.name.replace(/\s+/g, '_').toLowerCase()}.zip`);
  };

  const isPlayable = project.type === 'game' || project.type === 'website' || project.files.some(f => f.path.endsWith('.html'));
  const isMusic = project.type === 'music' && project.audioUrl;
  const [showFiles, setShowFiles] = useState(false);

  return (
    <>
      <div className="mt-4 w-full bg-[#0c0c0e] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl transition-all hover:border-[#00f3ff]/30 group/project">
        {/* Header / Main Action Area */}
        {!isMusic && isPlayable ? (
          <div className="relative h-48 w-full bg-gradient-to-br from-indigo-900/40 to-black overflow-hidden flex flex-col items-center justify-center gap-4 p-6">
            <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/coding/800/400')] opacity-10 grayscale group-hover/project:scale-110 transition-transform duration-1000"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent"></div>
            
            <div className={`w-16 h-16 rounded-2xl ${project.type === 'game' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'} flex items-center justify-center text-3xl shadow-2xl relative z-10 animate-bounce`}>
              <i className={`fa-solid ${project.type === 'game' ? 'fa-gamepad' : 'fa-globe'}`}></i>
            </div>
            
            <div className="text-center relative z-10">
              <h4 className="text-lg font-black text-white uppercase tracking-tighter">{project.name}</h4>
              <p className="text-[10px] text-[#00f3ff] font-bold uppercase tracking-[0.3em]">{project.type === 'game' ? 'Nöral Oyun Motoru' : 'Nöral Web Mimarisi'}</p>
            </div>

            <button 
              onClick={() => setShowPreview(true)}
              className={`relative z-10 px-10 py-4 ${project.type === 'game' ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/50' : 'bg-blue-600/20 text-blue-400 border-blue-500/50'} text-sm font-black rounded-2xl transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(0,243,255,0.2)] active:scale-95 border holo-btn uppercase tracking-[0.2em] group/play`}
            >
              <i className="fa-solid fa-play group-hover/play:scale-125 transition-transform"></i> {project.type === 'game' ? 'HEMEN OYNA' : 'SİTEYİ AÇ'}
              <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover/play:opacity-100 transition-opacity"></div>
            </button>
          </div>
        ) : !isMusic && (
          <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl">
                <i className="fa-solid fa-box-archive"></i>
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{project.name}</h4>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">{project.files.length} DOSYA • {project.type.toUpperCase()}</p>
              </div>
            </div>
            <button 
              onClick={handleDownload}
              className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              <i className="fa-solid fa-download"></i> İNDİR
            </button>
          </div>
        )}
        
        {isMusic ? (
          <div className="p-8 flex flex-col gap-6 bg-gradient-to-br from-emerald-500/10 to-transparent border-t border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-emerald-600 flex items-center justify-center text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] animate-pulse">
                <i className="fa-solid fa-waveform-lines text-2xl"></i>
              </div>
              <div>
                <h4 className="text-base font-black text-white uppercase tracking-tighter">CaganX Neural Audio</h4>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Ultra Hi-Fi Lossless • v5.0</p>
              </div>
            </div>

            <audio 
              controls 
              src={project.audioUrl} 
              className="w-full h-10 accent-emerald-500" 
              onPlay={(e) => {
                const btn = e.currentTarget.parentElement?.querySelector('.listen-btn') as HTMLButtonElement;
                if (btn) {
                  btn.innerHTML = '<i class="fa-solid fa-pause mr-2 text-lg"></i> DURDUR';
                  btn.classList.add('bg-rose-600', 'shadow-rose-600/40');
                  btn.classList.remove('bg-emerald-600', 'shadow-emerald-600/40');
                }
              }}
              onPause={(e) => {
                const btn = e.currentTarget.parentElement?.querySelector('.listen-btn') as HTMLButtonElement;
                if (btn) {
                  btn.innerHTML = '<i class="fa-solid fa-play mr-2 text-lg"></i> DİNLE';
                  btn.classList.remove('bg-rose-600', 'shadow-rose-600/40');
                  btn.classList.add('bg-emerald-600', 'shadow-emerald-600/40');
                }
              }}
            />

            <button 
              onClick={(e) => {
                const audio = e.currentTarget.parentElement?.querySelector('audio');
                if (audio) {
                  if (audio.paused) {
                    audio.play();
                  } else {
                    audio.pause();
                  }
                }
              }}
              className="listen-btn w-full py-6 bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-black rounded-2xl transition-all flex items-center justify-center gap-3 shadow-2xl shadow-emerald-600/50 active:scale-95 border border-white/20"
            >
              <i className="fa-solid fa-play mr-2 text-xl"></i> DİNLE
            </button>

            <p className="text-[10px] text-emerald-400/50 font-bold uppercase tracking-[0.4em] text-center animate-pulse">CaganX Neural Audio Core Processing</p>
          </div>
        ) : (
          <>
            {/* Action Bar for non-music projects */}
            <div className="px-6 py-3 bg-black/40 flex items-center justify-between border-t border-white/5">
               <button 
                 onClick={() => setShowFiles(!showFiles)}
                 className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-2"
               >
                 <i className={`fa-solid ${showFiles ? 'fa-chevron-up' : 'fa-code'}`}></i>
                 {showFiles ? 'Kodları Gizle' : 'Kodları İncele'}
               </button>
               {isPlayable && (
                 <button onClick={handleDownload} className="text-[10px] font-bold text-gray-500 hover:text-indigo-400 transition-colors uppercase tracking-widest flex items-center gap-2">
                   <i className="fa-solid fa-download"></i> ZIP İNDİR
                 </button>
               )}
            </div>

            {showFiles && (
              <div className="max-h-60 overflow-y-auto custom-scrollbar p-2 bg-black/60 border-t border-white/5">
                {project.files.map((file, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 hover:bg-white/5 rounded-lg transition-colors group cursor-default">
                    <i className="fa-regular fa-file-code text-gray-500 group-hover:text-indigo-400 transition-colors text-sm"></i>
                    <span className="text-xs text-gray-300 font-mono">{file.path}</span>
                    <span className="ml-auto text-[9px] text-gray-600 uppercase">{file.language}</span>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {showPreview && (
        <CodePreview project={project} onClose={() => setShowPreview(false)} />
      )}
    </>
  );
};

export default ProjectView;
