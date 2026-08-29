/* ============================================================
   CONSTANTS
   ============================================================ */

const CATEGORIES = ["Clothing", "Jewelry"];

const DEFAULT_CONFIG = {
  storeName: "Your Store Name",
  tagline: "Curated clothing & fine jewelry",
  whatsapp: "911234567890", // country code + number, digits only
  email: "owner@example.com",
  address: "",
  adminPassword: "admin123",
};

const SEED_PRODUCTS = [
  { id: "p1", name: "Draped Silk Midi Dress", category: "Clothing", subcategory: "Dresses", price: 3499, stock: 8, featured: true, description: "A fluid silk-blend midi with a soft cowl neckline, cut to move. Finished with mother-of-pearl buttons at the cuff.", image: "https://picsum.photos/seed/silkmidi/700/900", createdAt: 8 },
  { id: "p2", name: "Tailored Linen Blazer", category: "Clothing", subcategory: "Outerwear", price: 4299, stock: 5, featured: true, description: "Structured shoulders, a nipped waist, and breathable linen — built for transitional weather.", image: "https://picsum.photos/seed/linenblazer/700/900", createdAt: 7 },
  { id: "p3", name: "Pleated Wide-Leg Trousers", category: "Clothing", subcategory: "Trousers", price: 2199, stock: 12, featured: false, description: "High-waisted trousers with knife pleats and a fluid drape that flatters every silhouette.", image: "https://picsum.photos/seed/pleatedtrousers/700/900", createdAt: 6 },
  { id: "p4", name: "Hand-Embroidered Blouse", category: "Clothing", subcategory: "Tops", price: 1899, stock: 15, featured: false, description: "Cotton voile blouse with hand-embroidered florals along the yoke. Made by artisan partners.", image: "https://picsum.photos/seed/embroideredblouse/700/900", createdAt: 5 },
  { id: "p5", name: "Antique Gold Chain Necklace", category: "Jewelry", subcategory: "Necklaces", price: 2899, stock: 10, featured: true, description: "A hand-finished brass chain with an antique gold wash — layers beautifully or wears alone.", image: "https://picsum.photos/seed/goldchain/700/900", createdAt: 4 },
  { id: "p6", name: "Pearl Drop Earrings", category: "Jewelry", subcategory: "Earrings", price: 1299, stock: 20, featured: true, description: "Freshwater pearls suspended from delicate gold-plated hooks. Lightweight enough for all-day wear.", image: "https://picsum.photos/seed/pearldrops/700/900", createdAt: 3 },
  { id: "p7", name: "Stacking Ring Set (3pc)", category: "Jewelry", subcategory: "Rings", price: 999, stock: 25, featured: false, description: "Three slim bands in mixed textures, designed to be worn together or separately.", image: "https://picsum.photos/seed/stackingrings/700/900", createdAt: 2 },
  { id: "p8", name: "Beaded Statement Bracelet", category: "Jewelry", subcategory: "Bracelets", price: 1599, stock: 9, featured: false, description: "Hand-strung glass and brass beads on memory wire — no clasp needed.", image: "https://picsum.photos/seed/beadedbracelet/700/900", createdAt: 1 },
];

const fmt = (n) => "\u20B9" + Number(n || 0).toLocaleString("en-IN");
const uid = () => "id" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ============================================================
   STORAGE (localStorage)
   NOTE: this is per-browser only. Admin changes made on one
   device will not appear on a customer's device. For a real
   multi-device store you need a small backend + database.
   ============================================================ */

