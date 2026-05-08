import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Star } from 'lucide-react';
import Magnetic from '../ui/Magnetic';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

const CARD_WIDTH = 272; // 260px card + 12px gap (gap-3)
const SPEED = 40; // pixels per second

const ProductCard = ({ product, onAddToCart }) => (
  <div className="trending-card shrink-0 w-[260px] group relative bg-white rounded-2xl p-3 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 select-none">
    <Link to={`/product/${product._id}`} className="block relative aspect-4/5 overflow-hidden rounded-xl mb-3 bg-slate-100">
      <img
        src={product.images?.[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070'}
        alt={product.name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        draggable={false}
      />
      {product.discount > 0 && (
        <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm">
          -{product.discount}%
        </div>
      )}
    </Link>

    <div>
      <h3 className="text-base font-bold text-slate-900 truncate pr-4">{product.name}</h3>
      <div className="flex items-center gap-1 mb-2 text-amber-400">
        {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" />)}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-lg font-black text-slate-900">
          ${(product.price - (product.price * (product.discount || 0) / 100)).toFixed(2)}
        </span>
        <Magnetic>
          <button
            onClick={(e) => { e.preventDefault(); onAddToCart(product); }}
            className="bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-900 p-2.5 rounded-full transition-colors cursor-pointer"
          >
            <ShoppingBag size={18} strokeWidth={2.5} />
          </button>
        </Magnetic>
      </div>
    </div>
  </div>
);

const TrendingProducts = () => {
  const { token } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const tweenRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const onAddToCart = async (product) => {
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      await api.post('/cart/add', { item: { productId: product._id } });
      window.dispatchEvent(new Event('cartUpdate'));
      toast.success('Added to Cart!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    }
  };

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await api.get('/product/all');
        setProducts((res.data.products || []).slice(0, 8));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  // Header entrance animation
  useGSAP(() => {
    if (!loading && products.length > 0) {
      gsap.fromTo('.trending-header',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
          duration: 0.8,
          ease: "power3.out"
        }
      );
    }
  }, [loading, products]);

  // Infinite marquee loop
  useEffect(() => {
    if (loading || products.length === 0 || !trackRef.current) return;

    const track = trackRef.current;
    const totalWidth = CARD_WIDTH * products.length;
    const duration = totalWidth / SPEED;

    // Kill previous tween if exists
    if (tweenRef.current) tweenRef.current.kill();

    // Set initial position
    gsap.set(track, { x: 0 });

    // Animate: move left by exactly one set-width, then seamlessly repeat
    tweenRef.current = gsap.to(track, {
      x: -totalWidth,
      duration,
      ease: 'none',
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
      }
    });

    return () => {
      if (tweenRef.current) tweenRef.current.kill();
    };
  }, [loading, products]);

  const handleMouseEnter = useCallback(() => {
    if (tweenRef.current) tweenRef.current.pause();
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (tweenRef.current) tweenRef.current.resume();
  }, []);

  // We render 3 copies of the product list for seamless infinite scroll
  const renderSet = (keyPrefix) =>
    products.map((product) => (
      <ProductCard 
        key={`${keyPrefix}-${product._id}`} 
        product={product} 
        onAddToCart={onAddToCart} 
      />
    ));

  return (
    <section ref={sectionRef} className="py-16 bg-slate-50 overflow-hidden">
      <div className="w-[95%] max-w-7xl mx-auto">
        <div className="trending-header text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-2">Trending Now</h2>
          <p className="text-base text-slate-500 font-medium max-w-xl mx-auto">Discover the pieces everyone is talking about. These top-sellers won't stay in stock for long.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div
          className="relative"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-0 md:w-50 bg-linear-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-0 md:w-50 bg-linear-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>

          {/* Scrolling track */}
          <div
            ref={trackRef}
            className="flex gap-3 py-4 will-change-transform"
            style={{ width: 'max-content' }}
          >
            {renderSet('a')}
            {renderSet('b')}
            {renderSet('c')}
          </div>
        </div>
      )}
    </section>
  );
};

export default TrendingProducts;
