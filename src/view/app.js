document.addEventListener('DOMContentLoaded', () => {
const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        checkAuthStatus();
    }

    async function checkAuthStatus() {
        try {
            const response = await fetch('/api/check-auth', {
                method: 'GET'
            });
            
            if (!response.ok) {
                alert("Please log in to use access this page.");
                window.location.href = '/view/login.html';
            }else{
                loadRecipes();
            }
        } catch (error) {
            console.error("Error during authentication:", error);
            alert("Error during authentication.");
            window.location.href = '/view/login.html';
        }
    }


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
                    alert("You are logged in!");
                    window.location.href = '/view/index.html'; 
                } else {
                    const result = await response.json();
                    alert("Error: " + (result.error || "Unknown server error!"));
                }
            } catch (error) {
                console.error("Server error:", error);
                alert("Error: please check your connection!");
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
                    alert("Registration successful!");
                    window.location.href = '/view/login.html';
                } else {
                    const responseText = await response.text();
                    try {
                        const errorData = JSON.parse(responseText);
                        alert(errorData.error || "Error during registration.");
                    } catch (parseError) {
                        console.error(responseText);
                        alert("Server error!");
                    }
                }
            } catch (error) {
                console.error("Network error:", error);
                alert("Please check your connection!");
            }
        });
    }
});

const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/api/logout', { method: 'POST' });
                if (response.ok) {
                    window.location.href = '/view/login.html';
                }
            } catch (error) {
                console.error("Error during logout:", error);
            }
        });
    }

const showRecipesListBtn = document.getElementById('showRecipesListBtn');
const showAddRecipeBtn = document.getElementById('showAddRecipeBtn');
const recipesListSection = document.getElementById('recipes-list-section');
const addRecipeSection = document.getElementById('add-recipe-section');

    if (showRecipesListBtn && showAddRecipeBtn) {
        showRecipesListBtn.addEventListener('click', () => {
            recipesListSection.classList.remove('hidden');
            addRecipeSection.classList.add('hidden');
            loadRecipes();
        });

        showAddRecipeBtn.addEventListener('click', () => {
            addRecipeSection.classList.remove('hidden');
            recipesListSection.classList.add('hidden');
        });
    }

const createRecipeForm = document.getElementById('create-recipe-form');
    if (createRecipeForm) {
        createRecipeForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(createRecipeForm);

            try {
                const response = await fetch('/api/recipes', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    alert("Recipe saved!");
                    createRecipeForm.reset();
                    showRecipesListBtn.click();
                    loadRecipes();
                } else {
                    const result = await response.json();
                    alert("Error: " + (result.error || "Unknown Error"));
                }
            } catch (error) {
                console.error("Error during saving:", error);
            }
        });
    }


const recipesContainer = document.getElementById('recipes-container');

    async function loadRecipes() {
        if (!recipesContainer) return;

        try {
            const response = await fetch('/api/recipes', { method: 'GET' });
            
            if (response.ok) {
                const recipes = await response.json();
                
                recipesContainer.innerHTML = '';

                if (recipes.length === 0) {
                    recipesContainer.innerHTML = '<p>No recipes in the database. Add one!</p>';
                    return;
                }

                recipes.forEach(recipe => {
                    const date = new Date(recipe.created_at).toLocaleString('hu-HU');
                    
                    const recipeCard = document.createElement('div');
                    recipeCard.className = 'recipe-card';
                    
                    const ingredientsHtml = recipe.ingredients.replace(/\n/g, '<br>');
                    const instructionsHtml = recipe.instructions.replace(/\n/g, '<br>');

                    recipeCard.innerHTML = `
                        <h3>${recipe.title}</h3>
                        <div class="date">Author: <strong>${recipe.username}</strong> | ${date}</div>
                        <p><strong>Ingredients:</strong><br>${ingredientsHtml}</p>
                        <p><strong>Recipe:</strong><br>${instructionsHtml}</p>
                    `;
                    
                    recipesContainer.appendChild(recipeCard);
                });
            } else {
                console.error("Couldn't load recipes.");
            }
        } catch (error) {
            console.error("Network error:", error);
        }
    }