const DB = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem("atelier__" + key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      console.error("Storage read failed", e);
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem("atelier__" + key, JSON.stringify(value));
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
  cart: [],
  category: "All",
  search: "",
  sort: "newest",
  selectedProductId: null,
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
   NAVBAR / HERO / FOOTER (config-driven, rendered once + on config change)
   ============================================================ */

function renderChrome() {
  const c = state.config;
  $("navStoreName").textContent = c.storeName;
  $("navTagline").textContent = c.tagline;
  $("logoBadge").textContent = (c.storeName?.trim()?.[0] || "A").toUpperCase();
  $("heroTagline").textContent = `${c.tagline} — every piece chosen for how it wears, not just how it photographs.`;
  $("footerStoreName").textContent = c.storeName;
  $("footerTagline").textContent = c.tagline;
  $("footerYearName").textContent = c.storeName;
  $("footerYear").textContent = new Date().getFullYear();

  const contactBits = [];
  if (c.email) contactBits.push(`<span>${escapeHtml(c.email)}</span>`);
  if (c.address) contactBits.push(`<span>${escapeHtml(c.address)}</span>`);
  $("footerContact").innerHTML = contactBits.join("");

  const navLinksHtml = ["All", ...CATEGORIES].map(
    (cat) => `<button class="nav-link${state.category === cat ? " active" : ""}" data-action="set-category" data-category="${cat}" type="button">${cat}</button>`
  ).join("");
  $("navCenter").innerHTML = navLinksHtml;
  $("navMobileLinks").innerHTML = navLinksHtml;
}

/* ============================================================
   PRODUCT GRID
   ============================================================ */

function getFilteredProducts() {
  let list = [...state.products];
  if (state.category !== "All") list = list.filter((p) => p.category === state.category);
  if (state.search.trim()) {
    const q = state.search.toLowerCase();
    list = list.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      (p.subcategory || "").toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q)
    );
  }
  if (state.sort === "price-asc") list.sort((a, b) => a.price - b.price);
  else if (state.sort === "price-desc") list.sort((a, b) => b.price - a.price);
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
          <div class="product-category">${escapeHtml(p.subcategory || p.category)}</div>
          <div class="display product-name">${escapeHtml(p.name)}</div>
          <div class="product-price">${fmt(p.price)}</div>
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

function openProductModal(id) {
  state.selectedProductId = id;
  const p = state.products.find((x) => x.id === id);
  if (!p) return;
  const out = p.stock <= 0;
  $("productModalCard").innerHTML = `
    <img class="modal-image" src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" onerror="this.style.opacity='0.3'; this.src='';" />
    <div class="modal-panel">
      <button class="modal-close" data-action="close-product-modal" type="button" aria-label="Close"><i data-lucide="x"></i></button>
      <div class="modal-category">${escapeHtml(p.subcategory || p.category)}</div>
      <h2 class="display modal-title">${escapeHtml(p.name)}</h2>
      <div class="modal-price">${fmt(p.price)}</div>
      <p class="modal-desc">${escapeHtml(p.description || "")}</p>
      <div class="modal-stock">${out ? "Currently sold out" : `${p.stock} in stock`}</div>
      <button class="btn-modal-add${out ? " disabled" : ""}" data-action="add-to-cart-close" data-id="${p.id}" type="button" ${out ? "disabled" : ""}>
        <span>${out ? "Unavailable" : "Add to Bag"}</span>
      </button>
    </div>
  `;
  $("productModalOverlay").classList.remove("hidden");
  icons();
}
function closeProductModal() {
  state.selectedProductId = null;
  $("productModalOverlay").classList.add("hidden");
}

/* ============================================================
   CART
   ============================================================ */

function addToCart(id) {
  const p = state.products.find((x) => x.id === id);
  if (!p) return;
  const existing = state.cart.find((c) => c.id === id);
  if (existing) existing.qty = Math.min(existing.qty + 1, p.stock);
  else state.cart.push({ id, qty: 1 });
  openCart();
  renderCart();
}

function updateQty(id, qty) {
  if (qty <= 0) { state.cart = state.cart.filter((c) => c.id !== id); renderCart(); return; }
  const p = state.products.find((x) => x.id === id);
  const item = state.cart.find((c) => c.id === id);
  if (item) item.qty = Math.min(qty, p?.stock || qty);
  renderCart();
}

