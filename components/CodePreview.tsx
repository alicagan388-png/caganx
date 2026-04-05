import React, { useEffect, useRef, useState } from 'react';
import { ProjectArtifact } from '../types';

interface CodePreviewProps {
  project: ProjectArtifact;
  onClose: () => void;
}

const CodePreview: React.FC<CodePreviewProps> = ({ project, onClose }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!iframeRef.current) return;
    setIsLoading(true);

    const mainFile = project.files.find(f => f.path.endsWith('.html')) || project.files[0];
    
    if (!mainFile) {
      setError("Önizlenecek dosya bulunamadı.");
      setIsLoading(false);
      return;
    }

    // Construct the HTML content with injected CSS/JS if they are separate files
    let content = mainFile.content;

    // Ensure basic HTML structure if it's just a snippet
    if (!content.includes('<html') && !content.includes('<body')) {
      content = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              body { margin: 0; padding: 0; background: #000; color: #fff; font-family: sans-serif; overflow: hidden; }
              canvas { display: block; width: 100vw; height: 100vh; }
            </style>
          </head>
          <body>${content}</body>
        </html>
      `;
    } else if (!content.includes('<style>')) {
      // Inject default styles for games to prevent black screen issues
      const styleInject = `
        <style>
          body { margin: 0; padding: 0; background: #000; overflow: hidden; }
          canvas { display: block; width: 100vw; height: 100vh; }
        </style>
      `;
      content = content.replace('</head>', `${styleInject}</head>`);
      if (!content.includes('</head>')) content = content.replace('<body>', `<head>${styleInject}</head><body>`);
    }

    project.files.forEach(file => {
      if (file.path.endsWith('.css')) {
        content = content.replace(`<link rel="stylesheet" href="${file.path}">`, `<style>${file.content}</style>`);
        content = content.replace(`<link rel="stylesheet" href="./${file.path}">`, `<style>${file.content}</style>`);
      }
      if (file.path.endsWith('.js')) {
        content = content.replace(`<script src="${file.path}"></script>`, `<script>${file.content}</script>`);
        content = content.replace(`<script src="./${file.path}"></script>`, `<script>${file.content}</script>`);
      }
    });

    const doc = iframeRef.current.contentDocument;
    if (doc) {
      doc.open();
      doc.write(content);
      doc.close();
      
      // Small delay to ensure rendering started
      setTimeout(() => setIsLoading(false), 800);
    }
  }, [project]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-2xl animate-in fade-in duration-500">
      <div className="bg-[#0a0a0c] w-full h-full max-w-6xl max-h-[90vh] rounded-[2.5rem] border border-[#00f3ff]/20 shadow-[0_0_50px_rgba(0,243,255,0.1)] flex flex-col overflow-hidden relative">
        
        {/* Holographic Background Elements */}
        <div className="absolute inset-0 tech-grid opacity-5 pointer-events-none"></div>
        <div className="scanline"></div>

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-black/40 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#00f3ff]/10 border border-[#00f3ff]/20 flex items-center justify-center text-[#00f3ff] shadow-[0_0_15px_rgba(0,243,255,0.2)]">
              <i className={`fa-solid ${project.type === 'game' ? 'fa-gamepad' : 'fa-globe'}`}></i>
            </div>
            <div>
              <h3 className="text-white font-black uppercase tracking-tighter text-lg">{project.name}</h3>
              <p className="text-[10px] text-[#00f3ff] font-bold uppercase tracking-[0.3em]">CaganX Neural Engine • Live Preview</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => {
                if (iframeRef.current) {
                   setIsLoading(true);
                   iframeRef.current.src = 'about:blank';
                   setTimeout(() => {
                      const mainFile = project.files.find(f => f.path.endsWith('.html')) || project.files[0];
                      if (mainFile && iframeRef.current?.contentDocument) {
                         let content = mainFile.content;
                         project.files.forEach(file => {
                            if (file.path.endsWith('.css')) {
                                content = content.replace(`<link rel="stylesheet" href="${file.path}">`, `<style>${file.content}</style>`);
                            }
                            if (file.path.endsWith('.js')) {
                                content = content.replace(`<script src="${file.path}"></script>`, `<script>${file.content}</script>`);
                            }
                         });
                         iframeRef.current.contentDocument.open();
                         iframeRef.current.contentDocument.write(content);
                         iframeRef.current.contentDocument.close();
                         setTimeout(() => setIsLoading(false), 500);
                      }
                   }, 100);
                }
             }} className="px-6 py-2.5 bg-white/5 hover:bg-[#00f3ff]/10 rounded-xl text-[10px] font-black text-white transition-all flex items-center gap-2 border border-white/10 hover:border-[#00f3ff]/30 uppercase tracking-widest">
                <i className="fa-solid fa-rotate-right"></i> Yenile
             </button>
             <button onClick={onClose} className="w-12 h-12 rounded-full bg-white/5 hover:bg-red-500/20 hover:text-red-500 text-gray-400 transition-all flex items-center justify-center border border-white/10">
               <i className="fa-solid fa-xmark text-xl"></i>
             </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-black relative">
          {isLoading && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 border-4 border-[#00f3ff]/20 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#00f3ff] rounded-full border-t-transparent animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <i className="fa-solid fa-brain text-2xl text-[#00f3ff] animate-pulse"></i>
                </div>
              </div>
              <p className="text-[10px] font-bold text-[#00f3ff] uppercase tracking-[0.4em] animate-pulse">Nöral Matris Yükleniyor...</p>
            </div>
          )}

          {error ? (
            <div className="absolute inset-0 flex items-center justify-center text-red-500 font-black uppercase tracking-widest">
              <i className="fa-solid fa-triangle-exclamation mr-3"></i> {error}
            </div>
          ) : (
            <iframe 
              ref={iframeRef}
              className="w-full h-full border-none"
              title="Game Preview"
              sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-forms"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CodePreview;
