// js/browser-notifications.js

// Request notification permission on page load
document.addEventListener('DOMContentLoaded', function() {
    checkNotificationPermission();
    scheduleNotificationCheck();
});

function checkNotificationPermission() {
    if (!('Notification' in window)) {
        console.log('Browser tidak support notifications');
        return;
    }
    
    const settings = JSON.parse(localStorage.getItem('fetNotificationSettings') || '{}');
    
    if (settings.browserNotifications && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function sendBrowserNotification(title, body, icon = 'fas fa-bell') {
    const settings = JSON.parse(localStorage.getItem('fetNotificationSettings') || '{}');
    
    if (!settings.browserNotifications) return;
    if (Notification.permission !== 'granted') return;
    
    new Notification(title, {
        body: body,
        icon: 'https://ui-avatars.com/api/?name=FET&background=10b981&color=fff',
        badge: 'https://ui-avatars.com/api/?name=FET&background=10b981&color=fff',
        requireInteraction: true
    });
}

function checkExpiringItems() {
    const foodItems = JSON.parse(localStorage.getItem('fetFoodItems') || '[]');
    const settings = JSON.parse(localStorage.getItem('fetNotificationSettings') || '{}');
    
    if (!settings.expiryNotifications) return;
    
    const notificationTiming = parseInt(settings.notificationTiming || 3);
    
    foodItems.forEach(item => {
        const daysLeft = calculateDaysRemaining(item.expiryDate);
        
        // Check if we should notify
        if (daysLeft === notificationTiming || daysLeft === 1 || daysLeft === 0) {
            const lastNotified = localStorage.getItem(`notified_${item.id}`);
            const today = new Date().toDateString();
            
            // Only notify once per day
            if (lastNotified !== today) {
                let message = '';
                if (daysLeft === 0) {
                    message = `${item.name} expires today!`;
                } else if (daysLeft < 0) {
                    message = `${item.name} has expired!`;
                } else {
                    message = `${item.name} will expire in ${daysLeft} day${daysLeft !== 1 ? 's' : ''}!`;
                }
                
                sendBrowserNotification('🍎 Food Expiry Alert', message);
                localStorage.setItem(`notified_${item.id}`, today);
            }
        }
    });
}

function scheduleNotificationCheck() {
    // Check immediately
    checkExpiringItems();
    
    // Then check every hour
    setInterval(checkExpiringItems, 60 * 60 * 1000);
}