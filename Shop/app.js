/* ============================================================
   FIREBASE CLOUD DATABASE CONFIGURATION
   ============================================================ */

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAiJ1h6dbpCPd_-IFZWugCqb6RVZC6kCDg",
  authDomain: "dk-store-a10f4.firebaseapp.com",
  projectId: "dk-store-a10f4",
  storageBucket: "dk-store-a10f4.firebasestorage.app",
  messagingSenderId: "988073277280",
  appId: "1:988073277280:web:81ab753ad681a155b15005",
  measurementId: "G-HPKGRRPTT3"
};

let db = null;
let isCloudActive = false;

try {
  if (typeof firebase !== "undefined" && FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.apiKey !== "YOUR_API_KEY") {
    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.firestore();
    isCloudActive = true;
    console.log("☁️ Connected to Firebase Cloud Firestore");
  } else {
    console.log("ℹ️ Running in Local Storage mode.");
  }
} catch (err) {
  console.error("Firebase init failed, falling back to local storage:", err);
}

/* ============================================================
   CONSTANTS & INITIAL DATA
   ============================================================ */

const AUDIENCES = ["Kids", "Women"];
const CATEGORIES = ["Clothing", "Jewelry"];

const DEFAULT_CONFIG = {
  storeName: "DK Craze",
  tagline: "The Trend Store — Kids & Women",
  whatsapp: "919843441110",
  email: "dkcrazethetrendstore@gmail.com",
  address: "",
  instagram: "https://www.instagram.com/reel/DclSrc6pNV8/?igsi=b2R5bzltcXZ0b2M4",
  youtube: "https://www.youtube.com/@DkCraze19",
  wholesaleNote: "Wholesale available — message us on WhatsApp for bulk pricing.",
  upiId: "hemabharathik@oksbi",
  adminPassword: "admin123",
};

const SEED_PRODUCTS = [
  {
    id: "p1", name: "Floral Lace Baby Frock", brand: "DK Craze Kids", audience: "Kids", category: "Clothing",
    subcategory: "Dresses", stock: 18, featured: true, price: 699, originalPrice: 899,
    description: "Delicate and breathable cotton-blend frock featuring fine gold embroidery and soft lining.",
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80",
    wholesaleAvailable: true, createdAt: 8,
  },
  {
    id: "p2", name: "Kids Royal Velvet Kurta Set", brand: "DK Heritage", audience: "Kids", category: "Clothing",
    subcategory: "Ethnic", stock: 12, featured: true, price: 1199, originalPrice: 1499,
    description: "Traditional royal blue velvet kurta with intricate gold piping. Comfortable and festive.",
    image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80",
    wholesaleAvailable: false, createdAt: 7,
  },
  {
    id: "p3", name: "Kids Gold Peacock Charm Bracelet", brand: "DK Sparkle", audience: "Kids", category: "Jewelry",
    subcategory: "Bracelets", stock: 25, featured: false, price: 349, originalPrice: 499,
    description: "Lightweight, hypoallergenic brass charm bracelet with peacock enamel accents.",
    image: "https://images.unsplash.com/photo-1611591475129-410a8d672ea4?auto=format&fit=crop&w=800&q=80",
    wholesaleAvailable: true, createdAt: 6,
  },
  {
    id: "p4", name: "Peacock Blue Silk Evening Gown", brand: "DK Couture", audience: "Women", category: "Clothing",
    subcategory: "Dresses", stock: 6, featured: true, price: 3899, originalPrice: 4599,
    description: "Premium pure satin-silk gown with a draped silhouette and subtle gold hem detailing.",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80",
    wholesaleAvailable: false, createdAt: 5,
  },
  {
    id: "p5", name: "Ivory & Gold Embroidered Anarkali", brand: "DK Heritage", audience: "Women", category: "Clothing",
    subcategory: "Ethnic", stock: 10, featured: true, price: 4499, originalPrice: 5299,
    description: "Half-white chanderi silk Anarkali suit finished with fine zardozi embroidery work.",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    wholesaleAvailable: true, createdAt: 4,
  },
  {
    id: "p6", name: "24K Gold Plated Choker Necklace", brand: "DK Fine Jewels", audience: "Women", category: "Jewelry",
    subcategory: "Necklaces", stock: 8, featured: true, price: 2999, originalPrice: 3599,
    description: "Antique gold-finish choker adorned with fine micro-pearls and intricate filigree work.",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    wholesaleAvailable: false, createdAt: 3,
  },
  {
    id: "p7", name: "Emerald & Gold Peacock Drop Earrings", brand: "DK Fine Jewels", audience: "Women", category: "Jewelry",
    subcategory: "Earrings", stock: 15, featured: false, price: 1499, originalPrice: 1899,
    description: "Statement peacock motif drop earrings accented with lab-created emeralds and gold plating.",
    image: "https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80",
    wholesaleAvailable: true, createdAt: 2,
  },
  {
    id: "p8", name: "Kids Gold Bell Anklets (Pair)", brand: "DK Sparkle", audience: "Kids", category: "Jewelry",
    subcategory: "Anklets", stock: 20, featured: false, price: 499, originalPrice: 699,
    description: "Comfort-fit gold-plated baby anklets with delicate jingling bells.",
    image: "https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80",
    wholesaleAvailable: false, createdAt: 1,
  },
];

const fmt = (n) => "\u20B9" + Number(n || 0).toLocaleString("en-IN");
const uid = () => "id" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function getProductPrice(p) {
  return Number(p.price || (p.priceTiers && p.priceTiers[0]?.price) || 0);
}

function priceDisplay(p) {
  const currentPrice = getProductPrice(p);
  const origPrice = Number(p.originalPrice || 0);
  if (origPrice > currentPrice) {
    return `<span style="color:var(--gold-dark); font-weight:700;">${fmt(currentPrice)}</span> <span style="text-decoration:line-through; font-size:12px; opacity:0.6; margin-left:4px;">${fmt(origPrice)}</span>`;
  }
  return fmt(currentPrice);
}

/* ============================================================
   STORAGE
   ============================================================ */

