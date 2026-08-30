/* ============================================================
   CONSTANTS
   ============================================================ */

const AUDIENCES = ["Kids", "Women"];
const CATEGORIES = ["Clothing", "Jewelry"];

const DEFAULT_CONFIG = {
  storeName: "DK Craze",
  tagline: "The Trend Store — Kids & Women",
  whatsapp: "919843441110", // country code + number, digits only
  email: "owner@example.com",
  address: "",
  instagram: "https://www.instagram.com/reel/DclSrc6pNV8/?igsi=b2R5bzltcXZ0b2M4",
  wholesaleNote: "Wholesale available — message us on WhatsApp for bulk pricing.",
  upiId: "", // e.g. "yourname@okaxis" — needed for the GPay/UPI checkout option to appear
  adminPassword: "admin123",
};

// priceTiers: list of { label, price } — lets a product be sold as "1 Set" / "3 Set" etc.
const SEED_PRODUCTS = [
  {
    id: "p1", name: "Babyhug Brand Surplus Romper Set", brand: "Babyhug", audience: "Kids", category: "Clothing",
    subcategory: "Rompers", stock: 20, featured: true,
    description: "Genuine Babyhug brand surplus stock. Soft cotton rompers, perfect for everyday wear. Sold as single pieces or 3-piece sets at a bulk discount.",
    image: "https://picsum.photos/seed/babyromper/700/900",
    priceTiers: [{ label: "1 Set", price: 299 }, { label: "3 Set", price: 799 }],
    wholesaleAvailable: true, createdAt: 8,
  },
  {
    id: "p2", name: "Kids Printed Cotton Frock", brand: "", audience: "Kids", category: "Clothing",
    subcategory: "Dresses", stock: 14, featured: true,
    description: "Breathable cotton frock with a playful print — easy to move in, easy to wash.",
    image: "https://picsum.photos/seed/kidsfrock/700/900",
    priceTiers: [{ label: "Single Piece", price: 449 }],
    wholesaleAvailable: false, createdAt: 7,
  },
  {
    id: "p3", name: "Kids Charm Bracelet", brand: "", audience: "Kids", category: "Jewelry",
    subcategory: "Bracelets", stock: 25, featured: false,
    description: "Lightweight, nickel-free charm bracelet sized for little wrists.",
    image: "https://picsum.photos/seed/kidsbracelet/700/900",
    priceTiers: [{ label: "Single Piece", price: 199 }],
    wholesaleAvailable: false, createdAt: 6,
  },
  {
    id: "p4", name: "Draped Silk Midi Dress", brand: "", audience: "Women", category: "Clothing",
    subcategory: "Dresses", stock: 8, featured: true,
    description: "A fluid silk-blend midi with a soft cowl neckline, cut to move.",
    image: "https://picsum.photos/seed/silkmidi/700/900",
    priceTiers: [{ label: "Single Piece", price: 3499 }],
    wholesaleAvailable: false, createdAt: 5,
  },
  {
    id: "p5", name: "Hand-Embroidered Blouse", brand: "", audience: "Women", category: "Clothing",
    subcategory: "Tops", stock: 15, featured: false,
    description: "Cotton voile blouse with hand-embroidered florals along the yoke.",
    image: "https://picsum.photos/seed/embroideredblouse/700/900",
    priceTiers: [{ label: "Single Piece", price: 1899 }],
    wholesaleAvailable: false, createdAt: 4,
  },
  {
    id: "p6", name: "Antique Gold Chain Necklace", brand: "", audience: "Women", category: "Jewelry",
    subcategory: "Necklaces", stock: 10, featured: true,
    description: "A hand-finished brass chain with an antique gold wash — layers beautifully or wears alone.",
    image: "https://picsum.photos/seed/goldchain/700/900",
    priceTiers: [{ label: "Single Piece", price: 2899 }],
    wholesaleAvailable: false, createdAt: 3,
  },
  {
    id: "p7", name: "Pearl Drop Earrings", brand: "", audience: "Women", category: "Jewelry",
    subcategory: "Earrings", stock: 20, featured: true,
    description: "Freshwater pearls suspended from delicate gold-plated hooks.",
    image: "https://picsum.photos/seed/pearldrops/700/900",
    priceTiers: [{ label: "Single Piece", price: 1299 }],
    wholesaleAvailable: false, createdAt: 2,
  },
  {
    id: "p8", name: "Kids Stacking Ring Set (3pc)", brand: "", audience: "Kids", category: "Jewelry",
    subcategory: "Rings", stock: 25, featured: false,
    description: "Three slim adjustable bands sized for kids — no sharp edges, easy to resize.",
    image: "https://picsum.photos/seed/kidsrings/700/900",
    priceTiers: [{ label: "1 Set", price: 149 }],
    wholesaleAvailable: false, createdAt: 1,
  },
];

