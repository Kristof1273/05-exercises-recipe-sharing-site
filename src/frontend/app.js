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