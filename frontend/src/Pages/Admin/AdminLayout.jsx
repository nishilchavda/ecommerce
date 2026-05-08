import React, { useContext, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Settings, 
  LogOut, 
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import Magnetic from '../../Components/ui/Magnetic';

const AdminLayout = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Basic protection - should also be checked on backend
    if (!token || user?.role !== 'admin') {
      navigate('/');
    }
  }, [token, user, navigate]);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Products', icon: <Package size={20} />, path: '/admin/products' },
    { name: 'Orders', icon: <ShoppingCart size={20} />, path: '/admin/orders' },
    { name: 'Users', icon: <Users size={20} />, path: '/admin/users' },
    { name: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex overflow-hidden">
      
      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'w-64' : 'w-20'} 
        transition-all duration-500 ease-in-out border-r border-slate-800 bg-slate-900/50 backdrop-blur-xl
        flex flex-col z-50
      `}>
        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800">
          <Link to="/" className={`flex items-center gap-2 overflow-hidden transition-all ${!isSidebarOpen && 'opacity-0 w-0'}`}>
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-600/30">A</div>
            <span className="font-black tracking-tighter text-xl">ADMIN</span>
          </Link>
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                  ${isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <span className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300 shrink-0`}>
                  {item.icon}
                </span>
                <span className={`font-bold text-sm transition-all duration-300 truncate ${(!isSidebarOpen && 'lg:opacity-0 lg:w-0')}`}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 space-y-1 shrink-0">
           <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white transition-colors rounded-xl hover:bg-slate-800/50">
              <ArrowLeft size={18} className="shrink-0" />
              <span className={`font-bold text-sm truncate ${(!isSidebarOpen && 'lg:opacity-0 lg:w-0')}`}>Back to Shop</span>
           </Link>
           <button className="flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 transition-colors w-full cursor-pointer rounded-xl hover:bg-red-400/5 text-left">
              <LogOut size={18} className="shrink-0" />
              <span className={`font-bold text-sm truncate ${(!isSidebarOpen && 'lg:opacity-0 lg:w-0')}`}>Logout</span>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-slate-900 to-slate-950">
        {/* Topbar */}
        <header className="h-20 flex items-center justify-between px-4 md:px-8 border-b border-slate-800/50 sticky top-0 bg-slate-900/80 backdrop-blur-md z-40 shrink-0">
           <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-xl transition-all cursor-pointer lg:hidden"
              >
                <Menu size={20} />
              </button>
              <h2 className="text-lg md:text-xl font-bold tracking-tight truncate max-w-[150px] md:max-w-none">
                 {menuItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
              </h2>
           </div>

           <div className="flex items-center gap-3 md:gap-4">
              <div className="text-right hidden sm:block">
                 <p className="text-sm font-bold text-slate-100">{user.username}</p>
                 <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">{user.role}</p>
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-linear-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center font-bold text-slate-300 shadow-xl shrink-0">
                 {user.username.charAt(0).toUpperCase()}
              </div>
           </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
           <div className="max-w-7xl mx-auto">
              <Outlet />
           </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