const fmt = (n) => "\u20B9" + Number(n || 0).toLocaleString("en-IN");
const uid = () => "id" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

function lowestTier(p) {
  if (!p.priceTiers || p.priceTiers.length === 0) return { label: "Single Piece", price: 0 };
  return [...p.priceTiers].sort((a, b) => a.price - b.price)[0];
}
function priceDisplay(p) {
  const tiers = p.priceTiers || [];
  if (tiers.length <= 1) return fmt(lowestTier(p).price);
  return "From " + fmt(lowestTier(p).price);
}

/* ============================================================
   STORAGE (localStorage)
   NOTE: this is per-browser only. Admin changes made on one
   device will not appear on a customer's device. For a real
   multi-device store you need a small backend + database.
   ============================================================ */

const DB = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem("dkcraze__" + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.error("Storage read failed", e);
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem("dkcraze__" + key, JSON.stringify(value));
    } catch (e) {
      console.error("Storage write failed", e);
    }
  },
};

/* ============================================================
   STATE
   ============================================================ */

const state = {
  products: DB.get("products", null) || SEED_PRODUCTS,
  orders: DB.get("orders", []),
  config: DB.get("storeConfig", null) || DEFAULT_CONFIG,
  cart: [], // { lineId, productId, tierLabel, tierPrice, qty }
  audience: "All", // All | Kids | Women
  typeFilter: "All", // All | Clothing | Jewelry
  search: "",
  sort: "newest",
  isAdmin: false,
  adminTab: "products",
  editingProductId: null,
  addingProduct: false,
};

if (!DB.get("products", null)) DB.set("products", state.products);
if (!DB.get("storeConfig", null)) DB.set("storeConfig", state.config);

function saveProducts() { DB.set("products", state.products); }
function saveOrders() { DB.set("orders", state.orders); }
function saveConfig() { DB.set("storeConfig", state.config); }

/* ============================================================
   DOM SHORTCUTS
   ============================================================ */

const $ = (id) => document.getElementById(id);
function icons() { if (window.lucide) lucide.createIcons(); }

/* ============================================================
   NAVBAR / HERO / FOOTER (config-driven)
   ============================================================ */

function renderChrome() {
  const c = state.config;
  $("navStoreName").textContent = c.storeName;
  $("navTagline").textContent = c.tagline;
  $("heroTagline").textContent = `${c.tagline} — clothing and jewelry picked for how it wears, not just how it photographs.`;
  $("footerStoreName").textContent = c.storeName;
  $("footerTagline").textContent = c.tagline;
  $("footerYearName").textContent = c.storeName;
  $("footerYear").textContent = new Date().getFullYear();

  const contactBits = [];
  if (c.email) contactBits.push(`<span>${escapeHtml(c.email)}</span>`);
  if (c.address) contactBits.push(`<span>${escapeHtml(c.address)}</span>`);
  $("footerContact").innerHTML = contactBits.join("");

  const wholesaleBits = [];
  if (c.wholesaleNote) wholesaleBits.push(escapeHtml(c.wholesaleNote));
  if (c.instagram) wholesaleBits.push(`<a href="${escapeHtml(c.instagram)}" target="_blank" rel="noopener noreferrer">Follow us on Instagram</a>`);
  $("footerWholesale").innerHTML = wholesaleBits.join(" &middot; ");

  const audienceLinksHtml = ["All", ...AUDIENCES].map(
    (a) => `<button class="nav-link${state.audience === a ? " active" : ""}" data-action="set-audience" data-audience="${a}" type="button">${a}</button>`
  ).join("");
  $("navCenter").innerHTML = audienceLinksHtml;
  $("navMobileLinks").innerHTML = audienceLinksHtml;

  $("typeFilterSelect").value = state.typeFilter;
}

