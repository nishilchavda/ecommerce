import React, { useState, useContext, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { ArrowLeft, User, Mail, Lock, Sparkles } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Magnetic from "../../Components/ui/Magnetic";
import SpotlightCard from "../../Components/ui/SpotlightCard";


const LoginSignup = () => {
  const [isActive, setIsActive] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.fromTo(
        ".auth-main-container",
        { y: 30, opacity: 0, scale: 0.98 },
        { y: 0, opacity: 1, scale: 1, duration: 1.2, ease: "expo.out" },
      );
    },
    { scope: containerRef },
  );

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSignupChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await login(loginData.email, loginData.password);
    if (res.success) {
      toast.success("Welcome back!");
      navigate("/");
    } else {
      toast.error(res.message || "Login failed");
    }
    setIsSubmitting(false);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await register(
      signupData.username,
      signupData.email,
      signupData.password,
    );
    if (res.success) {
      toast.success("Account created successfully!");
      navigate("/");
    } else {
      toast.error(res.message || "Registration failed");
    }
    setIsSubmitting(false);
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-50 flex items-center justify-center relative overflow-hidden px-4 py-20 font-['Outfit',sans-serif]"
    >
      {/* Inject Outfit Font */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
                @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap');
                
                .font-outfit { font-family: 'Outfit', sans-serif; }

                @keyframes move {
                    0%, 49.99% { opacity: 0; z-index: 1; }
                    50%, 100% { opacity: 1; z-index: 5; }
                }
            `,
        }}
      />

      {/* Background Decorative Elements - Matching Project Theme */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-blue-100/60 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-indigo-100/60 blur-[140px]"></div>
      </div>

      {/* Auth Main Container */}
      <div className="auth-main-container relative z-10 w-full max-w-6xl min-h-[550px] sm:py-10 py-28">
        <SpotlightCard
          className="bg-white/70 backdrop-blur-3xl border-white/60 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-4xl overflow-hidden w-full h-full"
          spotlightColor="rgba(37, 99, 235, 0.04)"
        >
          <div className="relative w-full min-h-[550px] font-outfit">
            {/* Sign Up Form Container */}
            <div
              className={`absolute top-0 h-full transition-all duration-700 ease-in-out left-0 w-full md:w-1/2 z-1 ${isActive ? "md:translate-x-full opacity-100 z-5 animate-[move_0.7s]" : "opacity-0 pointer-events-none"}`}
            >
              <form
                onSubmit={handleSignupSubmit}
                className="bg-transparent flex flex-col items-center justify-center px-10 md:px-20 h-full text-center py-10"
              >
                <h1 className="text-5xl font-black tracking-tighter mb-3 text-slate-900 leading-none">
                  Create Account
                </h1>
                <p className="text-slate-500 font-medium mb-10 text-sm">
                  Join our exclusive community today.
                </p>

                <div className="w-full space-y-4">
                  <div className="relative group/input">
                    <User
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-600 transition-colors"
                      size={18}
                    />
                    <input
                      className="bg-slate-50 border border-slate-100 pl-14 pr-6 py-4.5 text-sm rounded-2xl w-full outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all font-semibold text-slate-900 placeholder:text-slate-400"
                      type="text"
                      name="username"
                      placeholder="Full Name"
                      value={signupData.username}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                  <div className="relative group/input">
                    <Mail
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-600 transition-colors"
                      size={18}
                    />
                    <input
                      className="bg-slate-50 border border-slate-100 pl-14 pr-6 py-4.5 text-sm rounded-2xl w-full outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all font-semibold text-slate-900 placeholder:text-slate-400"
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={signupData.email}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                  <div className="relative group/input">
                    <Lock
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-600 transition-colors"
                      size={18}
                    />
                    <input
                      className="bg-slate-50 border border-slate-100 pl-14 pr-6 py-4.5 text-sm rounded-2xl w-full outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all font-semibold text-slate-900 placeholder:text-slate-400"
                      type="password"
                      name="password"
                      placeholder="Create Password"
                      value={signupData.password}
                      onChange={handleSignupChange}
                      required
                    />
                  </div>
                </div>

                <Magnetic>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-slate-900 text-white text-base py-4.5 px-14 rounded-2xl font-extrabold mt-10 transition-all hover:bg-blue-600 active:scale-95 disabled:opacity-50 shadow-2xl shadow-blue-600/10 flex items-center gap-2 group/btn"
                  >
                    {isSubmitting ? (
                      "Processing..."
                    ) : (
                      <>
                        SIGN UP{" "}
                        <Sparkles
                          size={18}
                          className="group-hover/btn:rotate-12 transition-transform"
                        />
                      </>
                    )}
                  </button>
                </Magnetic>
              </form>
            </div>

            {/* Sign In Form Container */}
            <div
              className={`absolute top-0 h-full transition-all duration-700 ease-in-out left-0 w-full md:w-1/2 z-2 ${isActive ? "md:translate-x-full opacity-0 pointer-events-none" : "opacity-100"}`}
            >
              <form
                onSubmit={handleLoginSubmit}
                className="bg-transparent flex flex-col items-center justify-center px-10 md:px-20 h-full text-center py-10"
              >
                <h1 className="text-5xl font-black tracking-tighter mb-3 text-slate-900 leading-none">
                  Welcome Back
                </h1>
                <p className="text-slate-500 font-medium mb-10 text-sm">
                  Please enter your credentials.
                </p>

                <div className="w-full space-y-4">
                  <div className="relative group/input">
                    <Mail
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-600 transition-colors"
                      size={18}
                    />
                    <input
                      className="bg-slate-50 border border-slate-100 pl-14 pr-6 py-4.5 text-sm rounded-2xl w-full outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all font-semibold text-slate-900 placeholder:text-slate-400"
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={loginData.email}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                  <div className="relative group/input">
                    <Lock
                      className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-blue-600 transition-colors"
                      size={18}
                    />
                    <input
                      className="bg-slate-50 border border-slate-100 pl-14 pr-6 py-4.5 text-sm rounded-2xl w-full outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all font-semibold text-slate-900 placeholder:text-slate-400"
                      type="password"
                      name="password"
                      placeholder="Your Password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                </div>

                <Link
                  to="/forget-password"
                  size={14}
                  className="text-slate-400 mt-4 text-sm font-bold hover:text-blue-600 transition-colors tracking-wide"
                >
                  Forget Password?
                </Link>

                <Magnetic>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-slate-900 text-white text-base py-4.5 px-14 rounded-2xl font-extrabold mt-10 transition-all hover:bg-blue-600 active:scale-95 disabled:opacity-50 shadow-2xl shadow-blue-600/10"
                  >
                    {isSubmitting ? "Processing..." : "SIGN IN"}
                  </button>
                </Magnetic>
              </form>
            </div>

            {/* Toggle Container */}
            <div
              className={`hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-all duration-700 ease-in-out z-100 ${isActive ? "-translate-x-full rounded-r-4xl" : "rounded-l-4xl"}`}
            >
              <div
                className={`relative -left-full h-full w-[200%] bg-blue-600 bg-linear-to-br from-blue-700 via-blue-600 to-indigo-700 text-white transition-all duration-700 ease-in-out ${isActive ? "translate-x-1/2" : "translate-x-0"}`}
              >
                {/* Toggle Left Panel */}
                <div
                  className={`absolute top-0 flex flex-col items-center justify-center px-14 text-center h-full w-1/2 transition-all duration-700 ease-in-out ${isActive ? "translate-x-0" : "translate-x-[-200%]"}`}
                >
                  <h1 className="text-5xl font-black tracking-tighter mb-5 leading-none">
                    Already a Member?
                  </h1>
                  <p className="text-sm leading-7 tracking-wide mb-12 text-blue-50 font-medium">
                    Log in to your account and continue your journey with us.
                  </p>
                  <button
                    onClick={() => setIsActive(false)}
                    className="bg-white/10 backdrop-blur-md border-2 border-white/40 text-white text-xs py-4 px-12 rounded-2xl font-black uppercase tracking-[0.2em] transition-all hover:bg-white hover:text-blue-600 active:scale-95"
                  >
                    SIGN IN
                  </button>
                </div>

                {/* Toggle Right Panel */}
                <div
                  className={`absolute top-0 right-0 flex flex-col items-center justify-center px-14 text-center h-full w-1/2 transition-all duration-700 ease-in-out ${isActive ? "translate-x-[200%]" : "translate-x-0"}`}
                >
                  <h1 className="text-5xl font-black tracking-tighter mb-5 leading-none">
                    New Here?
                  </h1>
                  <p className="text-sm leading-7 tracking-wide mb-12 text-blue-50 font-medium">
                    Create your account today and unlock a world of premium
                    features.
                  </p>
                  <button
                    onClick={() => setIsActive(true)}
                    className="bg-white/10 backdrop-blur-md border-2 border-white/40 text-white text-xs py-4 px-12 rounded-2xl font-black uppercase tracking-[0.2em] transition-all hover:bg-white hover:text-blue-600 active:scale-95"
                  >
                    CREATE ACCOUNT
                  </button>
                </div>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </div>

      {/* Mobile Toggle Trigger */}
      <div className="md:hidden fixed top-26 left-1/2 -translate-x-1/2 z-100 flex bg-white/70 backdrop-blur-xl p-2 rounded-2xl shadow-sm ">
        <button
          onClick={() => setIsActive(false)}
          className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${!isActive ? "bg-slate-900 text-white shadow-xl" : "text-slate-400"}`}
        >
          Sign In
        </button>
        <button
          onClick={() => setIsActive(true)}
          className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isActive ? "bg-slate-900 text-white shadow-xl" : "text-slate-400"}`}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
};

export default LoginSignup;