const DB = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem("dkcraze__" + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem("dkcraze__" + key, JSON.stringify(value));
    } catch (e) {}
  },
};

const storedConfig = DB.get("storeConfig", null);
const storedProducts = DB.get("products", null);

const state = {
  products: storedProducts || SEED_PRODUCTS,
  orders: DB.get("orders", []),
  config: storedConfig ? { ...DEFAULT_CONFIG, ...storedConfig } : DEFAULT_CONFIG,
  cart: [],
  audience: "All",
  typeFilter: "All",
  search: "",
  orderFilterSearch: "",
  sort: "newest",
  isAdmin: false,
  adminTab: "products",
  editingProductId: null,
  addingProduct: false,
  uploadedScreenshotData: null,
  adminUploadedProductImage: null,
};

function saveProducts() {
  DB.set("products", state.products);
  if (isCloudActive) {
    db.collection("settings").doc("inventory").set({ items: state.products }).catch(console.error);
  }
}

function saveOrders() {
  DB.set("orders", state.orders);
  if (isCloudActive) {
    db.collection("settings").doc("ordersLog").set({ list: state.orders }).catch(console.error);
  }
}

function saveConfig() {
  DB.set("storeConfig", state.config);
  if (isCloudActive) {
    db.collection("settings").doc("storeConfig").set(state.config).catch(console.error);
  }
}

function syncWithCloud() {
  if (!isCloudActive) return;

  db.collection("settings").doc("inventory").onSnapshot((doc) => {
    if (doc.exists && doc.data().items) {
      state.products = doc.data().items;
      DB.set("products", state.products);
      renderProductGrid();
      if (state.isAdmin && state.adminTab === "products") renderAdminProducts();
    } else {
      saveProducts();
    }
  });

  db.collection("settings").doc("storeConfig").onSnapshot((doc) => {
    if (doc.exists) {
      state.config = { ...DEFAULT_CONFIG, ...doc.data() };
      DB.set("storeConfig", state.config);
      renderChrome();
    } else {
      saveConfig();
    }
  });

  db.collection("settings").doc("ordersLog").onSnapshot((doc) => {
    if (doc.exists && doc.data().list) {
      state.orders = doc.data().list;
      DB.set("orders", state.orders);
      if (state.isAdmin && state.adminTab === "orders") renderAdminOrders();
    }
  });
}

/* ============================================================
   DOM & SVGS
   ============================================================ */

const $ = (id) => document.getElementById(id);
function icons() { if (window.lucide) lucide.createIcons(); }

const SVG_ICONS = {
  youtube: `<svg class="brand-svg-icon yt" viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  instagram: `<svg class="brand-svg-icon ig" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>`,
  mail: `<svg class="brand-svg-icon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`
};

function renderChrome() {
  const c = state.config;
  $("navStoreName").textContent = c.storeName;
  $("navTagline").textContent = c.tagline;
  $("heroTagline").textContent = `${c.tagline} — curated collection of apparel and fine jewelry selected for style and everyday elegance.`;
  $("footerStoreName").textContent = c.storeName;
  $("footerTagline").textContent = c.tagline;
  $("footerYearName").textContent = c.storeName;
  $("footerYear").textContent = new Date().getFullYear();

  const socialBits = [];
  if (c.youtube) socialBits.push(`<a class="social-link" href="${escapeHtml(c.youtube)}" target="_blank" rel="noopener noreferrer">${SVG_ICONS.youtube} <span>YouTube</span></a>`);
  if (c.instagram) socialBits.push(`<a class="social-link" href="${escapeHtml(c.instagram)}" target="_blank" rel="noopener noreferrer">${SVG_ICONS.instagram} <span>Instagram</span></a>`);
  if (c.email) socialBits.push(`<a class="social-link" href="mailto:${escapeHtml(c.email)}">${SVG_ICONS.mail} <span>${escapeHtml(c.email)}</span></a>`);
  $("footerSocials").innerHTML = socialBits.join("");

  const wholesaleBits = [];
  if (c.wholesaleNote) wholesaleBits.push(`<span>${escapeHtml(c.wholesaleNote)}</span>`);
  $("footerWholesale").innerHTML = wholesaleBits.join("");

  const audienceLinksHtml = ["All", ...AUDIENCES].map(
    (a) => `<button class="nav-link${state.audience === a ? " active" : ""}" data-action="set-audience" data-audience="${a}" type="button">${a}</button>`
  ).join("");
  $("navCenter").innerHTML = audienceLinksHtml;
  $("navMobileLinks").innerHTML = audienceLinksHtml;

  $("typeFilterSelect").value = state.typeFilter;
  icons();
}

/* ============================================================
   PRODUCT GRID & DETAILS
   ============================================================ */

function getFilteredProducts() {
  let list = [...state.products];
  if (state.audience !== "All") list = list.filter((p) => p.audience === state.audience);
  if (state.typeFilter !== "All") list = list.filter((p) => p.category === state.typeFilter);
  if (state.search.trim()) {
    const q = state.search.toLowerCase();
    list = list.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      (p.brand || "").toLowerCase().includes(q) ||
      (p.subcategory || "").toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q)
    );
  }
  if (state.sort === "price-asc") list.sort((a, b) => getProductPrice(a) - getProductPrice(b));
  else if (state.sort === "price-desc") list.sort((a, b) => getProductPrice(b) - getProductPrice(a));
  else list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  return list;
}

function productCardHtml(p) {
  const low = p.stock > 0 && p.stock <= 3;
  const out = p.stock <= 0;
  return `
    <div class="product-card">
      <button class="product-card-link" data-action="open-product" data-id="${p.id}" type="button">
        <div class="product-img-wrap">
          <img class="product-img" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy" onerror="this.src='https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80';" />
          ${p.featured ? `<span class="badge-featured">✦ Featured</span>` : ""}
          ${out ? `<span class="badge-soldout">Sold Out</span>` : ""}
        </div>
        <div class="product-info">
          ${p.brand ? `<div class="product-brand">${escapeHtml(p.brand)}</div>` : ""}
          <div class="product-category">${escapeHtml(p.audience)} · ${escapeHtml(p.subcategory || p.category)}</div>
          <div class="display product-name">${escapeHtml(p.name)}</div>
          <div class="product-price">${priceDisplay(p)}</div>
          ${low && !out ? `<div class="product-lowstock">Only ${p.stock} left in stock</div>` : ""}
        </div>
      </button>
      <button class="btn-add" data-action="add-to-cart" data-id="${p.id}" type="button" ${out ? "disabled" : ""}>
        ${out ? "Unavailable" : "Add to Bag"}
      </button>
    </div>
  `;
}

