// Lógica común para páginas de producto individual

document.addEventListener('DOMContentLoaded', function() {
  // Cierre de sesión
  const btnCerrarSesion = document.getElementById('btnCerrarSesion');
  if (btnCerrarSesion) {
    btnCerrarSesion.onclick = function() {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = 'login.html';
    };
  }

  // Añadir al carrito
  const btnAddCarrito = document.getElementById('btnAddCarrito');
  if (btnAddCarrito) {
    // El código de producto debe estar en el botón como data-code
    const code = btnAddCarrito.getAttribute('data-code');
    btnAddCarrito.onclick = function() {
      if (typeof addToCart === 'function' && code) {
        addToCart(code, 1);
        updateCartBadge();
      }
    };
  }

  // Actualizar badge al cargar
  if (typeof updateCartBadge === 'function') {
    updateCartBadge();
  }
});
