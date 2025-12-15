// ==========================================
// FET - Food Expiry Tracker
// Advanced Notifications System
// ==========================================

// === NOTIFICATION CONFIGURATION ===
const NOTIFICATION_CONFIG = {
    CHECK_INTERVAL: 3600000, // Check every hour (3600000ms)
    SHOW_LIMIT: 5, // Max notifications to show at once
    AUTO_DISMISS: 10000, // Auto dismiss after 10 seconds
    SOUND_ENABLED: true,
    VIBRATE_PATTERN: [200, 100, 200] // Vibration pattern for mobile
};

// === NOTIFICATION TYPES ===
const NOTIFICATION_TYPES = {
    EXPIRING_SOON: {
        icon: 'fa-exclamation-triangle',
        color: '#fbbf24',
        priority: 'medium'
    },
    EXPIRED: {
        icon: 'fa-times-circle',
        color: '#ef4444',
        priority: 'high'
    },
    RECIPE_SUGGESTION: {
        icon: 'fa-utensils',
        color: '#10b981',
        priority: 'low'
    },
    SYSTEM: {
        icon: 'fa-info-circle',
        color: '#3b82f6',
        priority: 'low'
    }
};

// === NOTIFICATION STORAGE ===
let notificationHistory = [];
let activeNotifications = [];

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', function() {
    initNotificationSystem();
    loadNotificationHistory();
    checkForNotifications();
    
    // Start periodic checks
    setInterval(checkForNotifications, NOTIFICATION_CONFIG.CHECK_INTERVAL);
    
    // Check immediately on page load
    setTimeout(checkForNotifications, 2000);
});