/* ============================================================
   PRODUCT GRID
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
  if (state.sort === "price-asc") list.sort((a, b) => lowestTier(a).price - lowestTier(b).price);
  else if (state.sort === "price-desc") list.sort((a, b) => lowestTier(b).price - lowestTier(a).price);
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
          <img class="product-img" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" onerror="this.style.opacity='0.3'; this.src='';" />
          ${p.featured ? `<span class="badge-featured"><span class="stamp">★</span> Featured</span>` : ""}
          ${out ? `<span class="badge-soldout">Sold Out</span>` : ""}
        </div>
        <div class="product-info">
          ${p.brand ? `<div class="product-brand">${escapeHtml(p.brand)}</div>` : ""}
          <div class="product-category">${escapeHtml(p.audience)} · ${escapeHtml(p.subcategory || p.category)}</div>
          <div class="display product-name">${escapeHtml(p.name)}</div>
          <div class="product-price">${priceDisplay(p)}</div>
          ${low && !out ? `<div class="product-lowstock">Only ${p.stock} left</div>` : ""}
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
  $("pieceCount").textContent = `${list.length} piece${list.length !== 1 ? "s" : ""}`;
  $("productGrid").classList.toggle("hidden", list.length === 0);
  $("emptyState").classList.toggle("hidden", list.length !== 0);
  $("productGrid").innerHTML = list.map(productCardHtml).join("");
  icons();
}

/* ============================================================
   PRODUCT MODAL
   ============================================================ */

function tierOptionsHtml(p, selectedLabel) {
  const tiers = p.priceTiers || [];
  if (tiers.length <= 1) return "";
  return `
    <div class="tier-section">
      <div class="tier-label-heading">Choose an option</div>
      ${tiers.map((t, i) => `
        <label class="tier-option${t.label === selectedLabel ? " selected" : ""}">
          <span style="display:flex; align-items:center; gap:8px;">
            <input type="radio" name="tierChoice" value="${escapeHtml(t.label)}" data-price="${t.price}" ${t.label === selectedLabel ? "checked" : ""} />
            ${escapeHtml(t.label)}
          </span>
          <span class="tier-option-price">${fmt(t.price)}</span>
        </label>
      `).join("")}
    </div>
  `;
}

function openProductModal(id) {
  const p = state.products.find((x) => x.id === id);
  if (!p) return;
  const out = p.stock <= 0;
  const defaultTier = lowestTier(p);
  $("productModalCard").innerHTML = `
    <img class="modal-image" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" onerror="this.style.opacity='0.3'; this.src='';" />
    <div class="modal-panel">
      <button class="modal-close" data-action="close-product-modal" type="button" aria-label="Close"><i data-lucide="x"></i></button>
      ${p.brand ? `<div class="product-brand">${escapeHtml(p.brand)}</div>` : ""}
      <div class="modal-category">${escapeHtml(p.audience)} · ${escapeHtml(p.subcategory || p.category)}</div>
      <h2 class="display modal-title">${escapeHtml(p.name)}</h2>
      <div class="modal-price" id="modalPrice">${fmt(defaultTier.price)}</div>
      <p class="modal-desc">${escapeHtml(p.description || "")}</p>
      <div class="modal-stock">${out ? "Currently sold out" : `${p.stock} in stock`}</div>
      ${tierOptionsHtml(p, defaultTier.label)}
      ${p.wholesaleAvailable ? `<div class="wholesale-note"><i data-lucide="badge-percent" class="icon-sm"></i> ${escapeHtml(state.config.wholesaleNote || "Wholesale available — message us for bulk pricing.")}</div>` : ""}
      <button class="btn-modal-add${out ? " disabled" : ""}" data-action="add-to-cart-close" data-id="${p.id}" type="button" ${out ? "disabled" : ""}>
        <span>${out ? "Unavailable" : "Add to Bag"}</span>
      </button>
    </div>
  `;
  $("productModalOverlay").classList.remove("hidden");
  icons();

  document.querySelectorAll('#productModalCard input[name="tierChoice"]').forEach((radio) => {
    radio.addEventListener("change", (e) => {
      $("modalPrice").textContent = fmt(Number(e.target.dataset.price));
      document.querySelectorAll("#productModalCard .tier-option").forEach((el) => el.classList.remove("selected"));
      e.target.closest(".tier-option").classList.add("selected");
    });
  });
}
function closeProductModal() {
  $("productModalOverlay").classList.add("hidden");
}

