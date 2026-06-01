'use strict';

const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ========================================
   NAVBAR SCROLL EFFECT
   ======================================== */
const navbar = $('.navbar');
const backToTop = $('.btn-home');

function handleScroll() {
    const scrolled = window.scrollY > 0;
    navbar.classList.toggle('window-scroll', scrolled);
    backToTop?.classList.toggle('visible', window.scrollY > 300);
}

let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
        });
        ticking = true;
    }
}, { passive: true });

/* ========================================
   MOBILE MENU
   ======================================== */
const toggleBtn = $('.btn-toggle');
const menu = $('#menu');

if (toggleBtn && menu) {
    // Crear overlay
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);

    function toggleMenu(expanded) {
        const isOpen = expanded ?? toggleBtn.getAttribute('aria-expanded') !== 'true';
        toggleBtn.setAttribute('aria-expanded', String(isOpen));
        toggleBtn.setAttribute('aria-label', isOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
        menu.classList.toggle('mostrar', isOpen);
        overlay.classList.toggle('active', isOpen);
        document.body.classList.toggle('menu-open', isOpen);
    }

    toggleBtn.addEventListener('click', () => toggleMenu());

    // Cerrar con tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
            toggleMenu(false);
            toggleBtn.focus();
        }
    });

    // Cerrar al hacer clic en overlay
    overlay.addEventListener('click', () => toggleMenu(false));

    // Cerrar al hacer clic en un enlace
    $$('.menu-item a').forEach(link => {
        link.addEventListener('click', () => toggleMenu(false));
    });

    // Enfocar el primer elemento del menú cuando se abre
    const observer = new MutationObserver(() => {
        if (menu.classList.contains('mostrar')) {
            const firstLink = $('.menu-item a', menu);
            if (firstLink && !document.activeElement?.closest('.menu')) {
                // No robar el foco forzosamente, solo preparar
            }
        }
    });
    observer.observe(menu, { attributes: true, attributeFilter: ['class'] });
}

/* ========================================
   SMOOTH HASH SCROLL (offset for fixed nav)
   ======================================== */
$$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;
        const target = $(targetId);
        if (target) {
            e.preventDefault();
            const offset = 80;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    });
});

/* ========================================
   ACTIVE NAV LINK ON SCROLL
   ======================================== */
const sections = $$('section[id]');
const navLinks = $$('.menu-item a');

function updateActiveLink() {
    let current = '';
    const scrollPos = window.scrollY + 150;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
window.addEventListener('load', updateActiveLink);
