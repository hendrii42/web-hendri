/* HendriHub Global Logic v3.0
   Fixed: Event Delegation, Menu Logic, Z-index, Performance
*/

// --- GLOBAL STATE ---
let cursorX = 0;
let cursorY = 0;
let isHovering = false;
let cursorHoverInitialized = false;

// --- DOM ELEMENTS (Cached for performance) ---
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
const body = document.body;

// --- 1. CURSOR SYSTEM (OPTIMIZED) ---

// Track mouse position (throttled with RAF)
let rafId = null;

document.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    
    // Cancel previous RAF if still pending
    if (rafId) {
        cancelAnimationFrame(rafId);
    }
    
    // Update cursor position with RAF for smooth performance
    rafId = requestAnimationFrame(() => {
        updateCursorPosition();
        updateBentoGlow(e.clientX, e.clientY);
    });
});

// Update cursor elements position
function updateCursorPosition() {
    if (dot && ring) {
        dot.style.left = `${cursorX}px`;
        dot.style.top = `${cursorY}px`;
        
        ring.style.left = `${cursorX}px`;
        ring.style.top = `${cursorY}px`;
    }
}

// Update bento card glow effect
function updateBentoGlow(mouseX, mouseY) {
    const cards = document.querySelectorAll('.bento-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = mouseX - rect.left;
        const y = mouseY - rect.top;
        
        // Only update if mouse is near the card (performance optimization)
        if (x >= -100 && x <= rect.width + 100 && y >= -100 && y <= rect.height + 100) {
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        }
    });
}

// Initialize cursor hover effects (FIXED: Event Delegation)
function initCursorHover() {
    // Prevent double initialization
    if (cursorHoverInitialized) return;
    cursorHoverInitialized = true;
    
    // Use event delegation (better performance + no duplicates + safe)
    document.addEventListener('mouseenter', (e) => {
        const target = e.target.closest('a, button, .cursor-pointer, .bento-card, input, textarea, select');
        if (target) {
            body.classList.add('cursor-hover');
            isHovering = true;
        }
    }, true); // Use capture phase
    
    document.addEventListener('mouseleave', (e) => {
        const target = e.target.closest('a, button, .cursor-pointer, .bento-card, input, textarea, select');
        if (target) {
            body.classList.remove('cursor-hover');
            isHovering = false;
        }
    }, true); // Use capture phase
}

// Initialize on page load
if (typeof window !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCursorHover);
    } else {
        initCursorHover();
    }
}

// --- 2. MENU TOGGLE (IMPROVED WITH ANIMATION) ---

function toggleMenu() {
    const menu = document.getElementById('menuOverlay');
    const l1 = document.getElementById('line1');
    const l2 = document.getElementById('line2');
    
    if (!menu) {
        console.warn('Menu overlay not found');
        return;
    }
    
    if (menu.style.display === 'none' || !menu.classList.contains('active')) {
        // Open
        menu.style.display = 'flex';
        void menu.offsetWidth; // Force reflow for CSS transition
        menu.classList.add('active');
        document.body.style.overflow = 'hidden'; // Disable scroll
        
        // Animate hamburger to X
        if (l1 && l2) {
            l1.style.transform = 'rotate(45deg) translateY(4px)';
            l2.style.transform = 'rotate(-45deg) translateY(-4px)';
        }
        
        // Re-init cursor hover for menu items (safe now with event delegation)
        setTimeout(() => { if (window.initCursorHover) initCursorHover(); }, 100);
    } else {
        // Close
        menu.classList.remove('active');
        document.body.style.overflow = 'auto'; // Enable scroll
        
        // Animate X back to hamburger
        if (l1 && l2) {
            l1.style.transform = '';
            l2.style.transform = '';
        }
        
        setTimeout(() => { menu.style.display = 'none'; }, 300);
    }
}

