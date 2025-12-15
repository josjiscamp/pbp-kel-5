// ==========================================
// FET - Food Expiry Tracker
// Authentication JavaScript (Login & Register)
// ==========================================

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', function() {
    // Initialize password strength indicator if on register page
    const passwordInput = document.getElementById('password');
    if (passwordInput && document.getElementById('strengthFill')) {
        initPasswordStrength();
    }
    
    // Initialize form validation
    initFormValidation();
    
    // Add input animations
    initInputAnimations();
});

// === LOGIN FORM HANDLER ===
function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    
    // Validate form
    if (!validateLoginForm(email, password)) {
        return false;
    }
    
    // Show loading state
    showLoading('loginBtn');
    
    // Simulate API call (Replace with actual Laravel API endpoint)
    setTimeout(() => {
        // Demo: Check credentials
        if (email === 'demo@fet.com' && password === 'demo123') {
            // Success
            showAlert('success', 'Login successful! Redirecting to dashboard...');
            
            // Store user data (in real app, store JWT token)
            if (remember) {
                localStorage.setItem('fetUser', JSON.stringify({
                    email: email,
                    name: 'Demo User',
                    loginTime: new Date().toISOString()
                }));
            }
            
            // Redirect to dashboard after 1.5 seconds
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            // Error
            hideLoading('loginBtn');
            showAlert('danger', 'Invalid email or password. Please try again.');
        }
    }, 1500);
    
    return false;
}

// === REGISTER FORM HANDLER ===
function handleRegister(event) {
    event.preventDefault();
    
    const form = event.target;
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;
    
    // Validate form
    if (!validateRegisterForm(fullname, email, password, confirmPassword, terms)) {
        return false;
    }
    
    // Show loading state
    showLoading('registerBtn');
    
    // Simulate API call (Replace with actual Laravel API endpoint)
    setTimeout(() => {
        // Demo: Success
        showAlert('success', 'Account created successfully! Redirecting to login...');
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
            window.location.href = 'login.html?registered=true';
        }, 2000);
    }, 2000);
    
    return false;
}

// === VALIDATION FUNCTIONS ===

function validateLoginForm(email, password) {
    let isValid = true;
    
    // Email validation
    const emailInput = document.getElementById('email');
    if (!validateEmail(email)) {
        markInvalid(emailInput);
        isValid = false;
    } else {
        markValid(emailInput);
    }
    
    // Password validation
    const passwordInput = document.getElementById('password');
    if (password.length < 6) {
        markInvalid(passwordInput);
        isValid = false;
    } else {
        markValid(passwordInput);
    }
    
    if (!isValid) {
        showAlert('danger', 'Please check your inputs and try again.');
    }
    
    return isValid;
}

