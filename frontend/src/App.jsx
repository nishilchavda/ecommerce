import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { AuthProvider } from './context/AuthContext'
import Home from './Pages/Home'
import ForgetPassword from './Pages/Auth/ForgetPassword'
import ResetPassword from './Pages/Auth/ResetPassword'
import LoginSignup from './Pages/Auth/LoginSignup'
import Products from './Pages/Shop/Products'
import ProductDetails from './Pages/Shop/ProductDetails'
import CategoryPage from './Pages/Shop/CategoryPage'
import Profile from './Pages/Profile'
import Wishlist from './Pages/Wishlist'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import CartAndOrders from './Pages/CartAndOrders'
import Checkout from './Pages/Checkout'
import Deals from './Pages/Deals'
import Chatbot from './Components/Chatbot/Chatbot'

// Admin Pages
import AdminLayout from './Pages/Admin/AdminLayout'
import Dashboard from './Pages/Admin/Dashboard'
import ProductManagement from './Pages/Admin/ProductManagement'

const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPath && <Navbar />}
      <main className={`grow w-full ${isAdminPath ? '' : ''}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login-signup" element={<LoginSignup />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/shop" element={<Products />} />
          <Route path="/categories" element={<CategoryPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart-orders" element={<CartAndOrders />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/deals" element={<Deals />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="orders" element={<div className="p-8 text-center bg-slate-800/40 rounded-3xl border border-slate-700">Orders Management (Coming Soon)</div>} />
            <Route path="users" element={<div className="p-8 text-center bg-slate-800/40 rounded-3xl border border-slate-700">Users Management (Coming Soon)</div>} />
            <Route path="settings" element={<div className="p-8 text-center bg-slate-800/40 rounded-3xl border border-slate-700">Admin Settings (Coming Soon)</div>} />
          </Route>
        </Routes>
      </main>
      {!isAdminPath && <Footer />}
      <Chatbot />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
      <ToastContainer position="bottom-right" />
    </AuthProvider>
  )
}

export default App
