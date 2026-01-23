/* HendriHub Global Script: Kursor, Menu, Jam, & Fitur Lainnya */

// 1. LOGIKA KURSOR (Pindahan dari cursor.js)
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    // Gerakan kursor
    if(dot && ring) {
        dot.style.transform = `translate(${x}px, ${y}px)`;
        ring.style.transform = `translate(${x}px, ${y}px)`;
    }

    // Update variable untuk efek Glow di kartu Bento
    const cards = document.querySelectorAll('.bento-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${x - rect.left}px`);
        card.style.setProperty('--mouse-y', `${y - rect.top}px`);
    });
});

// Efek Hover Kursor pada Link/Tombol
document.querySelectorAll('a, button, .cursor-pointer').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

// 2. LOGIKA MENU TOGGLE
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

// 3. LOGIKA JAM & UTILITY LAINNYA
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

// Fungsi Copy Email & Scroll Top (Seperti yang kita bahas sebelumnya)
function copyEmail(email) { /* ... isi fungsi ... */ }
function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }
