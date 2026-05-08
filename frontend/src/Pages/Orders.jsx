import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { Package, Truck, Calendar, ChevronRight, ShoppingBag, MapPin } from 'lucide-react';
import { toast } from 'react-toastify';

const Orders = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) navigate('/login');
    const fetchOrders = async () => {
      try {
        const res = await api.get('/order/my-orders');
        setOrders(res.data.orders || []);
      } catch (err) {
        toast.error(err.response.data.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [token, navigate]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'cancelled': return 'bg-rose-100 text-rose-600 border-rose-200';
      case 'shipped': return 'bg-blue-100 text-blue-600 border-blue-200';
      default: return 'bg-amber-100 text-amber-600 border-amber-200';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="w-[95%] max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
           <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">My Orders</h1>
              <p className="text-slate-500 font-medium">Track your shipments and view your order history.</p>
           </div>
           
           {/* Tab Switcher */}
           <div className="flex bg-slate-200/50 p-1 rounded-2xl w-fit">
              <button 
                onClick={() => navigate('/cart')}
                className="text-slate-500 hover:text-slate-900 px-6 py-2.5 rounded-xl font-bold text-sm transition-all cursor-pointer"
              >
                Cart
              </button>
              <button className="bg-white text-slate-900 px-6 py-2.5 rounded-xl font-bold shadow-sm text-sm transition-all">
                Orders ({orders.length})
              </button>
           </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-4xl p-20 text-center border border-slate-100 shadow-sm">
             <Package size={48} className="mx-auto text-slate-200 mb-6" />
             <h2 className="text-2xl font-bold text-slate-800 tracking-tight">No orders yet</h2>
             <p className="text-slate-500 mt-2 font-medium">When you buy something, it will appear here.</p>
             <Link to="/shop" className="inline-block mt-8 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">
                Start Shopping
             </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-4xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 group">
                 {/* Order Header */}
                 <div className="p-6 md:p-8 bg-slate-50/50 border-b border-slate-100 flex flex-wrap gap-y-4 justify-between items-center">
                    <div className="flex flex-wrap gap-x-8 gap-y-2">
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order Date</p>
                          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                             <Calendar size={14} className="text-slate-400" />
                             {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </div>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Order ID</p>
                          <p className="text-slate-900 font-bold text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                       </div>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Amount</p>
                          <p className="text-blue-600 font-black text-sm">${order.totalAmount}</p>
                       </div>
                    </div>
                    
                    <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase border ${getStatusColor(order.status)}`}>
                       {order.status}
                    </div>
                 </div>

                 {/* Order Content */}
                 <div className="p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       
                       {/* Product Items */}
                       <div className="space-y-4">
                          {order.items.map((item, idx) => (
                             <div key={idx} className="flex gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-50 overflow-hidden shrink-0">
                                   <img src={item.productId?.images?.[0]} alt="" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                   <p className="font-bold text-slate-900 truncate">{item.productId?.name}</p>
                                   <p className="text-xs text-slate-500 font-medium">Qty: {item.quantity} × ${item.price}</p>
                                </div>
                             </div>
                          ))}
                       </div>

                       {/* Shipping Info */}
                       <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                          <div className="flex items-center gap-3 mb-3 text-slate-900">
                             <MapPin size={16} className="text-blue-600" />
                             <span className="text-sm font-bold">Delivery Address</span>
                          </div>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">
                             {order.shippingAddress?.street}<br />
                             {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}<br />
                             {order.shippingAddress?.country}
                          </p>
                          
                          <div className="mt-6 pt-4 border-t border-slate-200/50">
                             <div className="flex items-center gap-3 text-slate-900">
                                <Truck size={16} className="text-blue-600" />
                                <span className="text-xs font-bold">Shipping via Standard Express</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                       <button className="flex items-center gap-2 text-slate-900 font-bold text-sm hover:text-blue-600 transition-colors group">
                          View Full Details <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                       </button>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;
