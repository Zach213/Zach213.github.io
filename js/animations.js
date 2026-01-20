// Scroll Progress Indicator
const createScrollProgress = () => {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-progress';
    document.body.appendChild(indicator);

    window.addEventListener('scroll', () => {
        const winScroll = document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        indicator.style.transform = `scaleX(${scrolled / 100})`;
    });
};

// Enhanced Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeInUp');
            entry.target.style.opacity = '1';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Parallax Effect
const createParallax = () => {
    window.addEventListener('scroll', () => {
        const parallaxElements = document.querySelectorAll('.project-card');
        parallaxElements.forEach(element => {
            const speed = 0.05;
            const rect = element.getBoundingClientRect();
            const scrolled = window.pageYOffset;
            
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const distance = (rect.top - window.innerHeight) * speed;
                element.style.transform = `translateY(${distance}px)`;
            }
        });
    });
};

// Add mouse parallax effect to hero section
const addMouseParallax = () => {
    const hero = document.querySelector('.hero');
    const content = document.querySelector('.hero-content');
    const profileImg = document.querySelector('.profile-img');

    hero.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        content.style.transform = `translate(${x * 20 - 10}px, ${y * 20 - 10}px)`;
        profileImg.style.transform = `translate(${x * 40 - 20}px, ${y * 40 - 20}px)`;
    });

    hero.addEventListener('mouseleave', () => {
        content.style.transform = 'translate(0, 0)';
        profileImg.style.transform = 'translate(0, 0)';
    });
};

// Add magnetic effect to project cards
const addMagneticEffect = () => {
    const cards = document.querySelectorAll('.project-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            card.style.transform = `perspective(1000px) rotateX(${deltaY * 10}deg) rotateY(${deltaX * 10}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
};

// Add scroll-triggered animations
const addScrollAnimations = () => {
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        section.style.opacity = '0';
        section.style.transform = 'translateY(50px)';
        section.style.transition = 'all 0.6s ease-out';
        
        observer.observe(section);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    createScrollProgress();
    createParallax();
    addMouseParallax();
    addMagneticEffect();
    addScrollAnimations();

    // Animate elements
    const animateElements = [
        '.project-card',
        '.section-header',
        '.project-detail-box',
        '.hero-content'
    ];

    animateElements.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
            element.style.opacity = '0';
            observer.observe(element);
        });
    });
}); 