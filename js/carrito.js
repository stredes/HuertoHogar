document.addEventListener('DOMContentLoaded', () => {
// Lógica de carrito para carrito.html

// Espera a que el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Helper para obtener elementos por id
  function byId(id){ return document.getElementById(id); }

  // Renderiza el carrito en la tabla
  function render() {
    // Obtiene el carrito desde localStorage
    const cart = getCart();
    // Elementos de la UI
    const tbody = byId('tbody');
    const vacio = byId('vacio');
    const tabla = byId('wrap-tabla');
    const panel = byId('panel-total');
    const tot = byId('total');

    // Limpia la tabla antes de renderizar
    tbody.innerHTML = '';

    // Si el carrito está vacío, muestra mensaje y oculta tabla/panel
    if (!cart.length) {
      vacio.classList.remove('d-none');
      tabla.classList.add('d-none');
      panel.classList.add('d-none');
      updateCartBadge(); // Actualiza el badge del carrito
      return;
    }

    // Si hay productos, muestra tabla y panel
    vacio.classList.add('d-none');
    tabla.classList.remove('d-none');
    panel.classList.remove('d-none');

    // Renderiza cada producto del carrito como fila en la tabla
    for (const item of cart) {
      // Busca el producto en el catálogo global
      const p = (window.PRODUCTOS || []).find(x => x.code === item.code);
      // Usa el stock real si existe, si no, un valor alto por seguridad
      const stock = p ? p.stock : 9999;

      // Crea la fila con los datos y controles de cantidad
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

    // Muestra el total del carrito
    tot.textContent = formatPrecio(cartTotal());

    // Asocia eventos a los botones de cantidad y eliminar usando delegación
    tbody.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {

        // Obtiene la acción y el código de producto
        const action = e.currentTarget.getAttribute('data-action');
        const code = e.currentTarget.getAttribute('data-code');
        // Si es eliminar, quita el producto del carrito
        if (action === 'remove') {
          removeFromCart(code);
          toast('Producto eliminado del carrito', 'warning');
          render();
          return;
        }
        // Si es sumar/restar cantidad
        if (action === 'menos' || action === 'mas') {
          const cart = getCart();
          const idx = cart.findIndex(i => i.code === code);
          if (idx === -1) return;

          // Busca el producto y su stock
          const prod = (window.PRODUCTOS || []).find(x => x.code === code);
          const stock = prod ? prod.stock : 9999;

          // Calcula la nueva cantidad y la limita entre 1 y stock
          let qty = Number(cart[idx].cantidad) || 1;
          qty += (action === 'mas' ? 1 : -1);
          qty = Math.min(Math.max(qty, 1), stock);
          cart[idx].cantidad = qty;
          saveCart(cart);
          render();
        }
      });
    });

    // Asocia evento al input de cantidad para cambios manuales
    tbody.querySelectorAll('input[data-role="qty"]').forEach(inp => {
      inp.addEventListener('change', (e) => {
        const code = e.currentTarget.getAttribute('data-code');
        const prod = (window.PRODUCTOS || []).find(x => x.code === code);
        const stock = prod ? prod.stock : 9999;

        // Obtiene la cantidad ingresada y la limita entre 1 y stock
        let qty = Number(e.currentTarget.value) || 1;
        qty = Math.min(Math.max(qty, 1), stock);

        // Actualiza la cantidad en el carrito
        const cart = getCart();
        const idx = cart.findIndex(i => i.code === code);
        if (idx > -1) {
          cart[idx].cantidad = qty;
          saveCart(cart);
          render();
        }
      });
    });

    // Actualiza el badge del carrito
    updateCartBadge();
  }

  // Evento para vaciar el carrito
  byId('btn-vaciar').addEventListener('click', () => {
    if (!getCart().length) return;
    if (confirm('¿Seguro que deseas vaciar el carrito?')) {
      saveCart([]);
      render();
      toast('Carrito vaciado', 'secondary');
    }
  });

  // Muestra el año actual en el footer y renderiza el carrito al cargar
  const year = byId('year');
  if (year) year.textContent = new Date().getFullYear();
  render();
  updateCartBadge();
});
