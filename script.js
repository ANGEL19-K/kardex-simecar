document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm') || document.getElementById('form-login');
    const usernameInput = document.getElementById('username') || document.getElementById('login-correo');
    const passwordInput = document.getElementById('password') || document.getElementById('login-clave');
    const togglePassword = document.getElementById('togglePassword');
    const loginBtn = document.getElementById('loginBtn') || document.getElementById('btn-login');
    const messageElement = document.getElementById('message') || document.getElementById('login-error');

    // Verificar que todos los elementos existan
    if (!loginForm || !usernameInput || !passwordInput || !loginBtn || !messageElement) {
        console.error('Error: No se encontraron todos los elementos necesarios');
        return;
    }

    function setLoginButtonState(isLoading, text = 'Iniciar Sesión') {
        if (!loginBtn) return;
        const span = loginBtn.querySelector('span');

        if (span) {
            span.innerHTML = isLoading
                ? '<i class="fas fa-spinner fa-spin"></i> Verificando...'
                : `<i class="fas fa-right-to-bracket"></i> ${text}`;
            return;
        }

        loginBtn.innerHTML = isLoading
            ? '<i class="fa-solid fa-spinner fa-spin mr-2"></i>Validando...'
            : '<i class="fa-solid fa-right-to-bracket mr-2"></i>Iniciar sesión';
    }

    // Mostrar/Ocultar contraseña
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            const icon = this.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        });
    }

    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    supabase.auth.getSession().then(({ data }) => {
        if (data.session && window.location.pathname.endsWith('index.html')) {
            window.location.replace('karex.html');
        }
    });

    // Manejar envío del formulario
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        // Validar campos vacíos
        if (!username || !password) {
            showMessage('Por favor completa todos los campos', 'error');
            return;
        }

        loginBtn.disabled = true;
        setLoginButtonState(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: username,
                password
            });

            if (error) {
                const mensajeError = String(error.message || '').toLowerCase();
                let mensaje = 'No se pudo iniciar sesión.';
                if (mensajeError.includes('invalid login credentials')) mensaje = 'Correo o contraseña incorrectos.';
                else if (mensajeError.includes('email not confirmed')) mensaje = 'El correo todavía no está confirmado en Supabase.';
                else if (mensajeError.includes('too many requests')) mensaje = 'Demasiados intentos. Espera unos minutos y vuelve a intentar.';
                else if (mensajeError.includes('network') || mensajeError.includes('fetch')) mensaje = 'No se pudo conectar con Supabase.';
                showMessage(mensaje, 'error');
                loginBtn.disabled = false;
                setLoginButtonState(false);
                return;
            }

            showMessage('Acceso correcto. Cargando...', 'success');
            setTimeout(() => window.location.replace('karex.html'), 500);
        } catch (error) {
            showMessage('Ocurrió un error inesperado. Intenta nuevamente.', 'error');
            loginBtn.disabled = false;
            setLoginButtonState(false);
        }
    });

    // Mostrar mensajes
    function showMessage(text, type) {
        if (!messageElement) return;

        if (messageElement.id === 'login-error') {
            messageElement.textContent = text;
            messageElement.classList.remove('hidden');
            messageElement.classList.remove('text-emerald-600', 'text-rose-600');
            messageElement.classList.add(type === 'error' ? 'text-rose-600' : 'text-emerald-600');
            return;
        }

        messageElement.textContent = text;
        messageElement.className = `message show ${type}`;
        
        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
            messageElement.classList.remove('show');
        }, 3000);
    }

    // Atajos de teclado
    usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            passwordInput.focus();
        }
    });

    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
});