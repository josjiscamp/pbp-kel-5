// ==========================================
// FET - Food Expiry Tracker
// Smart Recipe Finder System (FIXED & COMPLETE)
// ==========================================

// === RECIPE API CONFIGURATION ===
const RECIPE_CONFIG = {
    // Spoonacular API (Free tier: 150 requests/day)
    SPOONACULAR_KEY: 'YOUR_API_KEY_HERE',
    SPOONACULAR_URL: 'https://api.spoonacular.com/recipes',
    USE_MOCK: true,
    MAX_RECIPES: 6,
    MIN_INGREDIENTS: 2,
    MAX_MISSING_INGREDIENTS: 2
};


// === SMART RECIPE GENERATION (MOCK) ===
function generateSmartRecipes(ingredients) {
    // Extract ingredient names
    const ingredientNames = ingredients.map(i => i.name.toLowerCase());
    const categories = [...new Set(ingredients.map(i => i.category))];
    
    // Comprehensive recipe database
    const recipeDatabase = [
        {
            id: 1,
            title: 'Quick Chicken Stir Fry',
            ingredients: ['chicken', 'vegetables', 'carrot', 'broccoli', 'bell pepper', 'onion'],
            categories: ['Meat', 'Vegetables'],
            description: 'A delicious and healthy stir fry packed with protein and fresh vegetables. Perfect for using up vegetables before they expire!',
            time: '20 mins',
            difficulty: 'Easy',
            servings: 4,
            image: '🍗',
            instructions: [
                'Cut chicken into bite-sized pieces and season with salt and pepper',
                'Heat 2 tablespoons of oil in a wok or large pan over high heat',
                'Stir fry chicken until golden brown (5-6 minutes), then set aside',
                'Add vegetables and stir fry for 4-5 minutes until tender-crisp',
                'Return chicken to pan, add soy sauce and stir to combine',
                'Serve hot over rice or noodles'
            ],
            nutrition: { calories: '320', protein: '28g', carbs: '15g', fat: '12g' }
        },
        {
            id: 2,
            title: 'Fresh Garden Salad',
            ingredients: ['lettuce', 'tomato', 'cucumber', 'carrot', 'vegetables', 'cheese'],
            categories: ['Vegetables', 'Fruits'],
            description: 'Crisp and refreshing salad with a variety of fresh vegetables. A perfect way to use multiple vegetables at once!',
            time: '10 mins',
            difficulty: 'Easy',
            servings: 2,
            image: '🥗',
            instructions: [
                'Wash and thoroughly dry all vegetables',
                'Chop lettuce into bite-sized pieces',
                'Dice tomatoes, cucumber, and carrots',
                'Mix all vegetables in a large bowl',
                'Add your favorite dressing and toss well',
                'Top with cheese if desired and serve immediately'
            ],
            nutrition: { calories: '120', protein: '4g', carbs: '18g', fat: '4g' }
        },
        {
            id: 3,
            title: 'Creamy Pasta Carbonara',
            ingredients: ['pasta', 'cheese', 'milk', 'egg', 'bacon', 'cream'],
            categories: ['Dairy', 'Grains'],
            description: 'Rich and creamy Italian pasta dish with cheese and eggs. A comfort food classic!',
            time: '25 mins',
            difficulty: 'Medium',
            servings: 3,
            image: '🍝',
            instructions: [
                'Cook pasta according to package directions in salted water',
                'While pasta cooks, beat eggs and mix with grated cheese',
                'Cook bacon until crispy, then chop into pieces',
                'Drain pasta, reserving 1 cup pasta water',
                'Toss hot pasta with egg mixture, adding pasta water to create sauce',
                'Add bacon, season with black pepper, and serve immediately'
            ],
            nutrition: { calories: '450', protein: '18g', carbs: '52g', fat: '18g' }
        },
        {
            id: 4,
            title: 'Hearty Vegetable Soup',
            ingredients: ['vegetables', 'carrot', 'potato', 'tomato', 'broth', 'celery', 'onion'],
            categories: ['Vegetables'],
            description: 'Warm and comforting soup perfect for using up vegetables. Great for meal prep!',
            time: '35 mins',
            difficulty: 'Easy',
            servings: 6,
            image: '🍲',
            instructions: [
                'Chop all vegetables into uniform chunks',
                'Sauté onions and garlic in a large pot with olive oil',
                'Add harder vegetables (carrots, potatoes) and cook 5 minutes',
                'Pour in broth and bring to boil',
                'Add remaining vegetables and simmer 20-25 minutes',
                'Season with salt, pepper, and herbs to taste'
            ],
            nutrition: { calories: '180', protein: '6g', carbs: '32g', fat: '3g' }
        },
        {
            id: 5,
            title: 'Grilled Salmon with Lemon',
            ingredients: ['salmon', 'fish', 'seafood', 'lemon', 'herbs', 'butter'],
            categories: ['Seafood'],
            description: 'Perfectly grilled salmon fillet with fresh lemon juice and herbs. Healthy and delicious!',
            time: '15 mins',
            difficulty: 'Medium',
            servings: 2,
            image: '🐟',
            instructions: [
                'Pat salmon dry and season generously with salt and pepper',
                'Heat grill or pan to medium-high heat',
                'Place salmon skin-side down and cook 4-5 minutes',
                'Flip and cook another 3-4 minutes until just cooked through',
                'Squeeze fresh lemon juice on top',
                'Garnish with herbs and serve with vegetables'
            ],
            nutrition: { calories: '380', protein: '34g', carbs: '2g', fat: '24g' }
        },
        {
            id: 6,
            title: 'Classic Cheese Omelette',
            ingredients: ['egg', 'cheese', 'milk', 'butter', 'herbs'],
            categories: ['Dairy'],
            description: 'Fluffy omelette filled with melted cheese. Perfect for breakfast or quick dinner!',
            time: '10 mins',
            difficulty: 'Easy',
            servings: 1,
            image: '🍳',
            instructions: [
                'Beat 3 eggs with a splash of milk and pinch of salt',
                'Heat butter in non-stick pan over medium heat',
                'Pour eggs and let set slightly without stirring',
                'Add grated cheese to one half of omelette',
                'Fold omelette in half and cook 1 more minute',
                'Slide onto plate and serve hot'
            ],
            nutrition: { calories: '280', protein: '20g', carbs: '4g', fat: '21g' }
        },
        {
            id: 7,
            title: 'Apple Cinnamon Muffins',
            ingredients: ['apple', 'fruit', 'flour', 'egg', 'milk', 'sugar', 'cinnamon'],
            categories: ['Fruits', 'Grains', 'Dairy'],
            description: 'Moist and delicious muffins with fresh apple chunks and warm cinnamon.',
            time: '40 mins',
            difficulty: 'Medium',
            servings: 12,
            image: '🧁',
            instructions: [
                'Preheat oven to 350°F (175°C) and line muffin tin',
                'Dice apples into small cubes (about 1/4 inch)',
                'Mix dry ingredients: flour, sugar, baking powder, cinnamon',
                'In separate bowl, beat eggs, milk, and melted butter',
                'Fold wet ingredients into dry, then gently fold in apples',
                'Fill muffin cups 3/4 full and bake 22-25 minutes'
            ],
            nutrition: { calories: '220', protein: '4g', carbs: '38g', fat: '6g' }
        },
        {
            id: 8,
            title: 'Classic Chicken Soup',
            ingredients: ['chicken', 'carrot', 'vegetables', 'broth', 'celery', 'noodles'],
            categories: ['Meat', 'Vegetables'],
            description: 'Comforting homemade chicken soup. Perfect for cold days!',
            time: '45 mins',
            difficulty: 'Medium',
            servings: 6,
            image: '🍜',
            instructions: [
                'Boil chicken breast in 8 cups water until cooked (15-20 mins)',
                'Remove chicken, let cool, then shred into pieces',
                'Add chopped vegetables to the broth',
                'Simmer until vegetables are tender (15-20 mins)',
                'Add shredded chicken and noodles back to pot',
                'Season with salt, pepper, and herbs, then serve hot'
            ],
            nutrition: { calories: '240', protein: '22g', carbs: '18g', fat: '8g' }
        },
        {
            id: 9,
            title: 'Vegetable Frittata',
            ingredients: ['egg', 'vegetables', 'cheese', 'tomato', 'spinach', 'onion'],
            categories: ['Dairy', 'Vegetables'],
            description: 'Italian-style baked egg dish with vegetables. Perfect for brunch!',
            time: '30 mins',
            difficulty: 'Medium',
            servings: 4,
            image: '🥚',
            instructions: [
                'Sauté vegetables in oven-safe pan until softened',
                'Beat 8 eggs with milk, salt, pepper, and cheese',
                'Pour egg mixture over vegetables in pan',
                'Cook on stovetop for 5 minutes without stirring',
                'Transfer pan to oven and bake at 375°F for 15-20 minutes',
                'Let cool 5 minutes, slice into wedges, and serve'
            ],
            nutrition: { calories: '260', protein: '18g', carbs: '8g', fat: '18g' }
        },
        {
            id: 10,
            title: 'Veggie Fried Rice',
            ingredients: ['rice', 'vegetables', 'egg', 'carrot', 'peas', 'soy sauce'],
            categories: ['Grains', 'Vegetables'],
            description: 'Quick fried rice loaded with vegetables. Perfect for using leftover rice!',
            time: '15 mins',
            difficulty: 'Easy',
            servings: 3,
            image: '🍚',
            instructions: [
                'Use day-old cooked rice (freshly cooked rice is too moist)',
                'Heat oil in wok or large pan over high heat',
                'Scramble eggs, then set aside',
                'Stir-fry vegetables until tender-crisp (3-4 minutes)',
                'Add rice and break up any clumps',
                'Add soy sauce and scrambled eggs, toss well, and serve hot'
            ],
            nutrition: { calories: '290', protein: '12g', carbs: '48g', fat: '6g' }
        }
    ];
    
    // Match recipes
    const matchedRecipes = recipeDatabase.map(recipe => {
        let score = 0;
        let matchedIngredients = [];
        
        // Check ingredient matches
        ingredientNames.forEach(ingredient => {
            const matches = recipe.ingredients.filter(ri => 
                ri.includes(ingredient) || 
                ingredient.includes(ri) ||
                (ri + 's').includes(ingredient) ||
                ingredient.includes(ri + 's')
            );
            
            if (matches.length > 0) {
                score += 10 * matches.length;
                matchedIngredients.push(ingredient);
            }
        });
        
        // Check category matches
        categories.forEach(category => {
            if (recipe.categories.includes(category)) {
                score += 5;
            }
        });
        
        // Bonus for recipes that use more items
        if (matchedIngredients.length >= 3) {
            score += 15;
        }
        
        return {
            ...recipe,
            score,
            matchedIngredients: [...new Set(matchedIngredients)],
            matchCount: matchedIngredients.length
        };
    })
    .filter(recipe => recipe.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, RECIPE_CONFIG.MAX_RECIPES);
    
    return matchedRecipes;
}
function changeTheme(theme, element) {
    // Update active state
    document.querySelectorAll('.theme-option').forEach(option => {
        option.classList.remove('active');
    });
    element.classList.add('active');
    
    // Save theme
    localStorage.setItem('fetTheme', theme);
    
    // Apply theme
    applyTheme(theme);
    
    showToast('Theme Changed!', `Switched to ${theme} theme!`, 'success');
}

