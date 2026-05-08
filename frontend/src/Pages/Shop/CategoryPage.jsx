import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, LayoutGrid } from 'lucide-react';
import Magnetic from '../../Components/ui/Magnetic';
import api from '../../api/axios';

gsap.registerPlugin(ScrollTrigger);

const accentMapping = {
  women: "from-rose-500/80 to-pink-600/80",
  men: "from-blue-600/80 to-indigo-700/80",
  accessories: "from-amber-500/80 to-orange-600/80",
  footwear: "from-emerald-500/80 to-teal-600/80",
  activewear: "from-violet-500/80 to-purple-700/80",
  electronics: "from-cyan-500/80 to-sky-600/80",
  home: "from-slate-600/80 to-slate-800/80",
  default: "from-slate-600/80 to-slate-800/80"
};

const CategoryPage = () => {
  const containerRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/product/all');
        const products = res.data.products || [];
        
        // Extract unique categories and their data
        const catMap = {};
        products.forEach(p => {
          const catName = p.category || 'Uncategorized';
          const lowerCat = catName.toLowerCase();
          
          if (!catMap[lowerCat]) {
            catMap[lowerCat] = {
              name: catName,
              image: p.images?.[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070',
              count: 0,
              accent: accentMapping[lowerCat] || accentMapping.default
            };
          }
          catMap[lowerCat].count += 1;
        });

        const catList = Object.values(catMap).map((cat, index) => {
          // Assign dynamic spans for bento effect
          let span = "md:col-span-1 md:row-span-1";
          if (index % 5 === 0) span = "md:col-span-2 md:row-span-2";
          else if (index % 3 === 0) span = "md:col-span-2 md:row-span-1";
          
          return { ...cat, span, id: index };
        });

        setCategories(catList);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useGSAP(() => {
    if (loading) return;
    
    // Header entrance
    gsap.fromTo('.cat-page-header',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        delay: 0.2,
      }
    );

    // Bento cards stagger entrance
    const cards = gsap.utils.toArray('.bento-item');
    gsap.fromTo(cards,
      { y: 60, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        delay: 0.4,
      }
    );
  }, { scope: containerRef, dependencies: [loading] });

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

        {/* Page Header */}
        <div className="cat-page-header mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <LayoutGrid size={20} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold text-blue-600 uppercase tracking-wider">Collections</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">
            Explore Categories
          </h1>
          <p className="text-lg text-slate-500 font-medium max-w-xl">
            Browse our dynamic collections. Every category is automatically updated based on our latest inventory.
          </p>
        </div>

        {/* Magic Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[200px] md:auto-rows-[220px] gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.name.toLowerCase()}`}
              className={`bento-item group relative rounded-3xl overflow-hidden block ${cat.span}`}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.2s] ease-out"
                  loading="lazy"
                />
              </div>

              {/* Gradient Overlay */}
              <div className={`absolute inset-0 bg-linear-to-t ${cat.accent} via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500`}></div>
              {/* Dark bottom gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent"></div>

              {/* Count Badge */}
              <div className="absolute top-5 right-5 z-20">
                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full border border-white/30 shadow-sm">
                  {cat.count} PRODUCTS
                </span>
              </div>

              {/* Info at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-xl md:text-2xl font-black text-white mb-0 drop-shadow-lg">
                      {cat.name}
                    </h3>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 delay-150 group-hover:translate-x-0 translate-x-2 shadow-xl">
                    <ArrowRight size={18} strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && (
          <div className="bg-white rounded-4xl p-20 text-center border border-slate-100 shadow-sm">
             <LayoutGrid size={48} className="mx-auto text-slate-200 mb-6" />
             <h2 className="text-2xl font-bold text-slate-800">No categories found</h2>
             <p className="text-slate-500 mt-2">Add some products to see categories here.</p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 font-medium mb-6">Want to see everything?</p>
          <Magnetic>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-600 transition-colors shadow-xl shadow-slate-900/20 group"
            >
              Browse All Products
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </Magnetic>
        </div>

      </div>
    </div>
  );
};

export default CategoryPage;
