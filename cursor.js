/**
 * HENDRIHUB - CORE CURSOR & INTERACTION LOGIC
 */

// 1. CEK PERANGKAT (Hanya jalankan jika layar > 1024px)
if (window.innerWidth > 1024) {
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');

    // Pastikan elemen kursor ada sebelum lanjut
    if (dot && ring) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX;
            const y = e.clientY;
            
            // Animasi Kursor & Efek Glow Bento dalam satu frame agar sinkron
            window.requestAnimationFrame(() => {
                // Pergerakan Kursor
                dot.style.left = `${x}px`;
                dot.style.top = `${y}px`;
                ring.style.left = `${x}px`;
                ring.style.top = `${y}px`;

                // Logika Glow Kartu Bento
                document.querySelectorAll('.bento-card').forEach(card => {
                    const rect = card.getBoundingClientRect();
                    card.style.setProperty('--mouse-x', `${x - rect.left}px`);
                    card.style.setProperty('--mouse-y', `${y - rect.top}px`);
                });
            });
        });

        // 2. CLASS HOVER (Memperbesar kursor saat menyentuh link)
        document.querySelectorAll('a, button, .bento-card, i').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
        });

        // 3. PARALLAX GAMBAR (Tilt effect)
        document.querySelectorAll('.bento-card img').forEach(img => {
            const card = img.closest('.bento-card');
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                
                img.style.transform = `scale(1.1) translate(${(x - 0.5) * 15}px, ${(y - 0.5) * 15}px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                img.style.transform = `scale(1) translate(0, 0)`;
            });
        });
    }
} else {
    // Jika di HP, pastikan elemen kursor benar-benar tidak terlihat
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if(dot) dot.style.display = 'none';
    if(ring) ring.style.display = 'none';
}