function renderProductGrid() {
  const list = getFilteredProducts();
  $("pieceCount").textContent = `${list.length} item${list.length !== 1 ? "s" : ""} available`;
  $("productGrid").classList.toggle("hidden", list.length === 0);
  $("emptyState").classList.toggle("hidden", list.length !== 0);
  $("productGrid").innerHTML = list.map(productCardHtml).join("");
  icons();
}

function openProductModal(id) {
  const p = state.products.find((x) => x.id === id);
  if (!p) return;
  const out = p.stock <= 0;
  const price = getProductPrice(p);
  const origPrice = Number(p.originalPrice || 0);

  $("productModalCard").innerHTML = `
    <img class="modal-image" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" onerror="this.src='https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80';" />
    <div class="modal-panel">
      <button class="modal-close" data-action="close-product-modal" type="button" aria-label="Close"><i data-lucide="x"></i></button>
      ${p.brand ? `<div class="product-brand">${escapeHtml(p.brand)}</div>` : ""}
      <div class="modal-category">${escapeHtml(p.audience)} · ${escapeHtml(p.subcategory || p.category)}</div>
      <h2 class="display modal-title">${escapeHtml(p.name)}</h2>
      <div class="modal-price" id="modalPrice">
        ${fmt(price)}
        ${origPrice > price ? `<span style="text-decoration:line-through; font-size:15px; opacity:0.5; margin-left:6px;">${fmt(origPrice)}</span>` : ""}
      </div>
      <p class="modal-desc">${escapeHtml(p.description || "")}</p>
      <div class="modal-stock">${out ? "Currently out of stock" : `${p.stock} units available`}</div>
      ${p.wholesaleAvailable ? `<div class="wholesale-note"><i data-lucide="sparkles" class="icon-sm"></i> ${escapeHtml(state.config.wholesaleNote || "Wholesale available.")}</div>` : ""}
      <button class="btn-modal-add${out ? " disabled" : ""}" data-action="add-to-cart-close" data-id="${p.id}" type="button" ${out ? "disabled" : ""}>
        <span>${out ? "Unavailable" : "Add to Bag"}</span>
      </button>
    </div>
  `;
  $("productModalOverlay").classList.remove("hidden");
  icons();
}

function closeProductModal() {
  $("productModalOverlay").classList.add("hidden");
}

/* ============================================================
   CART DRAWER
   ============================================================ */

function addToCart(productId) {
  const p = state.products.find((x) => x.id === productId);
  if (!p) return;
  const price = getProductPrice(p);
  const existing = state.cart.find((c) => c.productId === productId);
  if (existing) {
    existing.qty = Math.min(existing.qty + 1, p.stock);
  } else {
    state.cart.push({ lineId: productId, productId, tierLabel: "Standard", tierPrice: price, qty: 1 });
  }
  openCart();
  renderCart();
}

function updateQty(lineId, qty) {
  if (qty <= 0) { state.cart = state.cart.filter((c) => c.lineId !== lineId); renderCart(); return; }
  const item = state.cart.find((c) => c.lineId === lineId);
  const p = item ? state.products.find((x) => x.id === item.productId) : null;
  if (item) item.qty = Math.min(qty, p?.stock || qty);
  renderCart();
}

function removeFromCart(lineId) {
  state.cart = state.cart.filter((c) => c.lineId !== lineId);
  renderCart();
}

function cartCount() { return state.cart.reduce((s, c) => s + c.qty, 0); }

function renderCartBadge() {
  const n = cartCount();
  $("cartBadge").textContent = n;
  $("cartBadge").classList.toggle("hidden", n === 0);
}

function renderCart() {
  renderCartBadge();
  const items = state.cart
    .map((c) => ({ ...c, product: state.products.find((p) => p.id === c.productId) }))
    .filter((c) => c.product);
  const total = items.reduce((s, i) => s + i.tierPrice * i.qty, 0);

  if (items.length === 0) {
    $("cartItems").innerHTML = `
      <div class="cart-empty">
        <i data-lucide="shopping-bag" style="width:34px;height:34px;opacity:0.4;margin:0 auto 12px;display:block;"></i>
        <p>Your bag is currently empty.</p>
      </div>`;
    $("cartFooter").innerHTML = "";
  } else {
    $("cartItems").innerHTML = items.map((i) => `
      <div class="cart-item">
        <img class="cart-item-img" src="${escapeHtml(i.product.image)}" alt="${escapeHtml(i.product.name)}" onerror="this.src='https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80';" />
        <div style="flex:1;">
          <div class="cart-item-name">${escapeHtml(i.product.name)}</div>
          <div class="cart-item-price">${fmt(i.tierPrice)}</div>
          <div class="qty-row">
            <button class="qty-btn" data-action="qty-dec" data-line-id="${i.lineId}" type="button"><i data-lucide="minus"></i></button>
            <span style="font-size:13px; min-width:14px; text-align:center;">${i.qty}</span>
            <button class="qty-btn" data-action="qty-inc" data-line-id="${i.lineId}" type="button"><i data-lucide="plus"></i></button>
            <button class="cart-remove-btn" data-action="remove-from-cart" data-line-id="${i.lineId}" type="button"><i data-lucide="trash-2"></i></button>
          </div>
        </div>
      </div>
    `).join("");
    $("cartFooter").innerHTML = `
      <div class="cart-total-row"><span>Subtotal</span><span style="font-weight:600; color:var(--gold-dark);">${fmt(total)}</span></div>
      <button class="btn-checkout" data-action="open-checkout" type="button">Proceed to Payment</button>
    `;
  }
  icons();
}

