/* Le menu (ouverture mobile, sous-menus) est géré dans components.js */

/* ---------- Slider de l'accueil ----------
   Le script ne gère que la classe "active".
   Le choix de l'image ordi / mobile est fait uniquement en CSS
   (variables --img-desktop / --img-mobile + media query). */
const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.slide-indicator');

if (slides.length > 0 && indicators.length > 0) {
    let currentSlide = 0;
    let timer = null;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const slideInterval = 5000;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        indicators.forEach((indicator, i) => {
            indicator.style.opacity = i === index ? '1' : '0.5';
            if (i === index) {
                indicator.setAttribute('aria-current', 'true');
            } else {
                indicator.removeAttribute('aria-current');
            }
        });
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    function startTimer() {
        clearInterval(timer);
        if (reduceMotion) return; // pas de défilement automatique si l'utilisateur le refuse
        timer = setInterval(nextSlide, slideInterval);
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            startTimer(); // repart de zéro après un clic manuel
        });
    });

    // Pause du défilement quand l'onglet est en arrière-plan
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            clearInterval(timer);
        } else {
            startTimer();
        }
    });

    showSlide(currentSlide); // état initial correct des indicateurs
    startTimer();
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

document.querySelectorAll('a[href^="#"]:not(.skip-link)').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});


/* ---------- Visionneuse photos (page Spectacles) ---------- */
const lightbox = document.getElementById('lightbox');
const lightboxTriggers = Array.from(document.querySelectorAll('[data-lightbox]'))
    .sort((a, b) => Number(a.dataset.lightbox) - Number(b.dataset.lightbox));

if (lightbox && lightboxTriggers.length > 0 && typeof lightbox.showModal === 'function') {
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    let current = 0;

    const showPhoto = (index) => {
        current = (index + lightboxTriggers.length) % lightboxTriggers.length;
        const source = lightboxTriggers[current].querySelector('img');
        lightboxImg.src = source.currentSrc || source.src;
        lightboxImg.alt = source.alt;
        lightboxCaption.textContent = `${current + 1} / ${lightboxTriggers.length}`;
    };

    lightboxTriggers.forEach((trigger, index) => {
        trigger.addEventListener('click', () => {
            showPhoto(index);
            lightbox.showModal();
            document.body.style.overflow = 'hidden';
        });
    });

    lightbox.addEventListener('close', () => {
        document.body.style.overflow = '';
        lightboxTriggers[current].focus();
    });

    lightbox.querySelector('[data-lightbox-close]').addEventListener('click', () => lightbox.close());
    lightbox.querySelector('[data-lightbox-prev]').addEventListener('click', () => showPhoto(current - 1));
    lightbox.querySelector('[data-lightbox-next]').addEventListener('click', () => showPhoto(current + 1));

    // Clic en dehors de la photo : fermeture
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-inner')) {
            lightbox.close();
        }
    });

    lightbox.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') showPhoto(current - 1);
        if (e.key === 'ArrowRight') showPhoto(current + 1);
    });

    // Balayage sur mobile
    let touchStartX = null;
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    lightbox.addEventListener('touchend', (e) => {
        if (touchStartX === null) return;
        const delta = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 50) showPhoto(current + (delta < 0 ? 1 : -1));
        touchStartX = null;
    });
}
