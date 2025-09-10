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

  if (form) {
    form.addEventListener('submit', function (e) {
      let ok = true;
      if (
        (p1.value || '').length < 4 ||
        (p1.value || '').length > 10 ||
        p1.value !== p2.value ||
        !passwordFuerte(p1.value)
      ) {
        ok = false;
        p2.classList.add('is-invalid');
        errPass2.textContent = 'La contraseña debe tener 4-10 caracteres, incluir mayúscula, minúscula, número y caracter especial.';
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
