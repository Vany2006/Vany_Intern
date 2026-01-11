// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const contactForm = document.getElementById('contactForm');

// Toggle menu mobile
if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        // Toggle overflow pada body saat menu dibuka
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Tutup menu saat klik link
    document.querySelectorAll('.nav-menu a').forEach(n => {
        n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Tutup menu saat klik di luar
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Filter portofolio dengan optimasi
if (filterButtons.length && portfolioItems.length) {
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Hapus active class dari semua button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Tambah active class ke button yang diklik
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            portfolioItems.forEach(item => {
                const shouldShow = filterValue === 'all' || item.classList.contains(filterValue);
                
                if (shouldShow) {
                    item.style.display = 'block';
                    // Gunakan requestAnimationFrame untuk animasi yang lebih smooth
                    requestAnimationFrame(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    });
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    // Tunggu animasi selesai sebelum hide
                    setTimeout(() => {
                        if (item.style.opacity === '0') {
                            item.style.display = 'none';
                        }
                    }, 300);
                }
            });
        });
    });
}

// Form submission dengan validasi
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validasi sederhana
        const name = contactForm.querySelector('input[name="name"]');
        const email = contactForm.querySelector('input[name="email"]');
        const message = contactForm.querySelector('textarea[name="message"]');
        
        let isValid = true;
        
        // Reset error states
        [name, email, message].forEach(field => {
            if (field) field.style.borderColor = '';
        });
        
        // Validasi field
        if (name && !name.value.trim()) {
            name.style.borderColor = 'red';
            isValid = false;
        }
        
        if (email && (!email.value.trim() || !isValidEmail(email.value))) {
            email.style.borderColor = 'red';
            isValid = false;
        }
        
        if (message && !message.value.trim()) {
            message.style.borderColor = 'red';
            isValid = false;
        }
        
        if (isValid) {
            // Tampilkan loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Mengirim...';
            submitBtn.disabled = true;
            
            // Simulasi pengiriman (ganti dengan fetch/axios sesungguhnya)
            setTimeout(() => {
                alert('Terima kasih! Pesan Anda telah dikirim. Saya akan membalas segera.');
                contactForm.reset();
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1500);
        } else {
            alert('Harap isi semua field dengan benar!');
        }
    });
    
    // Fungsi validasi email
    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
}

// Smooth scrolling untuk link anchor dengan offset header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        
        // Skip jika hanya tanda #
        if (targetId === '#' || targetId === '#!') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            
            // Hitung offset berdasarkan tinggi header
            const headerHeight = document.querySelector('header')?.offsetHeight || 80;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update URL tanpa reload
            history.pushState(null, null, targetId);
        }
    });
});

// Close portfolio filter items dengan Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});

// Debounce function untuk performa
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

// Optimasi resize event
window.addEventListener('resize', debounce(() => {
    if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
    }
}, 250));