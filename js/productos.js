// Lógica de catálogo y filtros para productos.html

document.addEventListener('DOMContentLoaded', () => {
  const formFiltros = document.getElementById('form-filtros');
  const inputQ = document.getElementById('q');
  const selectCategoria = document.getElementById('categoria');
  const selectOrden = document.getElementById('orden');
  const grid = document.getElementById('grid');
  const estado = document.getElementById('estado');

  let productosFiltrados = [...PRODUCTOS];

  function filtrarYRenderizar() {
    let lista = [...PRODUCTOS];
    const q = (inputQ.value || '').toLowerCase();
    const cat = selectCategoria.value;
    const ord = selectOrden.value;

    // Filtro búsqueda
    if (q) {
      lista = lista.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        (p.code && p.code.toLowerCase().includes(q))
      );
    }
    // Filtro categoría
    if (cat) {
      lista = lista.filter(p => {
        if (cat === 'Frutas Frescas') return p.code.startsWith('FR');
        if (cat === 'Verduras Orgánicas') return p.code.startsWith('VR');
        if (cat === 'Productos Orgánicos') return p.code.startsWith('PO');
        if (cat === 'Productos Lácteos') return p.code.startsWith('PL');
        return true;
      });
    }
    // Orden
    if (ord === 'precio_asc') lista.sort((a,b) => a.precio - b.precio);
    if (ord === 'precio_desc') lista.sort((a,b) => b.precio - a.precio);
    if (ord === 'nombre_asc') lista.sort((a,b) => a.nombre.localeCompare(b.nombre));
    if (ord === 'nombre_desc') lista.sort((a,b) => b.nombre.localeCompare(a.nombre));

    renderCatalogoPersonalizado(lista);
  }

  function renderCatalogoPersonalizado(lista) {
    grid.innerHTML = '';
    if (!lista.length) {
      estado.hidden = false;
      return;
    }
    estado.hidden = true;
    for (const p of lista) {
      const sinStock = Number(p.stock) <= 0;
      let imgSrc = p.img;
      if (window.location.pathname.includes('/pages/')) {
        if (imgSrc.startsWith('images/')) imgSrc = '../' + imgSrc;
      }
      const col = document.createElement('div');
      col.className = "col-12 col-sm-6 col-lg-4";
      col.innerHTML = `
        <div class="card h-100 shadow-sm">
          <img src="${imgSrc}" class="card-img-top" alt="${p.nombre}" loading="lazy">
          <div class="card-body d-flex flex-column">
            <span class="badge bg-warning text-dark align-self-start mb-2">${p.code}</span>
            <h5 class="card-title mb-1">${p.nombre}</h5>
            <p class="card-text text-muted mb-1">${formatPrecio(p.precio)} / ${p.unidad}</p>
            <p class="card-text ${sinStock ? 'text-danger' : 'text-body-secondary'}">
              ${sinStock ? 'Sin stock' : `Stock: ${p.stock}`}
            </p>
            <div class="mt-auto d-flex gap-2">
              <a class="btn btn-outline-success w-50" href="producto_detalle.html?code=${encodeURIComponent(p.code)}">Ver</a>
              <button class="btn btn-success w-50" data-code="${p.code}" ${sinStock ? 'disabled' : ''}>Añadir</button>
            </div>
          </div>
        </div>
      `;
      const btn = col.querySelector('button[data-code]');
      if (btn && !sinStock) {
        btn.addEventListener('click', (e) => {
          const code = e.currentTarget.getAttribute('data-code');
          addToCart(code, 1);
        });
      }
      grid.appendChild(col);
    }
  }

  // Eventos de filtros
  formFiltros.addEventListener('input', filtrarYRenderizar);
  formFiltros.addEventListener('change', filtrarYRenderizar);

  // Inicializar catálogo
  filtrarYRenderizar();
  updateCartBadge();

  // Footer año
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
});
