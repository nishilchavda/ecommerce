import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Magnetic from '../ui/Magnetic';
import { Send, CheckCircle2 } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Newsletter = () => {
  const sectionRef = useRef(null);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      }
    });

    tl.fromTo('.nl-bg',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: "power3.out" }
    )
    .fromTo('.nl-content > *',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power2.out" },
      "-=0.6"
    );
  }, { scope: sectionRef });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 3000);
    }, 1500);
  };

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="w-[95%] max-w-7xl mx-auto relative rounded-[3rem] overflow-hidden bg-slate-900 nl-bg">
        
        {/* Background Decorative Elements */}
        <div className="absolute top-[-50%] left-[-10%] w-[60%] h-[150%] rounded-full bg-blue-600/20 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-50%] right-[-10%] w-[60%] h-[150%] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none"></div>

        <div className="relative z-10 px-6 py-16 md:py-24 text-center nl-content">
          <span className="inline-block text-blue-400 font-bold tracking-widest uppercase text-sm mb-4">
            Join The Club
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter mb-4">
            Get 15% Off Your First Order
          </h2>
          <p className="text-slate-400 font-medium max-w-lg mx-auto mb-10">
            Subscribe to our newsletter to receive exclusive offers, latest news, and style inspiration directly to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto relative flex items-center">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status !== 'idle'}
              placeholder="Enter your email address" 
              className="w-full bg-white/10 border border-white/20 text-white placeholder:text-slate-400 px-6 py-4 rounded-full outline-none focus:border-blue-500 focus:bg-white/15 transition-all font-medium pr-32 disabled:opacity-50"
              required
            />
            <div className="absolute right-2">
              <Magnetic>
                <button 
                  type="submit" 
                  disabled={status !== 'idle'}
                  className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${
                    status === 'success' ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-500'
                  } disabled:opacity-80`}
                >
                  {status === 'loading' ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : status === 'success' ? (
                    <CheckCircle2 size={20} strokeWidth={2.5} />
                  ) : (
                    <Send size={18} strokeWidth={2} className="-translate-x-px translate-y-px" />
                  )}
                </button>
              </Magnetic>
            </div>
          </form>
          
          <p className="text-xs text-slate-500 mt-4">
            By subscribing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
