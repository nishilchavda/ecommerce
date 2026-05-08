import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 pt-20 pb-10 px-4 md:px-8 border-t border-slate-900">
      <div className="w-[95%] max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand Info */}
          <div className="lg:col-span-4">
            <h2 className="text-3xl font-black text-white tracking-tighter mb-6">
              ECOMMERCE
            </h2>
            <p className="text-slate-400 font-medium mb-8 leading-relaxed max-w-sm">
              Premium fashion and accessories curated for your modern lifestyle. Quality meets contemporary design in every piece we offer.
            </p>
            <div className="flex items-center gap-4">
              
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="text-white font-bold text-lg mb-6">Shop</h3>
            <ul className="space-y-4">
              <li><Link to="/shop" className="text-slate-400 hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop" className="text-slate-400 hover:text-white transition-colors">Women's Fashion</Link></li>
              <li><Link to="/shop" className="text-slate-400 hover:text-white transition-colors">Men's Fashion</Link></li>
              <li><Link to="/shop" className="text-slate-400 hover:text-white transition-colors">Accessories</Link></li>
              <li><Link to="/shop" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2">Sale <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">HOT</span></Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-white font-bold text-lg mb-6">Support</h3>
            <ul className="space-y-4">
              <li><Link to="#" className="text-slate-400 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white transition-colors">Track Order</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white transition-colors">Returns & Refunds</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white transition-colors">Size Guide</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h3 className="text-white font-bold text-lg mb-6">Company</h3>
            <ul className="space-y-4">
              <li><Link to="#" className="text-slate-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white transition-colors">Careers</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-medium text-slate-500">
            &copy; {currentYear} ECOMMERCE. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {/* Mock payment icons */}
            <div className="flex gap-2 text-slate-500">
              <div className="w-10 h-6 bg-slate-900 rounded border border-slate-800 flex items-center justify-center text-[10px] font-bold">VISA</div>
              <div className="w-10 h-6 bg-slate-900 rounded border border-slate-800 flex items-center justify-center text-[10px] font-bold">MC</div>
              <div className="w-10 h-6 bg-slate-900 rounded border border-slate-800 flex items-center justify-center text-[10px] font-bold">AMEX</div>
              <div className="w-10 h-6 bg-slate-900 rounded border border-slate-800 flex items-center justify-center text-[10px] font-bold">PAYPAL</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;