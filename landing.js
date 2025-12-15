// ==========================================
// FET - Food Expiry Tracker
// Landing Page JavaScript
// ==========================================

// === INITIALIZATION ===
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100,
        easing: 'ease-out-cubic'
    });
    
    // Initialize all functions
    initNavbar();
    initBackToTop();
    initCounters();
    initSmoothScroll();
    initParallax();
});

// === NAVBAR SCROLL EFFECT ===
function initNavbar() {
    const navbar = document.getElementById('mainNavbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbarCollapse.classList.contains('show')) {
                navbarToggler.click();
            }
        });
    });
}

// === BACK TO TOP BUTTON ===
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// === ANIMATED COUNTERS ===
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let hasRun = false;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasRun) {
                hasRun = true;
                counters.forEach(counter => {
                    animateCounter(counter);
                });
            }
        });
    }, {
        threshold: 0.5
    });
    
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        observer.observe(heroStats);
    }
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60 FPS
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// === SMOOTH SCROLL FOR ANCHOR LINKS ===
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for navbar height
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// === PARALLAX EFFECT FOR HERO ===
function initParallax() {
    const heroSection = document.querySelector('.hero-section');
    const floatingCards = document.querySelectorAll('.floating-card');
    const phoneMockup = document.querySelector('.phone-mockup');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        if (heroSection && scrolled < window.innerHeight) {
            // Parallax for floating cards
            floatingCards.forEach((card, index) => {
                const speed = 0.3 + (index * 0.1);
                card.style.transform = `translateY(${scrolled * speed}px)`;
            });
            
            // Parallax for phone mockup
            if (phoneMockup) {
                phoneMockup.style.transform = `translate(-50%, -50%) scale(${1 + scrolled * 0.0002})`;
                phoneMockup.style.opacity = 1 - (scrolled * 0.002);
            }
        }
    });
}

// === FEATURE CARDS HOVER EFFECT ===
document.addEventListener('DOMContentLoaded', function() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
        
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
});

// === TIMELINE ANIMATION ON SCROLL ===
document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(50px)';
        item.style.transition = 'all 0.8s ease';
        observer.observe(item);
    });
});

// === GRADIENT TEXT ANIMATION ===
document.addEventListener('DOMContentLoaded', function() {
    const gradientText = document.querySelector('.gradient-text');
    
    if (gradientText) {
        let hue = 120; // Starting green
        
        setInterval(() => {
            hue = (hue + 1) % 360;
            const hue2 = (hue + 30) % 360;
            gradientText.style.background = `linear-gradient(135deg, hsl(${hue}, 70%, 50%) 0%, hsl(${hue2}, 70%, 60%) 100%)`;
            gradientText.style.webkitBackgroundClip = 'text';
            gradientText.style.webkitTextFillColor = 'transparent';
            gradientText.style.backgroundClip = 'text';
        }, 50);
    }
});

// === FLOATING ANIMATION FOR CARDS ===
document.addEventListener('DOMContentLoaded', function() {
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        // Add random slight rotation on hover
        card.addEventListener('mouseenter', function() {
            const randomRotate = (Math.random() - 0.5) * 10;
            this.style.transform = `translateY(-15px) rotate(${randomRotate}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotate(0deg)';
        });
    });
});

// === BUTTON RIPPLE EFFECT ===
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn-hero, .btn-cta');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add ripple styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .btn-hero, .btn-cta {
            position: relative;
            overflow: hidden;
        }
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-animation 0.6s ease-out;
            pointer-events: none;
        }
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
});

// === LAZY LOADING FOR IMAGES ===
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
});

// === NAVBAR ACTIVE LINK HIGHLIGHT ===
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});

// === MOUSE TRAIL EFFECT (Optional - Fancy!) ===
document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('.hero-section');
    let trails = [];
    const maxTrails = 20;
    
    if (heroSection) {
        heroSection.addEventListener('mousemove', function(e) {
            const trail = document.createElement('div');
            trail.className = 'mouse-trail';
            trail.style.left = e.pageX + 'px';
            trail.style.top = e.pageY + 'px';
            
            document.body.appendChild(trail);
            trails.push(trail);
            
            if (trails.length > maxTrails) {
                const oldTrail = trails.shift();
                oldTrail.remove();
            }
            
            setTimeout(() => {
                trail.remove();
                trails = trails.filter(t => t !== trail);
            }, 1000);
        });
        
        // Add trail styles
        const style = document.createElement('style');
        style.textContent = `
            .mouse-trail {
                position: absolute;
                width: 8px;
                height: 8px;
                background: rgba(16, 185, 129, 0.6);
                border-radius: 50%;
                pointer-events: none;
                animation: trail-fade 1s ease-out forwards;
                z-index: 1;
            }
            @keyframes trail-fade {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
});

// === CONSOLE EASTER EGG ===
console.log('%c🍎 FET - Food Expiry Tracker', 'color: #10b981; font-size: 20px; font-weight: bold;');
console.log('%cStop Food Waste, Start Smart Living', 'color: #64748b; font-size: 14px;');
console.log('%c💻 Developed by Kelompok 5', 'color: #10b981; font-size: 12px;');
console.log('%c📧 Want to hire us? Contact us! 🚀', 'color: #fbbf24; font-size: 12px;');

// === PERFORMANCE OPTIMIZATION ===
// Debounce function for scroll events
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

// Apply debounce to scroll-heavy functions
window.addEventListener('scroll', debounce(function() {
    // Your scroll functions here
}, 10));

// === ACCESSIBILITY IMPROVEMENTS ===
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard navigation support
    const focusableElements = document.querySelectorAll('a, button, input, [tabindex]:not([tabindex="-1"])');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #10b981';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
        });
    });
});

// === PRELOADER (Optional) ===
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }
});

// === EXPORT FOR TESTING ===
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initNavbar,
        initBackToTop,
        initCounters,
        initSmoothScroll,
        initParallax
    };
}