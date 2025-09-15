// Lógica de contacto para contacto.html

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('year').textContent = new Date().getFullYear();

  // Validador de dominios permitidos (si el usuario ingresa correo)
  function correoPermitido(v) {
    if (!v) return true; // el correo es opcional en contacto
    v = v.toLowerCase();
    return v.endsWith('@duoc.cl') || v.endsWith('@profesor.duoc.cl') || v.endsWith('@gmail.com');
  }

  // Contador de caracteres del comentario
  const comentario = document.getElementById('comentario');
  const contador = document.getElementById('contador');
  comentario.addEventListener('input', () => {
    const len = (comentario.value || '').length;
    contador.textContent = `${len} / 500`;
  });

  const form = document.getElementById('form-contacto');
  form.addEventListener('submit', (e) => {
    let ok = true;

    // validación nativa
    if (!form.checkValidity()) ok = false;

    // correo con dominios permitidos si fue ingresado
    const correo = document.getElementById('correo');
    if (!correoPermitido(correo.value)) {
      ok = false;
      correo.classList.add('is-invalid');
      document.getElementById('err-correo').textContent = 'El correo debe pertenecer a @duoc.cl, @profesor.duoc.cl o @gmail.com';
    } else {
      correo.classList.remove('is-invalid');
    }

    // comentario requerido y <= 500
    const com = document.getElementById('comentario');
    if ((com.value || '').trim().length === 0 || (com.value || '').length > 500) {
      ok = false;
      com.classList.add('is-invalid');
    } else {
      com.classList.remove('is-invalid');
    }

    if (!ok) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      e.preventDefault(); // simulación para la evaluación
      form.reset();
      contador.textContent = '0 / 500';
      document.getElementById('ok').classList.remove('d-none');
      toast('Mensaje enviado (simulación)', 'success');
    }
    form.classList.add('was-validated');
  });

  // Reset: limpiar estados visuales
  form.addEventListener('reset', () => {
    form.classList.remove('was-validated');
    document.getElementById('ok').classList.add('d-none');
    document.getElementById('correo').classList.remove('is-invalid');
    document.getElementById('comentario').classList.remove('is-invalid');
    contador.textContent = '0 / 500';
  });
});
