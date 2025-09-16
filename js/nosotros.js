// Lógica de nosotros para nosotros.html

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
  document.getElementById('year').textContent = new Date().getFullYear();
});
