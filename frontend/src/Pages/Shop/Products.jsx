import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Magnetic from "../../Components/ui/Magnetic";
import {
  ShoppingBag,
  Star,
  ArrowRight,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const Products = () => {
  const { token } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const containerRef = useRef(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // fetch all products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/product/all");
        setProducts(res.data.products || []);

        if (token) {
          const wlRes = await api.get("/wishlist/all");
          setWishlist(wlRes.data.wishlist?.productIds || []);
          const cartRes = await api.get("/cart/all");
          setCart(cartRes.data.cart?.items || []);
        }
      } catch (error) {
        toast.error("Failed to load products");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [token]);

  // Handle filtering
  useEffect(() => {
    let result = products;
    if (categoryFilter) {
      result = products.filter(
        (p) => p.category?.toLowerCase() === categoryFilter.toLowerCase(),
      );
    }
    setFilteredProducts(result);
    setCurrentPage(1); // Reset to page 1 when filters change
  }, [categoryFilter, products]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    // Smooth transition
    gsap.to(".product-card", {
      y: 20,
      opacity: 0,
      duration: 0.3,
      stagger: 0.05,
      ease: "power2.in",
      onComplete: () => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
      },
    });
  };

  // add to cart
  const addToCart = async (product) => {
    if (!token) {
      navigate("/login-signup");
      return;
    }

    const isAddedToCart = cart.some(
      (item) => (item.productId?._id || item.productId) === product._id,
    );

    if (isAddedToCart) {
      toast.info("Item already in cart");
      return;
    }

    try {
      await api.post("/cart/add", {
        item: { productId: product._id },
      });
      const cartRes = await api.get("/cart/all");
      setCart(cartRes.data.cart?.items || []);
      window.dispatchEvent(new Event("cartUpdate"));
      toast.success("Added to Cart!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const [wishlistStatus, setWishlistStatus] = useState({
    id: null,
    type: null,
  });

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
              y: -30, // Start above the target position
              opacity: 0,
              scale: 0.9,
              duration: 0.5,
              ease: "power3.out",
            },
            {
              y: 0, // Slide down to original position
              opacity: 1,
              scale: 1,
              duration: 0.5,
              ease: "power3.out", // Smooth deceleration
            },
          ).to(msgEl, {
            y: 30, // Exit by sliding further down
            opacity: 0,
            scale: 0.9,
            duration: 0.4,
            delay: 1.2, // Wait while user reads it
            ease: "power2.in",
            onComplete: () => setWishlistStatus({ id: null, type: null }),
          });
        }
      }, 10);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update wishlist");
    }
  };

  useGSAP(
    () => {
      if (!loading && paginatedProducts.length > 0) {
        gsap.fromTo(
          ".product-card",
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.2,
          },
        );

        gsap.fromTo(
          ".shop-header",
          { y: -30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
          },
        );

        gsap.fromTo(
          ".pagination-item",
          { scale: 0.8, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.6,
            stagger: 0.05,
            ease: "back.out(1.7)",
            delay: 0.8,
          },
        );
      }
    },
    { scope: containerRef, dependencies: [loading, paginatedProducts] },
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-slate-50 pt-22 pb-20 font-['Outfit',sans-serif]"
    >
      <div className="w-[95%] max-w-7xl mx-auto">
        <div className="shop-header flex flex-col md:flex-row justify-between items-end mb-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4 capitalize">
              {categoryFilter
                ? `${categoryFilter} Collection`
                : "Latest Arrivals"}
            </h1>
            <p className="text-slate-500 font-medium max-w-md">
              Browse our collection of premium fashion designed for your
              everyday lifestyle.
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <select className="bg-white border border-slate-200 text-slate-700 py-3 px-6 rounded-full outline-none font-bold shadow-sm focus:ring-2 focus:ring-blue-600 cursor-pointer">
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>
        </div>

        {paginatedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-4xl border border-slate-100 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-700">
              No products found in this category.
            </h2>
            <Link
              to="/shop"
              className="text-blue-600 font-bold mt-4 inline-block hover:underline"
            >
              Clear Filters
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-8 gap-2">
              {paginatedProducts.map((product) => (
                <div
                  key={product._id}
                  className="product-card group relative bg-white rounded-3xl sm:p-4 p-2 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] hover:shadow-xl transition-all duration-500"
                >
                  {/* Product Image */}
                  <Link
                    to={`/product/${product._id}`}
                    className="block relative aspect-4/5 overflow-hidden rounded-2xl sm:mb-4 mb-2 bg-slate-100"
                  >
                    <img
                      src={
                        product.images?.[0] ||
                        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070&auto=format&fit=crop"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    />

                    {/* Badges */}
                    {product.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-black px-3 py-1.5 rounded-full z-10 shadow-sm">
                        -{product.discount}%
                      </div>
                    )}
                    {product.isNewProduct && (
                      <div className="absolute top-3 right-3 bg-blue-600 text-white text-xs font-black px-3 py-1.5 rounded-full z-10 shadow-sm">
                        NEW
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWishlist(product);
                      }}
                      className={`absolute top-3 right-3 z-20 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all shadow-sm cursor-pointer ${
                        wishlist.some(
                          (item) =>
                            (item.productId?._id || item.productId) ===
                            product._id,
                        )
                          ? "bg-red-500 text-white"
                          : "bg-white/80 text-slate-400 hover:text-red-500"
                      }`}
                    >
                      <Heart
                        size={18}
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
                      <div className="absolute inset-0 flex items-start justify-end right-3 top-14 z-30 pointer-events-none">
                        <div
                          className={`wishlist-msg-${product._id} bg-white/90 backdrop-blur-md text-slate-800 py-1 px-3 rounded-full text-sm shadow-xl border border-white/50 font-bold`}
                        >
                          {wishlistStatus.type === "added"
                            ? "Added to ❤️"
                            : "Removed from 🤍"}
                        </div>
                      </div>
                    )}
                  </Link>

                  {/* Product Info */}
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="sm:text-lg text-base font-bold text-slate-900 sm:truncate pr-4">
                          {product.name}
                        </h3>
                        <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
                          {product.brand || "Premium"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mb-3 text-amber-400">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} size={14} fill="currentColor" />
                      ))}
                      <span className="text-xs text-slate-400 ml-1 font-bold">
                        (4.8)
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base sm:text-xl font-black text-slate-900">
                          $
                          {(
                            product.price -
                            (product.price * (product.discount || 0)) / 100
                          ).toFixed(2)}
                        </span>
                        {product.discount > 0 && (
                          <span className="text-sm font-bold text-slate-400 line-through">
                            ${product.price}
                          </span>
                        )}
                      </div>

                      <Magnetic>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product);
                          }}
                          className="bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-900 p-3 rounded-full transition-colors cursor-pointer shadow-sm active:scale-90"
                        >
                          <ShoppingBag size={20} strokeWidth={2.5} />
                        </button>
                      </Magnetic>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination UI */}
            {totalPages > 1 && (
              <div className="mt-20 flex justify-center items-center gap-3">
                <Magnetic>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-item w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                  >
                    <ChevronLeft size={20} />
                  </button>
                </Magnetic>

                <div className="flex gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <Magnetic key={i}>
                      <button
                        onClick={() => handlePageChange(i + 1)}
                        className={`pagination-item w-12 h-12 flex items-center justify-center rounded-2xl font-black text-sm transition-all shadow-sm cursor-pointer ${
                          currentPage === i + 1
                            ? "bg-slate-900 text-white scale-110"
                            : "bg-white border border-slate-200 text-slate-600 hover:border-slate-900"
                        }`}
                      >
                        {i + 1}
                      </button>
                    </Magnetic>
                  ))}
                </div>

                <Magnetic>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-item w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-blue-600 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-sm cursor-pointer"
                  >
                    <ChevronRight size={20} />
                  </button>
                </Magnetic>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
