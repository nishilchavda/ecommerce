import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const categories = [
  { 
    id: 1, 
    name: "Women's Fashion", 
    image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?q=80&w=1995&auto=format&fit=crop", 
    link: "/shop?category=women",
    className: "md:col-span-2 md:row-span-2 h-[400px] md:h-full"
  },
  { 
    id: 2, 
    name: "Men's Collection", 
    image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?q=80&w=2071&auto=format&fit=crop", 
    link: "/shop?category=men",
    className: "md:col-span-2 md:row-span-1 h-[300px] md:h-full"
  },
  { 
    id: 3, 
    name: "Accessories", 
    image: "https://images.unsplash.com/photo-1509319117193-57bab727e09d?q=80&w=1974&auto=format&fit=crop", 
    link: "/shop?category=accessories",
    className: "md:col-span-1 md:row-span-1 h-[300px] md:h-full"
  },
  { 
    id: 4, 
    name: "Footwear", 
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop", 
    link: "/shop?category=footwear",
    className: "md:col-span-1 md:row-span-1 h-[300px] md:h-full"
  }
];

const Categories = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray('.bento-card');
    
    gsap.fromTo('.section-header',
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

    gsap.fromTo(cards,
      { scale: 0.95, y: 50, opacity: 0 },
      {
        scale: 1, y: 0, opacity: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out"
      }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className=" bg-white py-20">
      <div className="w-[95%] max-w-7xl mx-auto">
        <div className="section-header flex flex-col md:flex-row justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter mb-2">Shop by Category</h2>
            <p className="text-base text-slate-500 font-medium max-w-md">Curated collections designed to help you find exactly what you're looking for.</p>
          </div>
          <Link to="/shop" className="mt-4 md:mt-0 flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition-colors group text-sm">
            View All <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Bento Grid / Masonry Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:h-[500px]">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              to={category.link} 
              className={`bento-card group relative rounded-3xl overflow-hidden block shadow-sm ${category.className}`}
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
              <div className="absolute inset-0 bg-linear-to-t from-slate-900/80 via-slate-900/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-1">{category.name}</h3>
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

export default Categories;