function initNotificationSystem() {
    // Create notification container
    createNotificationContainer();
    
    // Create notification center
    createNotificationCenter();
    
    // Request browser permission if enabled
    const settings = JSON.parse(localStorage.getItem('fetNotificationSettings') || '{}');
    if (settings.browserNotifications && 'Notification' in window) {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
}

// === NOTIFICATION CONTAINER ===
function createNotificationContainer() {
    if (document.getElementById('notificationContainer')) return;
    
    const container = document.createElement('div');
    container.id = 'notificationContainer';
    container.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        z-index: 9999;
        max-width: 400px;
    `;
    document.body.appendChild(container);
}

// === NOTIFICATION CENTER ===
function createNotificationCenter() {
    // Add notification center button to navbar
    const notificationIcon = document.querySelector('.notification-icon');
    if (!notificationIcon) return;
    
    notificationIcon.addEventListener('click', openNotificationCenter);
}

function openNotificationCenter() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'notificationCenterModal';
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="fas fa-bell"></i> Notifications
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body" id="notificationCenterBody">
                    <!-- Notifications will be loaded here -->
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-danger btn-sm" onclick="clearAllNotifications()">
                        <i class="fas fa-trash"></i> Clear All
                    </button>
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Load notifications
    displayNotificationHistory();
    
    // Show modal
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    // Remove from DOM when closed
    modal.addEventListener('hidden.bs.modal', function() {
        modal.remove();
    });
    
    // Mark all as read
    markAllAsRead();
}

// === CHECK FOR NOTIFICATIONS ===
function checkForNotifications() {
    const settings = JSON.parse(localStorage.getItem('fetNotificationSettings') || '{}');
    
    if (!settings.expiryNotifications) return;
    
    const foodItems = JSON.parse(localStorage.getItem('fetFoodItems') || '[]');
    const notificationTiming = parseInt(settings.notificationTiming || 3);
    
    let notificationsToShow = [];
    
    foodItems.forEach(item => {
        const daysLeft = calculateDaysRemaining(item.expiryDate);
        
        // Check if already notified today
        const lastNotified = getLastNotificationDate(item.id);
        const today = new Date().toDateString();
        
        if (lastNotified === today) return;
        
        // Expired items
        if (daysLeft <= 0) {
            notificationsToShow.push({
                type: 'EXPIRED',
                itemId: item.id,
                title: 'Food Expired!',
                message: `${item.name} has expired. Please remove it from your inventory.`,
                item: item,
                daysLeft: daysLeft
            });
        }
        // Expiring soon
        else if (daysLeft <= notificationTiming) {
            notificationsToShow.push({
                type: 'EXPIRING_SOON',
                itemId: item.id,
                title: 'Expiring Soon!',
                message: `${item.name} will expire in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}!`,
                item: item,
                daysLeft: daysLeft
            });
        }
    });
    
    // Limit notifications
    notificationsToShow = notificationsToShow
        .sort((a, b) => a.daysLeft - b.daysLeft) // Most urgent first
        .slice(0, NOTIFICATION_CONFIG.SHOW_LIMIT);
    
    // Show notifications
    notificationsToShow.forEach(notification => {
        showNotification(notification);
        saveNotificationToHistory(notification);
        markItemAsNotified(notification.itemId);
    });
    
    // Check for recipe suggestions
    if (settings.recipeSuggestions) {
        checkRecipeSuggestions();
    }
}

function checkRecipeSuggestions() {
    const foodItems = JSON.parse(localStorage.getItem('fetFoodItems') || '[]');
    
    const expiringItems = foodItems.filter(item => {
        const daysLeft = calculateDaysRemaining(item.expiryDate);
        return daysLeft > 0 && daysLeft <= 7;
    });
    
    if (expiringItems.length >= 3) {
        // Check if already shown today
        const lastShown = localStorage.getItem('lastRecipeSuggestion');
        const today = new Date().toDateString();
        
        if (lastShown !== today) {
            showNotification({
                type: 'RECIPE_SUGGESTION',
                title: 'Recipe Suggestions Available!',
                message: `You have ${expiringItems.length} items expiring soon. Find recipes to use them!`,
                action: {
                    text: 'Find Recipes',
                    callback: () => {
                        if (window.location.pathname.includes('dashboard')) {
                            openRecipeModal();
                        } else {
                            window.location.href = 'recipe-finder.html';
                        }
                    }
                }
            });
            
            localStorage.setItem('lastRecipeSuggestion', today);
        }
    }
}

// === SHOW NOTIFICATION ===
function showNotification(notification) {
    const container = document.getElementById('notificationContainer');
    if (!container) return;
    
    const type = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.SYSTEM;
    
    const notifElement = document.createElement('div');
    notifElement.className = 'notification-toast';
    notifElement.style.cssText = `
        background: white;
        border-radius: 15px;
        padding: 20px;
        margin-bottom: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        animation: slideInRight 0.4s ease-out;
        border-left: 4px solid ${type.color};
        position: relative;
        overflow: hidden;
    `;
    
    notifElement.innerHTML = `
        <div style="display: flex; align-items: start; gap: 15px;">
            <div style="
                width: 45px;
                height: 45px;
                border-radius: 50%;
                background: ${type.color}15;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            ">
                <i class="fas ${type.icon}" style="font-size: 20px; color: ${type.color};"></i>
            </div>
            <div style="flex: 1; min-width: 0;">
                <h6 style="margin: 0 0 8px 0; font-size: 15px; font-weight: 700; color: #1e293b;">
                    ${notification.title}
                </h6>
                <p style="margin: 0; font-size: 14px; color: #64748b; line-height: 1.5;">
                    ${notification.message}
                </p>
                ${notification.action ? `
                    <button 
                        onclick="handleNotificationAction(this)"
                        data-action="${notification.action.text}"
                        style="
                            margin-top: 12px;
                            background: ${type.color};
                            color: white;
                            border: none;
                            padding: 8px 18px;
                            border-radius: 8px;
                            font-size: 13px;
                            font-weight: 600;
                            cursor: pointer;
                        "
                    >
                        ${notification.action.text}
                    </button>
                ` : ''}
            </div>
            <button 
                onclick="this.parentElement.parentElement.remove()"
                style="
                    background: none;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    font-size: 18px;
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    flex-shrink: 0;
                "
            >
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="notification-progress" style="
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: ${type.color};
            width: 100%;
            animation: shrink ${NOTIFICATION_CONFIG.AUTO_DISMISS}ms linear;
        "></div>
    `;
    
    container.appendChild(notifElement);
    
    // Store callback
    if (notification.action && notification.action.callback) {
        notifElement.dataset.callback = notification.action.callback.toString();
    }
    
    // Play sound
    if (NOTIFICATION_CONFIG.SOUND_ENABLED) {
        playNotificationSound(type.priority);
    }
    
    // Vibrate on mobile
    if ('vibrate' in navigator) {
        navigator.vibrate(NOTIFICATION_CONFIG.VIBRATE_PATTERN);
    }
    
    // Send browser notification
    sendBrowserNotification(notification);
    
    // Auto dismiss
    setTimeout(() => {
        notifElement.style.animation = 'slideOutRight 0.4s ease-out';
        setTimeout(() => notifElement.remove(), 400);
    }, NOTIFICATION_CONFIG.AUTO_DISMISS);
    
    // Add to active notifications
    activeNotifications.push(notifElement);
    
    // Update badge
    updateNotificationBadge();
}

function handleNotificationAction(button) {
    const notifElement = button.closest('.notification-toast');
    const action = button.dataset.action;
    
    if (action === 'Find Recipes') {
        if (window.location.pathname.includes('dashboard')) {
            openRecipeModal();
        } else {
            window.location.href = 'recipe-finder.html';
        }
    }
    
    // Remove notification
    notifElement.remove();
}

// === BROWSER NOTIFICATIONS ===
function sendBrowserNotification(notification) {
    const settings = JSON.parse(localStorage.getItem('fetNotificationSettings') || '{}');
    
    if (!settings.browserNotifications) return;
    if (!('Notification' in window)) return;
    if (Notification.permission !== 'granted') return;
    
    const type = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.SYSTEM;
    
    const browserNotif = new Notification(notification.title, {
        body: notification.message,
        icon: 'https://ui-avatars.com/api/?name=FET&background=10b981&color=fff',
        badge: 'https://ui-avatars.com/api/?name=FET&background=10b981&color=fff',
        tag: notification.itemId || 'fet-notification',
        requireInteraction: type.priority === 'high'
    });
    
    browserNotif.onclick = function() {
        window.focus();
        if (notification.action && notification.action.callback) {
            notification.action.callback();
        }
        browserNotif.close();
    };
}

// === NOTIFICATION HISTORY ===
function saveNotificationToHistory(notification) {
    notificationHistory.unshift({
        ...notification,
        timestamp: new Date().toISOString(),
        read: false
    });
    
    // Keep only last 50 notifications
    notificationHistory = notificationHistory.slice(0, 50);
    
    localStorage.setItem('fetNotificationHistory', JSON.stringify(notificationHistory));
}

function loadNotificationHistory() {
    const stored = localStorage.getItem('fetNotificationHistory');
    if (stored) {
        notificationHistory = JSON.parse(stored);
    }
}

function displayNotificationHistory() {
    const body = document.getElementById('notificationCenterBody');
    if (!body) return;
    
    if (notificationHistory.length === 0) {
        body.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #64748b;">
                <i class="fas fa-bell-slash" style="font-size: 48px; margin-bottom: 15px; opacity: 0.3;"></i>
                <h5>No Notifications</h5>
                <p>You're all caught up!</p>
            </div>
        `;
        return;
    }
    
    body.innerHTML = '';
    
    notificationHistory.forEach(notification => {
        const type = NOTIFICATION_TYPES[notification.type] || NOTIFICATION_TYPES.SYSTEM;
        const date = new Date(notification.timestamp);
        const timeAgo = getTimeAgo(date);
        
        const notifElement = document.createElement('div');
        notifElement.style.cssText = `
            padding: 15px;
            border-bottom: 1px solid #f1f5f9;
            cursor: pointer;
            transition: background 0.2s ease;
            ${!notification.read ? 'background: #f0fdf4;' : ''}
        `;
        
        notifElement.innerHTML = `
            <div style="display: flex; gap: 12px; align-items: start;">
                <div style="
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: ${type.color}15;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                ">
                    <i class="fas ${type.icon}" style="color: ${type.color};"></i>
                </div>
                <div style="flex: 1; min-width: 0;">
                    <h6 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #1e293b;">
                        ${notification.title}
                    </h6>
                    <p style="margin: 0 0 6px 0; font-size: 13px; color: #64748b;">
                        ${notification.message}
                    </p>
                    <span style="font-size: 12px; color: #94a3b8;">
                        <i class="fas fa-clock"></i> ${timeAgo}
                    </span>
                </div>
            </div>
        `;
        
        notifElement.addEventListener('mouseenter', function() {
            this.style.background = '#f8fafc';
        });
        
        notifElement.addEventListener('mouseleave', function() {
            this.style.background = notification.read ? 'white' : '#f0fdf4';
        });
        
        body.appendChild(notifElement);
    });
}

