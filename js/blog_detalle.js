// Lógica de blog_detalle para blog_detalle.html

const POSTS = [
  {
    slug: "recetas-de-temporada-con-espinacas",
    titulo: "Recetas de temporada con espinacas",
    categoria: "Recetas",
    fecha: "2025-08-28",
    img: "https://images.unsplash.com/photo-1547056961-3a1e3a6ffbaf?q=80&w=1200",
    contenido: `
      <p>Las <strong>espinacas frescas</strong> son versátiles y ricas en hierro y vitaminas.
      Aquí van tres ideas rápidas:</p>
      <ol>
        <li><em>Salteado</em> con ajo y aceite de oliva.</li>
        <li><em>Tortilla</em> con huevos de campo y queso rallado.</li>
        <li><em>Smoothie verde</em> con plátano y miel orgánica.</li>
      </ol>
      <p>Compra espinacas en <a href="productos.html">nuestro catálogo</a> y pruébalas hoy mismo.</p>
    `
  },
  {
    slug: "como-conservar-frutas-por-mas-tiempo",
    titulo: "Cómo conservar frutas por más tiempo",
    categoria: "Consejos",
    fecha: "2025-08-20",
    img: "https://images.unsplash.com/photo-1570913149827-d2ac84ab3f9a?q=80&w=1200",
    contenido: `
      <p>Para extender la vida útil de tus frutas:</p>
      <ul>
        <li>Guárdalas en un lugar <strong>ventilado</strong> y seco.</li>
        <li>Separa las maduras de las verdes para evitar <em>etileno</em> excesivo.</li>
        <li>No laves hasta justo antes de consumir.</li>
      </ul>
      <p>Revisa nuestras <a href="productos.html">frutas frescas</a> seleccionadas.</p>
    `
  },
  {
    slug: "alianzas-con-agricultores-locales",
    titulo: "Alianzas con agricultores locales",
    categoria: "Noticias",
    fecha: "2025-08-10",
    img: "https://images.unsplash.com/photo-1506806732259-39c2d0268443?q=80&w=1200",
    contenido: `
      <p>Seguimos sumando productores locales para asegurar <strong>frescura</strong> y
      <strong>trazabilidad</strong> en todo Chile. Estas alianzas fortalecen la economía regional.</p>
    `
  }
];

function getParam(name){
  const url = new URL(location.href);
  return url.searchParams.get(name);
}

function renderDetalle(){
  const slug = getParam('slug');
  const cont = document.getElementById('contenido');

  const post = POSTS.find(p => p.slug === slug);
  if (!post){
    cont.innerHTML = `<div class="alert alert-warning">No se encontró el artículo.</div>`;
    return;
  }

  cont.innerHTML = `
    <article class="card shadow-sm">
      <img src="${post.img}" class="card-img-top" alt="${post.titulo}">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="badge bg-secondary">${post.categoria}</span>
          <small class="text-muted">${new Date(post.fecha).toLocaleDateString('es-CL')}</small>
        </div>
        <h1 class="h3 text-success fw-bold">${post.titulo}</h1>
        <div class="mt-3 post-body">${post.contenido}</div>

        <hr class="my-4" />
        <div class="d-flex gap-2">
          <a href="blog.html" class="btn btn-outline-success">← Volver al blog</a>
          <a href="productos.html" class="btn btn-success">Ver productos</a>
        </div>
      </div>
    </article>
  `;

  renderRelacionados(post);
}

function renderRelacionados(post){
  const otros = POSTS.filter(p => p.categoria === post.categoria && p.slug !== post.slug).slice(0,3);
  const sec = document.getElementById('relacionados');
  if (otros.length === 0){
    sec.innerHTML = "";
    return;
  }

  let html = `
    <h2 class="h5 text-success fw-bold mb-3">Artículos relacionados</h2>
    <div class="row g-4">
  `;
  for (const p of otros){
    html += `
      <div class="col-12 col-md-6 col-xl-4">
        <article class="card h-100 shadow-sm">
          <img src="${p.img}" class="card-img-top" alt="${p.titulo}">
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-center mb-2">
              <span class="badge bg-secondary">${p.categoria}</span>
              <small class="text-muted">${new Date(p.fecha).toLocaleDateString('es-CL')}</small>
            </div>
            <h3 class="h6">${p.titulo}</h3>
            <a class="btn btn-outline-success mt-auto" href="blog_detalle.html?slug=${encodeURIComponent(p.slug)}">Leer más</a>
          </div>
        </article>
      </div>
    `;
  }
  html += `</div>`;
  sec.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  renderDetalle();
  updateCartBadge();
});