// Close menu when clicking menu links (IMPROVED: Smart detection)
document.addEventListener('DOMContentLoaded', () => {
    const menuLinks = document.querySelectorAll('#menuOverlay a');
    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Don't close if external link (opens in new tab)
            if (link.target === '_blank') {
                return;
            }
            
            // Don't close if anchor link on same page (smooth scroll instead)
            if (link.href.includes('#') && link.pathname === window.location.pathname) {
                e.preventDefault();
                const targetId = link.href.split('#')[1];
                const targetEl = document.getElementById(targetId);
                
                if (targetEl) {
                    toggleMenu(); // Close menu first
                    setTimeout(() => {
                        targetEl.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 300);
                }
                return;
            }
            
            // For normal navigation, close with small delay for better UX
            setTimeout(toggleMenu, 200);
        });
    });
});

// --- 3. CLOSE MENU WITH ESC KEY ---
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const menu = document.getElementById('menuOverlay');
        if (menu && menu.classList.contains('active')) {
            toggleMenu();
        }
    }
});

// --- 4. THEME SWITCHER (ENHANCED) ---

function setTheme(color) {
    // Validate color input
    if (!color || typeof color !== 'string') {
        console.error('Invalid color provided');
        return;
    }
    
    // Apply to current page
    document.documentElement.style.setProperty('--accent-color', color);
    
    // Save to localStorage
    try {
        localStorage.setItem('selectedTheme', color);
    } catch (e) {
        console.warn('localStorage not available:', e);
    }
    
    // Visual feedback
    showThemeChangeNotification(color);
}

// Show notification when theme changes (FIXED: Z-index)
function showThemeChangeNotification(color) {
    // Remove existing notification if any
    const existing = document.getElementById('theme-notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.id = 'theme-notification';
    notification.innerHTML = `
        <div style="
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: ${color};
            color: white;
            padding: 12px 24px;
            border-radius: 50px;
            font-size: 11px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            z-index: 9500;
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        ">
            <i class="fa-solid fa-palette" style="margin-right: 8px;"></i>
            Theme Updated
        </div>
    `;
    
    body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        const notifEl = notification.querySelector('div');
        if (notifEl) {
            notifEl.style.transform = 'translateX(-50%) translateY(0)';
        }
    });
    
    // Auto remove after 2 seconds
    setTimeout(() => {
        const notifEl = notification.querySelector('div');
        if (notifEl) {
            notifEl.style.transform = 'translateX(-50%) translateY(100px)';
        }
        setTimeout(() => notification.remove(), 400);
    }, 2000);
}

// Auto-load saved theme on page load
window.addEventListener('DOMContentLoaded', () => {
    try {
        const savedTheme = localStorage.getItem('selectedTheme');
        if (savedTheme) {
            document.documentElement.style.setProperty('--accent-color', savedTheme);
        }
    } catch (e) {
        console.warn('localStorage not available:', e);
    }
});

// --- 5. CLOCK (IF ELEMENT EXISTS) ---

function updateClock() {
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        const now = new Date();
        const time = now.toLocaleTimeString('en-GB', { 
            hour: '2-digit', 
            minute: '2-digit', 
            timeZone: 'Asia/Jakarta' 
        });
        clockElement.textContent = time;
    }
}

// Only start clock if element exists
if (document.getElementById('clock')) {
    setInterval(updateClock, 1000);
    updateClock();
}

// --- 6. SCROLL PROGRESS BAR (THROTTLED) ---

let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            updateScrollProgress();
            ticking = false;
        });
        ticking = true;
    }
});

function updateScrollProgress() {
    const scrollBar = document.getElementById("scroll-progress");
    if (scrollBar) {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
        scrollBar.style.width = scrolled + "%";
    }
}

// --- 7. SMOOTH SCROLL UTILITIES ---

// Scroll to services section (called from index.html button)
function scrollToServices() {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
        servicesSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Scroll to top (called from footer button)
function scrollToTop() {
    window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
    });
}

// Generic smooth scroll to any element
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// --- 8. COPY EMAIL TO CLIPBOARD ---