function applyTheme(theme) {
    const body = document.body;
    const root = document.documentElement;
    
    // Remove all theme classes
    body.classList.remove('theme-light', 'theme-dark');
    
    if (theme === 'dark') {
        body.classList.add('theme-dark');
        
        // Dark theme CSS variables
        root.style.setProperty('--light-bg', '#0f172a');
        root.style.setProperty('--text-dark', '#f8fafc');
        root.style.setProperty('--text-light', '#cbd5e1');
        root.style.setProperty('--white', '#1e293b');
        root.style.setProperty('--border-color', '#334155');
        
        // Update cards
        document.querySelectorAll('.stat-card, .food-card, .filter-section, .modal-content').forEach(el => {
            el.style.background = '#1e293b';
            el.style.color = '#f8fafc';
        });
        
    } else if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
        
    } else {
        // Light theme (default)
        body.classList.add('theme-light');
        
        root.style.setProperty('--light-bg', '#f8fafc');
        root.style.setProperty('--text-dark', '#1e293b');
        root.style.setProperty('--text-light', '#64748b');
        root.style.setProperty('--white', '#ffffff');
        root.style.setProperty('--border-color', '#e2e8f0');
        
        // Reset cards
        document.querySelectorAll('.stat-card, .food-card, .filter-section, .modal-content').forEach(el => {
            el.style.background = '#ffffff';
            el.style.color = '#1e293b';
        });
    }
}

