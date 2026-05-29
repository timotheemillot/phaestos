const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

if (mobileMenuToggle && mobileMenu) {
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

document.querySelectorAll('[data-submenu-toggle]').forEach((toggle) => {
    toggle.addEventListener('click', () => {
        const targetId = toggle.getAttribute('data-submenu-toggle');
        const submenu = document.getElementById(targetId);
        const expanded = toggle.getAttribute('aria-expanded') === 'true';

        if (!submenu) {
            return;
        }

        toggle.setAttribute('aria-expanded', String(!expanded));
        submenu.classList.toggle('hidden');
    });
});

const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.slide-indicator');

if (slides.length > 0 && indicators.length > 0) {
    let currentSlide = 0;
    const slideInterval = 5000;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        indicators.forEach((indicator, i) => {
            indicator.style.opacity = i === index ? '1' : '0.5';
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    setInterval(nextSlide, slideInterval);

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
        });
    });
}

const revealElements = document.querySelectorAll('.scroll-reveal');

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;

    revealElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            element.classList.add('revealed');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll();

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
});

const nav = document.querySelector('nav');
if (nav) {
    window.addEventListener('scroll', () => {
        nav.style.backgroundColor = window.scrollY > 50
            ? 'rgba(17, 24, 39, 0.98)'
            : 'rgba(17, 24, 39, 0.95)';
    });
}