function validateRegisterForm(fullname, email, password, confirmPassword, terms) {
    let isValid = true;
    
    // Fullname validation
    const fullnameInput = document.getElementById('fullname');
    if (fullname.length < 3) {
        markInvalid(fullnameInput);
        isValid = false;
    } else {
        markValid(fullnameInput);
    }
    
    // Email validation
    const emailInput = document.getElementById('email');
    if (!validateEmail(email)) {
        markInvalid(emailInput);
        isValid = false;
    } else {
        markValid(emailInput);
    }
    
    // Password validation
    const passwordInput = document.getElementById('password');
    if (password.length < 6) {
        markInvalid(passwordInput);
        isValid = false;
    } else {
        markValid(passwordInput);
    }
    
    // Confirm password validation
    const confirmPasswordInput = document.getElementById('confirmPassword');
    if (password !== confirmPassword) {
        markInvalid(confirmPasswordInput);
        showAlert('danger', 'Passwords do not match!');
        isValid = false;
    } else {
        markValid(confirmPasswordInput);
    }
    
    // Terms validation
    const termsInput = document.getElementById('terms');
    if (!terms) {
        markInvalid(termsInput);
        showAlert('danger', 'You must agree to the terms and conditions.');
        isValid = false;
    } else {
        markValid(termsInput);
    }
    
    return isValid;
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function markInvalid(input) {
    input.classList.add('is-invalid');
    input.classList.remove('is-valid');
}

function markValid(input) {
    input.classList.add('is-valid');
    input.classList.remove('is-invalid');
}

// === PASSWORD STRENGTH INDICATOR ===
function initPasswordStrength() {
    const passwordInput = document.getElementById('password');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');
    
    passwordInput.addEventListener('input', function() {
        const password = this.value;
        const strength = calculatePasswordStrength(password);
        
        // Update strength bar
        strengthFill.className = 'strength-fill';
        
        if (strength.score === 0) {
            strengthFill.classList.add('strength-weak');
            strengthText.textContent = 'Weak';
            strengthText.style.color = '#ef4444';
        } else if (strength.score === 1) {
            strengthFill.classList.add('strength-medium');
            strengthText.textContent = 'Medium';
            strengthText.style.color = '#fbbf24';
        } else {
            strengthFill.classList.add('strength-strong');
            strengthText.textContent = 'Strong';
            strengthText.style.color = '#10b981';
        }
    });
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    if (!password) return { score: 0 };
    
    // Length check
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    
    // Has lowercase
    if (/[a-z]/.test(password)) score++;
    
    // Has uppercase
    if (/[A-Z]/.test(password)) score++;
    
    // Has numbers
    if (/\d/.test(password)) score++;
    
    // Has special characters
    if (/[^a-zA-Z\d]/.test(password)) score++;
    
    // Normalize score to 0-2
    if (score <= 2) return { score: 0 };
    if (score <= 4) return { score: 1 };
    return { score: 2 };
}

// === TOGGLE PASSWORD VISIBILITY ===
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// === ALERT FUNCTIONS ===
function showAlert(type, message) {
    const alertDiv = document.getElementById('alertMessage');
    const alertText = document.getElementById('alertText');
    
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertText.textContent = message;
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        closeAlert();
    }, 5000);
}

function closeAlert() {
    const alertDiv = document.getElementById('alertMessage');
    alertDiv.classList.remove('show');
    setTimeout(() => {
        alertDiv.classList.add('d-none');
    }, 150);
}

// === LOADING STATE ===
function showLoading(btnId) {
    const btn = document.getElementById(btnId);
    btn.classList.add('loading');
    btn.disabled = true;
}

function hideLoading(btnId) {
    const btn = document.getElementById(btnId);
    btn.classList.remove('loading');
    btn.disabled = false;
}

// === INPUT ANIMATIONS ===
function initInputAnimations() {
    const inputs = document.querySelectorAll('.form-control');
    
    inputs.forEach(input => {
        // Focus animation
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        // Blur animation
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            
            // Validate on blur
            if (this.value) {
                if (this.type === 'email') {
                    if (validateEmail(this.value)) {
                        markValid(this);
                    } else {
                        markInvalid(this);
                    }
                } else if (this.id === 'confirmPassword') {
                    const password = document.getElementById('password').value;
                    if (this.value === password) {
                        markValid(this);
                    } else {
                        markInvalid(this);
                    }
                } else if (this.hasAttribute('minlength')) {
                    const minLength = parseInt(this.getAttribute('minlength'));
                    if (this.value.length >= minLength) {
                        markValid(this);
                    } else {
                        markInvalid(this);
                    }
                }
            }
        });
        
        // Clear validation on input
        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                this.classList.remove('is-invalid');
            }
        });
    });
}

