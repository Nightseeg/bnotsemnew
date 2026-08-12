/* ==========================================================================
   BNOT SÉMINAIRE - NAVBAR COMPONENT (HEADER LINKS CLEANUP)
   ========================================================================== */

import { Auth } from '../auth.js';
import { Storage } from '../storage.js';

export function renderNavbar(currentRoute, onNavigate, onOpenCart, onOpenAuthModal) {
  const currentUser = Auth.getCurrentUser();
  const cartCount = Storage.getCartCount();

  const baseNavItems = [
    { type: 'internal', route: 'home', label: 'Accueil', icon: 'fa-house' },
    { type: 'internal', route: 'services', label: 'Nos Services', icon: 'fa-hand-holding-heart' },
    { type: 'internal', route: 'boutique', label: 'Boutique', icon: 'fa-store' },
  ];

  if (currentUser) {
    if (currentUser.role === 'admin') {
      baseNavItems.push({ type: 'internal', route: 'admin', label: 'Admin', icon: 'fa-crown' });
    } else {
      baseNavItems.push({ type: 'internal', route: 'dashboard', label: 'Mon Espace', icon: 'fa-user-graduate' });
    }
  }

  // Faire un don, Binian Adei Ad, and Contact last
  const allNavItems = [
    ...baseNavItems,
    { type: 'external', href: 'https://toratyaacov.fr', label: 'Faire un don' },
    { type: 'external', href: 'https://www.binianadeiad.com/', label: 'Binian Adei Ad' },
    { type: 'internal', route: 'contact', label: 'Contact', icon: 'fa-paper-plane' }
  ];

  const html = `
    <header class="navbar">
      <div class="navbar-container">
        <!-- Brand Logo -->
        <a href="#" class="brand" id="nav-brand-logo" style="display: flex; align-items: center; gap: 0.6rem; text-decoration: none;">
          <img src="assets/images/bnot_icon_transparent.png?v=2712" alt="Bnot Séminaire Logo" style="height: 48px; width: auto; object-fit: contain;">
          <div class="brand-text-container">
            <span class="brand-title">Bnot Séminaire</span>
            <span class="brand-subtitle">FRANCE - ISRAËL</span>
          </div>
        </a>

        <!-- Desktop Navigation Pills -->
        <nav class="nav-pill-group">
          ${allNavItems.map(item => {
            if (item.type === 'internal') {
              return `<a href="#" class="nav-pill-item ${currentRoute === item.route ? 'active' : ''}" data-route="${item.route}">${item.label}</a>`;
            } else {
              return `<a href="${item.href}" target="_blank" rel="noopener noreferrer" class="nav-pill-item">${item.label}</a>`;
            }
          }).join('')}
        </nav>

        <!-- Right Side Nav Actions -->
        <div class="nav-actions">

          <button class="btn-icon" id="btn-cart-toggle" title="Voir le Panier">
            <i class="fa-solid fa-cart-shopping"></i>
            ${cartCount > 0 ? `<span class="badge-count">${cartCount}</span>` : ''}
          </button>

          ${currentUser ? `
            <button class="btn btn-outline-pill btn-sm" id="btn-user-account" style="font-size: 0.85rem; padding: 0.5rem 1.1rem;">
              <i class="fa-solid fa-user-check"></i> ${currentUser.name.split(' ')[0]}
            </button>
            <button class="btn-icon" id="btn-logout" title="Déconnexion">
              <i class="fa-solid fa-right-from-bracket"></i>
            </button>
          ` : `
            <button class="btn btn-pink-gradient btn-sm" id="btn-login-open">
              <i class="fa-solid fa-user"></i> Connexion
            </button>
          `}

          <!-- Mobile Burger Toggle Button -->
          <button class="navbar-burger" id="btn-mobile-burger" aria-label="Menu Mobile">
            <i class="fa-solid fa-bars"></i>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Navigation Slide-in Drawer -->
    <div class="mobile-nav-backdrop" id="mobile-backdrop"></div>
    <aside class="mobile-nav-drawer" id="mobile-drawer">
      <div class="mobile-nav-header">
        <div class="brand" style="display: flex; align-items: center; gap: 0.5rem;">
          <img src="assets/images/bnot_icon_transparent.png?v=2712" alt="Bnot Séminaire Logo" style="height: 38px; width: auto; object-fit: contain;">
          <span class="brand-title" style="font-size: 1.2rem;">Bnot Séminaire</span>
        </div>
        <button class="btn-icon" id="btn-close-mobile-drawer">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="mobile-nav-links">
        ${allNavItems.map(item => {
          if (item.type === 'internal') {
            return `
              <a href="#" class="mobile-nav-link ${currentRoute === item.route ? 'active' : ''}" data-route="${item.route}">
                <i class="fa-solid ${item.icon}" style="width: 24px; color: var(--text-muted);"></i>
                <span>${item.label}</span>
              </a>
            `;
          } else {
            return `
              <a href="${item.href}" target="_blank" rel="noopener noreferrer" class="mobile-nav-link" style="padding-left: 2.25rem;">
                <span>${item.label}</span>
              </a>
            `;
          }
        }).join('')}

        <div style="margin-top: 1rem; border-top: 1px solid var(--border-color); padding-top: 1rem;">
          ${currentUser ? `
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.75rem;">Connecté(e) en tant que :</div>
            <div style="font-weight: 800; font-size: 1rem; margin-bottom: 1rem;">${currentUser.name}</div>
            <button class="btn btn-outline-pill" id="btn-mobile-logout" style="width: 100%;">
              <i class="fa-solid fa-right-from-bracket"></i> Déconnexion
            </button>
          ` : `
            <button class="btn btn-pink-gradient" id="btn-mobile-login" style="width: 100%;">
              <i class="fa-solid fa-user"></i> Connexion / Inscription
            </button>
          `}
        </div>
      </div>
    </aside>
  `;

  setTimeout(() => {
    // Navigation items
    document.querySelectorAll('.navbar [data-route], .mobile-nav-drawer [data-route]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const route = el.getAttribute('data-route');
        closeMobileMenu();
        onNavigate(route);
      });
    });

    document.getElementById('nav-brand-logo')?.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileMenu();
      onNavigate('home');
    });


    // Cart toggle
    document.getElementById('btn-cart-toggle')?.addEventListener('click', () => {
      closeMobileMenu();
      onOpenCart();
    });

    // Login/Logout
    document.getElementById('btn-login-open')?.addEventListener('click', () => onOpenAuthModal('login'));
    document.getElementById('btn-mobile-login')?.addEventListener('click', () => {
      closeMobileMenu();
      onOpenAuthModal('login');
    });

    document.getElementById('btn-logout')?.addEventListener('click', () => {
      Auth.logout();
      window.showToast('Déconnexion réussie !', 'info');
      onNavigate('home');
    });

    document.getElementById('btn-mobile-logout')?.addEventListener('click', () => {
      closeMobileMenu();
      Auth.logout();
      window.showToast('Déconnexion réussie !', 'info');
      onNavigate('home');
    });

    document.getElementById('btn-user-account')?.addEventListener('click', () => {
      if (currentUser.role === 'admin') onNavigate('admin');
      else onNavigate('dashboard');
    });

    // Mobile Menu Controls
    const burgerBtn = document.getElementById('btn-mobile-burger');
    const closeBtn = document.getElementById('btn-close-mobile-drawer');
    const backdrop = document.getElementById('mobile-backdrop');
    const drawer = document.getElementById('mobile-drawer');

    function openMobileMenu() {
      drawer?.classList.add('open');
      backdrop?.classList.add('active');
    }

    function closeMobileMenu() {
      drawer?.classList.remove('open');
      backdrop?.classList.remove('active');
    }

    burgerBtn?.addEventListener('click', openMobileMenu);
    closeBtn?.addEventListener('click', closeMobileMenu);
    backdrop?.addEventListener('click', closeMobileMenu);

  }, 0);

  return html;
}
