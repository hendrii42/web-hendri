const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');

document.addEventListener('mousemove', (e) => {
    const x = e.clientX;
    const y = e.clientY;
    
    // Gunakan requestAnimationFrame untuk performa yang lebih enteng
    window.requestAnimationFrame(() => {
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
        ring.style.left = `${x}px`;
        ring.style.top = `${y}px`;
    });
});

// Menambah class saat hover ke elemen interaktif
document.querySelectorAll('a, button, .bento-card, i').forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
    });
    el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
    });
});
