function getParam(name){
  const url = new URL(location.href);
  return url.searchParams.get(name);
}

function renderDetalle() {
  const code = getParam('code');
  const cont = document.getElementById('contenido');

  if (!code || !Array.isArray(window.PRODUCTOS)) {
    cont.innerHTML = `
      <div class="alert alert-warning">Producto no especificado.</div>
    `;
    return;
  }

  const p = window.PRODUCTOS.find(x => x.code === code);
  if (!p) {
    cont.innerHTML = `
      <div class="alert alert-danger">No se encontró el producto <strong>${code}</strong>.</div>
    `;
    return;
  }

  cont.innerHTML = `
    <div class="row g-4 align-items-start">
      <div class="col-12 col-lg-6">
        <div class="ratio ratio-4x3 bg-white border rounded overflow-hidden">
          <img src="${p.img}" alt="${p.nombre}" class="w-100 h-100 object-fit-cover">
        </div>
      </div>

      <div class="col-12 col-lg-6">
        <span class="badge bg-warning text-dark mb-2">${p.code}</span>
        <h1 class="h3 text-success fw-bold">${p.nombre}</h1>
        <p class="text-muted mb-2">${formatPrecio(p.precio)} / ${p.unidad}</p>
        <p><small class="text-body-secondary">Stock disponible: ${p.stock}</small></p>

        <!-- Controles de compra -->
        <div class="d-flex align-items-center gap-2 mb-3">
          <label for="qty" class="form-label mb-0 me-2">Cantidad</label>
          <div class="input-group" style="max-width: 180px;">
            <button class="btn btn-outline-secondary" type="button" id="menos">−</button>
            <input id="qty" type="number" class="form-control text-center" value="1" min="1" max="${p.stock}">
            <button class="btn btn-outline-secondary" type="button" id="mas">+</button>
          </div>
        </div>

        <div class="d-flex gap-2">
          <button id="btn-add" class="btn btn-success btn-lg flex-grow-1">Añadir al carrito</button>
          <a href="carrito.html" class="btn btn-outline-success">Ver carrito</a>
        </div>

        <hr class="my-4">

        <!-- Descripción corta sugerida (puedes personalizar por categoría) -->
        <div class="text-muted">
          <p>
            Producto fresco y seleccionado de HuertoHogar. Ideal para preparaciones saludables,
            directo del campo a tu mesa. Mantener en lugar fresco y ventilado.
          </p>
          <ul class="mb-0">
            <li>Unidad de venta: ${p.unidad}</li>
            <li>Código: ${p.code}</li>
            <li>Precio: ${formatPrecio(p.precio)}</li>
          </ul>
        </div>
      </div>
    </div>
  `;

  // Eventos de cantidad
  const input = document.getElementById('qty');
  document.getElementById('menos').addEventListener('click', () => {
    input.value = Math.max(1, Number(input.value || 1) - 1);
  });
  document.getElementById('mas').addEventListener('click', () => {
    input.value = Math.min(Number(input.max), Number(input.value || 1) + 1);
  });

  // Añadir al carrito
  document.getElementById('btn-add').addEventListener('click', () => {
    const qty = Math.max(1, Math.min(Number(input.max), Number(input.value || 1)));
    addToCart(p.code, qty);
  });

  // Relacionados (mismo prefijo de código: FR/VR/PO/PL)
  renderRelacionados(p);
}

function renderRelacionados(p) {
  const pref = p.code.slice(0,2);
  const relacionados = (window.PRODUCTOS || [])
    .filter(x => x.code.startsWith(pref) && x.code !== p.code)
    .slice(0, 3);

  const sec = document.getElementById('relacionados');
  if (relacionados.length === 0) {
    sec.innerHTML = '';
    return;
  }

  let html = `
    <h2 class="h5 text-success fw-bold mb-3">También podría interesarte</h2>
    <div class="row g-4">
  `;
  for (const r of relacionados) {
    html += `
      <div class="col-12 col-sm-6 col-lg-4">
        <div class="card h-100 shadow-sm">
          <img src="${r.img}" class="card-img-top" alt="${r.nombre}" loading="lazy">
          <div class="card-body d-flex flex-column">
            <span class="badge bg-warning text-dark mb-2">${r.code}</span>
            <h5 class="card-title">${r.nombre}</h5>
            <p class="card-text text-muted mb-1">${formatPrecio(r.precio)} / ${r.unidad}</p>
            <div class="mt-auto d-flex gap-2">
              <a href="producto_detalle.html?code=${encodeURIComponent(r.code)}" class="btn btn-outline-success w-50">Ver</a>
              <button class="btn btn-success w-50" data-code="${r.code}">Añadir</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  html += `</div>`;
  sec.innerHTML = html;

  // Bind añadir en relacionados
  sec.querySelectorAll('button[data-code]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      addToCart(e.currentTarget.getAttribute('data-code'), 1);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderDetalle();
  updateCartBadge();
});