/* ============================================================
   CART
   ============================================================ */

function addToCart(productId, tierLabel) {
  const p = state.products.find((x) => x.id === productId);
  if (!p) return;
  const tier = (p.priceTiers || []).find((t) => t.label === tierLabel) || lowestTier(p);
  const lineId = productId + "::" + tier.label;
  const existing = state.cart.find((c) => c.lineId === lineId);
  if (existing) existing.qty = Math.min(existing.qty + 1, p.stock);
  else state.cart.push({ lineId, productId, tierLabel: tier.label, tierPrice: tier.price, qty: 1 });
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
        <i data-lucide="shopping-bag" style="width:30px;height:30px;opacity:0.5;margin:0 auto 14px;display:block;"></i>
        <p style="font-size:13.5px;">Your bag is empty.</p>
      </div>`;
    $("cartFooter").innerHTML = "";
  } else {
    $("cartItems").innerHTML = items.map((i) => `
      <div class="cart-item">
        <img class="cart-item-img" src="${escapeHtml(i.product.image)}" alt="${escapeHtml(i.product.name)}" onerror="this.style.opacity='0.3'; this.src='';" />
        <div style="flex:1;">
          <div class="cart-item-name">${escapeHtml(i.product.name)}</div>
          <div class="cart-item-price">${escapeHtml(i.tierLabel)} · ${fmt(i.tierPrice)}</div>
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
      <div class="cart-total-row"><span>Total</span><span style="font-weight:600;">${fmt(total)}</span></div>
      <button class="btn-checkout" data-action="open-checkout" type="button">Checkout</button>
    `;
  }
  icons();
}

function openCart() { $("cartOverlay").classList.add("open"); }
function closeCart() { $("cartOverlay").classList.remove("open"); }

/* ============================================================
   CHECKOUT
   ============================================================ */

function buildOrderMessage(order) {
  const paymentLine = order.payment.method === "GPay / UPI"
    ? `Payment: GPay / UPI${order.payment.upiRef ? " (Ref: " + order.payment.upiRef + ")" : " (reference not provided)"}`
    : `Payment: Cash on Delivery`;
  const lines = [
    `New order from ${state.config.storeName}`,
    "",
    ...order.items.map((i) => `• ${i.name} (${i.tierLabel}) x${i.qty} — ${fmt(i.tierPrice * i.qty)}`),
    "",
    `Total: ${fmt(order.total)}`,
    paymentLine,
    "",
    `Customer: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `Address: ${order.customer.address}`,
    order.customer.notes ? `Notes: ${order.customer.notes}` : null,
    `Order ID: ${order.id}`,
  ].filter(Boolean);
  return lines.join("\n");
}

function upiUri(orderId, total) {
  const params = new URLSearchParams({
    pa: state.config.upiId,
    pn: state.config.storeName,
    am: String(total),
    cu: "INR",
    tn: `Order ${orderId}`,
  });
  return "upi://pay?" + params.toString();
}

function finalizeOrder(customer, items, total, payment) {
  const order = {
    id: payment.orderId || uid(),
    date: new Date().toISOString(),
    items: items.map((i) => ({ productId: i.productId, name: i.product.name, tierLabel: i.tierLabel, tierPrice: i.tierPrice, qty: i.qty })),
    total,
    customer,
    payment: { method: payment.method, upiRef: payment.upiRef || "" },
    status: "new",
  };
  state.orders.push(order);
  saveOrders();
  state.cart = [];
  renderCart();
  showOrderSuccess(order);
}