function openCart() { $("cartOverlay").classList.add("open"); }
function closeCart() { $("cartOverlay").classList.remove("open"); }

/* ============================================================
   CHECKOUT
   ============================================================ */

function getActiveUpiId() {
  return (state.config.upiId || DEFAULT_CONFIG.upiId).trim();
}

function upiUri(orderId, total) {
  const upi = getActiveUpiId();
  const params = new URLSearchParams({
    pa: upi,
    pn: "Hemalatha Bharathi",
    am: String(total),
    cu: "INR",
    tn: `DK Craze Order ${orderId}`,
  });
  return "upi://pay?" + params.toString();
}

function buildOrderMessage(order) {
  const lines = [
    `✨ *New Prepaid Order — ${state.config.storeName}* ✨`,
    "",
    `*Order Reference:* ${order.id}`,
    "",
    ...order.items.map((i) => `• ${i.name} x${i.qty} — ${fmt(i.tierPrice * i.qty)}`),
    "",
    `*Total Paid:* ${fmt(order.total)} via GPay / UPI`,
    `*Payment Sent To UPI ID:* ${getActiveUpiId()}`,
    `*UPI Ref ID:* ${order.payment.upiRef || "Not provided"}`,
    `*Payment Screenshot:* ${order.payment.screenshot ? "Attached / Saved in Cloud" : "Not attached"}`,
    "",
    `*Customer Details:*`,
    `Name: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `Delivery Address: ${order.customer.address}`,
    order.customer.notes ? `Notes: ${order.customer.notes}` : null,
  ].filter(Boolean);
  return lines.join("\n");
}

function finalizeOrder(customer, items, total, payment) {
  const order = {
    id: payment.orderId || uid(),
    date: new Date().toISOString(),
    items: items.map((i) => ({ productId: i.productId, name: i.product.name, tierLabel: "Standard", tierPrice: i.tierPrice, qty: i.qty })),
    total,
    customer,
    payment: {
      method: "GPay / UPI",
      upiId: getActiveUpiId(),
      upiRef: payment.upiRef || "",
      screenshot: state.uploadedScreenshotData || "",
    },
    status: "new",
  };
  state.orders.push(order);
  saveOrders();
  state.cart = [];
  renderCart();
  showOrderSuccess(order);
}

function renderCheckoutForm(items, total, prefill) {
  const p = prefill || { name: "", phone: "", address: "", notes: "" };
  const currentUpi = getActiveUpiId();

  $("checkoutPanel").innerHTML = `
    <div class="checkout-head">
      <h3 class="display" style="font-size:24px;">Delivery Information</h3>
      <button class="modal-close" data-action="close-checkout" type="button"><i data-lucide="x"></i></button>
    </div>
    <form id="checkoutForm">
      <div class="checkout-summary">Total Amount: <strong>${fmt(total)}</strong> · ${items.length} unique item${items.length !== 1 ? "s" : ""}</div>
      <label class="field"><span class="field-label">Full Name *</span><input name="name" value="${escapeHtml(p.name)}" required placeholder="e.g. Priyan Sharma" /></label>
      <label class="field"><span class="field-label">Phone / WhatsApp Number *</span><input name="phone" type="tel" value="${escapeHtml(p.phone)}" required placeholder="e.g. +91 98434 41110" /></label>
      <label class="field"><span class="field-label">Shipping Address *</span><textarea name="address" rows="2" required placeholder="Street address, city, pincode">${escapeHtml(p.address)}</textarea></label>
      <label class="field"><span class="field-label">Order Notes (Optional)</span><textarea name="notes" rows="2" placeholder="Special delivery instructions">${escapeHtml(p.notes)}</textarea></label>

      <div class="payment-method-badge">
        <i data-lucide="shield-check" style="color:var(--gold);"></i>
        <span>Prepaid UPI / GPay direct to <strong>${escapeHtml(currentUpi)}</strong></span>
      </div>

      <button type="submit" class="btn-submit" style="margin-top:16px;">Proceed to UPI / QR Scanner</button>
    </form>
  `;
  icons();

  $("checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const customer = {
      name: fd.get("name").trim(),
      phone: fd.get("phone").trim(),
      address: fd.get("address").trim(),
      notes: fd.get("notes").trim(),
    };
    if (!customer.name || !customer.phone || !customer.address) return;
    renderGpayStep(customer, items, total);
  });
}

function renderGpayStep(customer, items, total) {
  const orderId = uid();
  const uri = upiUri(orderId, total);
  const currentUpi = getActiveUpiId();
  const dynamicQr = "https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=" + encodeURIComponent(uri);

  $("checkoutPanel").innerHTML = `
    <div class="checkout-head">
      <h3 class="display" style="font-size:24px;">Scan &amp; Pay via UPI</h3>
      <button class="modal-close" data-action="close-checkout" type="button"><i data-lucide="x"></i></button>
    </div>
    <div class="checkout-summary">Total payable: <strong style="color:var(--gold-dark);">${fmt(total)}</strong></div>
    
    <div class="gpay-number-box">
      <span>Payee Name:</span>
      <strong>Hemalatha Bharathi</strong>
      <span style="font-size:12px; margin-top:2px; color:var(--blue-dark); font-weight:600;">UPI ID: ${escapeHtml(currentUpi)}</span>
    </div>

    <a class="btn-gpay-pay" href="${uri}"><i data-lucide="smartphone"></i> Open UPI App (GPay / PhonePe / Paytm)</a>
    <p class="upi-note" style="text-align:center;">Scan this Google Pay QR code to pay directly to <strong>${escapeHtml(currentUpi)}</strong>:</p>
    
    <div class="qr-wrap">
      <img src="gpay-qr.jpg" alt="Google Pay QR Code" width="220" style="border-radius:12px; border:1px solid var(--line-gold);" onerror="this.src='${dynamicQr}';" />
    </div>
    
    <form id="gpayConfirmForm" style="margin-top:16px;">
      <label class="field">
        <span class="field-label">Upload Payment Screenshot (Receipt) *</span>
        <input type="file" id="ssFileInput" accept="image/*" required class="file-input" />
      </label>
      <div id="ssPreviewWrap" class="ss-preview hidden">
        <img id="ssPreviewImg" src="" alt="Screenshot preview" />
        <span style="font-size:12px; color:var(--gold-dark);">Screenshot attached successfully</span>
      </div>

      <label class="field" style="margin-top:10px;">
        <span class="field-label">UPI Reference / UTR Number (Optional)</span>
        <input name="upiRef" placeholder="e.g. 328409182390" />
      </label>
      <button type="submit" class="btn-submit">Complete Order &amp; Dispatch to Admin</button>
    </form>
    <button class="btn-continue" type="button" data-action="back-to-checkout-form">← Back to Details</button>
  `;
  icons();

  const fileInput = $("ssFileInput");
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        state.uploadedScreenshotData = event.target.result;
        $("ssPreviewImg").src = event.target.result;
        $("ssPreviewWrap").classList.remove("hidden");
      };
      reader.readAsDataURL(file);
    }
  });

  $("gpayConfirmForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    finalizeOrder(customer, items, total, {
      method: "GPay / UPI",
      upiRef: fd.get("upiRef").trim(),
      orderId,
    });
  });

  $("checkoutPanel").querySelector('[data-action="back-to-checkout-form"]').addEventListener("click", () => {
    renderCheckoutForm(items, total, customer);
  });
}

function openCheckout() {
  closeCart();
  state.uploadedScreenshotData = null;
  const items = state.cart
    .map((c) => ({ ...c, product: state.products.find((p) => p.id === c.productId) }))
    .filter((c) => c.product);
  const total = items.reduce((s, i) => s + i.tierPrice * i.qty, 0);
  $("checkoutOverlay").classList.remove("hidden");
  renderCheckoutForm(items, total, null);
}

function showOrderSuccess(order) {
  const waLink = `https://wa.me/${state.config.whatsapp}?text=${encodeURIComponent(buildOrderMessage(order))}`;
  const mailSubject = `New Paid Order #${order.id} — ${state.config.storeName}`;
  const mailLink = `mailto:${state.config.email}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(buildOrderMessage(order))}`;

  $("checkoutPanel").innerHTML = `
    <div class="checkout-head">
      <h3 class="display" style="font-size:24px;">Order Placed Successfully</h3>
      <button class="modal-close" data-action="close-checkout" type="button"><i data-lucide="x"></i></button>
    </div>
    <div class="success-banner"><i data-lucide="check-circle" style="color:var(--gold);"></i> Payment details &amp; screenshot registered. Dispatch details to DK Craze:</div>
    <div class="send-options">
      <a class="btn-whatsapp" href="${waLink}" target="_blank" rel="noopener noreferrer">
        <i data-lucide="phone-forwarded"></i> Send Order &amp; SS via WhatsApp
      </a>
      <a class="btn-email" href="${mailLink}">
        <i data-lucide="mail"></i> Send Order via Email
      </a>
    </div>
    <p class="order-note">Order ID: <strong>${order.id}</strong>. Sent to <strong>${escapeHtml(state.config.email)}</strong> and WhatsApp <strong>+91 ${escapeHtml(state.config.whatsapp)}</strong>.</p>
    <button class="btn-continue" data-action="close-checkout" type="button">Back to Store</button>
  `;
  icons();
}

function closeCheckout() { $("checkoutOverlay").classList.add("hidden"); }

/* ============================================================
   ADMIN CONTROLS & VIEWS
   ============================================================ */

function openAdminLogin() {
  $("adminLoginPanel").innerHTML = `
    <i data-lucide="lock" style="color:var(--gold-dark);"></i>
    <h3 class="display" style="font-size:22px; margin-top:10px;">Store Management</h3>
    <p style="font-size:12.5px; opacity:0.7; margin-top:4px;">Sign in to adjust inventory, prices, and orders.</p>
    <form id="adminLoginForm" style="margin-top:16px;">
      <label class="field"><span class="field-label">Master Password *</span><input name="password" type="password" required /></label>
      <div class="field-error hidden" id="loginError">Invalid credentials.</div>
      <button type="submit" class="btn-submit">Authenticate</button>
    </form>
  `;
  $("adminLoginOverlay").classList.remove("hidden");
  icons();

  $("adminLoginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const enteredPassword = fd.get("password");

    if (enteredPassword === state.config.adminPassword) {
      closeAdminLogin();
      enterAdmin();
    } else {
      $("loginError").classList.remove("hidden");
    }
  });
}
function closeAdminLogin() { $("adminLoginOverlay").classList.add("hidden"); }