function markAllAsRead() {
    notificationHistory.forEach(notif => notif.read = true);
    localStorage.setItem('fetNotificationHistory', JSON.stringify(notificationHistory));
    updateNotificationBadge();
}

function clearAllNotifications() {
    if (!confirm('Clear all notification history?')) return;
    
    notificationHistory = [];
    localStorage.setItem('fetNotificationHistory', JSON.stringify(notificationHistory));
    
    const body = document.getElementById('notificationCenterBody');
    if (body) {
        body.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #64748b;">
                <i class="fas fa-check-circle" style="font-size: 48px; margin-bottom: 15px; color: #10b981;"></i>
                <h5>All Clear!</h5>
                <p>Notification history cleared.</p>
            </div>
        `;
    }
    
    updateNotificationBadge();
}

// === NOTIFICATION TRACKING ===
function getLastNotificationDate(itemId) {
    const tracking = JSON.parse(localStorage.getItem('fetNotificationTracking') || '{}');
    return tracking[itemId];
}

function markItemAsNotified(itemId) {
    const tracking = JSON.parse(localStorage.getItem('fetNotificationTracking') || '{}');
    tracking[itemId] = new Date().toDateString();
    localStorage.setItem('fetNotificationTracking', JSON.stringify(tracking));
}

// === UPDATE BADGE ===
function updateNotificationBadge() {
    const badge = document.getElementById('notificationBadge');
    if (!badge) return;
    
    const unreadCount = notificationHistory.filter(n => !n.read).length;
    
    if (unreadCount > 0) {
        badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
}

// === SOUND EFFECTS ===
function playNotificationSound(priority) {
    const settings = JSON.parse(localStorage.getItem('fetNotificationSettings') || '{}');
    if (!settings.soundEnabled) return;
    
    // Use Web Audio API for notification sounds
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Different frequencies for different priorities
    const frequencies = {
        high: [800, 1000],
        medium: [600, 800],
        low: [400, 600]
    };
    
    const freq = frequencies[priority] || frequencies.medium;
    oscillator.frequency.value = freq[0];
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
    
    // Second beep for high priority
    if (priority === 'high') {
        setTimeout(() => {
            const osc2 = audioContext.createOscillator();
            const gain2 = audioContext.createGain();
            osc2.connect(gain2);
            gain2.connect(audioContext.destination);
            osc2.frequency.value = freq[1];
            gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
            gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            osc2.start(audioContext.currentTime);
            osc2.stop(audioContext.currentTime + 0.3);
        }, 150);
    }
}

// === UTILITY FUNCTIONS ===
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

// === ANIMATION STYLES ===
if (!document.getElementById('notificationStyles')) {
    const style = document.createElement('style');
    style.id = 'notificationStyles';
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
        @keyframes shrink {
            from { width: 100%; }
            to { width: 0%; }
        }
    `;
    document.head.appendChild(style);
}

// === EXPORT ===
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkForNotifications,
        showNotification,
        sendBrowserNotification,
        clearAllNotifications
    };
}

console.log('%c🔔 Notification System Loaded', 'color: #10b981; font-size: 16px; font-weight: bold;');