function removeFromCart(id) {
  state.cart = state.cart.filter((c) => c.id !== id);
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
    .map((c) => ({ ...c, product: state.products.find((p) => p.id === c.id) }))
    .filter((c) => c.product);
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);

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
          <div class="cart-item-price">${fmt(i.product.price)}</div>
          <div class="qty-row">
            <button class="qty-btn" data-action="qty-dec" data-id="${i.id}" type="button"><i data-lucide="minus"></i></button>
            <span style="font-size:13px; min-width:14px; text-align:center;">${i.qty}</span>
            <button class="qty-btn" data-action="qty-inc" data-id="${i.id}" type="button"><i data-lucide="plus"></i></button>
            <button class="cart-remove-btn" data-action="remove-from-cart" data-id="${i.id}" type="button"><i data-lucide="trash-2"></i></button>
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
  const lines = [
    `New order from ${state.config.storeName}`,
    "",
    ...order.items.map((i) => `• ${i.name} x${i.qty} — ${fmt(i.price * i.qty)}`),
    "",
    `Total: ${fmt(order.total)}`,
    "",
    `Customer: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    `Address: ${order.customer.address}`,
    order.customer.notes ? `Notes: ${order.customer.notes}` : null,
    `Order ID: ${order.id}`,
  ].filter(Boolean);
  return lines.join("\n");
}

function openCheckout() {
  closeCart();
  const items = state.cart
    .map((c) => ({ ...c, product: state.products.find((p) => p.id === c.id) }))
    .filter((c) => c.product);
  const total = items.reduce((s, i) => s + i.product.price * i.qty, 0);

  $("checkoutPanel").innerHTML = `
    <div class="checkout-head">
      <h3 class="display" style="font-size:24px;">Checkout</h3>
      <button class="modal-close" data-action="close-checkout" type="button"><i data-lucide="x"></i></button>
    </div>
    <form id="checkoutForm">
      <div class="checkout-summary">Total: <strong>${fmt(total)}</strong> · ${items.length} item${items.length !== 1 ? "s" : ""}</div>
      <label class="field"><span class="field-label">Full name *</span><input name="name" required /></label>
      <label class="field"><span class="field-label">Phone number *</span><input name="phone" type="tel" required /></label>
      <label class="field"><span class="field-label">Delivery address *</span><textarea name="address" rows="2" required></textarea></label>
      <label class="field"><span class="field-label">Notes (optional)</span><textarea name="notes" rows="2"></textarea></label>
      <button type="submit" class="btn-submit" style="margin-top:8px;">Place Order</button>
    </form>
  `;
  $("checkoutOverlay").classList.remove("hidden");
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

    const order = {
      id: uid(),
      date: new Date().toISOString(),
      items: items.map((i) => ({ id: i.id, name: i.product.name, price: i.product.price, qty: i.qty })),
      total,
      customer,
      status: "new",
    };
    state.orders.push(order);
    saveOrders();
    state.cart = [];
    renderCart();
    showOrderSuccess(order);
  });
}

function showOrderSuccess(order) {
  const waLink = `https://wa.me/${state.config.whatsapp}?text=${encodeURIComponent(buildOrderMessage(order))}`;
  const mailLink = `mailto:${state.config.email}?subject=${encodeURIComponent("New order — " + state.config.storeName)}&body=${encodeURIComponent(buildOrderMessage(order))}`;

  $("checkoutPanel").innerHTML = `
    <div class="checkout-head">
      <h3 class="display" style="font-size:24px;">Order received</h3>
      <button class="modal-close" data-action="close-checkout" type="button"><i data-lucide="x"></i></button>
    </div>
    <div class="success-banner"><i data-lucide="check" style="color:var(--forest);"></i> Order saved. Now send it to ${escapeHtml(state.config.storeName)}:</div>
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

function productFormHtml(product) {
  const f = product || { name: "", category: "Clothing", subcategory: "", price: "", stock: "", description: "", image: "", featured: false };
  return `
    <form id="productForm" class="form-grid">
      <label class="field"><span class="field-label">Product name *</span><input name="name" value="${escapeHtml(f.name)}" required /></label>
      <label class="field">
        <span class="field-label">Category</span>
        <select name="category">
          ${CATEGORIES.map((c) => `<option value="${c}" ${f.category === c ? "selected" : ""}>${c}</option>`).join("")}
        </select>
      </label>
      <label class="field"><span class="field-label">Subcategory (e.g. Dresses, Rings)</span><input name="subcategory" value="${escapeHtml(f.subcategory)}" /></label>
      <label class="field"><span class="field-label">Price (INR) *</span><input name="price" type="number" min="0" step="1" value="${f.price}" required /></label>
      <label class="field"><span class="field-label">Stock quantity</span><input name="stock" type="number" min="0" step="1" value="${f.stock}" /></label>
      <label class="field"><span class="field-label">Image URL</span><input name="image" value="${escapeHtml(f.image)}" /></label>
      <label class="field span-2"><span class="field-label">Description</span><textarea name="description" rows="2">${escapeHtml(f.description)}</textarea></label>
      <label class="checkbox-field"><input type="checkbox" name="featured" ${f.featured ? "checked" : ""} /> Featured item</label>
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
          <div class="admin-row-name">${escapeHtml(p.name)}</div>
          <div class="admin-row-meta">${escapeHtml(p.category)}${p.subcategory ? " · " + escapeHtml(p.subcategory) : ""} · ${fmt(p.price)} · stock ${p.stock}</div>
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
      const p = {
        id: editing ? editing.id : uid(),
        name: fd.get("name").trim(),
        category: fd.get("category"),
        subcategory: fd.get("subcategory").trim(),
        price: Number(fd.get("price")) || 0,
        stock: Number(fd.get("stock")) || 0,
        description: fd.get("description").trim(),
        image: fd.get("image").trim(),
        featured: fd.get("featured") === "on",
        createdAt: editing ? editing.createdAt : Date.now(),
      };
      if (!p.name || !p.price) return;
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
  $("adminContent").innerHTML = [...state.orders].reverse().map((o) => `
    <div class="order-card">
      <div class="order-top"><span>${new Date(o.date).toLocaleString("en-IN")}</span><span>${fmt(o.total)}</span></div>
      <div class="order-customer">${escapeHtml(o.customer.name)} · ${escapeHtml(o.customer.phone)}</div>
      <div class="order-address">${escapeHtml(o.customer.address)}</div>
      <div class="order-items">
        ${o.items.map((i) => `<div>${escapeHtml(i.name)} × ${i.qty} — ${fmt(i.price * i.qty)}</div>`).join("")}
      </div>
    </div>
  `).join("");
}

