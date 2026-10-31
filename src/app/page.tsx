'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  PRODUCTS,
  MAGAZINE_ARTICLES,
  Product,
  MagazineArticle,
  Category,
} from '@/data/mockData';
import { ProductIllustration } from '@/components/ProductIllustration';
import {
  ShoppingBag,
  Search,
  Heart,
  Scale,
  Sparkles,
  BookOpen,
  Star,
  Check,
  X,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Zap,
  SlidersHorizontal,
  Award,
  Clock,
  ChevronRight,
  PackageCheck,
} from 'lucide-react';

interface CartItem {
  product: Product;
  quantity: number;
}

interface OrderReceipt {
  orderId: string;
  date: string;
  customerName: string;
  email: string;
  address: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
}

const CATEGORIES: Category[] = [
  'All',
  'Laptops',
  'Smartphones',
  'Audio',
  'Cameras',
  'Wearables',
  'Accessories',
];

export default function VoltMagazineStore() {
  // Navigation & View Mode
  const [activeSection, setActiveSection] = useState<'store' | 'magazine'>('store');

  // Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(3000);

  // Client-Side Persistent State (localStorage)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [orders, setOrders] = useState<OrderReceipt[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<MagazineArticle | null>(null);

  // Checkout State
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'form' | 'success'>('cart');
  const [customerName, setCustomerName] = useState('Alex Mercer');
  const [customerEmail, setCustomerEmail] = useState('alex.mercer@voltmag.io');
  const [customerAddress, setCustomerAddress] = useState('742 Silicon Avenue, Suite 4B, San Francisco, CA');
  const [lastOrder, setLastOrder] = useState<OrderReceipt | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load saved state from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('volt_cart_v1');
      const savedWishlist = localStorage.getItem('volt_wishlist_v1');
      const savedCompare = localStorage.getItem('volt_compare_v1');
      const savedOrders = localStorage.getItem('volt_orders_v1');

      if (savedCart) setCart(JSON.parse(savedCart));
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
      if (savedCompare) setCompareIds(JSON.parse(savedCompare));
      if (savedOrders) setOrders(JSON.parse(savedOrders));
    } catch (e) {
      console.error('Failed to read local storage', e);
    }
    setIsHydrated(true);
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem('volt_cart_v1', JSON.stringify(cart));
  }, [cart, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem('volt_wishlist_v1', JSON.stringify(wishlist));
  }, [wishlist, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem('volt_compare_v1', JSON.stringify(compareIds));
  }, [compareIds, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem('volt_orders_v1', JSON.stringify(orders));
  }, [orders, isHydrated]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory =
        selectedCategory === 'All' || product.category === selectedCategory;
      const matchesPrice = product.price <= maxPrice;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        product.name.toLowerCase().includes(q) ||
        product.brand.toLowerCase().includes(q) ||
        product.tagline.toLowerCase().includes(q) ||
        product.category.toLowerCase().includes(q) ||
        product.specs.some((s) => s.value.toLowerCase().includes(q));

      return matchesCategory && matchesPrice && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [selectedCategory, maxPrice, searchQuery, sortBy]);

  // Cart Helpers
  const addToCart = (product: Product, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    showToast(`Added ${product.name} to bag`);
  };

  const updateCartQty = (productId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.product.id === productId
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      const next = exists
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      showToast(exists ? 'Removed from saved list' : 'Saved to reading & wish list');
      return next;
    });
  };

  const toggleCompare = (productId: string) => {
    setCompareIds((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 3) {
        showToast('Up to 3 devices can be compared side-by-side');
        return prev;
      }
      showToast('Added device to Lab Spec Comparison');
      return [...prev, productId];
    });
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const discountAmount = appliedPromo === 'VOLT10' ? Math.round(cartSubtotal * 0.1) : 0;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'VOLT10') {
      setAppliedPromo('VOLT10');
      showToast('Promo code VOLT10 applied (10% off)');
    } else {
      showToast('Try code VOLT10 for 10% subscriber discount');
    }
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const newOrder: OrderReceipt = {
      orderId: `VLT-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      customerName,
      email: customerEmail,
      address: customerAddress,
      items: [...cart],
      subtotal: cartSubtotal,
      discount: discountAmount,
      total: cartTotal,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setLastOrder(newOrder);
    setCart([]);
    setAppliedPromo(null);
    setPromoCode('');
    setCheckoutStep('success');
    showToast(`Order ${newOrder.orderId} confirmed!`);
  };

  const comparedProducts = useMemo(
    () => PRODUCTS.filter((p) => compareIds.includes(p.id)),
    [compareIds]
  );

  const featuredArticle = MAGAZINE_ARTICLES[0];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Editorial Ticker Bar */}
      <div className="bg-indigo-950/70 border-b border-indigo-500/20 text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-indigo-200">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 font-semibold uppercase tracking-wider text-[10px]">
              <Zap className="w-3 h-3" /> Issue #42 // Autumn 2026
            </span>
            <span className="hidden sm:inline text-slate-300">
              100% Static Serverless Architecture • Local Browser Persistence • Reader Promo:{' '}
              <code className="text-indigo-300 font-mono font-bold">VOLT10</code> for 10% Off
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Lab Tested: 10 Flagship Electron Devices</span>
            {orders.length > 0 && (
              <span className="text-emerald-400 font-medium">
                {orders.length} Saved Order{orders.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-950/85 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveSection('store')}
              className="text-left group focus:outline-none"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <Cpu className="w-5 h-5 text-slate-950 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-xl font-black tracking-tight text-white block leading-none">
                    VOLT<span className="text-indigo-400">.MAG</span>
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-slate-400 block mt-0.5">
                    Electron Review & Store
                  </span>
                </div>
              </div>
            </button>

            {/* Primary Switcher */}
            <nav className="hidden md:flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveSection('store')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeSection === 'store'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                Hardware Catalog
              </button>
              <button
                onClick={() => setActiveSection('magazine')}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeSection === 'magazine'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Editorial Issues ({MAGAZINE_ARTICLES.length})
              </button>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeSection !== 'store') setActiveSection('store');
                }}
                placeholder="Search M4 OLED, Planar ANC, 240W GaN, Cameras..."
                className="w-full bg-slate-900/90 border border-slate-800 focus:border-indigo-500 rounded-xl pl-10 pr-8 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Compare Button */}
            <button
              onClick={() => setIsCompareOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Compare Devices Side-by-Side"
            >
              <Scale className="w-5 h-5" />
              {compareIds.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-cyan-500 text-slate-950 text-xs font-bold flex items-center justify-center">
                  {compareIds.length}
                </span>
              )}
            </button>

            {/* Wishlist Count Pill */}
            <button
              onClick={() => {
                if (wishlist.length === 0) {
                  showToast('Click the heart icon on any device to bookmark it');
                } else {
                  const firstWish = PRODUCTS.find((p) => p.id === wishlist[0]);
                  if (firstWish) setSelectedProduct(firstWish);
                }
              }}
              className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Saved Wishlist Devices"
            >
              <Heart
                className={`w-5 h-5 ${
                  wishlist.length > 0 ? 'fill-rose-500 text-rose-500' : ''
                }`}
              />
              {wishlist.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white text-xs font-bold flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Drawer Trigger */}
            <button
              onClick={() => {
                setCheckoutStep('cart');
                setIsCartOpen(true);
              }}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/25 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Bag</span>
              <span className="px-2 py-0.5 rounded-md bg-indigo-950/60 text-indigo-200 text-xs font-mono">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Search & View Switcher */}
        <div className="px-4 pb-3 flex flex-col gap-2 md:hidden">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveSection('store')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                activeSection === 'store'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400'
              }`}
            >
              Hardware Store
            </button>
            <button
              onClick={() => setActiveSection('magazine')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold ${
                activeSection === 'magazine'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-900 text-slate-400'
              }`}
            >
              Magazine Features
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Editorial Cover Story Banner */}
        <section className="relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/60 shadow-2xl">
          <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 sm:p-10 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                COVER STORY & CURATED DROP
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-[1.1]">
                {featuredArticle.title}
              </h1>
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
                {featuredArticle.subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => setSelectedArticle(featuredArticle)}
                  className="px-6 py-3 rounded-xl bg-white text-slate-950 hover:bg-slate-200 font-bold text-sm inline-flex items-center gap-2 transition-colors"
                >
                  <BookOpen className="w-4 h-4" />
                  Read Full Lab Report
                </button>
                <button
                  onClick={() => {
                    const heroProd = PRODUCTS[0];
                    setSelectedProduct(heroProd);
                  }}
                  className="px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm inline-flex items-center gap-2 transition-colors"
                >
                  Inspect AetherBook Pro 16
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center gap-6 pt-2 text-xs text-slate-400">
                <span>By {featuredArticle.author.name}</span>
                <span>•</span>
                <span>{featuredArticle.readTime}</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">3 Featured Devices Tested</span>
              </div>
            </div>

            {/* Featured Hardware Spotlight Card inside Hero */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-slate-950/80 border border-slate-800 p-5 space-y-4 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> Issue #42 Hardware of the Month
                  </span>
                  <span className="text-xs font-mono text-slate-400">SCORE: 9.8 / 10</span>
                </div>
                <ProductIllustration
                  type={PRODUCTS[0].svgType}
                  accentColor={PRODUCTS[0].accentColor}
                  className="w-full h-44"
                />
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-indigo-400 font-semibold">
                      {PRODUCTS[0].brand}
                    </div>
                    <h3 className="text-lg font-bold text-white">{PRODUCTS[0].name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{PRODUCTS[0].tagline}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xl font-black text-white">
                      ${PRODUCTS[0].price.toLocaleString()}
                    </div>
                    {PRODUCTS[0].originalPrice && (
                      <div className="text-xs text-slate-500 line-through">
                        ${PRODUCTS[0].originalPrice.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => addToCart(PRODUCTS[0])}
                    className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add to Bag
                  </button>
                  <button
                    onClick={() => setSelectedProduct(PRODUCTS[0])}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                  >
                    Specs & Verdict
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* STOREFRONT VIEW */}
        {activeSection === 'store' && (
          <section className="space-y-8">
            {/* Category Pills & Filter Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl">
              {/* Categories */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
                {CATEGORIES.map((category) => {
                  const count =
                    category === 'All'
                      ? PRODUCTS.length
                      : PRODUCTS.filter((p) => p.category === category).length;
                  const active = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                        active
                          ? 'bg-white text-slate-950 shadow-sm'
                          : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <span>{category}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          active
                            ? 'bg-slate-950/15 text-slate-950'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Price & Sort Controls */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-xs text-slate-400">
                    Max Price:{' '}
                    <strong className="text-white font-mono">
                      ${maxPrice.toLocaleString()}
                    </strong>
                  </span>
                  <input
                    type="range"
                    min={200}
                    max={3000}
                    step={100}
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-24 accent-indigo-500 cursor-pointer"
                  />
                </div>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="featured">Sort: Editorial Pick</option>
                  <option value="rating">Sort: Highest Lab Rating</option>
                  <option value="price-asc">Sort: Price (Low → High)</option>
                  <option value="price-desc">Sort: Price (High → Low)</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-3xl border border-slate-800/80 space-y-4">
                <p className="text-lg font-semibold text-slate-300">
                  No electron devices match your current filter criteria.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setMaxPrice(3000);
                    setSearchQuery('');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const isWished = wishlist.includes(product.id);
                  const isCompared = compareIds.includes(product.id);

                  return (
                    <div
                      key={product.id}
                      className="group rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-indigo-500/50 transition-all duration-300 flex flex-col overflow-hidden shadow-lg"
                    >
                      {/* Top Card Illustration & Badges */}
                      <div className="p-4 pb-0 relative">
                        <div className="absolute top-7 left-7 z-20 flex flex-wrap gap-1.5">
                          {product.badge && (
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow ${
                                product.badge === 'Editor Choice'
                                  ? 'bg-indigo-500 text-white'
                                  : product.badge === 'Best Seller'
                                  ? 'bg-amber-400 text-slate-950'
                                  : product.badge === 'New Release'
                                  ? 'bg-emerald-400 text-slate-950'
                                  : 'bg-rose-500 text-white'
                              }`}
                            >
                              {product.badge}
                            </span>
                          )}
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-slate-950/85 text-slate-300 border border-slate-700/80 backdrop-blur-md">
                            {product.category}
                          </span>
                        </div>

                        {/* Quick Wishlist & Compare Icons */}
                        <div className="absolute top-7 right-7 z-20 flex flex-col gap-1.5">
                          <button
                            onClick={() => toggleWishlist(product.id)}
                            className="p-2 rounded-full bg-slate-950/80 border border-slate-800 hover:border-rose-500/50 text-slate-300 hover:text-rose-400 transition-colors"
                            title="Save to Wishlist"
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                isWished ? 'fill-rose-500 text-rose-500' : ''
                              }`}
                            />
                          </button>
                          <button
                            onClick={() => toggleCompare(product.id)}
                            className={`p-2 rounded-full border transition-colors ${
                              isCompared
                                ? 'bg-cyan-500 text-slate-950 border-cyan-400'
                                : 'bg-slate-950/80 border-slate-800 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300'
                            }`}
                            title="Compare Specs"
                          >
                            <Scale className="w-4 h-4" />
                          </button>
                        </div>

                        <div
                          onClick={() => setSelectedProduct(product)}
                          className="cursor-pointer"
                        >
                          <ProductIllustration
                            type={product.svgType}
                            accentColor={product.accentColor}
                            className="w-full h-52"
                          />
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-indigo-400">
                              {product.brand}
                            </span>
                            <span className="inline-flex items-center gap-1 text-amber-400 font-semibold">
                              <Star className="w-3.5 h-3.5 fill-amber-400" />
                              {product.rating}{' '}
                              <span className="text-slate-500 font-normal">
                                ({product.reviewCount})
                              </span>
                            </span>
                          </div>

                          <h3
                            onClick={() => setSelectedProduct(product)}
                            className="text-lg font-bold text-white group-hover:text-indigo-300 cursor-pointer transition-colors"
                          >
                            {product.name}
                          </h3>

                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {product.tagline}
                          </p>

                          {/* Mini Spec Pills */}
                          <div className="pt-2 flex flex-wrap gap-1.5">
                            {product.specs.slice(0, 2).map((spec) => (
                              <span
                                key={spec.label}
                                className="text-[11px] bg-slate-950/90 border border-slate-800/90 text-slate-300 px-2.5 py-1 rounded-lg truncate max-w-full"
                              >
                                <strong className="text-slate-500 font-normal">
                                  {spec.label}:
                                </strong>{' '}
                                {spec.value}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Price & CTA Footer */}
                        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-3">
                          <div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-black text-white">
                                ${product.price.toLocaleString()}
                              </span>
                              {product.originalPrice && (
                                <span className="text-xs text-slate-500 line-through">
                                  ${product.originalPrice.toLocaleString()}
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              {product.stockCount} units in lab vault
                            </span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setSelectedProduct(product)}
                              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                            >
                              Review
                            </button>
                            <button
                              onClick={() => addToCart(product)}
                              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* EDITORIAL MAGAZINE SECTION (Always visible below store or when switched to Magazine tab) */}
        <section className="pt-6 border-t border-slate-800/80 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">
                VOLT // EDITORIAL DISPATCHES
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Long-Form Hardware Journalism & Tear-Downs
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-md">
              Every article links directly to the lab-tested hardware in our catalog so you can inspect full specifications and order with zero friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MAGAZINE_ARTICLES.map((article) => (
              <article
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="group cursor-pointer rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 transition-all p-6 flex flex-col justify-between space-y-5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-300 font-semibold border border-indigo-500/30">
                      {article.category}
                    </span>
                    <span className="text-slate-400 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center">
                      {article.author.avatarInitials}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">
                        {article.author.name}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {article.author.role}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read Issue <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Comparison Bar */}
      {compareIds.length > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-30 bg-slate-900/95 border border-cyan-500/40 backdrop-blur-xl px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
            <Scale className="w-4 h-4" />
            <span>{compareIds.length}/3 Selected for Lab Compare</span>
          </div>
          <button
            onClick={() => setIsCompareOpen(true)}
            className="px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs transition-colors"
          >
            Compare Specs Now
          </button>
          <button
            onClick={() => setCompareIds([])}
            className="text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white px-4 py-3 rounded-xl shadow-xl border border-indigo-400/40 flex items-center gap-2.5 text-xs font-semibold">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* PRODUCT DETAIL & EDITORIAL VERDICT MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                  {selectedProduct.brand} • {selectedProduct.category}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  {selectedProduct.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-5 space-y-4">
                <ProductIllustration
                  type={selectedProduct.svgType}
                  accentColor={selectedProduct.accentColor}
                  className="w-full h-60"
                />

                <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">Direct Magazine Price</span>
                    <div className="text-2xl font-black text-white">
                      ${selectedProduct.price.toLocaleString()}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      addToCart(selectedProduct);
                      setSelectedProduct(null);
                      setIsCartOpen(true);
                    }}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Bag & Checkout
                  </button>
                  <button
                    onClick={() => toggleCompare(selectedProduct.id)}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Scale className="w-4 h-4" />
                    {compareIds.includes(selectedProduct.id)
                      ? 'Remove from Comparison'
                      : 'Add to Spec Comparison'}
                  </button>
                </div>
              </div>

              <div className="md:col-span-7 space-y-5">
                <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> VOLT Lab Verdict ({selectedProduct.rating}/5.0)
                  </div>
                  <p className="text-sm text-slate-200 leading-relaxed italic">
                    &ldquo;{selectedProduct.editorialVerdict}&rdquo;
                  </p>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedProduct.description}
                </p>

                {/* Pros & Cons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-emerald-950/25 border border-emerald-500/20 space-y-2">
                    <div className="text-xs font-bold uppercase text-emerald-400">
                      What We Loved
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {selectedProduct.pros.map((pro) => (
                        <li key={pro} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-rose-950/25 border border-rose-500/20 space-y-2">
                    <div className="text-xs font-bold uppercase text-rose-400">
                      Watch Out For
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-300">
                      {selectedProduct.cons.map((con) => (
                        <li key={con} className="flex items-start gap-2">
                          <Minus className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Full Hardware Specifications */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Complete Technical Specifications
                  </h4>
                  <div className="rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
                    {selectedProduct.specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="px-4 py-2.5 bg-slate-950/60 flex items-center justify-between text-xs gap-4"
                      >
                        <span className="text-slate-400 font-medium">{spec.label}</span>
                        <span className="text-slate-100 font-semibold text-right">
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MAGAZINE ARTICLE READER MODAL WITH SHOPPABLE HARDWARE */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                {selectedArticle.category} • {selectedArticle.readTime}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">
                {selectedArticle.title}
              </h2>
              <p className="text-base text-slate-300 leading-relaxed">
                {selectedArticle.subtitle}
              </p>
              <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
                <div className="w-7 h-7 rounded-full bg-indigo-500 text-white font-bold flex items-center justify-center">
                  {selectedArticle.author.avatarInitials}
                </div>
                <span>
                  By <strong className="text-white">{selectedArticle.author.name}</strong> (
                  {selectedArticle.author.role}) • {selectedArticle.date}
                </span>
              </div>
            </div>

            {/* Key Takeaways Box */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Executive Lab Takeaways
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-200">
                {selectedArticle.keyTakeaways.map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Article Paragraphs */}
            <div className="space-y-4 text-slate-200 text-sm sm:text-base leading-relaxed font-serif">
              {selectedArticle.content.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Shop the Devices Mentioned in This Article */}
            <div className="pt-6 border-t border-slate-800 space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-indigo-400">
                Hardware Tested in This Article
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {PRODUCTS.filter((p) =>
                  selectedArticle.featuredProductIds.includes(p.id)
                ).map((prod) => (
                  <div
                    key={prod.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-[11px] text-indigo-400 font-semibold">
                        {prod.brand}
                      </div>
                      <div className="text-sm font-bold text-white">{prod.name}</div>
                      <div className="text-xs font-bold text-emerald-400 mt-1">
                        ${prod.price.toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(prod)}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0"
                    >
                      + Add to Bag
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIDE-BY-SIDE SPEC COMPARISON MODAL */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  VOLT HARDWARE BENCHMARK
                </span>
                <h2 className="text-2xl font-black text-white">
                  Side-by-Side Device Comparison
                </h2>
              </div>
              <button
                onClick={() => setIsCompareOpen(false)}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {comparedProducts.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-3">
                <Scale className="w-10 h-10 mx-auto text-slate-600" />
                <p>No devices selected for comparison yet.</p>
                <p className="text-xs">
                  Click the scale icon on up to 3 devices in the catalog to compare their specs side-by-side.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {comparedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-2xl bg-slate-950 border border-slate-800 p-5 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-400">
                          {product.brand}
                        </span>
                        <button
                          onClick={() => toggleCompare(product.id)}
                          className="text-xs text-slate-500 hover:text-rose-400"
                        >
                          Remove
                        </button>
                      </div>
                      <ProductIllustration
                        type={product.svgType}
                        accentColor={product.accentColor}
                        className="w-full h-36"
                      />
                      <h3 className="text-base font-bold text-white">{product.name}</h3>
                      <div className="text-xl font-black text-white">
                        ${product.price.toLocaleString()}
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        {product.specs.map((s) => (
                          <div key={s.label} className="text-xs">
                            <div className="text-slate-500">{s.label}</div>
                            <div className="text-slate-200 font-medium">{s.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(product)}
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold"
                    >
                      Add to Bag
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SHOPPING BAG & OFFLINE CHECKOUT DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between p-6 overflow-y-auto shadow-2xl">
            {/* Top Drawer Header */}
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-5 h-5 text-indigo-400" />
                  <h2 className="text-lg font-bold text-white">
                    {checkoutStep === 'cart' && `Your Hardware Bag (${cartCount})`}
                    {checkoutStep === 'form' && 'Express Local Checkout'}
                    {checkoutStep === 'success' && 'Order Confirmed'}
                  </h2>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* STEP 1: CART ITEMS */}
              {checkoutStep === 'cart' && (
                <>
                  {cart.length === 0 ? (
                    <div className="text-center py-16 space-y-4">
                      <ShoppingBag className="w-12 h-12 text-slate-700 mx-auto" />
                      <p className="text-sm text-slate-400">
                        Your hardware bag is currently empty.
                      </p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-white"
                      >
                        Explore Electron Catalog
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map(({ product, quantity }) => (
                        <div
                          key={product.id}
                          className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3"
                        >
                          <div className="space-y-1">
                            <div className="text-[10px] font-bold uppercase text-indigo-400">
                              {product.brand}
                            </div>
                            <div className="text-sm font-bold text-white">
                              {product.name}
                            </div>
                            <div className="text-xs text-slate-400">
                              ${product.price.toLocaleString()} each
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateCartQty(product.id, -1)}
                              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-mono font-bold w-5 text-center">
                              {quantity}
                            </span>
                            <button
                              onClick={() => updateCartQty(product.id, 1)}
                              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => removeFromCart(product.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-400 ml-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}

                      {/* Promo Code Form */}
                      <form onSubmit={handleApplyPromo} className="flex gap-2 pt-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Promo code (Try VOLT10)"
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white"
                        >
                          Apply
                        </button>
                      </form>
                    </div>
                  )}
                </>
              )}

              {/* STEP 2: CHECKOUT FORM */}
              {checkoutStep === 'form' && (
                <form id="checkout-form" onSubmit={handleCompleteOrder} className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-indigo-200 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-400 shrink-0" />
                    <span>
                      Zero-Server Mode: Your order receipt is generated locally and saved in your browser.
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-medium">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-medium">
                      Dispatch Email
                    </label>
                    <input
                      required
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-medium">
                      Shipping Destination
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={customerAddress}
                      onChange={(e) => setCustomerAddress(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white"
                    />
                  </div>
                </form>
              )}

              {/* STEP 3: INSTANT ORDER RECEIPT */}
              {checkoutStep === 'success' && lastOrder && (
                <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-4">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <PackageCheck className="w-7 h-7" />
                    <div>
                      <div className="text-xs font-mono uppercase">
                        Receipt #{lastOrder.orderId}
                      </div>
                      <div className="text-base font-bold text-white">
                        Hardware Dispatch Scheduled
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1 border-t border-slate-800 pt-3">
                    <div>
                      <strong className="text-slate-500">Recipient:</strong>{' '}
                      {lastOrder.customerName}
                    </div>
                    <div>
                      <strong className="text-slate-500">Address:</strong>{' '}
                      {lastOrder.address}
                    </div>
                    <div>
                      <strong className="text-slate-500">Date:</strong> {lastOrder.date}
                    </div>
                  </div>

                  <div className="space-y-1.5 border-t border-slate-800 pt-3">
                    {lastOrder.items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex justify-between text-xs text-slate-300"
                      >
                        <span>
                          {item.quantity}x {item.product.name}
                        </span>
                        <span className="font-mono">
                          ${(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                      <span>Total Paid</span>
                      <span>${lastOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Summary & Action Buttons */}
            {cart.length > 0 && checkoutStep !== 'success' && (
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Subtotal</span>
                    <span>${cartSubtotal.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>Subscriber Discount (VOLT10)</span>
                      <span>-${discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>Insured Courier Shipping</span>
                    <span className="text-emerald-400">FREE</span>
                  </div>
                  <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                    <span>Total</span>
                    <span>${cartTotal.toLocaleString()}</span>
                  </div>
                </div>

                {checkoutStep === 'cart' ? (
                  <button
                    onClick={() => setCheckoutStep('form')}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-colors"
                  >
                    Proceed to Express Checkout
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep('cart')}
                      className="px-4 py-3 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      form="checkout-form"
                      className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-colors"
                    >
                      Complete Order (${cartTotal.toLocaleString()})
                    </button>
                  </div>
                )}
              </div>
            )}

            {checkoutStep === 'success' && (
              <button
                onClick={() => {
                  setCheckoutStep('cart');
                  setIsCartOpen(false);
                }}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm"
              >
                Continue Reading & Shopping
              </button>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-10 px-4 mt-16">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span className="font-bold text-slate-300">VOLT.MAG</span> — Independent Electron Hardware Magazine & Storefront
          </div>
          <div>
            Built with Next.js Static Export (`output: &apos;export&apos;`) • Runs 100% Client-Side with Mock Data
          </div>
        </div>
      </footer>
    </div>
  );
}

