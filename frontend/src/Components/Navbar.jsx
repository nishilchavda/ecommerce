import React, { useRef, useState, useEffect, useContext } from "react";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  Heart,
  ShieldCheck,
} from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Magnetic from "./ui/Magnetic";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/shop" },
  { name: "Categories", href: "/categories" },
  { name: "Deals", href: "/deals" },
];

const Navbar = () => {
  const navRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mobileMenuRef = useRef(null);
  const location = useLocation();
  const { user, token } = useContext(AuthContext);
  const [cartCount, setCartCount] = useState(0);

  // Fetch cart to show count
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await api.get("/cart/all");
        const count =
          res.data.cart?.items?.reduce((acc, item) => acc + item.quantity, 0) ||
          0;
        setCartCount(count);
      } catch (err) {
        console.error("Navbar cart fetch failed", err);
      }
    };
    if (token) fetchCart();
    else setCartCount(0);

    // Listen for cart updates from other components
    const handleCartUpdate = () => fetchCart();
    window.addEventListener("cartUpdate", handleCartUpdate);
    return () => window.removeEventListener("cartUpdate", handleCartUpdate);
  }, [token, location.pathname]);

  // Handle scroll state to increase glass opacity when scrolled
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useGSAP(
    () => {
      // Initial entrance animation
      gsap.fromTo(
        navRef.current,
        { y: -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.5,
          ease: "elastic.out(1, 0.75)",
          delay: 0.2,
        },
      );

      gsap.fromTo(
        ".nav-item",
        { y: -20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.6,
        },
      );
    },
    { scope: navRef },
  );

  useGSAP(() => {
    if (isMobileMenuOpen) {
      gsap.to(mobileMenuRef.current, {
        height: "auto",
        opacity: 1,
        duration: 0.5,
        ease: "power3.out",
      });
    } else {
      gsap.to(mobileMenuRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
      });
    }
  }, [isMobileMenuOpen]);

  return (
    <header
      ref={navRef}
      className="fixed top-3 self-center -translate-x-1/2 z-50 w-[95%] max-w-7xl transition-all duration-500"
    >
      {/* 
        Ultra-Premium Glass Surface 
        - backdrop-blur-2xl for intense blurring of background
        - gradient background to simulate light hitting the glass
        - subtle white border for the "glass edge" effect
        - drop shadow for depth
      */}
      <div
        className={`
        relative flex items-center justify-between px-6 py-3.5 rounded-3xl
        transition-all duration-500 ease-out border overflow-hidden
        ${
          scrolled
            ? "bg-white/70 border-white/60 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] backdrop-blur-2xl"
            : "bg-white/40 border-white/30 shadow-[0_4px_24px_0_rgba(31,38,135,0.05)] backdrop-blur-xl"
        }
      `}
      >
        {/* Shine effect overlay */}
        <div className="absolute inset-0 bg-linear-to-tr from-white/10 via-transparent to-white/40 pointer-events-none rounded-full"></div>

        {/* Logo */}
        <div className="flex shrink-0 cursor-pointer nav-item group relative z-10">
          <Link to="/">
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 group-hover:tracking-widest transition-all duration-500 ease-out flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-600 group-hover:scale-150 transition-transform duration-500"></div>
              ECOMMERCE
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2 relative z-10">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;

            return (
              <Magnetic key={item.name}>
                <Link
                  to={item.href}
                  className={`nav-item relative px-5 py-2 text-sm font-bold transition-all rounded-full overflow-hidden group inline-block ${
                    isActive
                      ? "text-slate-900"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <span className="relative z-10">{item.name}</span>
                  {/* Hover capsule */}
                  <div
                    className={`absolute inset-0 h-full w-full rounded-full transition-transform duration-400 ease-out origin-center ${
                      isActive
                        ? "bg-white/80 scale-100 shadow-sm"
                        : "bg-white/80 scale-0 group-hover:scale-100 shadow-sm"
                    }`}
                  ></div>
                </Link>
              </Magnetic>
            );
          })}
        </nav>

        {/* Icons / Auth Buttons */}
        <div className="hidden md:flex items-center space-x-1 relative z-10">
          {user ? (
            <>
              <Magnetic>
                <button className="nav-item p-2.5 text-slate-700 hover:text-slate-900 hover:bg-white/80 rounded-full transition-all cursor-pointer">
                  <Search size={20} strokeWidth={2.5} />
                </button>
              </Magnetic>
              <Magnetic>
                <Link
                  to="/profile"
                  className="nav-item block p-2.5 text-slate-700 hover:text-slate-900 hover:bg-white/80 rounded-full transition-all cursor-pointer relative"
                >
                  <User size={20} strokeWidth={2.5} />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link
                  to="/wishlist"
                  className="nav-item block p-2.5 text-slate-700 hover:text-slate-900 hover:bg-white/80 rounded-full transition-all cursor-pointer relative"
                >
                  <Heart size={20} strokeWidth={2.5} />
                </Link>
              </Magnetic>
              {user?.role === "admin" && (
                <Magnetic>
                  <Link
                    to="/admin"
                    className="nav-item block p-2.5 text-blue-600 hover:bg-blue-50 rounded-full transition-all cursor-pointer relative group"
                  >
                    <ShieldCheck size={20} strokeWidth={2.5} />
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold">
                      Admin Panel
                    </span>
                  </Link>
                </Magnetic>
              )}
              <Magnetic>
                <Link
                  to="/cart-orders"
                  className="nav-item block p-2.5 text-slate-700 hover:text-slate-900 hover:bg-white/80 rounded-full transition-all cursor-pointer relative group"
                >
                  <ShoppingBag size={20} strokeWidth={2.5} />
                  {cartCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 bg-blue-600 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white shadow-sm transition-transform group-hover:scale-110">
                      {cartCount}
                    </span>
                  )}
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold">
                    Cart & Orders
                  </span>
                </Link>
              </Magnetic>
            </>
          ) : (
            <div className="flex items-center gap-2 nav-item">
              <Link
                to="/login-signup"
                className="px-5 py-2 text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center nav-item relative z-10">
          <Magnetic>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-800 hover:bg-white/80 rounded-full transition-all"
            >
              {isMobileMenuOpen ? (
                <X size={24} strokeWidth={2.5} />
              ) : (
                <Menu size={24} strokeWidth={2.5} />
              )}
            </button>
          </Magnetic>
        </div>
      </div>

      {/* Mobile Navigation Dropdown - Also Glass! */}
      <div
        ref={mobileMenuRef}
        className="md:hidden overflow-hidden h-0 opacity-0 bg-white/70 backdrop-blur-2xl mt-3 rounded-3xl border border-white/50 shadow-[0_16px_40px_0_rgba(31,38,135,0.1)] mx-auto w-full relative"
      >
        <div className="absolute inset-0 bg-linear-to-tr from-white/10 via-transparent to-white/30 pointer-events-none rounded-3xl"></div>
        <div className="px-4 py-4 space-y-2 relative z-10">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-5 py-3.5 text-base font-bold rounded-2xl transition-all ${
                  isActive
                    ? "bg-white/80 text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
          <div className="pt-4 pb-2 mt-4 border-t border-slate-200/50 flex justify-around">
            {user ? (
              <>
                <button className="p-3.5 text-slate-700 hover:bg-white/80 rounded-2xl transition-all w-full flex justify-center mx-1">
                  <Search size={22} strokeWidth={2.5} />
                </button>
                <Link
                  to="/profile"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3.5 text-slate-700 hover:bg-white/80 rounded-2xl transition-all w-full flex justify-center mx-1"
                >
                  <User size={22} strokeWidth={2.5} />
                </Link>
                {user?.role === "admin" && (
                  <Magnetic>
                    <Link
                      to="/admin"
                      className="p-3.5 text-slate-700 hover:bg-white/80 rounded-2xl transition-all w-full flex justify-center mx-1"
                    >
                      <ShieldCheck size={20} strokeWidth={2.5} />
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-bold">
                        Admin Panel
                      </span>
                    </Link>
                  </Magnetic>
                )}
                <Link
                  to="/wishlist"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3.5 text-slate-700 hover:bg-white/80 rounded-2xl transition-all w-full flex justify-center mx-1"
                >
                  <Heart size={22} strokeWidth={2.5} />
                </Link>
                <Link
                  to="/cart-orders"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3.5 text-slate-700 hover:bg-white/80 rounded-2xl transition-all w-full flex justify-center mx-1 relative"
                >
                  <ShoppingBag size={22} strokeWidth={2.5} />
                  {cartCount > 0 && (
                    <span className="absolute top-2 right-[20%] bg-blue-600 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white/80 shadow-sm">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </>
            ) : (
              <div className="flex flex-col w-full gap-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 text-center text-sm font-bold text-slate-700 hover:bg-white/80 rounded-xl transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full py-3 text-center text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