function renderAdminSettings() {
  const c = state.config;
  $("adminContent").innerHTML = `
    <form id="settingsForm" class="form-grid settings-form">
      <label class="field"><span class="field-label">Store name *</span><input name="storeName" value="${escapeHtml(c.storeName)}" required /></label>
      <label class="field"><span class="field-label">Tagline</span><input name="tagline" value="${escapeHtml(c.tagline)}" /></label>
      <label class="field"><span class="field-label">WhatsApp number (country code, digits only) *</span><input name="whatsapp" value="${escapeHtml(c.whatsapp)}" required /></label>
      <label class="field"><span class="field-label">Order email address *</span><input name="email" type="email" value="${escapeHtml(c.email)}" required /></label>
      <label class="field span-2"><span class="field-label">New admin password</span><input name="adminPassword" type="password" value="${escapeHtml(c.adminPassword)}" /></label>
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

  switch (action) {
    case "set-category":
      state.category = el.dataset.category;
      renderChrome();
      renderProductGrid();
      $("navMobilePanel").classList.remove("open");
      break;
    case "open-product": openProductModal(id); break;
    case "close-product-modal": closeProductModal(); break;
    case "add-to-cart": addToCart(id); break;
    case "add-to-cart-close": addToCart(id); closeProductModal(); break;
    case "qty-inc": {
      const item = state.cart.find((c) => c.id === id);
      updateQty(id, (item?.qty || 0) + 1);
      break;
    }
    case "qty-dec": {
      const item = state.cart.find((c) => c.id === id);
      updateQty(id, (item?.qty || 0) - 1);
      break;
    }
    case "remove-from-cart": removeFromCart(id); break;
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
  state.category = "All";
  state.search = "";
  $("searchInput").value = "";
  $("searchInputMobile").value = "";
  if (state.isAdmin) exitAdmin();
  renderChrome();
  renderProductGrid();
});

$("shopClothingBtn").addEventListener("click", () => {
  state.category = "Clothing";
  renderChrome();
  renderProductGrid();
});
$("shopJewelryBtn").addEventListener("click", () => {
  state.category = "Jewelry";
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
   ADD A CART SCRIM ELEMENT (overlay needs a click-catcher behind the drawer)
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