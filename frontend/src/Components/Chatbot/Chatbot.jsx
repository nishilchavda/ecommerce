import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles, Trash2, Cpu } from 'lucide-react';
import gsap from 'gsap';
import api from '../../api/axios';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('bot'); // 'bot' or 'ai'
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: "Welcome! How can I assist you today?", sender: 'bot', time: '10:00 AM' }
  ]);

  const windowRef = useRef(null);
  const iconRef = useRef(null);
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

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: input,
      sender: 'user',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    try {
      const res = await api.post('/bot/chat', { message: currentInput, mode });
      
      const botResponse = {
        id: Date.now() + 1,
        text: res.data.reply,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (err) {
      console.error("Chat error:", err);
      let errorText = "Sorry, I'm having trouble connecting. Please try again later.";
      
      if (err.response?.status === 401) {
        errorText = "Please log in to start chatting with our assistant.";
      }

      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
        sender: 'bot',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <>
      <div
        ref={windowRef}
        className={`fixed bottom-24 right-6 w-[350px] sm:w-[380px] h-[520px] bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden z-50 flex flex-col pointer-events-none opacity-0 transition-all duration-700 ${
          mode === 'ai' ? 'shadow-[0_0_40px_rgba(37,99,235,0.15)]' : ''
        }`}
      >
        {/* AI Background Glow */}
        {mode === 'ai' && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-400/20 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        )}

        {/* Header */}
        <div className="p-5 border-b border-white/40 flex items-center justify-between bg-white/40 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              {mode === 'ai' ? <Sparkles className="text-white" size={20} /> : <Bot className="text-white" size={20} />}
            </div>
            <div>
              <h3 className="font-bold text-transparent text-sm uppercase tracking-tight bg-gradient-to-r from-slate-900 via-blue-600 to-slate-900 bg-clip-text text-transparent bg-[length:200%_100%] animate-pulse">
                {mode === 'ai' ? "AI Concierge" : "Support Center"}
              </h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-black">Active</span>
              </div>
            </div>
          </div>
          <button 
            onClick={() => setMessages([{ id: 1, text: "Chat cleared. How can I help?", sender: 'bot', time: 'Now' }])}
            className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-white/80 rounded-2xl transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="px-4 py-3 bg-white/20 border-b border-white/30 relative z-10">
          <div className="flex items-center justify-center p-1 bg-slate-100/50 rounded-full border border-white/80 backdrop-blur-sm shadow-inner relative h-10">
            <div 
              className="absolute h-8 w-[48%] bg-blue-600 rounded-full transition-all duration-300 ease-out shadow-lg shadow-blue-600/30"
              style={{ left: mode === 'bot' ? '1%' : '51%' }}
            />
            <button
              onClick={() => setMode('bot')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-full z-10 text-[11px] font-black uppercase transition-colors duration-300 ${
                mode === 'bot' ? 'text-white' : 'text-slate-500'
              }`}
            >
              <Bot size={14} /> Bot
            </button>
            <button
              onClick={() => setMode('ai')}
              className={`flex-1 flex items-center justify-center gap-2 rounded-full z-10 text-[11px] font-black uppercase transition-colors duration-300 ${
                mode === 'ai' ? 'text-white' : 'text-slate-500'
              }`}
            >
              <Cpu size={14} /> AI
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 relative z-10">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-none'
                  : 'bg-white text-slate-700 border border-white/60 rounded-tl-none'
              }`}>
                <p className="font-medium">{msg.text}</p>
                <span className={`text-[9px] mt-1.5 block opacity-50 uppercase font-bold`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-5 border-t border-white/40 bg-white/60 flex gap-3 items-center relative z-10">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="How can we help?"
            className="flex-1 bg-white/80 border border-white shadow-inner rounded-2xl px-5 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20 transition-all placeholder:text-slate-400 font-medium"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-11 h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-600/30 active:scale-95"
          >
            <Send size={20} />
          </button>
        </form>
      </div>

      {/* Floating Icon */}
      <button
        ref={iconRef}
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-[1.8rem] flex items-center justify-center cursor-pointer z-50 shadow-[0_10px_30px_rgba(37,99,235,0.3)] transition-all duration-500 hover:scale-110 active:scale-90 ${
          isOpen ? 'bg-slate-900 rotate-90' : 'bg-blue-600'
        } text-white group`}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <div className={`absolute transition-all duration-500 transform ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}>
            <MessageCircle size={30} strokeWidth={2.5} />
          </div>
          <div className={`absolute transition-all duration-500 transform ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 rotate-180'}`}>
            <X size={30} strokeWidth={2.5} />
          </div>
        </div>
        {/* {!isOpen && (
          <span className="absolute inset-0 rounded-3xl bg-blue-600 animate-ping opacity-20 pointer-events-none "></span>
        )} */}
      </button>
    </>
  );
};

export default Chatbot;