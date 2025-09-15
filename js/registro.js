// registro.js
// Lógica de validación del formulario de registro


document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form-reg');
  const p1 = document.getElementById('pass');
  const p2 = document.getElementById('pass2');
  const errPass2 = document.getElementById('err-pass2');
  const requisitos = document.getElementById('requisitos-pass');

  // Mostrar requisitos al enfocar el campo de contraseña
  if (p1 && requisitos) {
    p1.addEventListener('focus', function () {
      requisitos.style.display = 'block';
    });
    p1.addEventListener('blur', function () {
      requisitos.style.display = 'none';
    });
  }

  function passwordFuerte(pass) {
    return /^([A-Za-z\d@$!%*?&]{4,10})$/.test(pass) &&
      /[A-Z]/.test(pass) &&
      /[a-z]/.test(pass) &&
      /\d/.test(pass) &&
      /[@$!%*?&]/.test(pass);
  }

  function correoPermitido(v) {
    if (!v) return false;
    v = v.toLowerCase();
    return v.endsWith('@duoc.cl') || v.endsWith('@profesor.duoc.cl') || v.endsWith('@gmail.com');
  }

  if (form && p1 && p2 && errPass2) {
    form.addEventListener('submit', function (e) {
      let ok = true;

      // Validar correo
      const correo = document.getElementById('correo');
      const errCorreo = document.getElementById('err-correo');
      if (!correoPermitido(correo.value)) {
        ok = false;
        correo.classList.add('is-invalid');
        if (errCorreo) errCorreo.textContent = 'El correo debe pertenecer a @duoc.cl, @profesor.duoc.cl o @gmail.com';
      } else {
        correo.classList.remove('is-invalid');
        if (errCorreo) errCorreo.textContent = '';
      }

      // Validar contraseña y confirmación
      if ((p1.value || '').length < 4 ||
          (p1.value || '').length > 10 ||
          !passwordFuerte(p1.value)) {
        ok = false;
        p1.classList.add('is-invalid');
      } else {
        p1.classList.remove('is-invalid');
      }

      if (p1.value !== p2.value) {
        ok = false;
        p2.classList.add('is-invalid');
        errPass2.textContent = 'Las contraseñas no coinciden.';
      } else {
        p2.classList.remove('is-invalid');
        errPass2.textContent = '';
      }

      if (!ok) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        e.preventDefault(); // solo simulación
        document.getElementById('ok').classList.remove('d-none');
        form.reset();
        form.classList.remove('was-validated');
      }
      form.classList.add('was-validated');
    });
  }
});
