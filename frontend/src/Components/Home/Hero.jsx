import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Magnetic from "../ui/Magnetic";
import { Link } from "react-router-dom";
import { ArrowRight, Star } from "lucide-react";

const Hero = () => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline();

      // Animate the text lines
      tl.fromTo(
        ".hero-title-line",
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.15,
          ease: "power4.out",
          delay: 0.2,
        },
      )
        .fromTo(
          ".hero-subtitle",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
          "-=0.6",
        )
        .fromTo(
          ".hero-btn",
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" },
          "-=0.6",
        )
        .fromTo(
          ".hero-image",
          { scale: 0.8, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.2, ease: "power4.out" },
          "-=0.8",
        )
        .fromTo(
          ".hero-badge",
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
            stagger: 0.2,
          },
          "-=0.6",
        );

      // Floating animation for image
      gsap.to(".hero-image-inner", {
        y: 15,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative pt-26 pb-16 lg:pt-30 lg:pb-24 overflow-hidden bg-slate-50 min-h-[90vh] flex items-center"
    >
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-200/40 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-purple-200/40 blur-[120px]"></div>
      </div>

      <div className="w-[95%] max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="flex flex-col items-start">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white/60 border border-slate-200 text-slate-800 text-sm font-semibold mb-6 hero-subtitle backdrop-blur-md shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 relative">
                <span className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-75"></span>
              </span>
              <span>New Spring Collection 2026</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tighter leading-[1.05] mb-4">
              <div className="overflow-hidden pb-1">
                <div className="hero-title-line">ELEVATE</div>
              </div>
              <div className="overflow-hidden pb-1">
                <div className="hero-title-line text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                  YOUR STYLE
                </div>
              </div>
              <div className="overflow-hidden pb-1">
                <div className="hero-title-line">EVERYDAY.</div>
              </div>
            </h1>

            <p className="text-base md:text-lg text-slate-600 mb-8 max-w-lg hero-subtitle leading-relaxed font-medium">
              Discover the latest trends in fashion and accessories. Curated
              collections designed to make you stand out from the crowd with
              uncompromising quality.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Magnetic>
                <Link
                  to="/shop"
                  className="hero-btn group relative px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg overflow-hidden flex items-center gap-2 shadow-xl shadow-slate-900/20"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Shop Collection{" "}
                    <ArrowRight
                      size={20}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                  <div className="absolute inset-0 h-full w-full bg-linear-to-r from-blue-600 to-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></div>
                </Link>
              </Magnetic>

              <Magnetic>
                <Link
                  to="/deals"
                  className="hero-btn inline-block px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 rounded-full font-bold text-lg hover:border-slate-900 transition-colors shadow-sm text-center"
                >
                  View Deals
                </Link>
              </Magnetic>
            </div>
          </div>

          {/* Image/Visual Content */}
          <div className="relative w-full aspect-4/5 md:aspect-4/3 lg:aspect-auto lg:h-[550px] hero-image mt-8 lg:mt-0">
            {/* Decorative background layers */}
            <div className="absolute inset-0 bg-slate-200 rounded-[2.5rem] transform rotate-3 scale-95 opacity-50 pointer-events-none"></div>
            <div className="absolute inset-0 bg-blue-100 rounded-[2.5rem] transform -rotate-2 scale-95 opacity-50 pointer-events-none"></div>

            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-slate-100 hero-image-inner group">
              <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
              <img
                src="https://i.pinimg.com/webp/1200x/f8/ba/3d/f8ba3ddf97d6136323359f5e429638a4.webp"
                alt="Fashion Model"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />

              {/* Badges */}
              <Magnetic>
                <div className="hero-badge absolute top-8 right-8 z-20 bg-white/90 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 border border-slate-100/50 cursor-pointer">
                  <div className="w-10 h-10 bg-linear-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg shadow-inner">
                    ✨
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Premium
                    </p>
                    <p className="text-sm font-black text-slate-900">Quality</p>
                  </div>
                </div>
              </Magnetic>

              <Magnetic>
                <div className="hero-badge absolute bottom-8 left-8 z-20 bg-white/90 backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-xl flex flex-col items-center border border-slate-100/50 cursor-pointer">
                  <div className="absolute -top-3 -right-3 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg animate-bounce">
                    !
                  </div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Spring Promo
                  </p>
                  <p className="text-2xl font-black text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400">
                    20% OFF
                  </p>
                  <p className="text-sm text-slate-300 font-medium">
                    On all new arrivals
                  </p>
                </div>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
