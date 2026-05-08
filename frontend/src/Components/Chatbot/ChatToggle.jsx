import React from 'react';
import { Bot, Cpu } from 'lucide-react';

const ChatToggle = ({ mode, setMode }) => {
  return (
    <div className="flex items-center justify-center p-1 bg-slate-800/50 rounded-full border border-slate-700/50 backdrop-blur-sm shadow-inner overflow-hidden relative">
      {/* Animated background pill */}
      <div 
        className="absolute h-8 w-[48%] bg-indigo-600/90 rounded-full transition-all duration-300 ease-out shadow-[0_0_15px_rgba(79,70,229,0.5)]"
        style={{
          left: mode === 'bot' ? '2%' : '50%'
        }}
      />
      
      <button
        onClick={() => setMode('bot')}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full z-10 transition-colors duration-300 ${
          mode === 'bot' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Bot size={16} />
        <span className="text-xs font-medium uppercase tracking-wider">Bot</span>
      </button>
      
      <button
        onClick={() => setMode('ai')}
        className={`flex items-center gap-2 px-4 py-1.5 rounded-full z-10 transition-colors duration-300 ${
          mode === 'ai' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Cpu size={16} />
        <span className="text-xs font-medium uppercase tracking-wider">AI</span>
      </button>
    </div>
  );
};

export default ChatToggle;
