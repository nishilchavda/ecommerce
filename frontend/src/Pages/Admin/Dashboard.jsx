import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import api from '../../api/axios';

const Dashboard = () => {
  const containerRef = useRef(null);
  const [stats, setStats] = useState([
    { label: 'Total Revenue', value: '$24,592', icon: <DollarSign />, trend: '+12.5%', isUp: true, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { label: 'Total Orders', value: '456', icon: <ShoppingCart />, trend: '+8.2%', isUp: true, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Total Products', value: '0', icon: <Package />, trend: '0%', isUp: true, color: 'text-violet-400', bg: 'bg-violet-400/10' },
    { label: 'Active Users', value: '1,234', icon: <Users />, trend: '-2.4%', isUp: false, color: 'text-rose-400', bg: 'bg-rose-400/10' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/product/all');
        const productCount = res.data.products?.length || 0;
        setStats(prev => prev.map(s => 
          s.label === 'Total Products' ? { ...s, value: productCount.toString() } : s
        ));
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };
    fetchStats();
  }, []);

  useGSAP(() => {
    gsap.fromTo('.stat-card',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
    );
    gsap.fromTo('.recent-activity',
      { x: -30, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.4 }
    );
    gsap.fromTo('.sales-chart',
      { x: 30, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.6 }
    );
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="relative p-6 md:p-8 rounded-3xl md:rounded-4xl bg-linear-to-br from-blue-600 to-indigo-700 overflow-hidden shadow-2xl shadow-blue-600/20">
         <div className="relative z-10">
            <h1 className="text-2xl md:text-3xl font-black text-white mb-2">Welcome Back, Admin!</h1>
            <p className="text-blue-100 font-medium max-w-md text-sm md:text-base">Here's what's happening with your store today. You have 12 new orders to process.</p>
         </div>
         {/* Decoration */}
         <div className="absolute top-[-50%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
         <div className="absolute bottom-[-50%] left-[-10%] w-64 h-64 bg-blue-400/20 rounded-full blur-2xl"></div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-5 md:p-6 rounded-3xl hover:bg-slate-800/60 transition-all group">
            <div className="flex justify-between items-start mb-4">
               <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110 duration-500`}>
                  {React.cloneElement(stat.icon, { size: 20 })}
               </div>
               <div className={`flex items-center gap-1 text-[10px] md:text-xs font-bold ${stat.isUp ? 'text-emerald-400' : 'text-rose-400'} bg-slate-900/50 px-2 py-1 rounded-full border border-slate-700`}>
                  {stat.isUp ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {stat.trend}
               </div>
            </div>
            <p className="text-slate-400 text-[10px] md:text-sm font-bold uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-xl md:text-2xl font-black text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
         {/* Recent Activity */}
         <div className="recent-activity lg:col-span-1 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl md:rounded-4xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-lg md:text-xl font-bold">Recent Activity</h3>
               <button className="text-blue-400 text-sm font-bold hover:underline cursor-pointer">View All</button>
            </div>
            <div className="space-y-6">
               {[1,2,3,4].map(i => (
                 <div key={i} className="flex gap-4 items-start">
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-700 flex items-center justify-center shrink-0">
                       <Clock size={16} className="text-slate-400" />
                    </div>
                    <div className="min-w-0">
                       <p className="text-sm font-bold text-slate-100 truncate">New order #1234{i}</p>
                       <p className="text-xs text-slate-500 font-medium mt-1">2 minutes ago</p>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         {/* Sales Overview / Chart Placeholder */}
         <div className="sales-chart lg:col-span-2 bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl md:rounded-4xl p-6 md:p-8 flex flex-col justify-center items-center text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-blue-600/10 flex items-center justify-center mb-6">
               <TrendingUp size={32} className="text-blue-500" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2">Sales Analytics</h3>
            <p className="text-slate-500 font-medium max-w-sm text-sm md:text-base">Integrate Chart.js or Recharts here to visualize your store's performance over time.</p>
            <button className="mt-8 px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-full transition-all cursor-pointer text-sm md:text-base">
               Configure Charts
            </button>
         </div>
      </div>

    </div>
  );
};

export default Dashboard;
