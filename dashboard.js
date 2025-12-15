// ==========================================
// FET - Food Expiry Tracker
// Dashboard JavaScript (COMPLETE & FIXED)
// ==========================================

// === GLOBAL VARIABLES ===
let foodItems = [];
let filteredFoodItems = [];
let currentFilter = 'all';
let deleteItemId = null;

// Bootstrap modal instances
let addFoodModal, editFoodModal, deleteModal, recipeModal;

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    checkDashboardAuth();
    
    // Initialize Bootstrap modals
    initModals();
    
    // Load food items from localStorage
    loadFoodItems();
    
    // Render initial view
    renderFoodGrid();
    updateStatCards();
    updateRecipeAlert();
    
    // Set minimum date for date inputs (today)
    setMinDate();
    
    // Initialize user info
    loadUserInfo();
    
    // Check for recipe suggestions
    if (typeof checkAndSuggestRecipes === 'function') {
        checkAndSuggestRecipes();
    }
});

// === AUTHENTICATION ===
function checkDashboardAuth() {
    const user = localStorage.getItem('fetUser');
    const isGuest = localStorage.getItem('fetGuestMode') === 'true';
    
    // Allow access if logged in OR in guest mode
    if (!user && !isGuest) {
        window.location.href = 'login.html';
    }
}

function loadUserInfo() {
    const user = JSON.parse(localStorage.getItem('fetUser') || '{}');
    
    if (user.name) {
        const userNameElements = document.querySelectorAll('#userName');
        userNameElements.forEach(el => el.textContent = user.name);
    }
    if (user.email) {
        const userEmailElements = document.querySelectorAll('#userEmail');
        userEmailElements.forEach(el => el.textContent = user.email);
    }
}

function handleLogout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('fetUser');
        window.location.href = 'login.html';
    }
}

// === MODAL MANAGEMENT ===
function initModals() {
    const addModalEl = document.getElementById('addFoodModal');
    const editModalEl = document.getElementById('editFoodModal');
    const deleteModalEl = document.getElementById('deleteModal');
    const recipeModalEl = document.getElementById('recipeModal');
    
    if (addModalEl) addFoodModal = new bootstrap.Modal(addModalEl);
    if (editModalEl) editFoodModal = new bootstrap.Modal(editModalEl);
    if (deleteModalEl) deleteModal = new bootstrap.Modal(deleteModalEl);
    if (recipeModalEl) recipeModal = new bootstrap.Modal(recipeModalEl);
}

function openAddFoodModal() {
    const form = document.getElementById('addFoodForm');
    if (form) form.reset();
    if (addFoodModal) addFoodModal.show();
}

function openEditFoodModal(id) {
    const food = foodItems.find(item => item.id === id);
    if (!food) return;
    
    document.getElementById('editFoodId').value = food.id;
    document.getElementById('editFoodName').value = food.name;
    document.getElementById('editFoodCategory').value = food.category;
    document.getElementById('editExpiryDate').value = food.expiryDate;
    
    if (editFoodModal) editFoodModal.show();
}

function openDeleteModal(id) {
    const food = foodItems.find(item => item.id === id);
    if (!food) return;
    
    deleteItemId = id;
    const nameEl = document.getElementById('deleteFoodName');
    if (nameEl) nameEl.textContent = food.name;
    if (deleteModal) deleteModal.show();
}

// === FOOD ITEMS MANAGEMENT ===
function loadFoodItems() {
    const stored = localStorage.getItem('fetFoodItems');
    if (stored) {
        foodItems = JSON.parse(stored);
    } else {
        foodItems = generateDemoData();
        saveFoodItems();
    }
    filteredFoodItems = [...foodItems];
}

function saveFoodItems() {
    localStorage.setItem('fetFoodItems', JSON.stringify(foodItems));
}

