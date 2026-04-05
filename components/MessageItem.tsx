
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Message, Feedback } from '../types';
import AgentStatus from './AgentStatus';
import GameBuilderStatus from './GameBuilderStatus';
import OrchestratorStatus from './OrchestratorStatus';
import ProjectView from './ProjectView';

interface MessageItemProps {
  message: Message;
  onSuggestionClick: (suggestion: string) => void;
  onSaveToLibrary: () => void;
  onRefine?: (type: string) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onSuggestionClick, onSaveToLibrary, onRefine }) => {
  const isUser = message.role === 'user';
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | undefined>(message.feedback);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [message.id]);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(message.text);
      utterance.lang = 'tr-TR';
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    const newFeedback: Feedback = { type, timestamp: Date.now() };
    setFeedback(newFeedback);
    if (type === 'negative') {
       console.log("AI Learning from negative feedback...");
    }
  };

  const isGameBuilder = message.text.includes("CaganX Game Studio") || message.text.includes("Oyun motoru başlatılıyor");

  return (
    <div className={`group flex flex-col ${isUser ? 'items-end' : 'items-start'} mb-6 px-4 md:px-0 animate-in slide-in-from-bottom-2 duration-500`}>
      <div className={`flex items-end gap-3 max-w-[90%] md:max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center text-xs shadow-lg ${isUser ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'} border border-white/10`}>
          <i className={`fa-solid ${isUser ? 'fa-user' : 'fa-robot'}`}></i>
        </div>

        {/* Message Bubble */}
        <div className={`relative p-5 rounded-3xl ${isUser ? 'holo-bubble holo-bubble-user text-white rounded-br-none' : 'holo-bubble text-gray-200 rounded-bl-none'} shadow-2xl backdrop-blur-md w-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,243,255,0.1)]`}>
          
          {/* Confidence Score */}
          {!isUser && message.confidenceScore && (
            <div className={`absolute -bottom-2 right-6 px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest shadow-lg z-10 ${
              message.confidenceScore > 90 ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 
              message.confidenceScore > 70 ? 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' : 
              'bg-rose-500/20 border-rose-500/30 text-rose-400'
            }`}>
              Güven: %{message.confidenceScore}
            </div>
          )}

          {/* Image/Video Content */}
          {message.generatedImage && (
            <div className="mb-4 rounded-2xl overflow-hidden border border-white/10 relative group/img">
              {(message.generatedImage.endsWith('.mp4') || message.generatedImage.endsWith('.webm') || message.text.includes("Video") || message.text.includes("RENDER")) ? (
                 <video 
                   src={message.generatedImage} 
                   controls 
                   autoPlay 
                   muted 
                   loop 
                   className="w-full h-auto object-cover" 
                 />
              ) : (
                 <img src={message.generatedImage} alt="Generated" className="w-full h-auto object-cover transition-transform duration-700 group-hover/img:scale-105" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end justify-between p-4 pointer-events-none">
                <div className="flex gap-2 pointer-events-auto">
                  <button onClick={onSaveToLibrary} className="text-white hover:text-indigo-400 transition-colors"><i className="fa-solid fa-bookmark"></i></button>
                  <a href={message.generatedImage} download className="text-white hover:text-emerald-400 transition-colors"><i className="fa-solid fa-download"></i></a>
                </div>
              </div>
            </div>
          )}

          {/* Text Content */}
          <div className="prose prose-invert prose-sm max-w-none break-words leading-relaxed">
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>

          {/* Orchestrator Status */}
          {message.orchestratorSteps && message.orchestratorSteps.length > 0 && (
            <OrchestratorStatus steps={message.orchestratorSteps} />
          )}

          {/* Agent Status */}
          {message.agentProcess && message.agentProcess.length > 0 && (
            isGameBuilder ? (
              <GameBuilderStatus tasks={message.agentProcess} />
            ) : (
              <AgentStatus tasks={message.agentProcess} />
            )
          )}

          {/* Project Artifact */}
          {message.project && (
            <ProjectView project={message.project} />
          )}

          {/* Actions */}
          {!isUser && (
            <div className="mt-3 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-wrap">
              <button onClick={handleSpeak} className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors ${isSpeaking ? 'text-indigo-400 animate-pulse' : 'text-gray-500'}`}>
                <i className={`fa-solid ${isSpeaking ? 'fa-stop' : 'fa-volume-high'}`}></i>
                {isSpeaking ? 'Durdur' : 'Sesli Oku'}
              </button>
              
              <div className="h-3 w-[1px] bg-white/10 hidden md:block"></div>
              
              <button onClick={() => handleFeedback('positive')} className={`text-gray-500 hover:text-emerald-400 transition-colors ${feedback?.type === 'positive' ? 'text-emerald-400' : ''}`}>
                <i className="fa-solid fa-thumbs-up text-xs"></i>
              </button>
              <button onClick={() => handleFeedback('negative')} className={`text-gray-500 hover:text-rose-400 transition-colors ${feedback?.type === 'negative' ? 'text-rose-400' : ''}`}>
                <i className="fa-solid fa-thumbs-down text-xs"></i>
              </button>
              
              <div className="h-3 w-[1px] bg-white/10 hidden md:block"></div>
              
              <button onClick={handleCopy} className={`text-gray-500 hover:text-white transition-colors flex items-center gap-1 ${copied ? 'text-emerald-400' : ''}`} title="Kopyala">
                <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'} text-xs`}></i>
                {copied && <span className="text-[8px] font-bold uppercase">Kopyalandı</span>}
              </button>

              <div className="h-3 w-[1px] bg-white/10 hidden md:block"></div>
              
              <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>

              {['Kısa', 'Profesyonel', 'Basit'].map(type => (
                <button 
                  key={type}
                  onClick={() => onRefine?.(type)}
                  className="ml-2 px-2 py-1 bg-white/5 rounded-md text-[8px] font-black uppercase text-gray-500 hover:text-indigo-400 border border-white/5 hidden md:block"
                >
                  Daha {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sources */}
      {message.sources && (
        <div className="mt-2 ml-12 flex flex-wrap gap-2">
          {message.sources.map((source, idx) => (
            <a key={idx} href={source.uri} target="_blank" rel="noopener noreferrer" className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-[9px] text-gray-400 hover:text-indigo-400 transition-colors flex items-center gap-2">
              <i className="fa-solid fa-link"></i> {source.title}
            </a>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {message.suggestions && (
        <div className="mt-2 ml-12 flex flex-wrap gap-2">
          {message.suggestions.map((s, idx) => (
            <button key={idx} onClick={() => onSuggestionClick(s)} className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-xl text-[10px] font-bold text-indigo-300 hover:text-indigo-200 transition-all">
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageItem;
