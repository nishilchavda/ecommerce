import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Mail, ArrowLeft, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Magnetic from '../../Components/ui/Magnetic';

const ForgetPassword = () => {
  const containerRef = useRef(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useGSAP(() => {
    gsap.fromTo('.forget-card',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
    );
  }, { scope: containerRef });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/user/forget-password', { email });
      setSubmitted(true);
      toast.success("Reset link sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-20">
      <div className="forget-card w-full max-w-md bg-white rounded-4xl shadow-2xl shadow-slate-200 border border-slate-100 p-8 md:p-10 relative overflow-hidden">
        
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        
        {!submitted ? (
          <>
            <div className="relative z-10">
              <Link to="/login-signup" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-sm transition-colors mb-8 group">
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Login
              </Link>
              
              <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Forget Password?</h1>
              <p className="text-slate-500 font-medium mb-8">No worries! Enter your email and we'll send you a link to reset your password.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required
                      type="email" 
                      placeholder="name@example.com"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <Magnetic>
                  <button 
                    disabled={loading}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : (
                      <>
                        Send Reset Link <ArrowRight size={20} />
                      </>
                    )}
                  </button>
                </Magnetic>
              </form>
            </div>
          </>
        ) : (
          <div className="text-center py-4 relative z-10">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter">Check Your Email</h2>
            <p className="text-slate-500 font-medium mb-8">We've sent a password reset link to <span className="text-slate-900 font-bold">{email}</span>. Please check your inbox and follow the instructions.</p>
            
            <Link to="/login" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg">
              Return to Login
            </Link>
            
            <p className="mt-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
              Didn't get the email? <button onClick={() => setSubmitted(false)} className="text-blue-600 hover:underline cursor-pointer">Try again</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;
