/* HendriHub Global Logic v1.0
   Combined: Cursor, Menu, Clock, Scroll, & Utilities
*/

// --- INITIAL SETUP & CURSOR ---
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    if(dot && ring) {
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
        
        ring.style.left = `${x}px`;
        ring.style.top = `${y}px`;
    }

    // Efek Glow kartu bento (tetap berfungsi)
    const cards = document.querySelectorAll('.bento-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${x - rect.left}px`);
        card.style.setProperty('--mouse-y', `${y - rect.top}px`);
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

// --- MENU TOGGLE ---
function toggleMenu() {
    const menu = document.getElementById('menuOverlay');
    const l1 = document.getElementById('line1');
    const l2 = document.getElementById('line2');
    
    if (!menu) return;

    // Cek kondisi asli di layar, bukan berdasarkan variabel
    const isHidden = window.getComputedStyle(menu).display === 'none';

    if (isHidden) {
        // PROSES MEMBUKA
        menu.style.display = 'flex';
        if(l1 && l2) {
            l1.style.transform = 'translateY(5px) rotate(45deg)'; 
            l2.style.transform = 'translateY(-5px) rotate(-45deg)';
        }
        document.body.style.overflow = 'hidden';
    } else {
        // PROSES MENUTUP
        menu.style.display = 'none';
        if(l1 && l2) {
            l1.style.transform = 'none'; 
            l2.style.transform = 'none';
        }
        document.body.style.overflow = 'auto';
    }
}

// --- GANTI WARNA BACKGROUND ---
function setTheme(color) {
    // 1. Terapkan ke halaman saat ini
    document.documentElement.style.setProperty('--accent-color', color);
    // 2. Simpan di memori browser
    localStorage.setItem('selectedTheme', color);
}

// OTOMATIS: Dijalankan setiap kali halaman apa pun dibuka
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('selectedTheme');
    if (savedTheme) {
        document.documentElement.style.setProperty('--accent-color', savedTheme);
    }
});

// --- JAM & SCROLL PROGRESS ---
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

// --- UTILITIES (COPY EMAIL & SCROLL TOP) ---
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