// Copy email to clipboard with improved feedback (FIXED: Z-index)
function copyEmail(email) {
    if (!email) {
        console.error('No email provided');
        return;
    }
    
    // Modern clipboard API
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email).then(() => {
            showCopyNotification('Email Copied!', true);
        }).catch(err => {
            console.error('Clipboard error:', err);
            fallbackCopyEmail(email);
        });
    } else {
        // Fallback for older browsers
        fallbackCopyEmail(email);
    }
}

// Fallback copy method
function fallbackCopyEmail(email) {
    const textArea = document.createElement('textarea');
    textArea.value = email;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.opacity = '0';
    body.appendChild(textArea);
    textArea.select();
    textArea.setSelectionRange(0, 99999); // For mobile
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopyNotification('Email Copied!', true);
        } else {
            showCopyNotification('Copy Failed', false);
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
        showCopyNotification('Copy Failed', false);
    }
    
    body.removeChild(textArea);
}

// Show copy notification (FIXED: Z-index below cursor)
function showCopyNotification(message, success) {
    // Remove existing notification
    const existing = document.getElementById('copy-toast');
    if (existing) {
        existing.remove();
    }
    
    const toast = document.createElement('div');
    toast.id = 'copy-toast';
    toast.innerHTML = `
        <div style="
            position: fixed;
            bottom: 40px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: ${success ? 'var(--accent-color)' : '#ef4444'};
            color: white;
            padding: 16px 32px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            z-index: 9500;
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 10px 40px rgba(0,0,0,0.4);
            backdrop-filter: blur(10px);
        ">
            <i class="fa-solid fa-${success ? 'check' : 'xmark'}" style="margin-right: 8px;"></i>
            ${message}
        </div>
    `;
    
    body.appendChild(toast);
    
    // Animate in
    requestAnimationFrame(() => {
        const toastEl = toast.querySelector('div');
        if (toastEl) {
            toastEl.style.transform = 'translateX(-50%) translateY(0)';
        }
    });
    
    // Auto remove after 2 seconds
    setTimeout(() => {
        const toastEl = toast.querySelector('div');
        if (toastEl) {
            toastEl.style.transform = 'translateX(-50%) translateY(100px)';
        }
        setTimeout(() => toast.remove(), 400);
    }, 2000);
}

// --- 9. PERFORMANCE MONITORING (DEV ONLY) ---

// Log performance metrics in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('load', () => {
        if (window.performance && window.performance.timing) {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`%c⚡ Page Load Time: ${pageLoadTime}ms`, 'color: #3b82f6; font-weight: bold; font-size: 14px;');
            
            // Additional metrics
            const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.navigationStart;
            console.log(`%c📄 DOM Content Loaded: ${domContentLoaded}ms`, 'color: #10b981; font-weight: bold;');
        }
    });
}

// --- 10. ERROR HANDLING ---

// Global error handler (optional, for debugging)
window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
    // You can send to analytics here if needed
    // Example: sendToAnalytics('error', event.error);
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    // You can send to analytics here if needed
});

// --- 11. LAZY LOAD IMAGES (OPTIONAL ENHANCEMENT) ---

// Add 'loaded' class when lazy images finish loading
if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.addEventListener('load', () => {
                    img.classList.add('loaded');
                });
                observer.unobserve(img);
            }
        });
    });
    
    lazyImages.forEach(img => imageObserver.observe(img));
}

// --- 12. PREVENT ACCIDENTAL DOUBLE-CLICK ZOOM (MOBILE) ---

// Prevent double-tap zoom on mobile (better UX for buttons)
let lastTouchEnd = 0;
document.addEventListener('touchend', (e) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
        e.preventDefault();
    }
    lastTouchEnd = now;
}, false);

// --- 13. EXPORT FOR MODULE USAGE (IF NEEDED) ---

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleMenu,
        setTheme,
        copyEmail,
        scrollToTop,
        scrollToServices,
        scrollToElement,
        initCursorHover
    };
}

// --- 14. INITIALIZATION LOG ---

console.log('%cHendriHub v3.0 Loaded ✓', 'color: #3b82f6; font-weight: bold; font-size: 16px; font-family: monospace;');
console.log('%cLogic & Creative', 'color: #8b5cf6; font-style: italic;');
