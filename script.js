/* HendriHub Global Logic v1.0
   Combined: Cursor, Menu, Clock, Scroll, & Utilities
*/

// --- 1. INITIAL SETUP & CURSOR ---
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    // Gunakan requestAnimationFrame agar update posisi sinkron dengan layar
    requestAnimationFrame(() => {
        if(dot && ring) {
            // translate(-50%, -50%) memastikan titik tengah kursor pas di ujung mouse
            dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
            ring.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        }

        // Efek Glow kartu bento
        const cards = document.querySelectorAll('.bento-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${x - rect.left}px`);
            card.style.setProperty('--mouse-y', `${y - rect.top}px`);
        });
    });
});

// Efek Hover Kursor Global
function initCursorHover() {
    const interactiveElements = document.querySelectorAll('a, button, .cursor-pointer, .bento-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
}
initCursorHover();

// --- 2. MENU TOGGLE ---
let menuOpen = false;
function toggleMenu() {
    const menu = document.getElementById('menuOverlay');
    const l1 = document.getElementById('line1');
    const l2 = document.getElementById('line2');
    if (!menu) return;

    menuOpen = !menuOpen;
    if (menuOpen) {
        menu.style.display = 'flex';
        if(l1 && l2) {
            l1.style.transform = 'translateY(5px) rotate(45deg)'; 
            l2.style.transform = 'translateY(-5px) rotate(-45deg)';
        }
        document.body.style.overflow = 'hidden';
    } else {
        menu.style.display = 'none';
        if(l1 && l2) {
            l1.style.transform = 'none'; 
            l2.style.transform = 'none';
        }
        document.body.style.overflow = 'auto';
    }
}

// --- 3. JAM & SCROLL PROGRESS ---
function updateClock() {
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        const now = new Date();
        clockElement.textContent = now.toLocaleTimeString('en-GB', { 
            hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' 
        });
    }
}
setInterval(updateClock, 1000);
updateClock();

window.addEventListener('scroll', () => {
    const scrollBar = document.getElementById("scroll-progress");
    if (scrollBar) {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollBar.style.width = scrolled + "%";
    }
});

// --- 4. UTILITIES (COPY EMAIL & SCROLL TOP) ---
function copyEmail(email) {
    navigator.clipboard.writeText(email).then(() => {
        const toast = document.createElement('div');
        toast.innerHTML = `<div class="bg-blue-600/90 backdrop-blur-md text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-2xl border border-white/10">
                             <i class="fa-solid fa-check mr-2"></i> Email Copied!
                           </div>`;
        toast.className = "fixed bottom-10 left-1/2 -translate-x-1/2 z-[5000] animate-bounce";
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = '0.5s';
            setTimeout(() => toast.remove(), 500);
        }, 2000);
    });
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