function enterAdmin() {
  state.isAdmin = true;
  state.adminTab = "products";
  $("storefrontView").classList.add("hidden");
  $("adminView").classList.remove("hidden");
  renderAdminTabs();
  renderAdminContent();
}
function exitAdmin() {
  state.isAdmin = false;
  $("adminView").classList.add("hidden");
  $("storefrontView").classList.remove("hidden");
}

function renderAdminTabs() {
  document.querySelectorAll(".admin-tab").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.tab === state.adminTab);
  });
}

function renderAdminContent() {
  if (state.adminTab === "products") renderAdminProducts();
  else if (state.adminTab === "orders") renderAdminOrders();
  else renderAdminSettings();
}

function productFormHtml(product) {
  const f = product || {
    name: "", brand: "", audience: "Kids", category: "Clothing",
    subcategory: "", stock: 10, price: "", originalPrice: "",
    description: "", image: "", wholesaleAvailable: false
  };
  state.adminUploadedProductImage = f.image || null;

  return `
    <form id="productForm" class="form-grid">
      <label class="field"><span class="field-label">Item Title *</span><input name="name" value="${escapeHtml(f.name)}" required /></label>
      <label class="field"><span class="field-label">Designer / Brand</span><input name="brand" value="${escapeHtml(f.brand || "")}" placeholder="e.g. DK Craze" /></label>
      
      <label class="field">
        <span class="field-label">Department</span>
        <select name="audience">
          ${AUDIENCES.map((a) => `<option value="${a}" ${f.audience === a ? "selected" : ""}>${a}</option>`).join("")}
        </select>
      </label>
      <label class="field">
        <span class="field-label">Category</span>
        <select name="category">
          ${CATEGORIES.map((c) => `<option value="${c}" ${f.category === c ? "selected" : ""}>${c}</option>`).join("")}
        </select>
      </label>
      
      <label class="field"><span class="field-label">Subcategory (e.g. Kurta, Choker, Frock)</span><input name="subcategory" value="${escapeHtml(f.subcategory)}" /></label>
      <label class="field"><span class="field-label">Available Stock Quantity *</span><input name="stock" type="number" min="0" step="1" value="${f.stock ?? 10}" required placeholder="e.g. 15" /></label>
      
      <label class="field">
        <span class="field-label">Selling Price (₹) *</span>
        <input name="price" type="number" min="0" step="1" value="${getProductPrice(f) || ""}" required placeholder="e.g. 1299" />
      </label>
      
      <label class="field">
        <span class="field-label">Original / MRP (₹) (Optional - for strike-through)</span>
        <input name="originalPrice" type="number" min="0" step="1" value="${f.originalPrice || ""}" placeholder="e.g. 1599" />
      </label>
      
      <div class="field span-2">
        <span class="field-label">Product Image (Choose File from Device) *</span>
        <input type="file" id="productImageFile" accept="image/*" class="file-input" ${f.image ? "" : "required"} />
        <div id="productImagePreviewWrap" class="product-img-upload-preview ${f.image ? "" : "hidden"}">
          <img id="productImagePreview" src="${escapeHtml(f.image || "")}" alt="Preview" />
          <span style="font-size:12px; color:var(--gold-dark);">Selected Image Preview</span>
        </div>
      </div>

      <label class="field span-2"><span class="field-label">Description</span><textarea name="description" rows="2">${escapeHtml(f.description)}</textarea></label>
      <label class="checkbox-field span-2"><input type="checkbox" name="wholesaleAvailable" ${f.wholesaleAvailable ? "checked" : ""} /> Wholesale eligible piece</label>
      <div class="form-actions">
        <button type="submit" class="btn-save">Save Piece</button>
        <button type="button" class="btn-cancel" data-action="cancel-product-form">Cancel</button>
      </div>
    </form>
  `;
}

