import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Magnetic from '../Components/ui/Magnetic';
import {
  User, Mail, ShieldCheck, Package, LogOut,
  Edit3, Check, ChevronRight, ShoppingBag, Clock, MapPin
} from 'lucide-react';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [editData, setEditData] = useState({ username: '', email: '' });
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!token) navigate('/login-signup');
  }, [token, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get('/order/my-orders');
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error('Failed to fetch orders', err);
      } finally {
        setLoadingOrders(false);
      }
    };
    if (token) fetchOrders();
  }, [token]);

  useEffect(() => {
    if (user) setEditData({ username: user.username || '', email: user.email || '' });
  }, [user]);

  useGSAP(() => {
    if (!user) return;
    gsap.fromTo('.profile-header',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.2 }
    );
    gsap.fromTo('.profile-card',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.4 }
    );
    gsap.fromTo('.profile-sidebar',
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 }
    );
  }, { scope: containerRef, dependencies: [user] });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/user/update', editData);
      const updated = { ...user, ...editData };
      localStorage.setItem('user', JSON.stringify(updated));
      toast.success('Profile updated successfully!');
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    navigate('/login-signup');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const getInitials = (name) =>
    name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';

  const getStatusColor = (status) => {
    switch (status) {
      case 'confrom': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-amber-100 text-amber-700';
      case 'cancel': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'confirmed': return 'Confirmed';
      case 'pending': return 'Pending';
      case 'cancelled': return 'Cancelled';
      case 'shipped': return 'Shipped';
      case 'delivered': return 'Delivered';
      default: return status;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User size={18} /> },
    { id: 'orders', label: 'Orders', icon: <Package size={18} /> },
    { id: 'settings', label: 'Settings', icon: <Edit3 size={18} /> },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 pt-28 pb-24">
      <div className="w-[95%] max-w-7xl mx-auto">

        {/* ===== PROFILE HEADER ===== */}
        <div className="profile-header relative mb-10">
          {/* Banner */}
          <div className="relative h-44 md:h-52 rounded-3xl overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700"></div>
            <div className="absolute inset-0 opacity-[0.08]" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
            <div className="absolute top-[-30%] right-[-8%] w-[45%] h-[160%] rounded-full bg-white/5 blur-3xl"></div>
            <div className="absolute bottom-[-50%] left-[-5%] w-[35%] h-[160%] rounded-full bg-purple-400/10 blur-3xl"></div>
          </div>

          {/* Avatar Row — overlapping bottom of banner */}
          <div className="relative -mt-32 px-6 md:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-5">
              {/* Avatar */}
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white shadow-xl border-4 border-white flex items-center justify-center text-2xl md:text-3xl font-black text-blue-600 relative overflow-hidden shrink-0">
                <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-indigo-100"></div>
                <span className="relative z-10">{getInitials(user.username)}</span>
              </div>

              {/* Name + meta */}
              <div className="flex-1 min-w-0 pt-2 md:pb-1">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight truncate">
                  {user.username}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1.5 text-sm font-medium text-slate-800 truncate">
                    <Mail size={14} className="shrink-0" /> {user.email}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full shrink-0">
                    <ShieldCheck size={13} /> {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)}
                  </span>
                </div>
              </div>

              {/* Logout */}
              <div className="shrink-0 md:pb-1">
                <Magnetic>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-slate-200 bg-white text-slate-600 font-bold text-sm hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all shadow-sm"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </Magnetic>
              </div>
            </div>
          </div>
        </div>

        {/* ===== CONTENT GRID ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Sidebar */}
          <div className="profile-sidebar lg:col-span-3">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden sticky top-28">
              <nav className="p-3 space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/15'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                    {tab.id === 'orders' && orders.length > 0 && (
                      <span className={`ml-auto text-xs font-black px-2.5 py-0.5 rounded-full ${
                        activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {orders.length}
                      </span>
                    )}
                  </button>
                ))}
              </nav>

              <div className="border-t border-slate-100 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Member</span>
                  <span className="text-sm font-bold text-slate-700">2026</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Orders</span>
                  <span className="text-sm font-bold text-slate-700">{orders.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">

            {/* ===== OVERVIEW ===== */}
            {activeTab === 'overview' && (
              <>
                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="profile-card bg-white rounded-2xl border border-slate-100 shadow-sm p-5 group hover:shadow-md transition-all">
                    <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Package size={22} />
                    </div>
                    <p className="text-2xl font-black text-slate-900">{orders.length}</p>
                    <p className="text-sm font-medium text-slate-500 mt-0.5">Total Orders</p>
                  </div>
                  <div className="profile-card bg-white rounded-2xl border border-slate-100 shadow-sm p-5 group hover:shadow-md transition-all">
                    <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <ShoppingBag size={22} />
                    </div>
                    <p className="text-2xl font-black text-slate-900">{orders.filter(o => o.status === 'confrom').length}</p>
                    <p className="text-sm font-medium text-slate-500 mt-0.5">Completed</p>
                  </div>
                  <div className="profile-card bg-white rounded-2xl border border-slate-100 shadow-sm p-5 group hover:shadow-md transition-all">
                    <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                      <Clock size={22} />
                    </div>
                    <p className="text-2xl font-black text-slate-900">{orders.filter(o => o.status === 'pending').length}</p>
                    <p className="text-sm font-medium text-slate-500 mt-0.5">Pending</p>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="profile-card bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                    <h3 className="text-base font-bold text-slate-900">Recent Orders</h3>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-sm font-bold text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors cursor-pointer"
                    >
                      View All <ChevronRight size={16} />
                    </button>
                  </div>
                  {loadingOrders ? (
                    <div className="flex justify-center py-10">
                      <div className="w-8 h-8 border-3 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="text-center py-14 px-6">
                      <div className="w-14 h-14 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center mb-3 text-slate-400">
                        <Package size={24} />
                      </div>
                      <p className="text-base font-bold text-slate-700 mb-1">No orders yet</p>
                      <p className="text-sm text-slate-500 mb-5">Start shopping to see your orders here.</p>
                      <Link to="/shop" className="inline-flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-full font-bold text-sm hover:bg-blue-600 transition-colors">
                        Browse Shop <ChevronRight size={16} />
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-50">
                      {orders.slice(0, 3).map((order, idx) => (
                        <div key={order._id || idx} className="px-5 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                              <Package size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">
                                Order #{(order._id || '').slice(-6).toUpperCase()}
                              </p>
                              <p className="text-xs text-slate-500">
                                {order.items?.length || 0} items · ${order.totalbill?.toFixed(2) || '0.00'}
                              </p>
                            </div>
                          </div>
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Account Info */}
                <div className="profile-card bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                  <h3 className="text-base font-bold text-slate-900 mb-4">Account Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { icon: <User size={16} />, label: 'Username', value: user.username },
                      { icon: <Mail size={16} />, label: 'Email', value: user.email },
                      { icon: <ShieldCheck size={16} />, label: 'Role', value: user.role, capitalize: true },
                      { icon: <MapPin size={16} />, label: 'Location', value: 'Not set' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl">
                        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                          <p className={`text-sm font-bold text-slate-900 truncate ${item.capitalize ? 'capitalize' : ''}`}>{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* ===== ORDERS ===== */}
            {activeTab === 'orders' && (
              <div className="profile-card bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">Order History</h3>
                  <p className="text-sm text-slate-500 mt-0.5">Track and manage all your orders.</p>
                </div>
                {loadingOrders ? (
                  <div className="flex justify-center py-14">
                    <div className="w-8 h-8 border-3 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-16 px-6">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-50 flex items-center justify-center mb-4 text-slate-400">
                      <Package size={28} />
                    </div>
                    <p className="text-lg font-bold text-slate-700 mb-2">No orders yet</p>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                      Looks like you haven't placed any orders. Explore our shop!
                    </p>
                    <Magnetic>
                      <Link to="/shop" className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-slate-900/20">
                        Start Shopping <ChevronRight size={18} />
                      </Link>
                    </Magnetic>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {orders.map((order, idx) => (
                      <div key={order._id || idx} className="px-5 py-4 hover:bg-slate-50/50 transition-colors">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                              <Package size={18} />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">
                                Order #{(order._id || '').slice(-6).toUpperCase()}
                              </p>
                              <p className="text-xs text-slate-500">
                                {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 ml-13 sm:ml-0">
                            <span className="text-base font-black text-slate-900">${order.totalbill?.toFixed(2) || '0.00'}</span>
                            <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${getStatusColor(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </div>
                        </div>
                        {order.items && order.items.length > 0 && (
                          <div className="mt-2.5 ml-13 flex flex-wrap gap-1.5">
                            {order.items.slice(0, 4).map((item, i) => (
                              <span key={i} className="text-xs bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded-full">
                                {item.quantity}x · ${item.price}
                              </span>
                            ))}
                            {order.items.length > 4 && (
                              <span className="text-xs bg-slate-100 text-slate-500 font-semibold px-2.5 py-1 rounded-full">
                                +{order.items.length - 4} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ===== SETTINGS ===== */}
            {activeTab === 'settings' && (
              <div className="profile-card bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-7">
                <h3 className="text-base font-bold text-slate-900 mb-1">Edit Profile</h3>
                <p className="text-sm text-slate-500 mb-6">Update your personal information.</p>

                <form onSubmit={handleUpdate} className="space-y-5 max-w-md">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <User size={18} />
                      </div>
                      <input
                        type="text"
                        value={editData.username}
                        onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-slate-900"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Mail size={18} />
                      </div>
                      <input
                        type="email"
                        value={editData.email}
                        onChange={(e) => setEditData({ ...editData, email: e.target.value })}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium text-slate-900"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <Magnetic>
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-bold text-sm hover:bg-blue-600 transition-colors shadow-lg shadow-slate-900/20 disabled:opacity-60 cursor-pointer"
                      >
                        {saving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Saving...
                          </>
                        ) : (
                          <>
                            <Check size={16} /> Save Changes
                          </>
                        )}
                      </button>
                    </Magnetic>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
