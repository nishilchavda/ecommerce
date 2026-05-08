import React, { useState, useEffect, useRef, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import api from "../../api/axios";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Magnetic from "../../Components/ui/Magnetic";
import {
  ShoppingBag,
  Star,
  Heart,
  ArrowLeft,
  Truck,
  ShieldCheck,
  RefreshCw,
  Minus,
  Plus,
} from "lucide-react";
import { toast } from "react-toastify";

const ProductDetails = () => {
  const { id } = useParams();
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const containerRef = useRef(null);

  const [wishlistStatus, setWishlistStatus] = useState({
    id: null,
    type: null,
  });

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await api.get(`/product/${id}`);
        setProduct(res.data.product);

        if (token) {
          const wlRes = await api.get("/wishlist/all");
          setWishlist(wlRes.data.wishlist?.productIds || []);
        }
      } catch (error) {
        toast.error("Failed to load product details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id, token]);

  useGSAP(
    () => {
      if (!loading && product) {
        gsap.fromTo(
          ".pd-gallery",
          { x: -50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        );
        gsap.fromTo(
          ".pd-info > *",
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            delay: 0.2,
          },
        );
      }
    },
    { scope: containerRef, dependencies: [loading, product] },
  );

  const handleAddToCart = async () => {
    if (!token) {
      navigate("/login-signup");
      return;
    }
    setAddingToCart(true);
    try {
      await api.post("/cart/add", {
        item: { productId: product._id, quantity, price: product.price },
      });
      window.dispatchEvent(new Event("cartUpdate"));
      toast.success(`Added ${quantity} ${product.name} to cart!`);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add to cart";
      toast.error(msg);
    } finally {
      setAddingToCart(false);
    }
  };

  const toggleWishlist = async (product) => {
    if (!token) {
      navigate("/login-signup");
      return;
    }

    const isWishlisted = wishlist.some(
      (item) => (item.productId?._id || item.productId) === product._id,
    );

    try {
      if (isWishlisted) {
        const entry = wishlist.find(
          (item) => (item.productId?._id || item.productId) === product._id,
        );
        await api.delete(`/wishlist/${entry._id}`);
        setWishlist((prev) => prev.filter((item) => item._id !== entry._id));
        setWishlistStatus({ id: product._id, type: "removed" });
      } else {
        await api.post("/wishlist/add", {
          item: { productId: product._id },
        });
        const wlRes = await api.get("/wishlist/all");
        setWishlist(wlRes.data.wishlist?.productIds || []);
        setWishlistStatus({ id: product._id, type: "added" });
      }

      // --- GSAP ANIMATION TRIGGER ---
      setTimeout(() => {
        const msgEl = document.querySelector(`.wishlist-msg-${product._id}`);
        if (msgEl) {
          const tl = gsap.timeline();

          tl.fromTo(
            msgEl,
            {
              y: 30, // Start BELOW the final position
              opacity: 0,
              scale: 0.9,
              duration: 0.4,
              delay: 0.3,
              ease: "power2.out",
            },
            {
              y: 0, // Move UP to the original spot
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: "power3.out",
            },
          ).to(msgEl, {
            y: -30, // Exit by moving UP further
            opacity: 0,
            scale: 0.9,
            duration: 0.4,
            delay: 1.2,
            ease: "power2.in",
            onComplete: () => setWishlistStatus({ id: null, type: null }),
          });
        }
      }, 10);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update wishlist");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col pt-20 gap-4">
        <h2 className="text-2xl font-bold text-slate-700">
          Product not found.
        </h2>
        <Link
          to="/shop"
          className="text-blue-600 font-semibold hover:underline"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const images =
    product.images?.length > 0
      ? product.images
      : [
          "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop",
        ];
  const finalPrice =
    product.price - (product.price * (product.discount || 0)) / 100;

  return (
    <div ref={containerRef} className="min-h-screen bg-white pt-28 pb-20">
      <div className="w-[95%] max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-semibold"
          >
            <ArrowLeft size={18} /> Back to Shop
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Gallery */}
          <div className="pd-gallery space-y-4">
            <div className="aspect-4/5 md:aspect-square w-full rounded-3xl overflow-hidden bg-slate-100 border border-slate-100 relative group">
              <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              {product.discount > 0 && (
                <div className="absolute top-5 left-5 bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-red-500/30 z-10">
                  -{product.discount}% OFF
                </div>
              )}
              {product.isNewProduct && (
                <div className="absolute top-5 right-5 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-blue-600/30 z-10">
                  NEW
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImage === idx
                        ? "border-slate-900 opacity-100 shadow-md"
                        : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Thumbnail ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="pd-info flex flex-col justify-center">
            {/* Category badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-slate-100 text-slate-600 font-bold text-xs uppercase tracking-wider rounded-full">
                {product.category || "Clothing"}
              </span>
              {product.isNewProduct && (
                <span className="px-3 py-1 bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-wider rounded-full">
                  New Arrival
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-1">
              {product.name}
            </h1>

            <p className="text-base font-bold text-slate-400 mb-5 uppercase tracking-widest">
              {product.brand || "Premium Brand"}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex items-center text-amber-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <span className="text-sm font-semibold text-slate-500">
                128 Reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-3 mb-6 pb-6 border-b border-slate-100">
              <span className="text-3xl font-black text-slate-900">
                ${finalPrice.toFixed(2)}
              </span>
              {product.discount > 0 && (
                <>
                  <span className="text-lg font-bold text-slate-400 line-through mb-0.5">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-1 rounded-full mb-1">
                    Save {product.discount}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-600 font-medium leading-relaxed mb-8">
              {product.description ||
                "Experience the perfect blend of comfort and style with this premium piece. Crafted with meticulous attention to detail, it's designed to elevate your everyday look."}
            </p>

            {/* Quantity + Actions */}
            <div className="flex items-center gap-3 mb-8">
              {/* Quantity selector */}
              <div className="flex items-center bg-slate-100 rounded-full p-1 border border-slate-200">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-white rounded-full transition-colors cursor-pointer"
                >
                  <Minus size={16} strokeWidth={2.5} />
                </button>
                <span className="w-10 text-center font-bold text-base text-slate-900">
                  {quantity}
                </span>
                <button
                  onClick={() =>
                    setQuantity(Math.min(product.stock || 10, quantity + 1))
                  }
                  className="w-10 h-10 flex items-center justify-center text-slate-600 hover:bg-white rounded-full transition-colors cursor-pointer"
                >
                  <Plus size={16} strokeWidth={2.5} />
                </button>
              </div>

              {/* Add to Cart */}

              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex-1 bg-slate-900 text-white h-12 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors shadow-xl shadow-slate-900/20 disabled:opacity-60 cursor-pointer"
              >
                {addingToCart ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} /> Add to Cart
                  </>
                )}
              </button>

              {/* Wishlist */}
              <div className="relative">
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`w-full h-12 flex items-center justify-center border-2 sm:px-6 px-4 gap-2 rounded-full transition-all cursor-pointer ${
                    wishlist.some(
                      (item) =>
                        (item.productId?._id || item.productId) === product._id,
                    )
                      ? "bg-red-50 border-red-300 text-red-500"
                      : "bg-white border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-300"
                  }`}
                >
                  <p className="sm:block hidden">Wishlist</p>
                  <Heart
                    size={20}
                    fill={
                      wishlist.some(
                        (item) =>
                          (item.productId?._id || item.productId) ===
                          product._id,
                      )
                        ? "currentColor"
                        : "none"
                    }
                  />
                </button>

                {wishlistStatus.id === product._id && (
                  <div className="absolute inset-0 flex items-center justify-center -top-24 z-30 pointer-events-none">
                    <div
                      className={`wishlist-msg-${product._id} bg-white/90 backdrop-blur-md text-slate-800 py-1 px-3 rounded-full text-sm shadow-xl border border-white/50 font-bold whitespace-nowrap`}
                    >
                      {wishlistStatus.type === "added"
                        ? "Added to ❤️"
                        : "Removed from 🤍"}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  icon: <Truck size={20} />,
                  title: "Free Shipping",
                  desc: "Orders over $100",
                },
                {
                  icon: <RefreshCw size={20} />,
                  title: "Easy Returns",
                  desc: "30-day policy",
                },
                {
                  icon: <ShieldCheck size={20} />,
                  title: "Secure Pay",
                  desc: "100% protected",
                },
              ].map((f, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100"
                >
                  <div className="text-blue-600 shrink-0">{f.icon}</div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {f.title}
                    </h4>
                    <p className="text-xs text-slate-500">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