function renderCheckoutForm(items, total, prefill) {
  const hasUpi = !!(state.config.upiId && state.config.upiId.trim());
  const p = prefill || { name: "", phone: "", address: "", notes: "", paymentMethod: "cod" };

  $("checkoutPanel").innerHTML = `
    <div class="checkout-head">
      <h3 class="display" style="font-size:24px;">Checkout</h3>
      <button class="modal-close" data-action="close-checkout" type="button"><i data-lucide="x"></i></button>
    </div>
    <form id="checkoutForm">
      <div class="checkout-summary">Total: <strong>${fmt(total)}</strong> · ${items.length} item${items.length !== 1 ? "s" : ""}</div>
      <label class="field"><span class="field-label">Full name *</span><input name="name" value="${escapeHtml(p.name)}" required /></label>
      <label class="field"><span class="field-label">Phone number *</span><input name="phone" type="tel" value="${escapeHtml(p.phone)}" required /></label>
      <label class="field"><span class="field-label">Delivery address *</span><textarea name="address" rows="2" required>${escapeHtml(p.address)}</textarea></label>
      <label class="field"><span class="field-label">Notes (optional)</span><textarea name="notes" rows="2">${escapeHtml(p.notes)}</textarea></label>

      <div class="field-label" style="margin-bottom:8px;">Payment method *</div>
      <div class="payment-method-group">
        <label class="payment-option${p.paymentMethod === "cod" ? " selected" : ""}">
          <span style="display:flex; align-items:center; gap:8px;">
            <input type="radio" name="paymentMethod" value="cod" ${p.paymentMethod === "cod" ? "checked" : ""} />
            Cash on Delivery
          </span>
        </label>
        <label class="payment-option${p.paymentMethod === "gpay" ? " selected" : ""}${hasUpi ? "" : " disabled"}">
          <span style="display:flex; align-items:center; gap:8px;">
            <input type="radio" name="paymentMethod" value="gpay" ${p.paymentMethod === "gpay" ? "checked" : ""} ${hasUpi ? "" : "disabled"} />
            Pay via GPay / UPI
          </span>
        </label>
      </div>
      ${hasUpi ? "" : `<p class="upi-note">GPay/UPI isn't set up yet — the store admin needs to add a UPI ID in Settings first.</p>`}

      <button type="submit" class="btn-submit" style="margin-top:14px;">Continue</button>
    </form>
  `;
  icons();

  document.querySelectorAll('#checkoutPanel .payment-option:not(.disabled)').forEach((label) => {
    label.addEventListener("click", () => {
      document.querySelectorAll('#checkoutPanel .payment-option').forEach((el) => el.classList.remove("selected"));
      label.classList.add("selected");
    });
  });

  $("checkoutForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const customer = {
      name: fd.get("name").trim(),
      phone: fd.get("phone").trim(),
      address: fd.get("address").trim(),
      notes: fd.get("notes").trim(),
    };
    const paymentMethod = fd.get("paymentMethod") || "cod";
    if (!customer.name || !customer.phone || !customer.address) return;

    if (paymentMethod === "gpay" && hasUpi) {
      renderGpayStep(customer, items, total);
    } else {
      finalizeOrder(customer, items, total, { method: "Cash on Delivery" });
    }
  });
}

function renderGpayStep(customer, items, total) {
  const orderId = uid();
  const uri = upiUri(orderId, total);
  const qrSrc = "https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=" + encodeURIComponent(uri);

  $("checkoutPanel").innerHTML = `
    <div class="checkout-head">
      <h3 class="display" style="font-size:24px;">Pay with GPay / UPI</h3>
      <button class="modal-close" data-action="close-checkout" type="button"><i data-lucide="x"></i></button>
    </div>
    <div class="checkout-summary">Amount to pay: <strong>${fmt(total)}</strong></div>
    <a class="btn-gpay-pay" href="${uri}"><i data-lucide="smartphone"></i> Open GPay / UPI app</a>
    <p class="upi-note" style="text-align:center;">On a phone, the button above opens your UPI app directly. On a computer, scan this QR code with your phone's GPay instead:</p>
    <div class="qr-wrap"><img src="${qrSrc}" alt="UPI payment QR code" width="180" height="180" /></div>
    <form id="gpayConfirmForm" style="margin-top:16px;">
      <label class="field"><span class="field-label">UPI transaction / reference ID (optional, but helps the seller confirm faster)</span><input name="upiRef" placeholder="e.g. 123456789012" /></label>
      <button type="submit" class="btn-submit">I've completed the payment — Place Order</button>
    </form>
    <p class="order-note">Note: this site can't automatically verify UPI payments on its own — it simply hands off to your GPay app. ${escapeHtml(state.config.storeName)} will confirm the payment landed before shipping.</p>
    <button class="btn-continue" type="button" data-action="back-to-checkout-form">← Back</button>
  `;
  icons();

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
    renderCheckoutForm(items, total, { ...customer, paymentMethod: "gpay" });
  });
}

function openCheckout() {
  closeCart();
  const items = state.cart
    .map((c) => ({ ...c, product: state.products.find((p) => p.id === c.productId) }))
    .filter((c) => c.product);
  const total = items.reduce((s, i) => s + i.tierPrice * i.qty, 0);
  $("checkoutOverlay").classList.remove("hidden");
  renderCheckoutForm(items, total, null);
}

function showOrderSuccess(order) {
  const waLink = `https://wa.me/${state.config.whatsapp}?text=${encodeURIComponent(buildOrderMessage(order))}`;
  const mailLink = `mailto:${state.config.email}?subject=${encodeURIComponent("New order — " + state.config.storeName)}&body=${encodeURIComponent(buildOrderMessage(order))}`;
  const paymentSummary = order.payment.method === "GPay / UPI"
    ? `Paid via GPay/UPI${order.payment.upiRef ? " · Ref " + escapeHtml(order.payment.upiRef) : ""}`
    : "Cash on Delivery";

  $("checkoutPanel").innerHTML = `
    <div class="checkout-head">
      <h3 class="display" style="font-size:24px;">Order received</h3>
      <button class="modal-close" data-action="close-checkout" type="button"><i data-lucide="x"></i></button>
    </div>
    <div class="success-banner"><i data-lucide="check" style="color:var(--forest);"></i> Order saved (${paymentSummary}). Now send it to ${escapeHtml(state.config.storeName)}:</div>
    <div class="send-options">
      <a class="btn-whatsapp" href="${waLink}" target="_blank" rel="noopener noreferrer"><i data-lucide="phone"></i> Send via WhatsApp</a>
      <a class="btn-email" href="${mailLink}"><i data-lucide="mail"></i> Send via Email</a>
    </div>
    <p class="order-note">Each button opens WhatsApp or your email app with the order pre-filled — just hit send. Your order ID is <strong>${order.id}</strong>.</p>
    <button class="btn-continue" data-action="close-checkout" type="button">Continue shopping</button>
  `;
  icons();
}

