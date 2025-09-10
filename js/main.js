/* main.js — HuertoHogar
   - Render de productos destacados en Home
   - Carrito con localStorage
   - Utilidades y helpers
   Nota: pensado para Bootstrap 5.3.x
*/

// -----------------------------
// Datos "faker" (Forma A HuertoHogar)
// -----------------------------
const PRODUCTOS = [
    // Frutas Frescas
    { code: "FR001", nombre: "Manzanas Fuji", precio: 1200, unidad: "kg",     stock: 150, img: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=1200" },
    { code: "FR002", nombre: "Naranjas Valencia", precio: 1000, unidad: "kg",  stock: 200, img: "https://images.unsplash.com/photo-1547514701-42782101795e?q=80&w=1200" },
    { code: "FR003", nombre: "Plátanos Cavendish", precio: 800,  unidad: "kg", stock: 250, img: "https://images.unsplash.com/photo-1571772805064-207c8435df79?q=80&w=1200" },
    // Verduras Orgánicas
    { code: "VR001", nombre: "Zanahorias Orgánicas", precio: 900, unidad: "kg",    stock: 100, img: "https://images.unsplash.com/photo-1515542706656-8e6ef17a1521?q=80&w=1200" },
    { code: "VR002", nombre: "Espinacas Frescas",    precio: 700, unidad: "500 g", stock: 80,  img: "https://images.unsplash.com/photo-1547056961-3a1e3a6ffbaf?q=80&w=1200" },
    { code: "VR003", nombre: "Pimientos Tricolores", precio: 1500, unidad: "kg",   stock: 120, img: "https://images.unsplash.com/photo-1511690078903-71dc5a56f694?q=80&w=1200" },
    // Productos Orgánicos / Lácteos
    { code: "PO001", nombre: "Miel Orgánica 500g", precio: 5000, unidad: "frasco", stock: 50, img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200" },
    { code: "PL001", nombre: "Leche Entera 1L",    precio: 1200, unidad: "unidad", stock: 90, img: "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?q=80&w=1200" },
  ];
  
  // -----------------------------
  // Carrito (localStorage)
  // -----------------------------
  const LS_KEY = "hh_cart";
  const BASE_TITLE = "HuertoHogar — Frescura del campo a tu mesa";
  
  /** Lee carrito del localStorage de forma segura. */
  function getCart() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  
  /** Escribe carrito en localStorage de forma segura. */
  function saveCart(cart) {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(cart || []));
    } catch {
      // Si falla por cuota o modo privado, simplemente no persistimos
    }
  }
  
  /** Añade un producto al carrito respetando stock. */
  function addToCart(code, cantidad = 1) {
    const producto = PRODUCTOS.find(p => p.code === code);
    if (!producto) {
      toast("Producto no encontrado", "danger");
      return;
    }
    if (producto.stock <= 0) {
      toast("Sin stock disponible", "warning");
      return;
    }
  
    const cart = getCart();
    const idx = cart.findIndex(i => i.code === code);
  
    if (idx > -1) {
      const nueva = { ...cart[idx] };
      nueva.cantidad = Math.min(nueva.cantidad + cantidad, producto.stock);
      cart[idx] = nueva;
    } else {
      cart.push({
        code: producto.code,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: Math.min(cantidad, producto.stock),
      });
    }
  
    saveCart(cart);
    toast(`Añadido: ${producto.nombre}`, "success");
    updateCartBadge();
  }
  
  /** Quita un ítem por código. */
  function removeFromCart(code) {
    const cart = getCart().filter(i => i.code !== code);
    saveCart(cart);
    updateCartBadge();
  }
  
  /** Total CLP del carrito. */
  function cartTotal() {
    return getCart().reduce((acc, i) => acc + (Number(i.precio) * Number(i.cantidad)), 0);
  }
  
  /** Refresca contador (badge en navbar si existe) y título del documento. */
  function updateCartBadge() {
    const totalItems = getCart().reduce((acc, i) => acc + Number(i.cantidad), 0);
  
    // Badge opcional en navbar
    const badge = document.getElementById("cart-badge"); // <span id="cart-badge" class="badge ...">
    if (badge) {
      badge.textContent = String(totalItems);
      badge.hidden = totalItems <= 0;
    }
  
    // Título del documento
    document.title = totalItems > 0 ? `(${totalItems}) HuertoHogar` : BASE_TITLE;
  }
  
  // -----------------------------
  // UI helpers (Bootstrap Toast)
  // -----------------------------
  /** Muestra un toast liviano sin depender de un contenedor preexistente. */
  function toast(msg, type = "primary") {
    const wrap = document.createElement("div");
    wrap.className = "position-fixed top-0 end-0 p-3";
    wrap.style.zIndex = "1080";
  
    const el = document.createElement("div");
    el.className = `toast align-items-center text-bg-${type} border-0 show`;
    el.setAttribute("role", "alert");
    el.setAttribute("aria-live", "assertive");
    el.setAttribute("aria-atomic", "true");
    el.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">${msg}</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;
    wrap.appendChild(el);
    document.body.appendChild(wrap);
  
    // Autocierre
    setTimeout(() => wrap.remove(), 2200);
  }
  
  // -----------------------------
  // Render: productos destacados en Home
  // -----------------------------
  function renderDestacados() {
    const cont = document.getElementById("grid-destacados");
    const msg = document.getElementById("msg-estado");
    if (!cont) return; // No estamos en Home
  
    if (msg) msg.hidden = false;
    cont.innerHTML = "";
  
    // Tomamos 6 productos para el Home (o todos si < 6)
    const destacados = PRODUCTOS.slice(0, 6);
  
    destacados.forEach(p => {
      const col = document.createElement("div");
      col.className = "col-12 col-sm-6 col-lg-4";
  
      const sinStock = p.stock <= 0;
  
      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${p.img}" class="card-img-top" alt="${p.nombre}" loading="lazy">
          <div class="card-body d-flex flex-column">
            <span class="badge bg-warning text-dark align-self-start mb-2">${p.code}</span>
            <h5 class="card-title mb-1">${p.nombre}</h5>
            <p class="card-text text-muted mb-1">${formatPrecio(p.precio)} / ${p.unidad}</p>
            <p class="card-text ${sinStock ? 'text-danger' : 'text-body-secondary'}">
              ${sinStock ? 'Sin stock' : `Stock: ${p.stock}`}
            </p>
            <div class="mt-auto d-flex gap-2">
              <a href="pages/producto_detalle.html?code=${encodeURIComponent(p.code)}" class="btn btn-outline-success w-50">Ver</a>
              <button class="btn btn-success w-50" data-code="${p.code}" ${sinStock ? "disabled" : ""}>Añadir</button>
            </div>
          </div>
        </div>
      `;
  
      // Click del botón añadir (si hay stock)
      const btn = col.querySelector("button[data-code]");
      if (btn && !sinStock) {
        btn.addEventListener("click", (e) => {
          const code = e.currentTarget.getAttribute("data-code");
          addToCart(code, 1);
        });
      }
  
      cont.appendChild(col);
    });
  
    if (msg) msg.hidden = true;
  }
  
  // -----------------------------
  // Utilidades
  // -----------------------------
  /** Formato CLP sin decimales (seguro). */
  function formatPrecio(num) {
    const n = Number(num || 0);
    try {
      return new Intl.NumberFormat("es-CL", {
        style: "currency",
        currency: "CLP",
        maximumFractionDigits: 0
      }).format(n);
    } catch {
      return `$${n}`;
    }
  }
  
  // -----------------------------
  // Init
  // -----------------------------
  document.addEventListener("DOMContentLoaded", () => {
    renderDestacados();   // Solo hace algo si existe #grid-destacados
    updateCartBadge();    // Refresca título/badge
  });
  