// === FORM VALIDATION ===
function initFormValidation() {
    const forms = document.querySelectorAll('.auth-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
}

// === SOCIAL LOGIN ===
function socialLogin(provider) {
    showAlert('info', `${provider.charAt(0).toUpperCase() + provider.slice(1)} login coming soon!`);
    
    // In real implementation:
    // window.location.href = `/auth/${provider}`;
}

// === CHECK IF USER IS LOGGED IN ===
function checkAuth() {
    const user = localStorage.getItem('fetUser');
    if (user) {
        // User is logged in, redirect to dashboard
        window.location.href = 'dashboard.html';
    }
}

// === AUTO-FILL DEMO CREDENTIALS ===
// For testing purposes - REMOVE in production
document.addEventListener('DOMContentLoaded', function() {
    // Check if on login page and add demo credentials hint
    const emailInput = document.getElementById('email');
    if (emailInput && window.location.pathname.includes('login')) {
        // Add a small hint below the form (for demo purposes)
        const demoHint = document.createElement('div');
        demoHint.className = 'alert alert-info mt-3';
        demoHint.innerHTML = '<small><strong>Demo Credentials:</strong><br>Email: demo@fet.com<br>Password: demo123</small>';
        demoHint.style.fontSize = '12px';
        
        const form = document.getElementById('loginForm');
        if (form) {
            form.appendChild(demoHint);
        }
    }
});

// === KEYBOARD SHORTCUTS ===
document.addEventListener('keydown', function(event) {
    // ESC to close alert
    if (event.key === 'Escape') {
        closeAlert();
    }
    
    // Ctrl/Cmd + Enter to submit form
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        const activeForm = document.querySelector('.auth-form');
        if (activeForm) {
            activeForm.dispatchEvent(new Event('submit', { cancelable: true }));
        }
    }
});

// === INPUT MASKING (Optional) ===
function initInputMasking() {
    // Format phone number (if you add phone input later)
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                value = value.match(/.{1,4}/g).join('-');
            }
            e.target.value = value;
        });
    }
}

// === AUTO FOCUS FIRST INPUT ===
document.addEventListener('DOMContentLoaded', function() {
    const firstInput = document.querySelector('.form-control');
    if (firstInput) {
        // Small delay to ensure smooth page load
        setTimeout(() => {
            firstInput.focus();
        }, 500);
    }
});

// === PREVENT MULTIPLE FORM SUBMISSIONS ===
let isSubmitting = false;

function preventMultipleSubmit(event) {
    if (isSubmitting) {
        event.preventDefault();
        return false;
    }
    isSubmitting = true;
    
    // Reset after 3 seconds
    setTimeout(() => {
        isSubmitting = false;
    }, 3000);
    
    return true;
}

// === CHECK REGISTRATION SUCCESS ===
document.addEventListener('DOMContentLoaded', function() {
    // Check if redirected from registration
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('registered') === 'true') {
        showAlert('success', 'Registration successful! Please login with your credentials.');
    }
});

// === FLOATING LABEL EFFECT (Optional Enhancement) ===
document.addEventListener('DOMContentLoaded', function() {
    const inputs = document.querySelectorAll('.form-control');
    
    inputs.forEach(input => {
        // Check if input has value on load
        if (input.value) {
            input.parentElement.classList.add('has-value');
        }
        
        input.addEventListener('input', function() {
            if (this.value) {
                this.parentElement.classList.add('has-value');
            } else {
                this.parentElement.classList.remove('has-value');
            }
        });
    });
});

// === REMEMBER ME FUNCTIONALITY ===
document.addEventListener('DOMContentLoaded', function() {
    // Check if there's a remembered email
    const rememberedEmail = localStorage.getItem('fetRememberedEmail');
    const emailInput = document.getElementById('email');
    const rememberCheckbox = document.getElementById('remember');
    
    if (rememberedEmail && emailInput) {
        emailInput.value = rememberedEmail;
        if (rememberCheckbox) {
            rememberCheckbox.checked = true;
        }
    }
    
    // Save email when remember me is checked
    if (rememberCheckbox) {
        rememberCheckbox.addEventListener('change', function() {
            if (!this.checked) {
                localStorage.removeItem('fetRememberedEmail');
            }
        });
    }
});

// === EXPORT FOR TESTING ===
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleLogin,
        handleRegister,
        validateEmail,
        calculatePasswordStrength,
        togglePassword,
        showAlert,
        closeAlert
    };
}

// === CONSOLE EASTER EGG ===
console.log('%c🍎 FET Authentication System', 'color: #10b981; font-size: 16px; font-weight: bold;');
console.log('%cSecure login powered by Laravel', 'color: #64748b; font-size: 12px;');
console.log('%c💡 Tip: Press Ctrl+Enter to submit forms!', 'color: #fbbf24; font-size: 11px;');