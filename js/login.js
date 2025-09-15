// Lógica de login para login.html

document.addEventListener('DOMContentLoaded', () => {
  // Validación de dominios permitidos
  function correoPermitido(v) {
    if (!v) return false;
    v = v.toLowerCase();
    return v.endsWith('@duoc.cl') || v.endsWith('@profesor.duoc.cl') || v.endsWith('@gmail.com');
  }

  const form = document.getElementById('form-login');
  form.addEventListener('submit', (e) => {
    let ok = true;

    if (!form.checkValidity()) ok = false;

    const correo = document.getElementById('correo');
    if (!correoPermitido(correo.value)) {
      ok = false;
      correo.classList.add('is-invalid');
      document.getElementById('err-correo').textContent = 'El correo debe pertenecer a @duoc.cl, @profesor.duoc.cl o @gmail.com';
    } else {
      correo.classList.remove('is-invalid');
    }

    const pass = document.getElementById('pass');
    if ((pass.value || '').length < 4 || (pass.value || '').length > 10) {
      ok = false;
    }

    if (!ok) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault(); // simulación
      document.getElementById('ok').classList.remove('d-none');
      // Guardar usuario simulado en localStorage para demo
      const usuario = {
        nombre: 'Nombre',
        apellido: 'Apellido',
        email: correo.value,
        password: pass.value
      };
      localStorage.setItem('usuario', JSON.stringify(usuario));
      // Redirección simulada a productos, pero mostrar opción de actualizar datos
      setTimeout(()=> location.href = 'productos.html', 950);
    }
    form.classList.add('was-validated');
  });

  // Agregar acceso a la página de actualización de datos si el usuario está logueado
  const usuarioGuardado = localStorage.getItem('usuario');
  if (usuarioGuardado) {
    const nav = document.querySelector('nav, .navbar, header');
    if (nav) {
      let btn = document.createElement('a');
      btn.href = 'actualizar_datos.html';
      btn.className = 'btn btn-outline-success ms-2';
      btn.textContent = 'Actualizar mis datos';
      nav.appendChild(btn);

    }
  }
});
