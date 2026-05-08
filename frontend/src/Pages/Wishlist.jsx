import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Magnetic from '../Components/ui/Magnetic';
import { Heart, Trash2, ShoppingBag, ArrowRight, Star } from 'lucide-react';
import { toast } from 'react-toastify';

const Wishlist = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await api.get('/wishlist/all');
        const items = res.data.wishlist?.productIds || [];
        setWishlist(items);
        console.log(items);
      } catch (err) {
        console.error('Failed to fetch wishlist', err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchWishlist();
  }, [token]);

  useGSAP(() => {
    if (loading) return;
    gsap.fromTo('.wl-header',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    );
    gsap.fromTo('.wl-card',
      { y: 40, opacity: 0, scale: 0.96 },
      { y: 0, opacity: 1, scale: 1, duration: 0.7, stagger: 0.1, ease: 'power3.out', delay: 0.4 }
    );
  }, { scope: containerRef, dependencies: [loading, wishlist] });

  const handleRemove = async (itemId) => {
    try {
      await api.delete(`/wishlist/${itemId}`);
      setWishlist(prev => prev.filter(p => p._id !== itemId));
      toast.success('Removed from wishlist');
    } catch (error) {
      toast.error('Failed to remove item',error.response.data.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="w-[95%] max-w-7xl mx-auto">

        {/* Header */}
        <div className="wl-header mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/30">
              <Heart size={20} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold text-rose-600 uppercase tracking-wider">Saved Items</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-3">
            My Wishlist
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-lg">
            {wishlist.length > 0
              ? `You have ${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} saved for later.`
              : 'Your wishlist is empty. Start adding items you love!'
            }
          </p>
        </div>

        {/* Empty State */}
        {wishlist.length === 0 ? (
          <div className="wl-card bg-white rounded-3xl border border-slate-100 shadow-sm p-12 md:p-16 text-center">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-rose-50 flex items-center justify-center mb-6 text-rose-400">
              <Heart size={36} strokeWidth={1.5} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-3">Nothing here yet</h2>
            <p className="text-slate-500 font-medium max-w-md mx-auto mb-8">
              Browse our shop and tap the heart icon on items you love. They'll appear here so you can find them easily later.
            </p>
            <Magnetic>
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 bg-slate-900 text-white px-7 py-3.5 rounded-full font-bold hover:bg-blue-600 transition-colors shadow-xl shadow-slate-900/20 group"
              >
                Explore Shop <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </Magnetic>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((entry) => {
              const product = entry?.productId;
              if (!product) return null;

              return (
                <div
                  key={entry._id}
                  className="wl-card group relative bg-white rounded-2xl p-3 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500"
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(entry._id)}
                    className="absolute top-5 right-5 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 hover:border-red-200 transition-all shadow-sm cursor-pointer"
                  >
                    <Trash2 size={16} strokeWidth={2.5} />
                  </button>

                  {/* Product Image */}
                  <Link to={`/product/${product._id}`} className="block relative aspect-4/5 overflow-hidden rounded-xl mb-3 bg-slate-100">
                    <img
                      src={product.images?.[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-sm">
                        -{product.discount}%
                      </div>
                    )}
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="bg-white text-slate-900 px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
                          View Details <ArrowRight size={14} />
                        </span>
                      </div>
                    </div>
                  </Link>

                  {/* Info */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 truncate pr-4">{product.name}</h3>
                    <p className="text-sm text-slate-500 font-medium mb-2">{product.brand || 'Premium'}</p>
                    <div className="flex items-center gap-1 mb-2 text-amber-400">
                      {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" />)}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-slate-900">
                          ${(product.price - (product.price * (product.discount || 0) / 100)).toFixed(2)}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-sm font-semibold text-slate-400 line-through">${product.price}</span>
                        )}
                      </div>
                      <Magnetic>
                        <button
                          onClick={() => toast.success('Added to cart!')}
                          className="bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-900 p-2.5 rounded-full transition-colors cursor-pointer"
                        >
                          <ShoppingBag size={18} strokeWidth={2.5} />
                        </button>
                      </Magnetic>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
