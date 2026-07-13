document.addEventListener('DOMContentLoaded', () => {

    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(loginForm);

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                
                if (response.ok) {
                    alert("Sikeres regisztráció! Most már beléphetsz.");
                    window.location.href = '/frontend/login.html';
                } else {
                    const result = await response.json();
                    alert("Hiba történt: " + (result.error || "Ismeretlen hiba a szerveren!"));
                }
            } catch (error) {
                console.error("Hálózati hiba:", error);
            }
        });
    }

    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    body: formData
                });
                
                if (response.ok) {
                    alert("Sikeres regisztráció! Most már beléphetsz.");
                    window.location.href = '/frontend/login.html';
                }
            } catch (error) {
                console.error("Hálózati hiba:", error);
            }
        });
    }
});