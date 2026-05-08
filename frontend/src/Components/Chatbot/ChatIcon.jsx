import React, { useEffect, useRef } from 'react';
import { MessageCircle, X } from 'lucide-react';
import gsap from 'gsap';

const ChatIcon = ({ isOpen, toggleChat }) => {
  const iconRef = useRef(null);

  useEffect(() => {
    // Initial entrance animation
    gsap.fromTo(iconRef.current, 
      { scale: 0, opacity: 0, y: 50 },
      { scale: 1, opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)", delay: 1 }
    );

    // Hover animation setup
    const icon = iconRef.current;
    const hoverTl = gsap.to(icon, { 
      scale: 1.1, 
      duration: 0.3, 
      paused: true, 
      ease: "power2.out",
      boxShadow: "0 0 25px rgba(99, 102, 241, 0.6)"
    });

    icon.addEventListener('mouseenter', () => hoverTl.play());
    icon.addEventListener('mouseleave', () => hoverTl.reverse());

    return () => {
      icon.removeEventListener('mouseenter', () => hoverTl.play());
      icon.removeEventListener('mouseleave', () => hoverTl.reverse());
    };
  }, []);

  return (
    <button
      ref={iconRef}
      onClick={toggleChat}
      className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer z-50 shadow-2xl transition-colors duration-300 ${
        isOpen ? 'bg-slate-800' : 'bg-indigo-600'
      } text-white group`}
      aria-label="Toggle Chatbot"
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <div className={`absolute transition-all duration-500 transform ${isOpen ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}>
          <MessageCircle size={28} />
        </div>
        <div className={`absolute transition-all duration-500 transform ${isOpen ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'}`}>
          <X size={28} />
        </div>
      </div>
      
      {/* Pulse effect when closed */}
      {isOpen && (
        <span className="absolute inset-0 rounded-full bg-indigo-600 animate-ping opacity-20 group-hover:opacity-40"></span>
      )}
    </button>
  );
};

export default ChatIcon;
