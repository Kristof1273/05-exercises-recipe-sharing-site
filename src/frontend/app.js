const usernameInput = document.querySelector('#username');
const firstName = document.querySelector('#first_name');
const lastName = document.querySelector('#last_name');
const email = document.querySelector('#email');
//Password?
const registerBtn = document.querySelector('#registerBtn')
const loginBtn = document.querySelector('#loginBtn')

// Bejelentkezés API hívás
async function loginUser(username, password) {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        
        if (response.ok) {
            console.log("Sikeres belépés!", result);
        } else {
            console.error("Hiba:", result.error);
        }
    } catch (error) {
        console.error("Hálózati hiba:", error);
    }
}