function closeCheckout() { $("checkoutOverlay").classList.add("hidden"); }

/* ============================================================
   ADMIN LOGIN
   ============================================================ */

function openAdminLogin() {
  $("adminLoginPanel").innerHTML = `
    <i data-lucide="lock" style="color:var(--forest);"></i>
    <h3 class="display" style="font-size:22px; margin-top:10px;">Admin sign in</h3>
    <p style="font-size:12.5px; opacity:0.6; margin-top:4px;">Manage products, orders, and store settings.</p>
    <form id="adminLoginForm" style="margin-top:16px;">
      <label class="field"><span class="field-label">Admin password *</span><input name="password" type="password" required /></label>
      <div class="field-error hidden" id="loginError">Incorrect password.</div>
      <button type="submit" class="btn-submit">Sign in</button>
    </form>
    <p class="admin-login-hint">Default password: admin123 — change it in Settings after signing in.</p>
  `;
  $("adminLoginOverlay").classList.remove("hidden");
  icons();

  $("adminLoginForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    if (fd.get("password") === state.config.adminPassword) {
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

/* ============================================================
   ADMIN DASHBOARD
   ============================================================ */

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

// Tiers are entered as one line per tier: "Label, Price" e.g. "1 Set, 299"
function tiersToText(tiers) {
  return (tiers || []).map((t) => `${t.label}, ${t.price}`).join("\n");
}
function textToTiers(text) {
  return text.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
    const idx = line.lastIndexOf(",");
    if (idx === -1) return null;
    const label = line.slice(0, idx).trim();
    const price = Number(line.slice(idx + 1).trim());
    if (!label || Number.isNaN(price)) return null;
    return { label, price };
  }).filter(Boolean);
}

