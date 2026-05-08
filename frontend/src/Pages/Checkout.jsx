import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { MapPin, CreditCard, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import Magnetic from '../Components/ui/Magnetic';

const Checkout = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);

  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  const [paymentMethod, setPaymentMethod] = useState('COD');

  useEffect(() => {
    if (!token) navigate('/login');
    const fetchCart = async () => {
      try {
        const res = await api.get('/cart/all');
        if (!res.data.cart || res.data.cart.items.length === 0) {
          toast.info("Your cart is empty");
          navigate('/cart');
          return;
        }
        setCart(res.data.cart);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [token, navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/order/place', {
        shippingAddress: address,
        paymentMethod
      });
      setOrderComplete(true);
      window.dispatchEvent(new Event('cartUpdate'));
      toast.success("Order placed successfully!");
      setTimeout(() => navigate('/orders'), 3000);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    } finally {
      setSubmitting(false);
    }
  };

  const calculateTotal = () => {
    return cart?.items.reduce((total, item) => {
      return total + (item.productId?.price || 0) * item.quantity;
    }, 0) || 0;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  if (orderComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 bg-slate-50">
        <div className="text-center p-12 bg-white rounded-4xl shadow-2xl shadow-blue-600/10 border border-slate-100 max-w-lg w-[90%] animate-in fade-in zoom-in duration-500">
           <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} strokeWidth={2.5} />
           </div>
           <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">Order Confirmed!</h1>
           <p className="text-slate-500 font-medium mb-8">Thank you for your purchase. We've received your order and are getting it ready for shipment.</p>
           <div className="flex flex-col gap-3">
              <button onClick={() => navigate('/orders')} className="bg-slate-900 text-white py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all">
                 View My Orders
              </button>
              <button onClick={() => navigate('/shop')} className="text-slate-500 font-bold hover:text-slate-900 py-2 transition-all">
                 Continue Shopping
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-24">
      <div className="w-[95%] max-w-7xl mx-auto">
        
        <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-12">Checkout</h1>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
           
           {/* Left Column: Address & Payment */}
           <div className="lg:col-span-2 space-y-8">
              
              {/* Shipping Address */}
              <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                       <MapPin size={20} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Shipping Address</h2>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                       <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Street Address</label>
                       <input 
                         required
                         type="text" 
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                         value={address.street}
                         onChange={(e) => setAddress({...address, street: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">City</label>
                       <input 
                         required
                         type="text" 
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                         value={address.city}
                         onChange={(e) => setAddress({...address, city: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">State / Province</label>
                       <input 
                         required
                         type="text" 
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                         value={address.state}
                         onChange={(e) => setAddress({...address, state: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Zip / Postal Code</label>
                       <input 
                         required
                         type="text" 
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                         value={address.zipCode}
                         onChange={(e) => setAddress({...address, zipCode: e.target.value})}
                       />
                    </div>
                    <div>
                       <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Country</label>
                       <input 
                         required
                         type="text" 
                         className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium"
                         value={address.country}
                         onChange={(e) => setAddress({...address, country: e.target.value})}
                       />
                    </div>
                 </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-sm">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                       <CreditCard size={20} strokeWidth={2.5} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900">Payment Method</h2>
                 </div>

                 <div className="space-y-4">
                    <label className={`
                       flex items-center justify-between p-6 rounded-3xl border-2 transition-all cursor-pointer
                       ${paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 hover:border-slate-200'}
                    `}>
                       <div className="flex items-center gap-4">
                          <input 
                            type="radio" 
                            name="payment" 
                            className="w-5 h-5 text-blue-600 focus:ring-blue-600"
                            checked={paymentMethod === 'COD'}
                            onChange={() => setPaymentMethod('COD')}
                          />
                          <div>
                             <p className="font-bold text-slate-900">Cash on Delivery</p>
                             <p className="text-xs text-slate-500 font-medium">Pay when your order arrives</p>
                          </div>
                       </div>
                       <ShoppingBag size={24} className="text-slate-300" />
                    </label>
                    <label className="flex items-center justify-between p-6 rounded-3xl border-2 border-slate-100 opacity-50 cursor-not-allowed">
                       <div className="flex items-center gap-4">
                          <input type="radio" disabled className="w-5 h-5" />
                          <div>
                             <p className="font-bold text-slate-900">Online Payment</p>
                             <p className="text-xs text-slate-500 font-medium">Credit card, UPI, etc. (Coming Soon)</p>
                          </div>
                       </div>
                       <CreditCard size={24} className="text-slate-300" />
                    </label>
                 </div>
              </div>
           </div>

           {/* Right Column: Order Summary */}
           <div className="lg:col-span-1">
              <div className="bg-white rounded-4xl p-8 border border-slate-100 shadow-xl shadow-slate-900/5 sticky top-32">
                 <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
                 
                 <div className="space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {cart?.items.map((item) => (
                       <div key={item._id} className="flex gap-4">
                          <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden border border-slate-50 shrink-0">
                             <img src={item.productId?.images?.[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                             <p className="font-bold text-slate-900 text-sm truncate">{item.productId?.name}</p>
                             <p className="text-xs text-slate-500 font-medium">{item.quantity} × ${item.productId?.price}</p>
                          </div>
                          <p className="font-bold text-slate-900 text-sm">${item.quantity * item.productId?.price}</p>
                       </div>
                    ))}
                 </div>

                 <div className="space-y-3 border-t border-slate-100 pt-6 mb-8">
                    <div className="flex justify-between text-slate-500 font-medium">
                       <span>Subtotal</span>
                       <span>${calculateTotal()}</span>
                    </div>
                    <div className="flex justify-between text-slate-500 font-medium">
                       <span>Shipping</span>
                       <span className="text-emerald-500 font-bold uppercase text-xs">Free</span>
                    </div>
                    <div className="flex justify-between text-xl font-black text-slate-900 pt-2">
                       <span>Total</span>
                       <span>${calculateTotal()}</span>
                    </div>
                 </div>

                 <Magnetic>
                    <button 
                      disabled={submitting}
                      className="w-full bg-slate-900 text-white py-5 rounded-3xl font-bold flex items-center justify-center gap-3 hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/20 disabled:opacity-50"
                    >
                       {submitting ? 'Processing...' : (
                          <>
                             Confirm & Pay <ArrowRight size={20} />
                          </>
                       )}
                    </button>
                 </Magnetic>
                 <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-6">
                    Secure 256-bit SSL encrypted checkout
                 </p>
              </div>
           </div>

        </form>
      </div>
    </div>
  );
};

export default Checkout;