function renderAdminProducts() {
  const editing = state.editingProductId ? state.products.find((p) => p.id === state.editingProductId) : null;
  const showForm = state.addingProduct || !!editing;

  let html = "";
  if (!showForm) {
    html += `<button class="btn-add-product" data-action="start-add-product" type="button"><i data-lucide="plus"></i> Add New Piece</button>`;
  } else {
    html += productFormHtml(editing);
  }

  html += `<div id="adminProductList">`;
  if (state.products.length === 0) {
    html += `<p style="opacity:0.6; font-size:13.5px;">No inventory items available.</p>`;
  } else {
    html += state.products.map((p) => `
      <div class="admin-row">
        <img class="admin-row-thumb" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" onerror="this.src='https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80';" />
        <div style="flex:1; min-width:0;">
          <div class="admin-row-name">${p.brand ? escapeHtml(p.brand) + " — " : ""}${escapeHtml(p.name)}</div>
          <div class="admin-row-meta">${escapeHtml(p.audience)} · ${escapeHtml(p.category)}${p.subcategory ? " · " + escapeHtml(p.subcategory) : ""} · <strong>Price: ${fmt(getProductPrice(p))}</strong> · <strong>Stock: ${p.stock}</strong></div>
        </div>
        <button class="icon-btn-sm" data-action="edit-product" data-id="${p.id}" type="button"><i data-lucide="edit-2"></i></button>
        <button class="icon-btn-sm" data-action="delete-product" data-id="${p.id}" type="button"><i data-lucide="trash-2"></i></button>
      </div>
    `).join("");
  }
  html += `</div>`;

  $("adminContent").innerHTML = html;
  icons();

  const imgFileInput = $("productImageFile");
  if (imgFileInput) {
    imgFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          state.adminUploadedProductImage = event.target.result;
          $("productImagePreview").src = event.target.result;
          $("productImagePreviewWrap").classList.remove("hidden");
        };
        reader.readAsDataURL(file);
      }
    });
  }

  const form = $("productForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const price = Number(fd.get("price")) || 0;
      const originalPrice = Number(fd.get("originalPrice")) || 0;
      const stock = Number(fd.get("stock")) || 0;

      if (!price) {
        alert("Please specify a valid product price.");
        return;
      }

      const imageSrc = state.adminUploadedProductImage || (editing ? editing.image : "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80");

      const p = {
        id: editing ? editing.id : uid(),
        name: fd.get("name").trim(),
        brand: fd.get("brand").trim(),
        audience: fd.get("audience"),
        category: fd.get("category"),
        subcategory: fd.get("subcategory").trim(),
        stock,
        price,
        originalPrice,
        priceTiers: [{ label: "Standard", price }],
        description: fd.get("description").trim(),
        image: imageSrc,
        wholesaleAvailable: fd.get("wholesaleAvailable") === "on",
        featured: editing ? editing.featured : false,
        createdAt: editing ? editing.createdAt : Date.now(),
      };

      if (!p.name) return;
      if (editing) {
        state.products = state.products.map((x) => (x.id === p.id ? p : x));
      } else {
        state.products.push(p);
      }
      saveProducts();
      state.editingProductId = null;
      state.addingProduct = false;
      state.adminUploadedProductImage = null;
      renderAdminProducts();
    });
  }
}

