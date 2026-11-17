/* ---------- Composants partagés : menu (site-header) et pied de page (site-footer) ----------
   Ce fichier est chargé dans le <head> de chaque page (sauf l'accueil).
   Pour modifier le menu ou le pied de page, il suffit de changer ce fichier :
   toutes les pages sont mises à jour d'un coup.
   Les liens sont écrits relativement à la racine du site, le préfixe est calculé
   automatiquement (pages/ ou racine). */
(function () {
    const script = document.currentScript;
    const root = new URL('./', script.src).href; // URL du dossier racine du site

    const url = (path) => root + path;
    const pageName = () => {
        const parts = location.pathname.split('/');
        return parts[parts.length - 1] || 'index.html';
    };

    // Liens du menu principal
    const MENU = [
        { label: 'Accueil', href: 'index.html', match: ['index.html'] },
        { label: 'La Compagnie', href: 'pages/compagnie.html', match: ['compagnie.html'] },
        { label: 'Spectacles', href: 'pages/spectacles.html', match: ['spectacles.html'] },
        {
            label: 'Membres',
            href: 'pages/membres.html',
            match: ['membres.html', 'artistes.html', 'membres-honorifiques.html', 'membres-donateurs.html'],
            children: [
                { label: 'Artistes', href: 'pages/artistes.html', match: ['artistes.html'] },
                { label: 'Membres honorifiques', href: 'pages/membres-honorifiques.html', match: ['membres-honorifiques.html'] },
                { label: 'Membres donateurs', href: 'pages/membres-donateurs.html', match: ['membres-donateurs.html'] }
            ]
        },
        { label: 'Nous Soutenir', href: 'pages/soutenir.html', match: ['soutenir.html'] },
        { label: 'Presse', href: 'pages/presse.html', match: ['presse.html'] },
        { label: 'Contact', href: 'pages/contact.html', match: ['contact.html'] }
    ];

    const CHEVRON = '<svg class="h-4 w-4" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>';

    const isActive = (item) => item.match.includes(pageName());
    const current = (item) => (isActive(item) ? ' aria-current="page"' : '');

    /* ---------- Menu ---------- */
    class SiteHeader extends HTMLElement {
        connectedCallback() {
            const desktop = MENU.map((item) => {
                if (!item.children) {
                    return `<a href="${url(item.href)}" class="nav-link ${isActive(item) ? 'nav-link-active text-white' : 'text-gray-300 hover:text-white'}"${current(item)}>${item.label}</a>`;
                }
                const sub = item.children
                    .map((c) => `<a href="${url(c.href)}" class="dropdown-link${isActive(c) ? ' dropdown-link-active' : ''}"${current(c)}>${c.label}</a>`)
                    .join('');
                return `<div class="nav-dropdown">
                    <a href="${url(item.href)}" class="nav-link inline-flex items-center gap-1.5 ${isActive(item) ? 'nav-link-active text-white' : 'text-gray-300 hover:text-white'}" aria-haspopup="true">${item.label}${CHEVRON}</a>
                    <div class="nav-dropdown-menu">${sub}</div>
                </div>`;
            }).join('');

            const mobile = MENU.map((item) => {
                if (!item.children) {
                    return `<a href="${url(item.href)}" class="mobile-link ${isActive(item) ? 'mobile-link-active' : ''}"${current(item)}>${item.label}</a>`;
                }
                const sub = item.children
                    .map((c) => `<a href="${url(c.href)}" class="mobile-submenu-link${isActive(c) ? ' mobile-submenu-link-active' : ''}"${current(c)}>${c.label}</a>`)
                    .join('');
                const open = isActive(item);
                return `<div>
                    <button type="button" class="mobile-link flex w-full items-center justify-between text-left ${open ? 'mobile-link-active' : ''}" data-submenu-toggle="mobile-members-submenu" aria-expanded="${open}" aria-controls="mobile-members-submenu">
                        <span>${item.label}</span>${CHEVRON}
                    </button>
                    <div id="mobile-members-submenu" class="mobile-submenu ${open ? '' : 'hidden'}">${sub}</div>
                </div>`;
            }).join('');

            this.innerHTML = `
            <nav class="site-nav fixed inset-x-0 top-0 z-50 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm" aria-label="Navigation principale">
                <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
                    <a href="${url('index.html')}" class="site-logo" aria-label="Phaestos, retour à l'accueil">PHAESTOS</a>
                    <div class="hidden items-center gap-8 lg:flex">${desktop}</div>
                    <button id="mobile-menu-toggle" type="button" class="menu-toggle lg:hidden" aria-label="Ouvrir le menu" aria-expanded="false" aria-controls="mobile-menu">
                        <svg class="icon-open h-6 w-6" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                        <svg class="icon-close hidden h-6 w-6" aria-hidden="true" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 6l12 12M18 6L6 18"></path></svg>
                    </button>
                </div>
                <div id="mobile-menu" class="mobile-panel hidden lg:hidden">${mobile}</div>
            </nav>`;

            this.setup();
        }

        setup() {
            const toggle = this.querySelector('#mobile-menu-toggle');
            const panel = this.querySelector('#mobile-menu');
            const iconOpen = toggle.querySelector('.icon-open');
            const iconClose = toggle.querySelector('.icon-close');

            const setOpen = (open) => {
                panel.classList.toggle('hidden', !open);
                toggle.setAttribute('aria-expanded', String(open));
                toggle.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
                iconOpen.classList.toggle('hidden', open);
                iconClose.classList.toggle('hidden', !open);
            };

            toggle.addEventListener('click', () => setOpen(panel.classList.contains('hidden')));

            // Sous-menu "Membres" (mobile)
            this.querySelectorAll('[data-submenu-toggle]').forEach((button) => {
                button.addEventListener('click', () => {
                    const submenu = this.querySelector('#' + button.getAttribute('data-submenu-toggle'));
                    const expanded = button.getAttribute('aria-expanded') === 'true';
                    button.setAttribute('aria-expanded', String(!expanded));
                    submenu.classList.toggle('hidden', expanded);
                });
            });

            // Fermeture : Échap, clic à l'extérieur, clic sur un lien, passage en grand écran
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && !panel.classList.contains('hidden')) {
                    setOpen(false);
                    toggle.focus();
                }
            });
            document.addEventListener('click', (e) => {
                if (!this.contains(e.target)) setOpen(false);
            });
            panel.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
            window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
                if (e.matches) setOpen(false);
            });

            // Fond légèrement plus opaque après un peu de défilement
            const nav = this.querySelector('nav');
            const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 50);
            window.addEventListener('scroll', onScroll, { passive: true });
            onScroll();
        }
    }

    /* ---------- Pied de page ---------- */
    class SiteFooter extends HTMLElement {
        connectedCallback() {
            const year = new Date().getFullYear();
            this.innerHTML = `
            <footer class="border-t border-gray-800 bg-gray-950 text-gray-400">
                <div class="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
                    <div>
                        <a href="${url('index.html')}" class="site-logo">PHAESTOS</a>
                        <p class="mt-3 max-w-xs text-sm leading-relaxed">Compagnie de théâtre. Créer, transmettre et faire vivre le théâtre.</p>
                    </div>
                    <nav aria-label="Pied de page">
                        <p class="footer-title">Explorer</p>
                        <ul class="mt-3 space-y-1 text-sm">
                            <li><a class="footer-link" href="${url('pages/compagnie.html')}">La Compagnie</a></li>
                            <li><a class="footer-link" href="${url('pages/spectacles.html')}">Spectacles</a></li>
                            <li><a class="footer-link" href="${url('pages/artistes.html')}">Artistes</a></li>
                            <li><a class="footer-link" href="${url('pages/soutenir.html')}">Nous Soutenir</a></li>
                            <li><a class="footer-link" href="${url('pages/presse.html')}">Presse</a></li>
                            <li><a class="footer-link" href="${url('pages/contact.html')}">Contact</a></li>
                        </ul>
                    </nav>
                    <div>
                        <p class="footer-title">Nous suivre</p>
                        <ul class="mt-3 space-y-1 text-sm">
                            <li><a class="footer-link" href="mailto:compagniephaestos@gmail.com">compagniephaestos@gmail.com</a></li>
                            <li><a class="footer-link" href="https://www.instagram.com/compagnie._.phaestos" target="_blank" rel="noopener noreferrer">Instagram : @compagnie._.phaestos<span class="sr-only"> (nouvel onglet)</span></a></li>
                        </ul>
                    </div>
                </div>
                <div class="border-t border-gray-800">
                    <div class="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-sm sm:flex-row sm:px-6">
                        <p>&copy; ${year} Compagnie Phaestos. Tous droits réservés.</p>
                        <p class="flex flex-wrap justify-center gap-x-5 gap-y-1">
                            <a class="footer-link" href="${url('pages/mentions-legales.html')}">Mentions légales</a>
                            <a class="footer-link" href="${url('pages/politique-confidentialite.html')}">Politique de confidentialité</a>
                        </p>
                    </div>
                </div>
            </footer>`;
        }
    }

    customElements.define('site-header', SiteHeader);
    customElements.define('site-footer', SiteFooter);
})();
