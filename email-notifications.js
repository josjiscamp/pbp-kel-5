// js/email-notifications.js

// EmailJS Configuration
const EMAILJS_CONFIG = {
    SERVICE_ID: 'service_abc123',  // ← Ganti dengan Service ID kamu
    TEMPLATE_ID: 'template_gtgdla9', // ← Ganti dengan Template ID kamu
    PUBLIC_KEY: 'F6gqqFv2Zda4jl_ta'   // ← Ganti dengan Public Key kamu
};

// Check and send daily email
function checkAndSendDailyEmail() {
    const settings = JSON.parse(localStorage.getItem('fetNotificationSettings') || '{}');
    
    // Check if email notifications enabled
    if (!settings.emailNotifications) {
        console.log('Email notifications disabled');
        return;
    }
    
    // Check if already sent today
    const lastSent = localStorage.getItem('lastEmailSent');
    const today = new Date().toDateString();
    
    if (lastSent === today) {
        console.log('Email already sent today');
        return;
    }
    
    // Get expiring items
    const foodItems = JSON.parse(localStorage.getItem('fetFoodItems') || '[]');
    const expiringItems = foodItems.filter(item => {
        const daysLeft = calculateDaysRemaining(item.expiryDate);
        return daysLeft >= 0 && daysLeft <= 7;
    });
    
    // Only send if there are expiring items
    if (expiringItems.length === 0) {
        console.log('No expiring items');
        return;
    }
    
    // Send email
    sendExpiryEmail(expiringItems);
}

// Send email using EmailJS
function sendExpiryEmail(items) {
    const user = JSON.parse(localStorage.getItem('fetUser') || '{}');
    
    // Format items list
    let itemsList = '';
    items.forEach(item => {
        const daysLeft = calculateDaysRemaining(item.expiryDate);
        const status = daysLeft === 0 ? '⚠️ EXPIRES TODAY' : 
                       daysLeft === 1 ? '⚠️ 1 day left' : 
                       `⏰ ${daysLeft} days left`;
        
        itemsList += `
- ${item.name} (${item.category}) - ${status}
  Expires: ${formatDate(item.expiryDate)}
`;
    });
    
    // Email parameters
    const templateParams = {
        user_name: user.name || 'User',
        to_email: user.email || 'demo@fet.com',
        item_count: items.length,
        items_list: itemsList
    };
    
    // Send via EmailJS
    emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
    )
    .then(function(response) {
        console.log('✅ Email sent successfully!', response.status, response.text);
        
        // Save timestamp
        localStorage.setItem('lastEmailSent', new Date().toDateString());
        
        // Show toast
        showToast('Email Sent!', 'Daily summary sent to your email', 'success');
    })
    .catch(function(error) {
        console.error('❌ Email failed:', error);
        showToast('Email Failed', 'Could not send email notification', 'danger');
    });
}

// Manual send email (for testing)
function sendTestEmail() {
    const settings = JSON.parse(localStorage.getItem('fetNotificationSettings') || '{}');
    
    if (!settings.emailNotifications) {
        showToast('Email Disabled', 'Enable email notifications in settings first', 'warning');
        return;
    }
    
    const foodItems = JSON.parse(localStorage.getItem('fetFoodItems') || '[]');
    const expiringItems = foodItems.filter(item => {
        const daysLeft = calculateDaysRemaining(item.expiryDate);
        return daysLeft >= 0 && daysLeft <= 7;
    });
    
    if (expiringItems.length === 0) {
        showToast('No Items', 'No expiring items to notify about', 'info');
        return;
    }
    
    sendExpiryEmail(expiringItems);
}

// Schedule daily check (8 AM)
function scheduleDailyEmail() {
    // Check immediately on load
    setTimeout(checkAndSendDailyEmail, 3000);
    
    // Then check every hour to catch 8 AM
    setInterval(function() {
        const now = new Date();
        const hour = now.getHours();
        
        // Send at 8 AM
        if (hour === 8) {
            checkAndSendDailyEmail();
        }
    }, 60 * 60 * 1000); // Every hour
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    scheduleDailyEmail();
});

console.log('📧 Email notification system loaded');