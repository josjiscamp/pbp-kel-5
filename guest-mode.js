// ==========================================
// FET - Food Expiry Tracker
// Guest Mode System
// ==========================================

// === GUEST MODE ACTIVATION ===
function activateGuestMode() {
    // Set guest flag
    localStorage.setItem('fetGuestMode', 'true');
    
    // Generate realistic dummy data
    generateGuestData();
    
    // Set guest user info
    const guestUser = {
        name: 'Guest User',
        email: 'guest@fet.com',
        isGuest: true,
        loginTime: new Date().toISOString()
    };
    localStorage.setItem('fetUser', JSON.stringify(guestUser));
    
    // Set default notification settings
    const defaultSettings = {
        expiryNotifications: true,
        browserNotifications: false,
        emailNotifications: false,
        recipeSuggestions: true,
        notificationTiming: 3
    };
    localStorage.setItem('fetNotificationSettings', JSON.stringify(defaultSettings));
    
    // Show welcome message
    showGuestWelcome();
    
    // Redirect to dashboard
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

// === GENERATE REALISTIC GUEST DATA ===
function generateGuestData() {
    const today = new Date();
    
    const guestFoods = [
        // FRESH ITEMS (>7 days)
        {
            id: Date.now() + 1,
            name: 'Fresh Milk',
            category: 'Dairy',
            expiryDate: getDateString(10),
            image: null,
            addedDate: new Date(today - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: Date.now() + 2,
            name: 'Cheddar Cheese',
            category: 'Dairy',
            expiryDate: getDateString(15),
            image: null,
            addedDate: new Date(today - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: Date.now() + 3,
            name: 'Greek Yogurt',
            category: 'Dairy',
            expiryDate: getDateString(12),
            image: null,
            addedDate: new Date(today - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: Date.now() + 4,
            name: 'Fresh Apples',
            category: 'Fruits',
            expiryDate: getDateString(14),
            image: null,
            addedDate: new Date(today - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: Date.now() + 5,
            name: 'Bananas',
            category: 'Fruits',
            expiryDate: getDateString(8),
            image: null,
            addedDate: new Date().toISOString()
        },
        {
            id: Date.now() + 6,
            name: 'Strawberries',
            category: 'Fruits',
            expiryDate: getDateString(9),
            image: null,
            addedDate: new Date().toISOString()
        },
        {
            id: Date.now() + 7,
            name: 'Salmon Fillet',
            category: 'Seafood',
            expiryDate: getDateString(8),
            image: null,
            addedDate: new Date(today - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: Date.now() + 8,
            name: 'Whole Wheat Bread',
            category: 'Grains',
            expiryDate: getDateString(11),
            image: null,
            addedDate: new Date(today - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        
        // EXPIRING SOON (1-7 days)
        {
            id: Date.now() + 9,
            name: 'Chicken Breast',
            category: 'Meat',
            expiryDate: getDateString(3),
            image: null,
            addedDate: new Date(today - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: Date.now() + 10,
            name: 'Ground Beef',
            category: 'Meat',
            expiryDate: getDateString(2),
            image: null,
            addedDate: new Date(today - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: Date.now() + 11,
            name: 'Fresh Carrots',
            category: 'Vegetables',
            expiryDate: getDateString(5),
            image: null,
            addedDate: new Date(today - 4 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: Date.now() + 12,
            name: 'Tomatoes',
            category: 'Vegetables',
            expiryDate: getDateString(4),
            image: null,
            addedDate: new Date(today - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: Date.now() + 13,
            name: 'Broccoli',
            category: 'Vegetables',
            expiryDate: getDateString(6),
            image: null,
            addedDate: new Date(today - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: Date.now() + 14,
            name: 'Bell Peppers',
            category: 'Vegetables',
            expiryDate: getDateString(5),
            image: null,
            addedDate: new Date(today - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: Date.now() + 15,
            name: 'Eggs (Dozen)',
            category: 'Dairy',
            expiryDate: getDateString(7),
            image: null,
            addedDate: new Date(today - 7 * 24 * 60 * 60 * 1000).toISOString()
        },
        
        // EXPIRED (<=0 days)
        {
            id: Date.now() + 16,
            name: 'Lettuce',
            category: 'Vegetables',
            expiryDate: getDateString(-1),
            image: null,
            addedDate: new Date(today - 10 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
            id: Date.now() + 17,
            name: 'Cottage Cheese',
            category: 'Dairy',
            expiryDate: getDateString(-2),
            image: null,
            addedDate: new Date(today - 14 * 24 * 60 * 60 * 1000).toISOString()
        }
    ];
    
    localStorage.setItem('fetFoodItems', JSON.stringify(guestFoods));
}

// === HELPER FUNCTIONS ===
function getDateString(daysFromNow) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
}

function showGuestWelcome() {
    // Create welcome notification
    const welcomeDiv = document.createElement('div');
    welcomeDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 40px;
        border-radius: 20px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        z-index: 99999;
        text-align: center;
        max-width: 400px;
        animation: scaleIn 0.3s ease-out;
    `;
    
    welcomeDiv.innerHTML = `
        <div style="font-size: 64px; margin-bottom: 20px;">👋</div>
        <h3 style="font-size: 24px; font-weight: 700; color: #1e293b; margin-bottom: 10px;">
            Welcome to Guest Mode!
        </h3>
        <p style="font-size: 15px; color: #64748b; margin-bottom: 20px;">
            Explore all features with demo data. Your changes won't be saved permanently.
        </p>
        <div style="
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            padding: 15px;
            border-radius: 12px;
            color: white;
            font-size: 14px;
            font-weight: 600;
        ">
            <i class="fas fa-rocket"></i> Redirecting to dashboard...
        </div>
    `;
    
    // Add animation style
    if (!document.getElementById('guestModeStyles')) {
        const style = document.createElement('style');
        style.id = 'guestModeStyles';
        style.textContent = `
            @keyframes scaleIn {
                from {
                    transform: translate(-50%, -50%) scale(0.8);
                    opacity: 0;
                }
                to {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(welcomeDiv);
    
    // Remove after redirect
    setTimeout(() => {
        welcomeDiv.style.animation = 'scaleOut 0.3s ease-out';
        setTimeout(() => welcomeDiv.remove(), 300);
    }, 1000);
}

// === CHECK GUEST MODE ===
function isGuestMode() {
    return localStorage.getItem('fetGuestMode') === 'true';
}

// === EXIT GUEST MODE ===
function exitGuestMode() {
    // Clear guest data
    localStorage.removeItem('fetGuestMode');
    localStorage.removeItem('fetUser');
    localStorage.removeItem('fetFoodItems');
    localStorage.removeItem('fetNotificationSettings');
    
    // Redirect to login
    window.location.href = 'login.html';
}

// === CREATE GUEST MODE BANNER ===
function createGuestModeBanner() {
    // Only show on dashboard
    if (!window.location.pathname.includes('dashboard')) return;
    
    // Check if guest mode
    if (!isGuestMode()) return;
    
    // Create banner
    const banner = document.createElement('div');
    banner.id = 'guestModeBanner';
    banner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
        padding: 12px 20px;
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: space-between;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        animation: slideDown 0.3s ease-out;
    `;
    
    banner.innerHTML = `
        <div style="display: flex; align-items: center; gap: 15px; color: white;">
            <i class="fas fa-exclamation-circle" style="font-size: 20px;"></i>
            <div>
                <strong style="font-size: 14px;">Guest Mode Active</strong>
                <p style="margin: 0; font-size: 12px; opacity: 0.9;">
                    You're exploring with demo data. Create an account to save your progress!
                </p>
            </div>
        </div>
        <div style="display: flex; gap: 10px;">
            <button 
                onclick="window.location.href='register.html'"
                style="
                    background: white;
                    color: #f59e0b;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 13px;
                    transition: all 0.3s ease;
                "
                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.2)'"
                onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'"
            >
                <i class="fas fa-user-plus"></i> Create Account
            </button>
            <button 
                onclick="exitGuestMode()"
                style="
                    background: transparent;
                    color: white;
                    border: 2px solid white;
                    padding: 10px 20px;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    font-size: 13px;
                    transition: all 0.3s ease;
                "
                onmouseover="this.style.background='rgba(255,255,255,0.2)'"
                onmouseout="this.style.background='transparent'"
            >
                <i class="fas fa-sign-out-alt"></i> Exit Guest Mode
            </button>
        </div>
    `;
    
    // Add animation style
    if (!document.getElementById('bannerAnimationStyle')) {
        const style = document.createElement('style');
        style.id = 'bannerAnimationStyle';
        style.textContent = `
            @keyframes slideDown {
                from {
                    transform: translateY(-100%);
                }
                to {
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.insertBefore(banner, document.body.firstChild);
    
    // Adjust main content padding to account for banner
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.style.paddingTop = '70px';
    }
}

// === INITIALIZE GUEST MODE BANNER ===
document.addEventListener('DOMContentLoaded', function() {
    createGuestModeBanner();
});

// === MODIFY AUTH CHECK FOR GUEST MODE ===
function checkDashboardAuthWithGuest() {
    const user = localStorage.getItem('fetUser');
    const isGuest = localStorage.getItem('fetGuestMode') === 'true';
    
    // Allow access if logged in OR in guest mode
    if (!user && !isGuest) {
        window.location.href = 'login.html';
    }
}

// === CONSOLE INFO ===
console.log('%c👥 Guest Mode Module Loaded', 'color: #fbbf24; font-size: 16px; font-weight: bold;');
console.log('%c✨ Guest mode with realistic demo data ready!', 'color: #64748b; font-size: 12px;');