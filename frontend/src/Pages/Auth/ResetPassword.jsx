import React, { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Lock, ArrowRight, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import Magnetic from '../../Components/ui/Magnetic';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useGSAP(() => {
    gsap.fromTo('.reset-card',
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 1, ease: 'back.out(1.7)', delay: 0.2 }
    );
  }, { scope: containerRef });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      await api.post(`/user/reset-password/${token}`, { newPassword: password });
      setSuccess(true);
      toast.success("Password reset successfully!");
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Link expired or invalid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 flex items-center justify-center p-4 pt-20">
      <div className="reset-card w-full max-w-md bg-white rounded-4xl shadow-2xl shadow-slate-200 border border-slate-100 p-8 md:p-10 relative overflow-hidden">
        
        {/* Background Decoration */}
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        {!success ? (
          <div className="relative z-10">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
              <ShieldCheck size={28} strokeWidth={2.5} />
            </div>
            
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter mb-2">Secure Reset</h1>
            <p className="text-slate-500 font-medium mb-8">Choose a strong password to protect your account and regain access.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    required
                    type="password" 
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                      Reset Password <ArrowRight size={20} />
                    </>
                  )}
                </button>
              </Magnetic>
            </form>
          </div>
        ) : (
          <div className="text-center py-4 relative z-10 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} strokeWidth={2.5} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tighter">Password Updated</h2>
            <p className="text-slate-500 font-medium mb-8">Your security settings have been updated. You'll be redirected to the login page shortly.</p>
            
            <Link to="/login" className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-600 transition-all shadow-lg">
              Login Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