function exportOrdersToCSV() {
  if (state.orders.length === 0) {
    alert("No orders available to export.");
    return;
  }
  const headers = ["Order ID", "Date", "Customer Name", "Phone", "Address", "Items Summary", "Total (INR)", "Payment Method", "Target UPI ID", "UPI Ref"];
  const rows = state.orders.map(o => {
    const itemsStr = o.items.map(i => `${i.name} x${i.qty}`).join(" | ");
    return [
      `"${o.id}"`,
      `"${new Date(o.date).toLocaleString('en-IN')}"`,
      `"${(o.customer?.name || '').replace(/"/g, '""')}"`,
      `"${(o.customer?.phone || '').replace(/"/g, '""')}"`,
      `"${(o.customer?.address || '').replace(/"/g, '""')}"`,
      `"${itemsStr.replace(/"/g, '""')}"`,
      `"${o.total}"`,
      `"${o.payment?.method || 'GPay / UPI'}"`,
      `"${o.payment?.upiId || getActiveUpiId()}"`,
      `"${(o.payment?.upiRef || '').replace(/"/g, '""')}"`
    ].join(",");
  });

  const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `DK_Craze_Orders_${new Date().toISOString().slice(0,10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function eraseAllOrders() {
  if (state.orders.length === 0) return;
  if (confirm("Are you sure you want to erase ALL order logs? This action cannot be undone.")) {
    state.orders = [];
    saveOrders();
    renderAdminOrders();
  }
}

function eraseSingleOrder(orderId) {
  if (confirm(`Erase order record #${orderId}?`)) {
    state.orders = state.orders.filter(o => o.id !== orderId);
    saveOrders();
    renderAdminOrders();
  }
}

function renderAdminOrders() {
  let list = [...state.orders].reverse();

  if (state.orderFilterSearch.trim()) {
    const q = state.orderFilterSearch.toLowerCase();
    list = list.filter(o =>
      (o.id || "").toLowerCase().includes(q) ||
      (o.customer?.name || "").toLowerCase().includes(q) ||
      (o.customer?.phone || "").toLowerCase().includes(q) ||
      (o.customer?.address || "").toLowerCase().includes(q) ||
      (o.payment?.upiRef || "").toLowerCase().includes(q)
    );
  }

  let html = `
    <div class="order-toolbar">
      <div class="order-search-wrap">
        <i data-lucide="search" class="icon-sm"></i>
        <input type="text" id="orderSearchInput" placeholder="Filter orders by name, phone, ID..." value="${escapeHtml(state.orderFilterSearch)}" class="order-search-input" />
      </div>
      <div class="order-toolbar-actions">
        <button class="btn-order-action export" data-action="export-orders" type="button"><i data-lucide="download"></i> Export CSV</button>
        <button class="btn-order-action erase" data-action="erase-all-orders" type="button"><i data-lucide="trash-2"></i> Clear All</button>
      </div>
    </div>
  `;

  if (state.orders.length === 0) {
    html += `<p style="opacity:0.6; font-size:13.5px; margin-top:20px;">No active orders yet.</p>`;
  } else if (list.length === 0) {
    html += `<p style="opacity:0.6; font-size:13.5px; margin-top:20px;">No orders match the filter "${escapeHtml(state.orderFilterSearch)}".</p>`;
  } else {
    html += `<div class="orders-list-wrap">` + list.map((o) => `
      <div class="order-card">
        <div class="order-top">
          <span>${new Date(o.date).toLocaleString("en-IN")} · ID: <strong>${escapeHtml(o.id)}</strong></span>
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="color:var(--gold-dark); font-weight:700; font-size:15px;">${fmt(o.total)}</span>
            <button class="icon-btn-sm" data-action="erase-order" data-id="${o.id}" title="Delete order" type="button"><i data-lucide="trash-2"></i></button>
          </div>
        </div>
        <div class="order-customer">${escapeHtml(o.customer.name)} · 📞 ${escapeHtml(o.customer.phone)}</div>
        <div class="order-address">📍 ${escapeHtml(o.customer.address)}</div>
        <div class="order-payment">Paid via GPay / UPI ${o.payment?.upiRef ? " · Ref: " + escapeHtml(o.payment.upiRef) : ""} (Sent to: ${escapeHtml(o.payment?.upiId || getActiveUpiId())})</div>
        ${o.payment?.screenshot ? `
          <div class="order-ss-view">
            <span style="font-size:11px; text-transform:uppercase; color:var(--gold-dark); font-weight:600;">Payment Screenshot:</span>
            <img src="${o.payment.screenshot}" alt="Payment proof" class="order-ss-thumb" onclick="window.open('${o.payment.screenshot}', '_blank')" />
          </div>
        ` : ""}
        <div class="order-items">
          ${o.items.map((i) => `<div>• ${escapeHtml(i.name)} × ${i.qty} — ${fmt(i.tierPrice * i.qty)}</div>`).join("")}
        </div>
      </div>
    `).join("") + `</div>`;
  }

  $("adminContent").innerHTML = html;
  icons();

  const searchInput = $("orderSearchInput");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      state.orderFilterSearch = e.target.value;
      renderAdminOrders();
      $("orderSearchInput").focus();
    });
  }
}

function renderAdminSettings() {
  const c = state.config;
  $("adminContent").innerHTML = `
    <form id="settingsForm" class="form-grid settings-form">
      <label class="field"><span class="field-label">Store Brand Name *</span><input name="storeName" value="${escapeHtml(c.storeName)}" required /></label>
      <label class="field"><span class="field-label">Tagline</span><input name="tagline" value="${escapeHtml(c.tagline)}" /></label>
      <label class="field"><span class="field-label">WhatsApp Contact Number *</span><input name="whatsapp" value="${escapeHtml(c.whatsapp)}" required /></label>
      <label class="field"><span class="field-label">Store Email Address *</span><input name="email" type="email" value="${escapeHtml(c.email)}" required /></label>
      <label class="field"><span class="field-label">YouTube Channel Link</span><input name="youtube" value="${escapeHtml(c.youtube || "")}" placeholder="https://www.youtube.com/@DkCraze19" /></label>
      <label class="field"><span class="field-label">Instagram Profile URL</span><input name="instagram" value="${escapeHtml(c.instagram || "")}" /></label>
      <label class="field"><span class="field-label">UPI ID for Direct Payments &amp; QR Scanner *</span><input name="upiId" value="${escapeHtml(c.upiId || "")}" required placeholder="e.g. hemabharathik@oksbi" /></label>
      <label class="field span-2"><span class="field-label">Admin Security Password *</span><input name="adminPassword" type="password" value="${escapeHtml(c.adminPassword)}" required /></label>
      <label class="field span-2"><span class="field-label">Wholesale Information Note</span><textarea name="wholesaleNote" rows="2">${escapeHtml(c.wholesaleNote || "")}</textarea></label>
      <div class="settings-actions">
        <button type="submit" class="btn-save">Update Settings</button>
        <span class="saved-msg hidden" id="settingsSavedMsg">Settings and password updated successfully.</span>
      </div>
    </form>
  `;

  $("settingsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newPassword = fd.get("adminPassword").trim();
    const newUpiId = fd.get("upiId").trim();

    if (!newPassword) {
      alert("Password cannot be empty.");
      return;
    }

    state.config = {
      storeName: fd.get("storeName").trim() || DEFAULT_CONFIG.storeName,
      tagline: fd.get("tagline").trim(),
      whatsapp: fd.get("whatsapp").trim(),
      email: fd.get("email").trim() || DEFAULT_CONFIG.email,
      address: c.address || "",
      youtube: fd.get("youtube").trim(),
      instagram: fd.get("instagram").trim(),
      wholesaleNote: fd.get("wholesaleNote").trim(),
      upiId: newUpiId || DEFAULT_CONFIG.upiId,
      adminPassword: newPassword,
    };

    saveConfig();
    renderChrome();
    const msg = $("settingsSavedMsg");
    msg.classList.remove("hidden");
    setTimeout(() => msg.classList.add("hidden"), 2500);
  });
}