function productFormHtml(product) {
  const f = product || { name: "", brand: "", audience: "Kids", category: "Clothing", subcategory: "", stock: "", description: "", image: "", priceTiers: [], wholesaleAvailable: false };
  return `
    <form id="productForm" class="form-grid">
      <label class="field"><span class="field-label">Product name *</span><input name="name" value="${escapeHtml(f.name)}" required /></label>
      <label class="field"><span class="field-label">Brand (optional)</span><input name="brand" value="${escapeHtml(f.brand || "")}" placeholder="e.g. Babyhug" /></label>
      <label class="field">
        <span class="field-label">Audience</span>
        <select name="audience">
          ${AUDIENCES.map((a) => `<option value="${a}" ${f.audience === a ? "selected" : ""}>${a}</option>`).join("")}
        </select>
      </label>
      <label class="field">
        <span class="field-label">Type</span>
        <select name="category">
          ${CATEGORIES.map((c) => `<option value="${c}" ${f.category === c ? "selected" : ""}>${c}</option>`).join("")}
        </select>
      </label>
      <label class="field"><span class="field-label">Subcategory (e.g. Dresses, Rings)</span><input name="subcategory" value="${escapeHtml(f.subcategory)}" /></label>
      <label class="field"><span class="field-label">Stock quantity</span><input name="stock" type="number" min="0" step="1" value="${f.stock}" /></label>
      <label class="field span-2">
        <span class="field-label">Pricing (one per line: Label, Price) *</span>
        <textarea name="priceTiers" rows="3" placeholder="1 Set, 299&#10;3 Set, 799" required>${escapeHtml(tiersToText(f.priceTiers))}</textarea>
      </label>
      <label class="field span-2"><span class="field-label">Image URL</span><input name="image" value="${escapeHtml(f.image)}" /></label>
      <label class="field span-2"><span class="field-label">Description</span><textarea name="description" rows="2">${escapeHtml(f.description)}</textarea></label>
      <label class="checkbox-field span-2"><input type="checkbox" name="wholesaleAvailable" ${f.wholesaleAvailable ? "checked" : ""} /> Wholesale available for this item</label>
      <div class="form-actions">
        <button type="submit" class="btn-save">Save</button>
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
    html += `<button class="btn-add-product" data-action="start-add-product" type="button"><i data-lucide="plus"></i> Add product</button>`;
  } else {
    html += productFormHtml(editing);
  }

  html += `<div id="adminProductList">`;
  if (state.products.length === 0) {
    html += `<p style="opacity:0.6; font-size:13.5px;">No products yet — add your first item above.</p>`;
  } else {
    html += state.products.map((p) => `
      <div class="admin-row">
        <img class="admin-row-thumb" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" onerror="this.style.opacity='0.3'; this.src='';" />
        <div style="flex:1; min-width:0;">
          <div class="admin-row-name">${p.brand ? escapeHtml(p.brand) + " — " : ""}${escapeHtml(p.name)}</div>
          <div class="admin-row-meta">${escapeHtml(p.audience)} · ${escapeHtml(p.category)}${p.subcategory ? " · " + escapeHtml(p.subcategory) : ""} · ${priceDisplay(p)} · stock ${p.stock}${p.wholesaleAvailable ? " · wholesale" : ""}</div>
        </div>
        <button class="icon-btn-sm" data-action="edit-product" data-id="${p.id}" type="button"><i data-lucide="edit-2"></i></button>
        <button class="icon-btn-sm" data-action="delete-product" data-id="${p.id}" type="button"><i data-lucide="trash-2"></i></button>
      </div>
    `).join("");
  }
  html += `</div>`;

  $("adminContent").innerHTML = html;
  icons();

  const form = $("productForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const priceTiers = textToTiers(fd.get("priceTiers") || "");
      if (priceTiers.length === 0) {
        alert("Please add at least one valid pricing line, e.g.\n1 Set, 299");
        return;
      }
      const p = {
        id: editing ? editing.id : uid(),
        name: fd.get("name").trim(),
        brand: fd.get("brand").trim(),
        audience: fd.get("audience"),
        category: fd.get("category"),
        subcategory: fd.get("subcategory").trim(),
        stock: Number(fd.get("stock")) || 0,
        description: fd.get("description").trim(),
        image: fd.get("image").trim(),
        priceTiers,
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
      renderAdminProducts();
    });
  }
}

function renderAdminOrders() {
  if (state.orders.length === 0) {
    $("adminContent").innerHTML = `<p style="opacity:0.6; font-size:13.5px;">No orders yet. Orders placed on the site will appear here as a backup log — they're also sent to you directly via WhatsApp/email by the customer.</p>`;
    return;
  }
  $("adminContent").innerHTML = [...state.orders].reverse().map((o) => {
    const payment = o.payment || { method: "Cash on Delivery" };
    const paymentLabel = payment.method === "GPay / UPI"
      ? `GPay/UPI${payment.upiRef ? " · Ref " + escapeHtml(payment.upiRef) : " · no ref given"}`
      : "Cash on Delivery";
    return `
    <div class="order-card">
      <div class="order-top"><span>${new Date(o.date).toLocaleString("en-IN")}</span><span>${fmt(o.total)}</span></div>
      <div class="order-customer">${escapeHtml(o.customer.name)} · ${escapeHtml(o.customer.phone)}</div>
      <div class="order-address">${escapeHtml(o.customer.address)}</div>
      <div class="order-payment">${paymentLabel}</div>
      <div class="order-items">
        ${o.items.map((i) => `<div>${escapeHtml(i.name)} (${escapeHtml(i.tierLabel)}) × ${i.qty} — ${fmt(i.tierPrice * i.qty)}</div>`).join("")}
      </div>
    </div>
  `;
  }).join("");
}