function generateDemoData() {
    return [
        {
            id: Date.now() + 1,
            name: 'Chicken Breast',
            category: 'Meat',
            expiryDate: getDateString(5),
            image: null,
            addedDate: new Date().toISOString()
        },
        {
            id: Date.now() + 2,
            name: 'Fresh Milk',
            category: 'Dairy',
            expiryDate: getDateString(3),
            image: null,
            addedDate: new Date().toISOString()
        },
        {
            id: Date.now() + 3,
            name: 'Carrots',
            category: 'Vegetables',
            expiryDate: getDateString(10),
            image: null,
            addedDate: new Date().toISOString()
        },
        {
            id: Date.now() + 4,
            name: 'Cheddar Cheese',
            category: 'Dairy',
            expiryDate: getDateString(15),
            image: null,
            addedDate: new Date().toISOString()
        },
        {
            id: Date.now() + 5,
            name: 'Tomatoes',
            category: 'Vegetables',
            expiryDate: getDateString(2),
            image: null,
            addedDate: new Date().toISOString()
        },
        {
            id: Date.now() + 6,
            name: 'Salmon Fillet',
            category: 'Seafood',
            expiryDate: getDateString(-1),
            image: null,
            addedDate: new Date().toISOString()
        },
        {
            id: Date.now() + 7,
            name: 'Apples',
            category: 'Fruits',
            expiryDate: getDateString(7),
            image: null,
            addedDate: new Date().toISOString()
        },
        {
            id: Date.now() + 8,
            name: 'Whole Wheat Bread',
            category: 'Grains',
            expiryDate: getDateString(4),
            image: null,
            addedDate: new Date().toISOString()
        }
    ];
}

// === CRUD OPERATIONS ===

// CREATE - Add New Food
function handleAddFood(event) {
    event.preventDefault();
    
    const name = document.getElementById('foodName').value;
    const category = document.getElementById('foodCategory').value;
    const expiryDate = document.getElementById('expiryDate').value;
    const imageFile = document.getElementById('foodImage').files[0];
    
    if (!name || !category || !expiryDate) {
        showToast('Error', 'Please fill all required fields!', 'danger');
        return;
    }
    
    const newFood = {
        id: Date.now(),
        name: name,
        category: category,
        expiryDate: expiryDate,
        image: null,
        addedDate: new Date().toISOString()
    };
    
    if (imageFile) {
        if (imageFile.size > 2 * 1024 * 1024) {
            showToast('Error', 'Image size must be less than 2MB!', 'danger');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            newFood.image = e.target.result;
            addFoodToList(newFood);
        };
        reader.readAsDataURL(imageFile);
    } else {
        addFoodToList(newFood);
    }
}

function addFoodToList(food) {
    foodItems.unshift(food);
    saveFoodItems();
    
    if (addFoodModal) addFoodModal.hide();
    
    applyCurrentFilter();
    updateStatCards();
    updateRecipeAlert();
    
    playSuccessSound();
    showToast('Success!', `${food.name} added successfully!`, 'success');
}

// UPDATE - Edit Food
function handleEditFood(event) {
    event.preventDefault();
    
    const id = parseInt(document.getElementById('editFoodId').value);
    const name = document.getElementById('editFoodName').value;
    const category = document.getElementById('editFoodCategory').value;
    const expiryDate = document.getElementById('editExpiryDate').value;
    
    const index = foodItems.findIndex(item => item.id === id);
    if (index === -1) return;
    
    foodItems[index].name = name;
    foodItems[index].category = category;
    foodItems[index].expiryDate = expiryDate;
    
    saveFoodItems();
    
    if (editFoodModal) editFoodModal.hide();
    
    applyCurrentFilter();
    updateStatCards();
    updateRecipeAlert();
    
    showToast('Updated!', `${name} updated successfully!`, 'info');
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

// DELETE - Remove Food
function confirmDelete() {
    if (!deleteItemId) return;
    
    const food = foodItems.find(item => item.id === deleteItemId);
    const foodName = food ? food.name : 'Item';
    
    foodItems = foodItems.filter(item => item.id !== deleteItemId);
    saveFoodItems();
    
    if (deleteModal) deleteModal.hide();
    
    deleteItemId = null;
    
    applyCurrentFilter();
    updateStatCards();
    updateRecipeAlert();
    
    playAlertSound();
    showToast('Deleted!', `${foodName} has been deleted.`, 'danger');
}

// === FILTERING & SEARCHING ===
function filterByStatus(status) {
    currentFilter = status;
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.filter-btn').classList.add('active');
    
    applyCurrentFilter();
}

function applyCurrentFilter() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    
    filteredFoodItems = foodItems.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm) ||
                             item.category.toLowerCase().includes(searchTerm);
        
        if (!matchesSearch) return false;
        
        if (currentFilter === 'all') return true;
        
        const daysLeft = calculateDaysRemaining(item.expiryDate);
        
        if (currentFilter === 'fresh') {
            return daysLeft > 7;
        } else if (currentFilter === 'expiring') {
            return daysLeft > 0 && daysLeft <= 7;
        } else if (currentFilter === 'expired') {
            return daysLeft <= 0;
        }
        
        return true;
    });
    
    renderFoodGrid();
}

