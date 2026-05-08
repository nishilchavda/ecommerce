import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import api from '../../api/axios';

gsap.registerPlugin(ScrollTrigger);

const FeaturedCategories = () => {
  const sectionRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/product/all');
        const products = res.data.products || [];
        
        // Get unique categories and take the first 3
        const catMap = {};
        products.forEach(p => {
          const catName = p.category || 'Uncategorized';
          if (!catMap[catName]) {
            catMap[catName] = {
              name: catName,
              image: p.images?.[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070',
            };
          }
        });

        const catList = Object.values(catMap).slice(0, 3);
        setCategories(catList);
      } catch (err) {
        console.error("Home categories fetch failed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useGSAP(() => {
    if (loading) return;
    const cards = gsap.utils.toArray('.category-card');
    
    gsap.fromTo('.section-header',
      { y: 50, opacity: 0 },
      {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
        },
        y: 0, opacity: 1,
        duration: 1,
        ease: "power3.out"
      }
    );

    gsap.fromTo(cards,
      { y: 100, opacity: 0 },
      {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
        y: 0, opacity: 1,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out"
      }
    );
  }, { scope: sectionRef, dependencies: [loading] });

  if (loading) return null;

  return (
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="w-[95%] max-w-7xl mx-auto">
        <div className="section-header flex flex-col md:flex-row justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-2">Shop by Category</h2>
            <p className="text-base text-slate-500 font-medium max-w-md">Curated collections designed to help you find exactly what you're looking for.</p>
          </div>
          <Link to="/categories" className="mt-4 md:mt-0 flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors group text-sm">
            View All Categories <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((category, idx) => (
            <Link 
              key={idx} 
              to={`/shop?category=${category.name.toLowerCase()}`} 
              className="category-card group relative h-[300px] md:h-[350px] rounded-3xl overflow-hidden block shadow-sm"
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/20 to-transparent"></div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl font-bold text-white mb-1">{category.name}</h3>
                <span className="inline-flex items-center gap-1.5 text-white/90 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  Explore <ArrowRight size={14} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
