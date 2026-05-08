import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Truck, ShieldCheck, RefreshCw, Clock } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const TrustBadges = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const badges = gsap.utils.toArray('.trust-badge');
    
    gsap.fromTo(badges,
      { y: 30, scale: 0.9, opacity: 0 },
      {
        y: 0, scale: 1, opacity: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
        duration: 0.6,
        stagger: 0.15,
        ease: "back.out(1.5)"
      }
    );
  }, { scope: sectionRef });

  const badges = [
    { icon: <Truck size={32} strokeWidth={1.5} />, title: "Free Shipping", desc: "On all orders over $100" },
    { icon: <RefreshCw size={32} strokeWidth={1.5} />, title: "Easy Returns", desc: "30-day return policy" },
    { icon: <ShieldCheck size={32} strokeWidth={1.5} />, title: "Secure Checkout", desc: "100% protected payments" },
    { icon: <Clock size={32} strokeWidth={1.5} />, title: "24/7 Support", desc: "Dedicated support team" }
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-white border-t border-b border-slate-100">
      <div className="w-[95%] max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, idx) => (
            <div key={idx} className="trust-badge flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-slate-50 text-slate-900 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                {badge.icon}
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-1">{badge.title}</h4>
              <p className="text-sm font-medium text-slate-500">{badge.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
