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

// Tambahkan efek tilt sedikit pada gambar saat hover
document.querySelectorAll('.bento-card img').forEach(img => {
    const card = img.closest('.bento-card');
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        // Geser gambar sedikit berlawanan arah kursor
        img.style.transform = `scale(1.1) translate(${(x - 0.5) * 10}px, ${(y - 0.5) * 10}px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        img.style.transform = `scale(1) translate(0, 0)`;
    });
});

document.addEventListener('mousemove', (e) => {
    // Kode kursor yang sudah ada...
    
    // Tambahan untuk efek glow kartu bento
    document.querySelectorAll('.bento-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});
