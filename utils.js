// ==========================================
// FET - Food Expiry Tracker
// Utility Functions (Shared Helpers)
// ==========================================

// === DATE & TIME UTILITIES ===
function calculateDaysRemaining(expiryDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function getDateString(daysFromNow) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
}

function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60
    };
    
    for (let [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval !== 1 ? 's' : ''} ago`;
        }
    }
    
    return 'Just now';
}

// === STATUS UTILITIES ===
function getStatus(daysLeft) {
    if (daysLeft > 7) return 'fresh';
    if (daysLeft > 0) return 'expiring';
    return 'expired';
}

function getStatusText(daysLeft) {
    if (daysLeft > 7) return 'Fresh';
    if (daysLeft > 0) return 'Expiring Soon';
    return 'Expired';
}

// === CATEGORY UTILITIES ===
function getCategoryIcon(category) {
    const icons = {
        'Vegetables': 'fas fa-carrot',
        'Fruits': 'fas fa-apple-alt',
        'Dairy': 'fas fa-cheese',
        'Meat': 'fas fa-drumstick-bite',
        'Seafood': 'fas fa-fish',
        'Grains': 'fas fa-bread-slice',
        'Beverages': 'fas fa-coffee',
        'Others': 'fas fa-box'
    };
    return icons[category] || 'fas fa-utensils';
}

// === VALIDATION UTILITIES ===
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// === TOAST NOTIFICATION UTILITY ===
function showToast(title, message, type = 'success') {
    // Create toast container if not exists
    let toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toastContainer';
        toastContainer.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            z-index: 9999;
            max-width: 400px;
        `;
        document.body.appendChild(toastContainer);
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.style.cssText = `
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        margin-bottom: 15px;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
        border-left: 4px solid ${type === 'success' ? '#10b981' : type === 'danger' ? '#ef4444' : type === 'info' ? '#3b82f6' : '#fbbf24'};
    `;
    
    const iconMap = {
        success: 'check-circle',
        danger: 'times-circle',
        info: 'info-circle',
        warning: 'exclamation-triangle'
    };
    
    const colorMap = {
        success: '#10b981',
        danger: '#ef4444',
        info: '#3b82f6',
        warning: '#fbbf24'
    };
    
    toast.innerHTML = `
        <div style="display: flex; align-items: start; gap: 12px;">
            <i class="fas fa-${iconMap[type] || 'info-circle'}" 
               style="font-size: 24px; color: ${colorMap[type] || '#10b981'};"></i>
            <div style="flex: 1;">
                <h5 style="margin: 0 0 5px 0; font-size: 16px; font-weight: 600; color: #1e293b;">${title}</h5>
                <p style="margin: 0; font-size: 14px; color: #64748b;">${message}</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; color: #64748b; cursor: pointer; font-size: 18px; padding: 0;">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// === STORAGE UTILITIES ===
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

function getFromLocalStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('Error removing from localStorage:', error);
        return false;
    }
}

// === STRING UTILITIES ===
function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function truncateText(text, maxLength = 100) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// === NUMBER UTILITIES ===
function formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
}

function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

// === ARRAY UTILITIES ===
function shuffle(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function groupBy(array, key) {
    return array.reduce((result, item) => {
        const group = item[key];
        if (!result[group]) {
            result[group] = [];
        }
        result[group].push(item);
        return result;
    }, {});
}

// === DOM UTILITIES ===
function createElement(tag, className, innerHTML) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (innerHTML) element.innerHTML = innerHTML;
    return element;
}

function removeAllChildren(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

// === DEBOUNCE & THROTTLE ===
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// === ANIMATION UTILITIES ===
function smoothScrollTo(element, duration = 500) {
    const targetPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// === RANDOM UTILITIES ===
function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

function getRandomColor() {
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// === CONSOLE STYLING ===
function logStyled(message, color = '#10b981') {
    console.log(`%c${message}`, `color: ${color}; font-weight: bold;`);
}

// === EXPORT ===
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateDaysRemaining,
        formatDate,
        getDateString,
        getTimeAgo,
        getStatus,
        getStatusText,
        getCategoryIcon,
        validateEmail,
        validatePassword,
        showToast,
        saveToLocalStorage,
        getFromLocalStorage,
        removeFromLocalStorage,
        capitalizeFirst,
        truncateText,
        formatNumber,
        formatCurrency,
        shuffle,
        groupBy,
        createElement,
        debounce,
        throttle,
        generateId,
        getRandomColor,
        logStyled
    };
}

// Add animation styles if not exists
if (!document.getElementById('utilsAnimationStyles')) {
    const style = document.createElement('style');
    style.id = 'utilsAnimationStyles';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

function handleLogoutWithMessage() {
    const isGuest = localStorage.getItem('fetGuestMode') === 'true';
    const user = JSON.parse(localStorage.getItem('fetUser') || '{}');
    
    let message = '';
    let redirectTo = 'login.html';
    
    if (isGuest) {
        message = 'Exit Guest Mode?\n\n✨ Create an account to save your data permanently!';
        redirectTo = 'index.html';
    } else {
        message = `Logout from ${user.name || 'your account'}?\n\n👋 See you again soon!`;
        redirectTo = 'login.html';
    }
    
    const confirmation = confirm(message);
    
    if (confirmation) {
        if (!isGuest) {
            // Only clear for logged-in users
            localStorage.removeItem('fetUser');
        }
        
        // Show toast
        if (typeof showToast === 'function') {
            showToast(
                isGuest ? 'Exiting Guest Mode' : 'Logged Out',
                isGuest ? 'Come back anytime!' : 'See you soon! 👋',
                'info'
            );
        }
        
        // Redirect
        setTimeout(() => {
            window.location.href = redirectTo;
        }, 1000);
    }
}

console.log('%c⚡ Utils Module Loaded', 'color: #10b981; font-size: 14px; font-weight: bold;');