function renderAdminSettings() {
  const c = state.config;
  $("adminContent").innerHTML = `
    <form id="settingsForm" class="form-grid settings-form">
      <label class="field"><span class="field-label">Store name *</span><input name="storeName" value="${escapeHtml(c.storeName)}" required /></label>
      <label class="field"><span class="field-label">Tagline</span><input name="tagline" value="${escapeHtml(c.tagline)}" /></label>
      <label class="field"><span class="field-label">WhatsApp number (country code, digits only) *</span><input name="whatsapp" value="${escapeHtml(c.whatsapp)}" required /></label>
      <label class="field"><span class="field-label">Order email address *</span><input name="email" type="email" value="${escapeHtml(c.email)}" required /></label>
      <label class="field"><span class="field-label">Instagram link</span><input name="instagram" value="${escapeHtml(c.instagram || "")}" placeholder="https://instagram.com/yourstore" /></label>
      <label class="field"><span class="field-label">UPI ID (for GPay checkout)</span><input name="upiId" value="${escapeHtml(c.upiId || "")}" placeholder="yourname@okaxis" /></label>
      <label class="field span-2"><span class="field-label">New admin password</span><input name="adminPassword" type="password" value="${escapeHtml(c.adminPassword)}" /></label>
      <label class="field span-2"><span class="field-label">Wholesale note (shown on wholesale items &amp; footer)</span><textarea name="wholesaleNote" rows="2">${escapeHtml(c.wholesaleNote || "")}</textarea></label>
      <div class="settings-actions">
        <button type="submit" class="btn-save">Save settings</button>
        <span class="saved-msg hidden" id="settingsSavedMsg">Settings saved.</span>
      </div>
    </form>
  `;
  $("settingsForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    state.config = {
      storeName: fd.get("storeName").trim() || DEFAULT_CONFIG.storeName,
      tagline: fd.get("tagline").trim(),
      whatsapp: fd.get("whatsapp").trim(),
      email: fd.get("email").trim(),
      address: c.address || "",
      instagram: fd.get("instagram").trim(),
      wholesaleNote: fd.get("wholesaleNote").trim(),
      upiId: fd.get("upiId").trim(),
      adminPassword: fd.get("adminPassword").trim() || DEFAULT_CONFIG.adminPassword,
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
      const checked = document.querySelector('#productModalCard input[name="tierChoice"]:checked');
      addToCart(id, checked ? checked.value : undefined);
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

/* ============================================================
   ADD A CART SCRIM ELEMENT (click-catcher behind the drawer)
   ============================================================ */

(function addCartScrim() {
  const overlay = $("cartOverlay");
  const scrim = document.createElement("div");
  scrim.className = "cart-scrim";
  overlay.insertBefore(scrim, overlay.firstChild);
})();

/* ============================================================
   INIT
   ============================================================ */

renderChrome();
renderProductGrid();
renderCartBadge();
icons();