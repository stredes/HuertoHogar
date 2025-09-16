// Lógica de carrito para carrito.html

document.addEventListener('DOMContentLoaded', () => {
  // ...existing code...
  // Helpers UI
  function byId(id){ return document.getElementById(id); }

  function render() {
    const cart = getCart();
    const tbody = byId('tbody');
    const vacio = byId('vacio');
    const tabla = byId('wrap-tabla');
    const panel = byId('panel-total');
    const tot = byId('total');

    tbody.innerHTML = '';

    if (!cart.length) {
      vacio.classList.remove('d-none');
      tabla.classList.add('d-none');
      panel.classList.add('d-none');
      updateCartBadge();
      return;
    }

    vacio.classList.add('d-none');
    tabla.classList.remove('d-none');
    panel.classList.remove('d-none');

    // Render filas
    for (const item of cart) {
      const p = (window.PRODUCTOS || []).find(x => x.code === item.code);
      const stock = p ? p.stock : 9999; // seguridad

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><span class="badge bg-warning text-dark">${item.code}</span></td>
        <td class="fw-medium">${item.nombre}</td>
        <td class="text-end">${formatPrecio(item.precio)}</td>
        <td class="text-center">
          <div class="btn-group" role="group" aria-label="Cantidad">
            <button class="btn btn-outline-secondary btn-sm" data-action="menos" data-code="${item.code}">−</button>
            <input type="number" class="form-control form-control-sm text-center" style="width:80px" value="${item.cantidad}" min="1" max="${stock}" data-role="qty" data-code="${item.code}">
            <button class="btn btn-outline-secondary btn-sm" data-action="mas" data-code="${item.code}">+</button>
          </div>
        </td>
        <td class="text-end fw-semibold">${formatPrecio(item.precio * item.cantidad)}</td>
        <td class="text-center">
          <button class="btn btn-outline-danger btn-sm" title="Eliminar" data-action="remove" data-code="${item.code}">✕</button>
        </td>
      `;
      tbody.appendChild(tr);
    }

    // Total
    tot.textContent = formatPrecio(cartTotal());

    // Bind eventos (delegación)
    tbody.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.getAttribute('data-action');
        const code = e.currentTarget.getAttribute('data-code');
        if (action === 'remove') {
          removeFromCart(code);
          toast('Producto eliminado del carrito', 'warning');
          render();
          return;
        }
        if (action === 'menos' || action === 'mas') {
          const cart = getCart();
          const idx = cart.findIndex(i => i.code === code);
          if (idx === -1) return;

          const prod = (window.PRODUCTOS || []).find(x => x.code === code);
          const stock = prod ? prod.stock : 9999;

          let qty = Number(cart[idx].cantidad) || 1;
          qty += (action === 'mas' ? 1 : -1);
          qty = Math.min(Math.max(qty, 1), stock);
          cart[idx].cantidad = qty;
          saveCart(cart);
          render();
        }
      });
    });

    tbody.querySelectorAll('input[data-role="qty"]').forEach(inp => {
      inp.addEventListener('change', (e) => {
        const code = e.currentTarget.getAttribute('data-code');
        const prod = (window.PRODUCTOS || []).find(x => x.code === code);
        const stock = prod ? prod.stock : 9999;

        let qty = Number(e.currentTarget.value) || 1;
        qty = Math.min(Math.max(qty, 1), stock);

        const cart = getCart();
        const idx = cart.findIndex(i => i.code === code);
        if (idx > -1) {
          cart[idx].cantidad = qty;
          saveCart(cart);
          render();
        }
      });
    });

    updateCartBadge();
  }

  // Vaciar carrito
  byId('btn-vaciar').addEventListener('click', () => {
    if (!getCart().length) return;
    if (confirm('¿Seguro que deseas vaciar el carrito?')) {
      saveCart([]);
      render();
      toast('Carrito vaciado', 'secondary');
    }
  });

  // Año + primer render
  const year = byId('year');
  if (year) year.textContent = new Date().getFullYear();
  render();
  updateCartBadge();
});
