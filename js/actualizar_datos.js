// js/actualizar_datos.js

document.addEventListener('DOMContentLoaded', function () {
    // Simulación: obtener datos del usuario desde localStorage
    const usuario = JSON.parse(localStorage.getItem('usuario')) || {};

    const form = document.getElementById('formActualizarDatos');
    const nombreInput = document.getElementById('nombre');
    const apellidoInput = document.getElementById('apellido');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const mensajeExito = document.getElementById('mensajeExito');

    // Rellenar campos con datos actuales
    if (usuario) {
        nombreInput.value = usuario.nombre || '';
        apellidoInput.value = usuario.apellido || '';
        emailInput.value = usuario.email || '';
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let valido = true;
        // Validación nombre
        if (!nombreInput.value.trim()) {
            nombreInput.classList.add('is-invalid');
            valido = false;
        } else {
            nombreInput.classList.remove('is-invalid');
        }
        // Validación apellido
        if (!apellidoInput.value.trim()) {
            apellidoInput.classList.add('is-invalid');
            valido = false;
        } else {
            apellidoInput.classList.remove('is-invalid');
        }
        // Validación contraseña (si se quiere cambiar)
        if (passwordInput.value) {
            const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
            if (!regex.test(passwordInput.value)) {
                passwordInput.classList.add('is-invalid');
                valido = false;
            } else {
                passwordInput.classList.remove('is-invalid');
            }
            // Confirmar contraseña
            if (passwordInput.value !== confirmPasswordInput.value) {
                confirmPasswordInput.classList.add('is-invalid');
                valido = false;
            } else {
                confirmPasswordInput.classList.remove('is-invalid');
            }
        } else {
            passwordInput.classList.remove('is-invalid');
            confirmPasswordInput.classList.remove('is-invalid');
        }
        if (!valido) return;
        // Guardar cambios en localStorage
        usuario.nombre = nombreInput.value.trim();
        usuario.apellido = apellidoInput.value.trim();
        // Solo actualizar contraseña si se ingresó
        if (passwordInput.value) {
            usuario.password = passwordInput.value;
        }
        localStorage.setItem('usuario', JSON.stringify(usuario));
        mensajeExito.classList.remove('d-none');
        setTimeout(() => mensajeExito.classList.add('d-none'), 3000);
        passwordInput.value = '';
        confirmPasswordInput.value = '';
    });
});
