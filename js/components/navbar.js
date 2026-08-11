/* ==========================================================================
   BNOT SÉMINAIRE - NAVBAR COMPONENT (MOBILE BURGER & DRAWER INTEGRATED)
   ========================================================================== */

import { Auth } from '../auth.js';
import { Storage } from '../storage.js';

export function renderNavbar(currentRoute, onNavigate, onOpenCart, onOpenAuthModal) {
  const currentUser = Auth.getCurrentUser();
  const cartCount = Storage.getCartCount();

  const navItems = [
    { route: 'home', label: 'Accueil', icon: 'fa-house' },
    { route: 'boutique', label: 'Boutique', icon: 'fa-store' },
    { route: 'visa', label: 'Visa Étudiant', icon: 'fa-passport' },
    { route: 'koupat', label: 'Koupat Holim', icon: 'fa-notes-medical' },
    { route: 'contact', label: 'Contact', icon: 'fa-paper-plane' },
  ];

  if (currentUser) {
    if (currentUser.role === 'admin') {
      navItems.push({ route: 'admin', label: 'Admin', icon: 'fa-crown' });
    } else {
      navItems.push({ route: 'dashboard', label: 'Mon Espace', icon: 'fa-user-graduate' });
    }
  }

  const html = `
    <header class="navbar">
      <div class="navbar-container">
        <!-- Brand Logo -->
        <a href="#" class="brand" id="nav-brand-logo">
          <div style="width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-1), var(--accent-2)); display: flex; align-items: center; justify-content: center; color: var(--text-main); font-weight: 800;">
            <i class="fa-solid fa-star" style="font-size: 1.1rem;"></i>
          </div>
          <div class="brand-text-container">
            <span class="brand-title">Bnot Séminaire</span>
            <span class="brand-subtitle">FRANCE - ISRAËL</span>
          </div>
        </a>

        <!-- Desktop Navigation Pills -->
        <nav class="nav-pill-group">
          ${navItems.map(item => `
            <a href="#" class="nav-pill-item ${currentRoute === item.route ? 'active' : ''}" data-route="${item.route}">
              ${item.label}
            </a>
          `).join('')}
        </nav>

        <!-- Right Side Nav Actions -->
        <div class="nav-actions">
          <button class="btn-icon" id="btn-theme-toggle" title="Changer de mode (Clair/Sombre)">
            <i class="fa-solid ${Storage.getTheme() === 'dark' ? 'fa-sun' : 'fa-moon'}"></i>
          </button>

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
        <div class="brand">
          <div style="width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-1), var(--accent-2)); display: flex; align-items: center; justify-content: center; color: var(--text-main);">
            <i class="fa-solid fa-star" style="font-size: 0.9rem;"></i>
          </div>
          <span class="brand-title" style="font-size: 1.2rem;">Bnot Séminaire</span>
        </div>
        <button class="btn-icon" id="btn-close-mobile-drawer">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <div class="mobile-nav-links">
        ${navItems.map(item => `
          <a href="#" class="mobile-nav-link ${currentRoute === item.route ? 'active' : ''}" data-route="${item.route}">
            <i class="fa-solid ${item.icon}" style="width: 24px; color: var(--text-muted);"></i>
            <span>${item.label}</span>
          </a>
        `).join('')}

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
      onNavigate(currentUser ? (currentUser.role === 'admin' ? 'admin' : 'dashboard') : 'home');
    });

    // Theme toggle
    document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
      const nextTheme = Storage.getTheme() === 'dark' ? 'light' : 'dark';
      Storage.setTheme(nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
      window.dispatchEvent(new Event('cart-updated'));
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