// Apply saved theme on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('fetTheme') || 'light';
    applyTheme(savedTheme);
    
    // Update active button
    document.querySelectorAll('.theme-option').forEach(option => {
        if (option.getAttribute('onclick').includes(`'${savedTheme}'`)) {
            option.classList.add('active');
        }
    });
});

// === DISPLAY RECIPES ===
function displayRecipes(recipes) {
    hideRecipeLoading();
    
    const resultsContainer = document.getElementById('recipeResults');
    if (!resultsContainer) return;
    
    resultsContainer.innerHTML = '';
    
    if (recipes.length === 0) {
        resultsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #64748b;">
                <i class="fas fa-search" style="font-size: 48px; margin-bottom: 15px; opacity: 0.5;"></i>
                <h5>No Recipes Found</h5>
                <p>Try different ingredients or add more items to your inventory.</p>
            </div>
        `;
        return;
    }
    
    recipes.forEach(recipe => {
        const card = createRecipeCard(recipe);
        resultsContainer.appendChild(card);
    });
}

function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.style.cssText = `
        background: white;
        border: 2px solid #e2e8f0;
        border-radius: 15px;
        padding: 20px;
        transition: all 0.3s ease;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    `;
    
    const matchBadge = recipe.matchCount ? `
        <span style="
            position: absolute;
            top: 15px;
            right: 15px;
            background: #10b981;
            color: white;
            padding: 5px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            z-index: 1;
        ">
            <i class="fas fa-check"></i> ${recipe.matchCount} match${recipe.matchCount !== 1 ? 'es' : ''}
        </span>
    ` : '';
    
    card.innerHTML = `
        ${matchBadge}
        <div style="display: flex; gap: 20px; align-items: start;">
            <div style="font-size: 64px; flex-shrink: 0;">
                ${recipe.image}
            </div>
            <div style="flex: 1;">
                <h5 style="margin: 0 0 10px 0; color: #1e293b; font-size: 18px; font-weight: 700;">
                    ${recipe.title}
                </h5>
                <p style="color: #64748b; margin: 0 0 15px 0; font-size: 14px; line-height: 1.6;">
                    ${recipe.description}
                </p>
                
                ${recipe.matchedIngredients && recipe.matchedIngredients.length > 0 ? `
                    <div style="margin-bottom: 15px;">
                        <div style="font-size: 12px; color: #10b981; font-weight: 600; margin-bottom: 5px;">
                            <i class="fas fa-check-circle"></i> Uses your ingredients:
                        </div>
                        <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                            ${recipe.matchedIngredients.map(ing => `
                                <span style="
                                    background: #d1fae5;
                                    color: #065f46;
                                    padding: 4px 10px;
                                    border-radius: 12px;
                                    font-size: 11px;
                                    font-weight: 500;
                                ">${ing}</span>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}
                
                <div style="display: flex; gap: 20px; font-size: 13px; color: #64748b; margin-bottom: 15px;">
                    <span><i class="fas fa-clock" style="color: #10b981;"></i> ${recipe.time}</span>
                    <span><i class="fas fa-signal" style="color: #fbbf24;"></i> ${recipe.difficulty}</span>
                    <span><i class="fas fa-users" style="color: #3b82f6;"></i> ${recipe.servings} servings</span>
                </div>
                
                ${recipe.nutrition ? `
                    <div style="
                        background: #f8fafc;
                        padding: 12px;
                        border-radius: 10px;
                        display: grid;
                        grid-template-columns: repeat(4, 1fr);
                        gap: 10px;
                        margin-bottom: 15px;
                    ">
                        <div style="text-align: center;">
                            <div style="font-size: 16px; font-weight: 700; color: #1e293b;">${recipe.nutrition.calories}</div>
                            <div style="font-size: 11px; color: #64748b;">Calories</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 16px; font-weight: 700; color: #1e293b;">${recipe.nutrition.protein}</div>
                            <div style="font-size: 11px; color: #64748b;">Protein</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 16px; font-weight: 700; color: #1e293b;">${recipe.nutrition.carbs}</div>
                            <div style="font-size: 11px; color: #64748b;">Carbs</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 16px; font-weight: 700; color: #1e293b;">${recipe.nutrition.fat}</div>
                            <div style="font-size: 11px; color: #64748b;">Fat</div>
                        </div>
                    </div>
                ` : ''}
                
                <button 
                    class="btn-view-recipe"
                    data-recipe-id="${recipe.id}"
                    style="
                        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 10px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        width: 100%;
                    "
                >
                    <i class="fas fa-book-open"></i> View Full Recipe
                </button>
            </div>
        </div>
    `;
    
    // Add click event for view button
    const viewBtn = card.querySelector('.btn-view-recipe');
    viewBtn.addEventListener('click', function() {
        viewRecipeDetails(recipe);
    });
    
    // Hover effect
    card.addEventListener('mouseenter', function() {
        this.style.borderColor = '#10b981';
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.1)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.borderColor = '#e2e8f0';
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
    
    return card;
}

// === VIEW RECIPE DETAILS ===
function viewRecipeDetails(recipe) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.setAttribute('tabindex', '-1');
    
    modal.innerHTML = `
        <div class="modal-dialog modal-lg modal-dialog-scrollable modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-utensils"></i> ${recipe.title}
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="font-size: 100px;">${recipe.image}</div>
                    </div>
                    
                    <div style="display: flex; justify-content: center; gap: 30px; margin-bottom: 25px; flex-wrap: wrap;">
                        <div style="text-align: center;">
                            <i class="fas fa-clock" style="font-size: 24px; color: #10b981; margin-bottom: 5px; display: block;"></i>
                            <div style="font-weight: 700; color: #1e293b;">${recipe.time}</div>
                            <div style="font-size: 12px; color: #64748b;">Prep Time</div>
                        </div>
                        <div style="text-align: center;">
                            <i class="fas fa-signal" style="font-size: 24px; color: #fbbf24; margin-bottom: 5px; display: block;"></i>
                            <div style="font-weight: 700; color: #1e293b;">${recipe.difficulty}</div>
                            <div style="font-size: 12px; color: #64748b;">Difficulty</div>
                        </div>
                        <div style="text-align: center;">
                            <i class="fas fa-users" style="font-size: 24px; color: #3b82f6; margin-bottom: 5px; display: block;"></i>
                            <div style="font-weight: 700; color: #1e293b;">${recipe.servings}</div>
                            <div style="font-size: 12px; color: #64748b;">Servings</div>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <h6 style="color: #1e293b; font-weight: 700; margin-bottom: 10px;">
                            <i class="fas fa-info-circle" style="color: #10b981;"></i> Description
                        </h6>
                        <p style="color: #64748b; line-height: 1.8;">${recipe.description}</p>
                    </div>
                    
                    ${recipe.instructions && recipe.instructions.length > 0 ? `
                        <div style="margin-bottom: 20px;">
                            <h6 style="color: #1e293b; font-weight: 700; margin-bottom: 15px;">
                                <i class="fas fa-list-ol" style="color: #10b981;"></i> Instructions
                            </h6>
                            <ol style="color: #64748b; line-height: 2; padding-left: 20px;">
                                ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
                            </ol>
                        </div>
                    ` : ''}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    modal.addEventListener('hidden.bs.modal', function() {
        modal.remove();
    });
}

// === ENHANCED MODAL DISPLAY ===
function displayIngredientChips(items) {
    const chipContainer = document.getElementById('ingredientChips');
    if (!chipContainer) return;
    
    chipContainer.innerHTML = '';
    
    items.forEach(item => {
        const daysLeft = calculateDaysRemaining(item.expiryDate);
        const chip = document.createElement('span');
        chip.className = 'ingredient-chip';
        chip.style.cssText = `
            background: ${daysLeft <= 3 ? '#fee2e2' : '#fef3c7'};
            color: ${daysLeft <= 3 ? '#991b1b' : '#92400e'};
            border: 2px solid ${daysLeft <= 3 ? '#fca5a5' : '#fcd34d'};
            padding: 8px 15px;
            border-radius: 20px;
            display: inline-block;
            margin: 5px;
            font-size: 14px;
            font-weight: 500;
        `;
        chip.innerHTML = `
            <i class="${getCategoryIcon(item.category)}" style="margin-right: 5px;"></i>
            ${item.name}
            <span style="font-size: 11px; opacity: 0.7;"> (${daysLeft}d)</span>
        `;
        chipContainer.appendChild(chip);
    });
    
    const infoText = document.createElement('p');
    infoText.style.cssText = 'margin-top: 10px; font-size: 13px; color: #64748b;';
    infoText.innerHTML = `<i class="fas fa-lightbulb" style="color: #fbbf24;"></i> We'll find recipes using these ingredients!`;
    chipContainer.appendChild(infoText);
}

function showRecipeLoading() {
    const loading = document.getElementById('recipeLoading');
    const results = document.getElementById('recipeResults');
    if (loading) loading.classList.remove('d-none');
    if (results) results.innerHTML = '';
}

function hideRecipeLoading() {
    const loading = document.getElementById('recipeLoading');
    if (loading) loading.classList.add('d-none');
}

// === ENHANCED OPEN RECIPE MODAL ===
function openRecipeModal() {
    if (typeof foodItems === 'undefined') {
        console.error('foodItems not defined');
        return;
    }
    
    const expiringItems = foodItems.filter(item => {
        const daysLeft = calculateDaysRemaining(item.expiryDate);
        return daysLeft > 0 && daysLeft <= 7;
    });
    
    if (expiringItems.length === 0) {
        if (typeof showToast === 'function') {
            showToast('No Expiring Items', 'You don\'t have any items expiring soon!', 'info');
        } else {
            alert('You don\'t have any items expiring soon!');
        }
        return;
    }
    
    displayIngredientChips(expiringItems);
    showRecipeLoading();
    
    if (typeof recipeModal !== 'undefined') {
        recipeModal.show();
    }
    
    setTimeout(() => {
        const recipes = generateSmartRecipes(expiringItems);
        displayRecipes(recipes);
    }, 1500);
}

// === CONSOLE INFO ===
console.log('%c🍳 Recipe Finder Module Loaded', 'color: #10b981; font-size: 16px; font-weight: bold;');
console.log('%c✅ Smart recipe matching system ready!', 'color: #64748b; font-size: 12px;');