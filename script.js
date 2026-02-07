// ===== Mosbiic Website JavaScript =====

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    initCursorGlow();
    initNavigation();
    initScrollAnimations();
    initSmoothScroll();
});

// ===== Cursor Glow Effect =====
function initCursorGlow() {
    const cursorGlow = document.querySelector('.cursor-glow');
    if (!cursorGlow || window.matchMedia('(pointer: coarse)').matches) return;

    let mouseX = 0, mouseY = 0;
    let currentX = 0, currentY = 0;
    let rafId = null;
    let isActive = false;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        if (!isActive) {
            isActive = true;
            animate();
        }
    });

    function animate() {
        // Smooth follow with easing
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;
        
        cursorGlow.style.left = currentX + 'px';
        cursorGlow.style.top = currentY + 'px';
        
        rafId = requestAnimationFrame(animate);
    }

    // Pause animation when tab is hidden
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(rafId);
            isActive = false;
        }
    });
}

// ===== Navigation =====
function initNavigation() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add/remove scrolled class
        if (currentScroll > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }, { passive: true });
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.about-card, .connect-card, .origin-text');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add stagger delay based on data attribute
                const delay = entry.target.dataset.delay || 0;
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // Parallax effect for orbs
    const orbs = document.querySelectorAll('.gradient-orb');
    
    if (orbs.length && !window.matchMedia('(pointer: coarse)').matches) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            orbs.forEach((orb, index) => {
                const speed = 0.2 + (index * 0.1);
                const yPos = -(scrolled * speed);
                orb.style.transform = `translateY(${yPos}px)`;
            });
        }, { passive: true });
    }
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ===== Emoji Burst Effect =====
function createEmojiBurst(x, y) {
    const emojis = ['✨', '🐕', '💜', '🌟', '🎉'];
    const container = document.body;
    
    for (let i = 0; i < 8; i++) {
        const emoji = document.createElement('span');
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            font-size: 1.5rem;
            pointer-events: none;
            z-index: 9999;
            animation: emoji-burst 1s ease-out forwards;
        `;
        
        // Random direction
        const angle = (Math.PI * 2 * i) / 8;
        const velocity = 50 + Math.random() * 50;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        
        emoji.style.setProperty('--tx', `${tx}px`);
        emoji.style.setProperty('--ty', `${ty}px`);
        
        container.appendChild(emoji);
        
        setTimeout(() => emoji.remove(), 1000);
    }
}

// Add CSS for emoji burst
const burstStyle = document.createElement('style');
burstStyle.textContent = `
    @keyframes emoji-burst {
        0% {
            transform: translate(0, 0) scale(0);
            opacity: 1;
        }
        50% {
            transform: translate(var(--tx), var(--ty)) scale(1.2);
            opacity: 1;
        }
        100% {
            transform: translate(var(--tx), calc(var(--ty) + 20px)) scale(0.5);
            opacity: 0;
        }
    }
`;
document.head.appendChild(burstStyle);

// Add click effect to hero emoji
document.addEventListener('DOMContentLoaded', () => {
    const heroEmoji = document.querySelector('.emoji-bounce');
    if (heroEmoji) {
        heroEmoji.style.cursor = 'pointer';
        heroEmoji.addEventListener('click', (e) => {
            const rect = heroEmoji.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            createEmojiBurst(x, y);
        });
    }
});

// ===== Typewriter Effect for Hero (optional enhancement) =====
function initTypewriter() {
    const titleElement = document.querySelector('.title-name');
    if (!titleElement) return;
    
    const text = titleElement.textContent;
    titleElement.textContent = '';
    titleElement.style.opacity = '1';
    
    let i = 0;
    const typeInterval = setInterval(() => {
        if (i < text.length) {
            titleElement.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(typeInterval);
        }
    }, 100);
}

// ===== Prefers Reduced Motion =====
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--transition-smooth', 'none');
    document.querySelectorAll('.gradient-orb, .emoji-bounce, .paw').forEach(el => {
        el.style.animation = 'none';
    });
}
