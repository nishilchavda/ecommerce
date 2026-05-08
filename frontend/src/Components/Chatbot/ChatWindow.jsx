import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Sparkles, MoreVertical, Trash2 } from 'lucide-react';
import gsap from 'gsap';
import ShinyText from './ShinyText';
import ChatToggle from './ChatToggle';

const ChatWindow = ({ isOpen, mode, setMode }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hey there! How can I help you today?", sender: 'bot', time: '10:00 AM' }
  ]);
  const [input, setInput] = useState('');
  const windowRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.fromTo(windowRef.current,
        { opacity: 0, y: 30, scale: 0.95, pointerEvents: 'none' },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out", pointerEvents: 'all' }
      );
    } else {
      gsap.to(windowRef.current,
        { opacity: 0, y: 30, scale: 0.95, duration: 0.4, ease: "power3.in", pointerEvents: 'none' }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([...messages, newMessage]);
    setInput('');

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        text: mode === 'ai' ? "I'm processing your request with AI..." : "I'm looking into that for you!",
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  return (
    <div
      ref={windowRef}
      className={`fixed bottom-24 right-6 w-[350px] sm:w-[400px] h-[500px] bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-50 flex flex-col pointer-events-none opacity-0 transition-all duration-700 ${
        mode === 'ai' ? 'shadow-[0_0_30px_rgba(99,102,241,0.2)]' : ''
      }`}
    >
      {/* Decorative background glow for AI mode */}
      {mode === 'ai' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[80px] animate-pulse" />
          <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-600/10 blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-slate-700/50 flex items-center justify-between bg-slate-800/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-600/20 flex items-center justify-center border border-indigo-500/30">
            {mode === 'ai' ? <Sparkles className="text-indigo-400" size={20} /> : <Bot className="text-indigo-400" size={20} />}
          </div>
          <div>
            <ShinyText text={mode === 'ai' ? "AI Assistant" : "Support Bot"} className="font-semibold text-sm" />
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-medium">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full transition-colors">
            <Trash2 size={16} onClick={() => setMessages([])} />
          </button>
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-full transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="p-3 bg-slate-800/10 border-b border-slate-700/30">
        <ChatToggle mode={mode} setMode={setMode} />
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-[0_5px_15px_rgba(79,70,229,0.3)]'
                  : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
              }`}
            >
              <p>{msg.text}</p>
              <span className={`text-[10px] mt-1 block ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-500'}`}>
                {msg.time}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-700/50 bg-slate-800/30 flex gap-2 items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-slate-700/50 border border-slate-600/50 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95 shadow-lg shadow-indigo-600/30"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;