function filterFoods() {
    applyCurrentFilter();
}

// === RENDERING ===
function renderFoodGrid() {
    const grid = document.getElementById('foodGrid');
    const emptyState = document.getElementById('emptyState');
    
    if (!grid) return;
    
    if (filteredFoodItems.length === 0) {
        grid.innerHTML = '';
        if (emptyState) emptyState.classList.remove('d-none');
        return;
    }
    
    if (emptyState) emptyState.classList.add('d-none');
    grid.innerHTML = '';
    
    filteredFoodItems.forEach(food => {
        const card = createFoodCard(food);
        grid.appendChild(card);
    });
}

function createFoodCard(food) {
    const card = document.createElement('div');
    card.className = 'food-card';
    
    const daysLeft = calculateDaysRemaining(food.expiryDate);
    const status = getStatus(daysLeft);
    const statusText = getStatusText(daysLeft);
    const icon = getCategoryIcon(food.category);
    
    card.innerHTML = `
        <div class="food-image">
            ${food.image ? 
                `<img src="${food.image}" alt="${food.name}" style="width: 100%; height: 100%; object-fit: cover;">` : 
                `<i class="${icon}"></i>`
            }
            <span class="food-status-badge status-${status}">${statusText}</span>
        </div>
        <div class="food-info">
            <div class="food-category">${food.category}</div>
            <h3 class="food-name">${food.name}</h3>
            <div class="food-expiry">
                <i class="fas fa-calendar-alt"></i>
                <span>Expires: ${formatDate(food.expiryDate)}</span>
            </div>
            <div class="days-remaining ${status}">
                ${daysLeft > 0 ? `${daysLeft} days left` : daysLeft === 0 ? 'Expires today!' : 'Expired'}
            </div>
            <div class="food-actions">
                <button class="btn-action btn-edit" onclick="openEditFoodModal(${food.id})">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-action btn-delete" onclick="openDeleteModal(${food.id})">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// === STATISTICS ===
function updateStatCards() {
    const stats = calculateStats();
    
    const freshCountEl = document.getElementById('freshCount');
    const expiringCountEl = document.getElementById('expiringCount');
    const expiredCountEl = document.getElementById('expiredCount');
    const totalCountEl = document.getElementById('totalCount');
    
    if (freshCountEl) freshCountEl.textContent = stats.fresh;
    if (expiringCountEl) expiringCountEl.textContent = stats.expiring;
    if (expiredCountEl) expiredCountEl.textContent = stats.expired;
    if (totalCountEl) totalCountEl.textContent = stats.total;
    
    const notificationBadge = document.getElementById('notificationBadge');
    if (notificationBadge) {
        const alertCount = stats.expiring + stats.expired;
        if (alertCount > 0) {
            notificationBadge.textContent = alertCount;
            notificationBadge.style.display = 'block';
        } else {
            notificationBadge.style.display = 'none';
        }
    }
}

function calculateStats() {
    let fresh = 0, expiring = 0, expired = 0;
    
    foodItems.forEach(item => {
        const daysLeft = calculateDaysRemaining(item.expiryDate);
        if (daysLeft > 7) {
            fresh++;
        } else if (daysLeft > 0 && daysLeft <= 7) {
            expiring++;
        } else {
            expired++;
        }
    });
    
    return {
        fresh,
        expiring,
        expired,
        total: foodItems.length
    };
}

function updateRecipeAlert() {
    const stats = calculateStats();
    const alert = document.getElementById('recipeSuggestionAlert');
    const countEl = document.getElementById('expiringItemsCount');
    
    if (alert) {
        if (stats.expiring > 0) {
            alert.classList.remove('d-none');
            if (countEl) countEl.textContent = stats.expiring;
        } else {
            alert.classList.add('d-none');
        }
    }
}

// === HELPER FUNCTIONS ===
function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    const expiryDateInput = document.getElementById('expiryDate');
    const editExpiryDateInput = document.getElementById('editExpiryDate');
    
    if (expiryDateInput) expiryDateInput.setAttribute('min', today);
    if (editExpiryDateInput) editExpiryDateInput.setAttribute('min', today);
}

// === SIDEBAR TOGGLE (Mobile) ===
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('show');
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function(event) {
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = event.target.closest('.sidebar-toggle');
    
    if (sidebar && window.innerWidth <= 991) {
        if (!sidebar.contains(event.target) && !toggleBtn) {
            sidebar.classList.remove('show');
        }
    }
});

// === KEYBOARD SHORTCUTS ===
document.addEventListener('keydown', function(event) {
    // Ctrl/Cmd + K to focus search
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.focus();
    }
    
    // Ctrl/Cmd + N to add new food
    if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        openAddFoodModal();
    }
    
    // ESC to close modals
    if (event.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal.show');
        openModals.forEach(modal => {
            const modalInstance = bootstrap.Modal.getInstance(modal);
            if (modalInstance) modalInstance.hide();
        });
    }
});

// === AUTO REFRESH ===
setInterval(() => {
    updateStatCards();
    if (currentFilter !== 'all') {
        applyCurrentFilter();
    }
}, 60000); // 60 seconds

// === RECIPE MODAL (Enhanced) ===
// Tambahkan di dashboard.js
function openRecipeModal() {
    // Get items expiring in 7 days
    const expiringItems = foodItems.filter(item => {
        const daysLeft = calculateDaysRemaining(item.expiryDate);
        return daysLeft > 0 && daysLeft <= 7;
    });
    
    if (expiringItems.length === 0) {
        showToast('No Expiring Items', 'You don\'t have any items expiring soon!', 'info');
        return;
    }
    
    // Show ingredient chips
    const chipContainer = document.getElementById('ingredientChips');
    chipContainer.innerHTML = '';
    
    expiringItems.forEach(item => {
        const daysLeft = calculateDaysRemaining(item.expiryDate);
        const chip = document.createElement('span');
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
            <i class="${getCategoryIcon(item.category)}"></i>
            ${item.name} <span style="font-size: 11px;">(${daysLeft}d)</span>
        `;
        chipContainer.appendChild(chip);
    });
    
    // Show loading
    document.getElementById('recipeLoading').classList.remove('d-none');
    document.getElementById('recipeResults').innerHTML = '';
    
    // Open modal
    if (recipeModal) recipeModal.show();
    
    // Generate recipes after 1.5s
    setTimeout(() => {
        const recipes = generateSmartRecipes(expiringItems);
        document.getElementById('recipeLoading').classList.add('d-none');
        
        const resultsContainer = document.getElementById('recipeResults');
        resultsContainer.innerHTML = '';
        
        if (recipes.length === 0) {
            resultsContainer.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <i class="fas fa-search" style="font-size: 48px; color: #cbd5e1;"></i>
                    <h5>No Recipes Found</h5>
                    <p>Try adding more ingredients!</p>
                </div>
            `;
            return;
        }
        
        recipes.forEach(recipe => {
            resultsContainer.appendChild(createRecipeCard(recipe));
        });
    }, 1500);
}

// === EXPORT FOR TESTING ===
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleAddFood,
        handleEditFood,
        confirmDelete,
        filterByStatus,
        calculateDaysRemaining,
        getStatus,
        formatDate
    };
}

// === CONSOLE EASTER EGG ===
console.log('%c🎯 FET Dashboard Loaded', 'color: #10b981; font-size: 16px; font-weight: bold;');
console.log('%c📊 Food tracking system ready!', 'color: #64748b; font-size: 12px;');
console.log('%c💡 Shortcuts: Ctrl+K (search), Ctrl+N (add food), ESC (close)', 'color: #fbbf24; font-size: 11px;');