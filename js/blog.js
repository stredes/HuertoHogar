// Lógica de blog para blog.html
document.addEventListener('DOMContentLoaded', () => {
  // Lógica para cerrar sesión
  const btnCerrarSesion = document.getElementById('btnCerrarSesion');
  if (btnCerrarSesion) {
    btnCerrarSesion.onclick = cerrarSesion;
  }
  function cerrarSesion() {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'login.html';
  }
});

const POSTS = [
  {
    slug: "recetas-de-temporada-con-espinacas",
    titulo: "Recetas de temporada con espinacas",
    categoria: "Recetas",
    fecha: "2025-08-28",
    resumen: "Tres ideas rápidas y saludables para aprovechar espinacas frescas en salteados, tortillas y smoothies.",
    img: "https://images.unsplash.com/photo-1547056961-3a1e3a6ffbaf?q=80&w=1200"
  },
  {
    slug: "como-conservar-frutas-por-mas-tiempo",
    titulo: "Cómo conservar frutas por más tiempo",
    categoria: "Consejos",
    fecha: "2025-08-20",
    resumen: "Trucos sencillos para evitar desperdicio: ventilación, temperatura y separación por madurez.",
    img: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=1200"
  },
  {
    slug: "alianzas-con-agricultores-locales",
    titulo: "Alianzas con agricultores locales",
    categoria: "Noticias",
    fecha: "2025-08-10",
    resumen: "Seguimos expandiendo nuestra red para asegurar frescura y trazabilidad en todo Chile.",
    img: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200"
  }
];

function filtrarOrdenar(posts){
  const q   = (document.getElementById('q').value || '').toLowerCase().trim();
  const cat = document.getElementById('cat').value;
  const ord = document.getElementById('ord').value;

  let out = [...posts];
  if (q){
    out = out.filter(p =>
      p.titulo.toLowerCase().includes(q) ||
      p.resumen.toLowerCase().includes(q) ||
      p.categoria.toLowerCase().includes(q)
    );
  }
  if (cat){
    out = out.filter(p => p.categoria === cat);
  }

  if (ord === 'reciente') out.sort((a,b)=> b.fecha.localeCompare(a.fecha));
  if (ord === 'antiguo')  out.sort((a,b)=> a.fecha.localeCompare(b.fecha));
  if (ord === 'titulo_asc')  out.sort((a,b)=> a.titulo.localeCompare(b.titulo));
  if (ord === 'titulo_desc') out.sort((a,b)=> b.titulo.localeCompare(a.titulo));

  return out;
}

function render(){
  const cont = document.getElementById('grid');
  const estado = document.getElementById('estado');
  const data = filtrarOrdenar(POSTS);

  cont.innerHTML = '';
  if (data.length === 0){
    estado.classList.remove('d-none');
    return;
  }
  estado.classList.add('d-none');

  for (const p of data){
    const col = document.createElement('div');
    col.className = "col-12 col-md-6 col-xl-4";
    col.innerHTML = `
      <article class="card h-100 shadow-sm">
        <img src="${p.img}" class="card-img-top" alt="${p.titulo}" loading="lazy">
        <div class="card-body d-flex flex-column">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-secondary">${p.categoria}</span>
            <small class="text-muted">${new Date(p.fecha).toLocaleDateString('es-CL')}</small>
          </div>
          <h2 class="h5 card-title">${p.titulo}</h2>
          <p class="card-text text-muted">${p.resumen}</p>
          <a class="btn btn-outline-success mt-auto" href="blog_detalle.html?slug=${encodeURIComponent(p.slug)}">Leer más</a>
        </div>
      </article>
    `;
    cont.appendChild(col);
  }
}

document.getElementById('q').addEventListener('input', render);
document.getElementById('cat').addEventListener('change', render);
document.getElementById('ord').addEventListener('change', render);

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  render();
  updateCartBadge();
});
