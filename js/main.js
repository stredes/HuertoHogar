/* main.js — HuertoHogar
   - Render de productos destacados en Home
   - Carrito con localStorage
   - Utilidades y helpers
   Nota: pensado para Bootstrap 5.3.8
*/

// -----------------------------
// Datos "faker" (Forma A HuertoHogar)
// -----------------------------
const PRODUCTOS = [
    // Frutas Frescas
    { code: "FR001", nombre: "Manzanas Fuji", precio: 1200, unidad: "kg", stock: 150, img: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=1200" },
    { code: "FR002", nombre: "Naranjas Valencia", precio: 1000, unidad: "kg", stock: 200, img: "https://images.unsplash.com/photo-1547514701-42782101795e?q=80&w=1200" },
    { code: "FR003", nombre: "Plátanos Cavendish", precio: 800,  unidad: "kg", stock: 250, img: "https://images.unsplash.com/photo-1571772805064-207c8435df79?q=80&w=1200" },
    // Verduras Orgánicas
    { code: "VR001", nombre: "Zanahorias Orgánicas", precio: 900, unidad: "kg", stock: 100, img: "https://images.unsplash.com/photo-1515542706656-8e6ef17a1521?q=80&w=1200" },
    { code: "VR002", nombre: "Espinacas Frescas",   precio: 700, unidad: "500 g", stock: 80, img: "https://images.unsplash.com/photo-1547056961-3a1e3a6ffbaf?q=80&w=1200" },
    { code: "VR003", nombre: "Pimientos Tricolores", precio: 1500, unidad: "kg", stock: 120, img: "https://images.unsplash.com/photo-1511690078903-71dc5a56f694?q=80&w=1200" },
    // Productos Orgánicos / Lácteos
    { code: "PO001", nombre: "Miel Orgánica 500g",  precio: 5000, unidad: "frasco", stock: 50, img: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200" },
    { code: "PL001", nombre: "Leche Entera 1L",     precio: 1200, unidad: "unidad", stock: 90, img: "https://images.unsplash.com/photo-1550581190-9c1c48d21d6c?q=80&w=1200" },
  ];
  
  // -----------------------------
  // Carrito (localStorage)
  // -----------------------------
  const LS_KEY = "hh_cart";
  
  function getCart() {
    try {
      return JSON.parse(localStorage.getItem(LS_KEY)) || [];
    } catch {
      return [];
    }
  }
  
  function saveCart(cart) {
    localStorage.setItem(LS_KEY, JSON.stringify(cart));
  }
  
  function addToCart(code, cantidad = 1) {
    const producto = PRODUCTOS.find(p => p.code === code);
    if (!producto) return toast("Producto no encontrado", "danger");
  
    const cart = getCart();
    const idx = cart.findIndex(i => i.code === code);
  
    // Reglas simples: no permitir superar stock
    if (idx > -1) {
      const nueva = { ...cart[idx] };
      nueva.cantidad = Math.min(nueva.cantidad + cantidad, producto.stock);
      cart[idx] = nueva;
    } else {
      cart.push({ code: producto.code, nombre: producto.nombre, precio: producto.precio, cantidad: Math.min(cantidad, producto.stock) });
    }
  
    saveCart(cart);
    toast(`Añadido: ${producto.nombre}`, "success");
    updateCartBadge();
  }
  
  function removeFromCart(code) {
    const cart = getCart().filter(i => i.code !== code);
    saveCart(cart);
    updateCartBadge();
  }
  
  function cartTotal() {
    return getCart().reduce((acc, i) => acc + i.precio * i.cantidad, 0);
  }
  
  function updateCartBadge() {
    // Puedes crear un badge en la navbar si lo deseas (no obligatorio)
    // Por ejemplo, colocar el total de ítems en el título del documento:
    const totalItems = getCart().reduce((acc, i) => acc + i.cantidad, 0);
    document.title = totalItems > 0 ? `(${totalItems}) HuertoHogar` : "HuertoHogar — Frescura del campo a tu mesa";
  }
  
  // -----------------------------
  // UI helpers (Bootstrap Toast)
  // -----------------------------
  function toast(msg, type = "primary") {
    // Crea un toast ligero al vuelo (sin contenedor persistente)
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
        <div class="toast-body">
          ${msg}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    `;
    wrap.appendChild(el);
    document.body.appendChild(wrap);
  
    // Autocierre
    setTimeout(() => {
      wrap.remove();
    }, 2200);
  }
  
  // -----------------------------
  // Render: productos destacados en Home
  // -----------------------------
  function renderDestacados() {
    const cont = document.getElementById("grid-destacados");
    const msg = document.getElementById("msg-estado");
    if (!cont) return; // Estamos en otra página
  
    msg && (msg.hidden = false);
    cont.innerHTML = "";
  
    // Tomamos 6 productos para el Home (o todos si < 6)
    const destacados = PRODUCTOS.slice(0, 6);
  
    destacados.forEach(p => {
      const col = document.createElement("div");
      col.className = "col-12 col-sm-6 col-lg-4";
  
      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${p.img}" class="card-img-top" alt="${p.nombre}" loading="lazy">
          <div class="card-body d-flex flex-column">
            <span class="badge bg-warning text-dark align-self-start mb-2">${p.code}</span>
            <h5 class="card-title">${p.nombre}</h5>
            <p class="card-text text-muted mb-1">${formatPrecio(p.precio)} / ${p.unidad}</p>
            <p class="card-text"><small class="text-body-secondary">Stock: ${p.stock}</small></p>
            <div class="mt-auto d-flex gap-2">
              <a href="pages/producto_detalle.html?code=${encodeURIComponent(p.code)}" class="btn btn-outline-success w-50">Ver</a>
              <button class="btn btn-success w-50" data-code="${p.code}">Añadir</button>
            </div>
          </div>
        </div>
      `;
  
      // Delegamos el click del botón añadir
      const btn = col.querySelector("button[data-code]");
      btn.addEventListener("click", (e) => {
        const code = e.currentTarget.getAttribute("data-code");
        addToCart(code, 1);
      });
  
      cont.appendChild(col);
    });
  
    msg && (msg.hidden = true);
  }
  
  // -----------------------------
  // Utilidades
  // -----------------------------
  function formatPrecio(num) {
    // Formato CLP sin decimales
    try {
      return new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(num);
    } catch {
      return `$${num}`;
    }
  }
  
  // -----------------------------
  // Init
  // -----------------------------
  document.addEventListener("DOMContentLoaded", () => {
    renderDestacados();
    updateCartBadge();
  });
  