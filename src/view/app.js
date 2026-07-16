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
                
                if (response.ok) {
                    alert("Sikeres belépés!");
                    window.location.href = '/view/index.html'; 
                } else {
                    const result = await response.json();
                    alert("Hiba történt: " + (result.error || "Ismeretlen hiba a szerveren!"));
                }
            } catch (error) {
                console.error("Hálózati hiba:", error);
                alert("Hálózati hiba történt. Kérlek, ellenőrizd az internetkapcsolatod!");
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
                    window.location.href = '/view/login.html';
                } else {
                    const responseText = await response.text();
                    try {
                        const errorData = JSON.parse(responseText);
                        alert(errorData.error || "Hiba történt a regisztráció során.");
                    } catch (parseError) {
                        console.error(responseText);
                        alert("A szerver hibát dobott. Kérlek, nézd meg a Konzol (F12) üzeneteit!");
                    }
                }
            } catch (error) {
                console.error("Hálózati hiba:", error);
                alert("Hálózati hiba történt. Kérlek, ellenőrizd az internetkapcsolatod!");
            }
        });
    }
});