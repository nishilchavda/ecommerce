import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Magnetic from '../Components/ui/Magnetic';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RefreshCw,
  Package,
  Calendar,
  ChevronRight,
  MapPin
} from 'lucide-react';
import { toast } from 'react-toastify';

const CartAndOrders = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const containerRef = useRef(null);
  
  // Tab State - Detect from URL search param or pathname
  const [activeTab, setActiveTab] = useState('cart');

  useEffect(() => {
    const tab = searchParams.get('tab') || (window.location.pathname === '/orders' ? 'orders' : 'cart');
    setActiveTab(tab);
  }, [searchParams, navigate]);

  // Cart Data
  const [cart, setCart] = useState(null);
  const [loadingCart, setLoadingCart] = useState(true);
  const [updatingCart, setUpdatingCart] = useState(false);

  // Orders Data
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  // Fetch Cart
  const fetchCart = async () => {
    try {
      const res = await api.get('/cart/all');
      setCart(res.data.cart);
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setLoadingCart(false);
    }
  };

  // Fetch Orders
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

  useEffect(() => {
    if (token) {
      fetchCart();
      fetchOrders();
    }
  }, [token]);

  const handleUpdateQuantity = async (productId, newQty) => {
    if (newQty < 1 || updatingCart) return;
    setUpdatingCart(true);
    try {
      await api.put(`/cart/update/${productId}`, { quantity: newQty });
      setCart(prev => ({
        ...prev,
        items: prev.items.map(item => 
          item.productId?._id === productId ? { ...item, quantity: newQty } : item
        )
      }));
      window.dispatchEvent(new Event('cartUpdate'));
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setUpdatingCart(false);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/cart/product/${productId}`);
      setCart(prev => ({
        ...prev,
        items: prev.items.filter(item => item.productId?._id !== productId)
      }));
      toast.success('Removed from cart');
      window.dispatchEvent(new Event('cartUpdate'));
    } catch (err) {
      toast.error(err.response?.data?.message || "Remove failed");
    }
  };

  useGSAP(() => {
    // Entrance animations for both tabs
    gsap.fromTo('.tab-content',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out', clearProps: 'all' }
    );
  }, { scope: containerRef, dependencies: [activeTab] });

  const subtotal = cart?.items?.reduce((acc, item) => {
    const product = item.productId;
    if (!product) return acc;
    const price = product.price - (product.price * (product.discount || 0) / 100);
    return acc + (price * item.quantity);
  }, 0) || 0;

  const shipping = subtotal > 100 || subtotal === 0 ? 0 : 15;
  const total = subtotal + shipping;

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'cancelled': return 'bg-rose-100 text-rose-600 border-rose-200';
      case 'shipped': return 'bg-blue-100 text-blue-600 border-blue-200';
      default: return 'bg-amber-100 text-amber-600 border-amber-200';
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="w-[95%] max-w-7xl mx-auto">
        
        {/* Unified Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                {activeTab === 'cart' ? 'Shopping Cart' : 'My Orders'}
              </h1>
              <p className="text-slate-500 font-medium mt-1">
                {activeTab === 'cart' 
                  ? 'Review your items and proceed to checkout.' 
                  : 'Track your shipments and view your history.'}
              </p>
            </div>
            
            {/* Tab Switcher - Seamlessly switches state without route change refresh */}
            <div className="flex bg-slate-200/50 p-1.5 rounded-2xl w-fit backdrop-blur-sm">
              <button 
                onClick={() => setSearchParams({ tab: 'cart' })}
                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeTab === 'cart' 
                    ? 'bg-white text-slate-900 shadow-xl shadow-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-700 cursor-pointer'
                }`}
              >
                Bag ({cart?.items?.length || 0})
              </button>
              <button 
                onClick={() => setSearchParams({ tab: 'orders' })}
                className={`px-8 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeTab === 'orders' 
                    ? 'bg-white text-slate-900 shadow-xl shadow-slate-200/50' 
                    : 'text-slate-500 hover:text-slate-700 cursor-pointer'
                }`}
              >
                Orders ({orders.length})
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          
          {/* CART TAB */}
          {activeTab === 'cart' && (
            loadingCart ? (
              <div className="py-20 flex justify-center"><div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div></div>
            ) : cart?.items?.length === 0 ? (
              <div className="bg-white rounded-4xl p-16 text-center border border-slate-100 shadow-sm">
                <ShoppingBag size={40} className="mx-auto mb-6 text-slate-300" />
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Your cart is empty</h2>
                <Link to="/shop" className="inline-flex mt-6 bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-600 transition-all">Start Shopping</Link>
              </div>
            ) : (
              <div className="grid lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-8 space-y-4">
                  {cart?.items?.map((item) => {
                    const product = item.productId;
                    if (!product) return null;
                    const finalPrice = product.price - (product.price * (product.discount || 0) / 100);
                    return (
                      <div key={item._id} className="group bg-white rounded-3xl p-4 md:p-6 border border-slate-100 shadow-sm flex gap-6 items-center">
                        <Link to={`/product/${product._id}`} className="shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-slate-100 border border-slate-50">
                          <img src={product.images?.[0]} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </Link>
                        <div className="grow min-w-0">
                          <div className="flex justify-between mb-1">
                            <Link to={`/product/${product._id}`} className="text-lg font-bold text-slate-900 hover:text-blue-600 truncate pr-4">{product.name}</Link>
                            <button onClick={() => handleRemove(product._id)} className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"><Trash2 size={20} /></button>
                          </div>
                          <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">{product.brand || 'Premium'}</p>
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <span className="text-xl font-black text-slate-900">${finalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center bg-slate-50 rounded-full p-1 border border-slate-100">
                              <button onClick={() => handleUpdateQuantity(product._id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded-full disabled:opacity-30 cursor-pointer" disabled={item.quantity <= 1 || updatingCart}><Minus size={14} strokeWidth={3} /></button>
                              <span className="w-8 text-center font-bold text-slate-900">{item.quantity}</span>
                              <button onClick={() => handleUpdateQuantity(product._id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-slate-600 hover:bg-white rounded-full disabled:opacity-30 cursor-pointer" disabled={updatingCart}><Plus size={14} strokeWidth={3} /></button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="lg:col-span-4 sticky top-32">
                   <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
                     <h3 className="text-2xl font-black text-slate-900 tracking-tighter mb-6">Order Summary</h3>
                     <div className="space-y-4 mb-6 pb-6 border-b border-slate-100 font-medium">
                       <div className="flex justify-between text-slate-600"><span>Subtotal</span><span className="text-slate-900 font-bold">${subtotal.toFixed(2)}</span></div>
                       <div className="flex justify-between text-slate-600"><span>Shipping</span><span className="text-slate-900 font-bold">{shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}</span></div>
                     </div>
                     <div className="flex justify-between items-end mb-8"><span className="text-lg font-bold text-slate-900">Total</span><span className="text-3xl font-black text-slate-900 tracking-tighter">${total.toFixed(2)}</span></div>
                     <Magnetic><button onClick={() => navigate('/checkout')} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-bold flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/20 cursor-pointer">Proceed to Checkout <ArrowRight size={20} /></button></Magnetic>
                   </div>
                </div>
              </div>
            )
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            loadingOrders ? (
              <div className="py-20 flex justify-center"><div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div></div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-4xl p-20 text-center border border-slate-100 shadow-sm">
                 <Package size={48} className="mx-auto text-slate-200 mb-6" />
                 <h2 className="text-2xl font-bold text-slate-800 tracking-tight">No orders yet</h2>
                 <Link to="/shop" className="inline-block mt-8 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">Start Shopping</Link>
              </div>
            ) : (
              <div className="space-y-6 w-full">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 group">
                    <div className="p-6 md:p-8 bg-slate-50/50 border-b border-slate-100 flex flex-wrap gap-y-4 justify-between items-center">
                      <div className="flex flex-wrap gap-x-8 gap-y-2">
                        <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Date</p><p className="text-slate-900 font-bold text-sm">{new Date(order.createdAt).toLocaleDateString()}</p></div>
                        <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order ID</p><p className="text-slate-900 font-bold text-sm">#{order._id.slice(-8).toUpperCase()}</p></div>
                        <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p><p className="text-blue-600 font-black text-sm">${order.totalAmount}</p></div>
                      </div>
                      <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase border ${getStatusColor(order.status)}`}>{order.status}</div>
                    </div>
                    <div className="p-6 md:p-8 grid md:grid-cols-2 gap-8">
                       <div className="space-y-4">
                          {order.items.map((item, idx) => (
                             <div key={idx} className="flex gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-50 overflow-hidden shrink-0"><img src={item.productId?.images?.[0]} alt="" className="w-full h-full object-cover" /></div>
                                <div className="flex-1 min-w-0"><p className="font-bold text-slate-900 truncate">{item.productId?.name}</p><p className="text-xs text-slate-500 font-medium">{item.quantity} × ${item.price}</p></div>
                             </div>
                          ))}
                       </div>
                       <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                          <div className="flex items-center gap-3 mb-3 text-slate-900 font-bold text-sm"><MapPin size={16} className="text-blue-600" /> Shipping Info</div>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">{order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

        </div>
      </div>
    </div>
  );
};

export default CartAndOrders;
