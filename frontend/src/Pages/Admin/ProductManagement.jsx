import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  MoreVertical,
  Filter,
  Image as ImageIcon,
  X,
  Save,
  Loader2
} from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import api from '../../api/axios';
import { toast } from 'react-toastify';

const ProductManagement = () => {
  const containerRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    brand: '',
    discount: 0,
    stock: 10,
    description: '',
    images: ['']
  });

  const fetchProducts = async () => {
    try {
      const res = await api.get('/product/all');
      setProducts(res.data.products || []);
    } catch (err) {
      toast.error("Failed to load products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useGSAP(() => {
    if (loading) return;
    gsap.fromTo('.product-row',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
    );
  }, { scope: containerRef, dependencies: [loading, products] });

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category || '',
        brand: product.brand || '',
        discount: product.discount || 0,
        stock: product.stock || 10,
        description: product.description || '',
        images: product.images?.length > 0 ? product.images : ['']
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        category: '',
        brand: '',
        discount: 0,
        stock: 10,
        description: '',
        images: ['']
      });
    }
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/product/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingProduct) {
        await api.put(`/product/${editingProduct._id}`, formData);
        toast.success("Product updated successfully");
      } else {
        await api.post('/product/add', formData);
        toast.success("Product created successfully");
      }
      setModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div ref={containerRef} className="space-y-6">
      
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
         <div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Product Inventory</h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Manage your catalog, prices, and stock levels.</p>
         </div>
         <button 
           onClick={() => handleOpenModal()}
           className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-6 py-4 sm:py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/20 cursor-pointer active:scale-95 shrink-0"
         >
            <Plus size={20} strokeWidth={2.5} />
            Add New Product
         </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 p-4 md:p-5 rounded-3xl flex flex-col md:flex-row gap-4">
         <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or category..."
              className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-blue-600 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <button className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0">
            <Filter size={18} />
            Filters
         </button>
      </div>

      {/* Table Content (Desktop) / Card Grid (Mobile) */}
      <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700/50 rounded-3xl md:rounded-4xl overflow-hidden">
         
         {/* Desktop Table */}
         <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-slate-700/50">
                     <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Product</th>
                     <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Category</th>
                     <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Price</th>
                     <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">Stock</th>
                     <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-700/30">
                  {loading ? (
                    <tr>
                       <td colSpan="5" className="px-8 py-20 text-center">
                          <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                       </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                       <td colSpan="5" className="px-8 py-20 text-center text-slate-500 font-bold">
                          No products found matching your criteria.
                       </td>
                    </tr>
                  ) : filteredProducts.map((p) => (
                    <tr key={p._id} className="product-row hover:bg-white/[0.02] transition-colors group">
                       <td className="px-8 py-4">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-xl bg-slate-700 overflow-hidden border border-slate-600 flex items-center justify-center">
                                {p.images?.[0] ? (
                                  <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <ImageIcon size={20} className="text-slate-500" />
                                )}
                             </div>
                             <div>
                                <p className="font-bold text-slate-100 group-hover:text-blue-400 transition-colors">{p.name}</p>
                                <p className="text-xs font-medium text-slate-500">{p.brand || 'No Brand'}</p>
                             </div>
                          </div>
                       </td>
                       <td className="px-8 py-4">
                          <span className="px-3 py-1 bg-slate-900/50 border border-slate-700 rounded-full text-xs font-bold text-slate-400">
                             {p.category || 'N/A'}
                          </span>
                       </td>
                       <td className="px-8 py-4">
                          <div className="flex flex-col">
                             <span className="font-bold text-slate-100">${p.price}</span>
                             {p.discount > 0 && <span className="text-[10px] font-black text-emerald-400 uppercase">-{p.discount}% OFF</span>}
                          </div>
                       </td>
                       <td className="px-8 py-4">
                          <div className="flex items-center gap-2">
                             <div className={`w-1.5 h-1.5 rounded-full ${p.stock > 5 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                             <span className="font-bold text-sm text-slate-300">{p.stock || 0}</span>
                          </div>
                       </td>
                       <td className="px-8 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                             <button 
                               onClick={() => handleOpenModal(p)}
                               className="p-2 hover:bg-blue-600/10 text-slate-400 hover:text-blue-400 rounded-lg transition-all cursor-pointer"
                             >
                                <Edit2 size={18} />
                             </button>
                             <button 
                               onClick={() => handleDelete(p._id)}
                               className="p-2 hover:bg-rose-600/10 text-slate-400 hover:text-rose-400 rounded-lg transition-all cursor-pointer"
                             >
                                <Trash2 size={18} />
                             </button>
                          </div>
                       </td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* Mobile Card Grid */}
         <div className="lg:hidden p-4 space-y-4">
            {loading ? (
              <div className="py-20 text-center">
                 <div className="w-10 h-10 border-4 border-slate-700 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-10 text-center text-slate-500 font-bold">
                 No products found.
              </div>
            ) : filteredProducts.map((p) => (
              <div key={p._id} className="product-row bg-slate-900/40 border border-slate-700/50 rounded-2xl p-4 flex flex-col gap-4">
                 <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-xl bg-slate-800 overflow-hidden shrink-0 border border-slate-700">
                       {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" /> : <ImageIcon className="m-auto mt-4 text-slate-600" />}
                    </div>
                    <div className="min-w-0 flex-1">
                       <h4 className="font-bold text-slate-100 truncate">{p.name}</h4>
                       <p className="text-xs text-slate-500">{p.brand || 'No Brand'}</p>
                       <div className="mt-2 flex items-center gap-2">
                          <span className="text-sm font-black text-white">${p.price}</span>
                          {p.discount > 0 && <span className="text-[10px] font-black text-emerald-400">-{p.discount}%</span>}
                       </div>
                    </div>
                    <div className="flex flex-col gap-1">
                       <button onClick={() => handleOpenModal(p)} className="p-2 bg-slate-800 text-blue-400 rounded-lg"><Edit2 size={16} /></button>
                       <button onClick={() => handleDelete(p._id)} className="p-2 bg-slate-800 text-rose-400 rounded-lg"><Trash2 size={16} /></button>
                    </div>
                 </div>
                 <div className="flex justify-between items-center pt-3 border-t border-slate-800/50">
                    <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                       {p.category || 'N/A'}
                    </span>
                    <div className="flex items-center gap-1.5">
                       <div className={`w-1.5 h-1.5 rounded-full ${p.stock > 5 ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                       <span className="text-xs font-bold text-slate-400">{p.stock} in stock</span>
                    </div>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center sm:p-4">
           {/* Backdrop */}
           <div 
             className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
             onClick={() => !isSubmitting && setModalOpen(false)}
           ></div>
           
           {/* Modal Body */}
           <div className="relative bg-slate-900 border-t sm:border border-slate-800 w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto rounded-t-3xl sm:rounded-4xl shadow-3xl p-6 sm:p-8 custom-scrollbar z-[101]">
              <div className="flex justify-between items-start mb-6 sm:mb-8">
                 <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                    <p className="text-slate-500 font-medium text-sm">Fill in the details below to update your catalog.</p>
                 </div>
                 <button 
                   onClick={() => setModalOpen(false)}
                   className="p-2 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                 >
                    <X size={24} />
                 </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                 <div className="md:col-span-2">
                    <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Product Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-sm sm:text-base"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4 md:contents">
                    <div>
                       <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Price ($)</label>
                       <input 
                         required
                         type="number" 
                         className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-sm sm:text-base"
                         value={formData.price}
                         onChange={(e) => setFormData({...formData, price: e.target.value})}
                       />
                    </div>

                    <div>
                       <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Category</label>
                       <input 
                         required
                         type="text" 
                         placeholder="e.g. Men"
                         className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-sm sm:text-base"
                         value={formData.category}
                         onChange={(e) => setFormData({...formData, category: e.target.value})}
                       />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4 md:contents">
                    <div>
                       <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Brand</label>
                       <input 
                         type="text" 
                         className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-sm sm:text-base"
                         value={formData.brand}
                         onChange={(e) => setFormData({...formData, brand: e.target.value})}
                       />
                    </div>

                    <div>
                       <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Stock</label>
                       <input 
                         type="number" 
                         className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-sm sm:text-base"
                         value={formData.stock}
                         onChange={(e) => setFormData({...formData, stock: e.target.value})}
                       />
                    </div>
                 </div>

                 <div>
                    <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Discount (%)</label>
                    <input 
                      type="number" 
                      className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-sm sm:text-base"
                      value={formData.discount}
                      onChange={(e) => setFormData({...formData, discount: e.target.value})}
                    />
                 </div>

                 <div className="md:col-span-2">
                    <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Description</label>
                    <textarea 
                      rows="3"
                      className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium resize-none text-sm sm:text-base"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    ></textarea>
                 </div>

                 <div className="md:col-span-2">
                    <label className="block text-[10px] sm:text-xs font-black text-slate-500 uppercase tracking-widest mb-2 ml-1">Image URLs (comma separated)</label>
                    <input 
                      type="text" 
                      placeholder="https://..."
                      className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-blue-600 transition-all font-medium text-sm sm:text-base"
                      value={formData.images.join(', ')}
                      onChange={(e) => setFormData({...formData, images: e.target.value.split(',').map(s => s.trim())})}
                    />
                 </div>

                 <div className="md:col-span-2 flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4 mt-4 mb-4 sm:mb-0">
                    <button 
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className="w-full sm:w-auto px-8 py-4 sm:py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 font-bold rounded-2xl transition-all cursor-pointer"
                    >
                       Cancel
                    </button>
                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-4 sm:py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                       {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
                       {editingProduct ? 'Update' : 'Create'}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

    </div>
  );
};

export default ProductManagement;
