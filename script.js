/* HendriHub Global Logic v2.0
   Fixed: Cursor Performance, Menu Animation, Error Handling
*/

// --- GLOBAL STATE ---
let cursorX = 0;
let cursorY = 0;
let isHovering = false;

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

// Initialize cursor hover effects
function initCursorHover() {
    // Remove existing listeners first (prevent duplicates)
    const interactiveElements = document.querySelectorAll('a, button, .cursor-pointer, .bento-card, input, textarea, select');
    
    interactiveElements.forEach(el => {
        // Remove old listeners by cloning (clean slate)
        const newEl = el.cloneNode(true);
        el.parentNode?.replaceChild(newEl, el);
    });
    
    // Re-query after cloning
    const elements = document.querySelectorAll('a, button, .cursor-pointer, .bento-card, input, textarea, select');
    
    elements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            body.classList.add('cursor-hover');
            isHovering = true;
        });
        
        el.addEventListener('mouseleave', () => {
            body.classList.remove('cursor-hover');
            isHovering = false;
        });
    });
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
    
    if (!menu || !l1 || !l2) {
        console.warn('Menu elements not found');
        return;
    }

    const isOpen = menu.style.display === 'flex';
    
    if (!isOpen) {
        // Open menu
        menu.style.display = 'flex';
        // Force reflow for animation
        void menu.offsetWidth;
        menu.classList.add('active');
        
        // Animate hamburger to X
        l1.style.transform = 'translateY(5px) rotate(45deg)';
        l2.style.transform = 'translateY(-5px) rotate(-45deg)';
        
        // Lock scroll
        body.style.overflow = 'hidden';
        
        // Re-init cursor hover for menu items
        setTimeout(() => {
            initCursorHover();
        }, 100);
    } else {
        // Close menu
        menu.classList.remove('active');
        
        // Reset hamburger
        l1.style.transform = 'none';
        l2.style.transform = 'none';
        
        // Unlock scroll after animation
        setTimeout(() => {
            menu.style.display = 'none';
            body.style.overflow = 'auto';
        }, 300); // Match CSS transition duration
    }
}

// Close menu when clicking menu links
document.addEventListener('DOMContentLoaded', () => {
    const menuLinks = document.querySelectorAll('#menuOverlay a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Small delay for better UX
            setTimeout(toggleMenu, 200);
        });
    });
});

// --- 3. THEME SWITCHER (ENHANCED) ---

function setTheme(color) {
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

// Show notification when theme changes
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
            z-index: 10001;
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

// --- 4. CLOCK (IF ELEMENT EXISTS) ---

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

// --- 5. SCROLL PROGRESS BAR ---

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

// --- 6. UTILITIES ---

// Copy email to clipboard with improved feedback
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
    body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyNotification('Email Copied!', true);
    } catch (err) {
        console.error('Fallback copy failed:', err);
        showCopyNotification('Copy Failed', false);
    }
    
    body.removeChild(textArea);
}

// Show copy notification
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
            z-index: 10001;
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
    
    // Auto remove
    setTimeout(() => {
        const toastEl = toast.querySelector('div');
        if (toastEl) {
            toastEl.style.transform = 'translateX(-50%) translateY(100px)';
        }
        setTimeout(() => toast.remove(), 400);
    }, 2000);
}

// Smooth scroll to top
function scrollToTop() {
    window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
    });
}

// --- 7. PERFORMANCE MONITORING (OPTIONAL DEV TOOL) ---

// Log performance metrics in development
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('load', () => {
        if (window.performance && window.performance.timing) {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`%c⚡ Page Load Time: ${pageLoadTime}ms`, 'color: #3b82f6; font-weight: bold;');
        }
    });
}

// --- 8. ERROR HANDLING ---

// Global error handler (optional, for debugging)
window.addEventListener('error', (event) => {
    console.error('Global error caught:', event.error);
    // You can send to analytics here if needed
});

// --- 9. EXPORT FOR MODULE USAGE (IF NEEDED) ---

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        toggleMenu,
        setTheme,
        copyEmail,
        scrollToTop,
        initCursorHover
    };
}
