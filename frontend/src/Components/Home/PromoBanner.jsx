import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import Magnetic from '../ui/Magnetic';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const PromoBanner = () => {
  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const textRef = useRef(null);

  useGSAP(() => {
    // Parallax effect on the background image
    gsap.to(bgRef.current, {
      yPercent: 30,
      ease: "none",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top bottom", 
        end: "bottom top",
        scrub: true
      }
    });

    // Fade up text on enter
    gsap.fromTo(textRef.current.children,
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative h-[70vh] min-h-[400px] overflow-hidden flex items-center justify-center">
      
      {/* Parallax Background */}
      <div 
        ref={bgRef} 
        className="absolute inset-0 top-[-20%] h-[140%] w-full"
      >
        <img 
          src="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2071&auto=format&fit=crop" 
          alt="Fall Collection" 
          className="w-full h-full object-cover object-center"
        />
        {/* Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-slate-900/50"></div>
      </div>

      {/* Content */}
      <div ref={textRef} className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <span className="inline-block px-4 py-1.5 rounded-full border border-white/30 text-white font-bold text-xs uppercase tracking-widest mb-6 backdrop-blur-sm">
          Limited Time Offer
        </span>
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 leading-tight">
          Mid-Season Clearance.<br/>
          <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">Up to 50% Off.</span>
        </h2>
        <p className="text-lg text-white/80 font-medium mb-10 max-w-xl mx-auto">
          Refresh your wardrobe with premium pieces at unbeatable prices. Exclusively available online.
        </p>
        
        <div className="flex justify-center">
          <Magnetic>
            <Link to="/shop" className="group flex items-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-colors shadow-2xl">
              Shop The Sale <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </Magnetic>
        </div>
      </div>

    </section>
  );
};

export default PromoBanner;
