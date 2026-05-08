import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ShoppingBag, Timer, Zap, ArrowRight, Tag, Star, Gift, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import SpotlightCard from '../Components/ui/SpotlightCard';
import Magnetic from '../Components/ui/Magnetic';
import api from '../api/axios';
import { toast } from 'react-toastify';

const Deals = () => {
  const containerRef = useRef(null);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ h: 24, m: 0, s: 0 });

  // Countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { h, m, s } = prev;
        if (s > 0) s--;
        else {
          if (m > 0) { m--; s = 59; }
          else {
            if (h > 0) { h--; m = 59; s = 59; }
            else clearInterval(timer);
          }
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const res = await api.get('/product/all');
        const discounted = res.data.products?.filter(p => p.discount > 0) || [];
        setDeals(discounted.slice(0, 8));
      } catch (err) {
        console.error("Deals fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  useGSAP(() => {
    if (loading) return;

    const tl = gsap.timeline();

    tl.fromTo('.deals-title', 
      { y: 50, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
    )
    .fromTo('.timer-box', 
      { scale: 0.8, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }, 
      '-=0.5'
    )
    .fromTo('.deal-card', 
      { y: 100, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, 
      '-=0.4'
    );
  }, { scope: containerRef, dependencies: [loading] });

  const handleAddToCart = async (product) => {
    try {
      await api.post('/cart/add', { item: { productId: product._id, quantity: 1 } });
      window.dispatchEvent(new Event('cartUpdate'));
      toast.success('Added to Cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 pt-32 pb-24 text-slate-900 overflow-hidden relative">
      {/* Background Glows - Adjusted for Light Theme */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-400/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-400/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="w-[95%] max-w-7xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/10 border border-blue-600/20 text-blue-700 text-sm font-bold mb-6 deals-title">
            <Zap size={14} fill="currentColor" />
            <span>FLASH DEALS ENDING SOON</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 deals-title">
            Exclusive <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">Offers</span>
          </h1>

          {/* Countdown Timer */}
          <div className="flex justify-center gap-4 timer-box">
            {[
              { label: 'HOURS', value: timeLeft.h },
              { label: 'MINS', value: timeLeft.m },
              { label: 'SECS', value: timeLeft.s }
            ].map((unit, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-white/70 backdrop-blur-xl border border-white rounded-3xl flex items-center justify-center mb-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <span className="text-3xl md:text-4xl font-black tabular-nums text-slate-900">
                    {unit.value.toString().padStart(2, '0')}
                  </span>
                </div>
                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">{unit.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {deals.map((deal) => (
            <SpotlightCard 
              key={deal._id} 
              className="deal-card group bg-white border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500"
              spotlightColor="rgba(59, 130, 246, 0.08)"
            >
              <div className="p-4">
                {/* Image Container */}
                <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-slate-100">
                  <img 
                    src={deal.images?.[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070'} 
                    alt={deal.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Discount Badge */}
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg">
                    -{deal.discount}% OFF
                  </div>
                  {/* Quick Action */}
                  <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Magnetic>
                      <button 
                        onClick={() => handleAddToCart(deal)}
                        className="bg-white text-slate-900 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer border border-slate-100"
                      >
                        <ShoppingBag size={20} strokeWidth={2.5} />
                      </button>
                    </Magnetic>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold text-lg text-slate-900 truncate flex-1">{deal.name}</h3>
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star size={14} fill="currentColor" />
                      <span className="text-xs font-bold text-slate-900">4.8</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-500 text-sm line-clamp-1">{deal.description}</p>
                  
                  <div className="flex items-center gap-3 pt-2">
                    <span className="text-2xl font-black text-slate-900">
                      ${(deal.price - (deal.price * deal.discount / 100)).toFixed(2)}
                    </span>
                    <span className="text-sm font-bold text-slate-400 line-through">
                      ${deal.price}
                    </span>
                  </div>

                  <Link 
                    to={`/product/${deal._id}`}
                    className="flex items-center justify-between w-full mt-4 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-all text-sm font-bold group/btn text-slate-900"
                  >
                    View Details
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>

        {/* Promo Banner */}
        <div className="mt-20 deal-card">
           <SpotlightCard 
              spotlightColor="rgba(59, 130, 246, 0.1)" 
              className="p-8 md:p-12 relative overflow-hidden bg-white border-slate-100 shadow-xl"
            >
              <div className="absolute top-0 right-0 p-8 text-blue-600/5">
                <Gift size={160} strokeWidth={1} />
              </div>
              
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Unlock Premium Perks</h2>
                <p className="text-slate-500 font-medium mb-8 text-lg">Join our loyalty program and get early access to limited edition drops and exclusive member-only discounts.</p>
                
                <div className="flex flex-wrap gap-4">
                  <Magnetic>
                    <button className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xl shadow-slate-900/10">
                      Join Rewards <Sparkles size={18} />
                    </button>
                  </Magnetic>
                  <button className="bg-white hover:bg-slate-50 text-slate-900 px-8 py-4 rounded-2xl font-bold transition-all border border-slate-200 cursor-pointer shadow-sm">
                    Learn More
                  </button>
                </div>
              </div>
           </SpotlightCard>
        </div>
      </div>
    </div>
  );
};

export default Deals;