/* ============================================================
   EVENT DELEGATION
   ============================================================ */

document.addEventListener("click", (e) => {
  const el = e.target.closest("[data-action]");
  if (!el) return;
  const action = el.dataset.action;
  const id = el.dataset.id;
  const lineId = el.dataset.lineId;

  switch (action) {
    case "set-audience":
      state.audience = el.dataset.audience;
      renderChrome();
      renderProductGrid();
      $("navMobilePanel").classList.remove("open");
      break;
    case "open-product": openProductModal(id); break;
    case "close-product-modal": closeProductModal(); break;
    case "add-to-cart": addToCart(id); break;
    case "add-to-cart-close": {
      addToCart(id);
      closeProductModal();
      break;
    }
    case "qty-inc": {
      const item = state.cart.find((c) => c.lineId === lineId);
      updateQty(lineId, (item?.qty || 0) + 1);
      break;
    }
    case "qty-dec": {
      const item = state.cart.find((c) => c.lineId === lineId);
      updateQty(lineId, (item?.qty || 0) - 1);
      break;
    }
    case "remove-from-cart": removeFromCart(lineId); break;
    case "open-checkout": openCheckout(); break;
    case "close-checkout": closeCheckout(); break;
    case "start-add-product":
      state.addingProduct = true;
      state.editingProductId = null;
      renderAdminProducts();
      break;
    case "cancel-product-form":
      state.addingProduct = false;
      state.editingProductId = null;
      renderAdminProducts();
      break;
    case "edit-product":
      state.editingProductId = id;
      state.addingProduct = false;
      renderAdminProducts();
      break;
    case "delete-product":
      state.products = state.products.filter((p) => p.id !== id);
      saveProducts();
      renderAdminProducts();
      break;
    case "export-orders":
      exportOrdersToCSV();
      break;
    case "erase-all-orders":
      eraseAllOrders();
      break;
    case "erase-order":
      eraseSingleOrder(id);
      break;
  }
});

$("logoBtn").addEventListener("click", () => {
  state.audience = "All";
  state.typeFilter = "All";
  state.search = "";
  $("searchInput").value = "";
  $("searchInputMobile").value = "";
  if (state.isAdmin) exitAdmin();
  renderChrome();
  renderProductGrid();
});

$("shopKidsBtn").addEventListener("click", () => {
  state.audience = "Kids";
  renderChrome();
  renderProductGrid();
});
$("shopWomenBtn").addEventListener("click", () => {
  state.audience = "Women";
  renderChrome();
  renderProductGrid();
});

$("searchInput").addEventListener("input", (e) => {
  state.search = e.target.value;
  $("searchInputMobile").value = e.target.value;
  renderProductGrid();
});
$("searchInputMobile").addEventListener("input", (e) => {
  state.search = e.target.value;
  $("searchInput").value = e.target.value;
  renderProductGrid();
});

$("sortSelect").addEventListener("change", (e) => {
  state.sort = e.target.value;
  renderProductGrid();
});
$("typeFilterSelect").addEventListener("change", (e) => {
  state.typeFilter = e.target.value;
  renderProductGrid();
});

$("cartBtn").addEventListener("click", () => { openCart(); renderCart(); });
$("cartCloseBtn").addEventListener("click", closeCart);
$("cartOverlay").addEventListener("click", (e) => { if (e.target.id === "cartOverlay" || e.target.classList.contains("cart-scrim")) closeCart(); });

$("adminBtn").addEventListener("click", () => { if (!state.isAdmin) openAdminLogin(); });
$("adminLoginOverlay").addEventListener("click", (e) => { if (e.target.id === "adminLoginOverlay") closeAdminLogin(); });
$("adminLogoutBtn").addEventListener("click", exitAdmin);

$("productModalOverlay").addEventListener("click", (e) => { if (e.target.id === "productModalOverlay") closeProductModal(); });
$("checkoutOverlay").addEventListener("click", (e) => { if (e.target.id === "checkoutOverlay") closeCheckout(); });

$("mobileToggle").addEventListener("click", () => {
  $("navMobilePanel").classList.toggle("open");
});

document.querySelectorAll(".admin-tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    state.adminTab = btn.dataset.tab;
    state.addingProduct = false;
    state.editingProductId = null;
    renderAdminTabs();
    renderAdminContent();
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  closeProductModal();
  closeCheckout();
  closeAdminLogin();
  closeCart();
});

(function addCartScrim() {
  const overlay = $("cartOverlay");
  const scrim = document.createElement("div");
  scrim.className = "cart-scrim";
  overlay.insertBefore(scrim, overlay.firstChild);
})();

/* ============================================================
   INITIALIZATION
   ============================================================ */

renderChrome();
renderProductGrid();
renderCartBadge();
icons();
syncWithCloud();