/* ==========================================================================
   BNOT SÉMINAIRE - NAVBAR COMPONENT (WITH CONTACT ROUTE CONNECTED)
   ========================================================================== */

import { Auth } from '../auth.js';
import { Storage } from '../storage.js';

export function renderNavbar(activeRoute, onNavigate, onOpenCart, onOpenAuthModal) {
  const currentUser = Auth.getCurrentUser();
  const cart = Storage.getCart();
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const theme = Storage.getTheme();

  const userActionHtml = currentUser ? `
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <button class="btn btn-outline-pill" id="nav-btn-espace">
        <i class="fa-solid fa-user"></i> Mon espace (${currentUser.name.split(' ')[0]})
      </button>
      <button id="btn-logout" class="btn-icon" title="Se déconnecter">
        <i class="fa-solid fa-right-from-bracket"></i>
      </button>
    </div>
  ` : `
    <button id="btn-login-nav" class="btn btn-outline-pill">
      Mon espace
    </button>
  `;

  const html = `
    <nav class="navbar">
      <div class="navbar-container">
        <!-- Logo Left -->
        <div class="brand" style="cursor: pointer;" id="nav-brand">
          <div style="width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, var(--accent-1), var(--accent-2)); display: flex; align-items: center; justify-content: center; color: var(--text-main); font-weight: 800; font-size: 1.1rem;">
            🌸
          </div>
          <div class="brand-text-container">
            <span class="brand-title">Bnot Séminaire</span>
            <span class="brand-subtitle">FRANCE - ISRAËL</span>
          </div>
        </div>

        <!-- Center Nav Pills (Matching Screenshot) -->
        <div class="nav-pill-group">
          <button class="nav-pill-item ${activeRoute === 'home' ? 'active' : ''}" data-route="home">Accueil</button>
          <button class="nav-pill-item ${activeRoute === 'boutique' ? 'active' : ''}" data-route="boutique">Boutique</button>
          <button class="nav-pill-item" id="btn-nav-don">Faire un don</button>
          <button class="nav-pill-item ${activeRoute === 'contact' ? 'active' : ''}" data-route="contact">Contact</button>
        </div>

        <!-- Right Action Buttons (Mon Espace + Appeler) -->
        <div class="nav-actions">
          <button id="btn-cart" class="btn-icon" title="Voir le panier">
            <i class="fa-solid fa-shopping-bag"></i>
            ${totalCartCount > 0 ? `<span class="badge-count">${totalCartCount}</span>` : ''}
          </button>

          <button id="btn-theme-toggle" class="btn-icon" title="Changer le thème">
            <i class="fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}"></i>
          </button>

          ${userActionHtml}

          <a href="tel:+972534727103" class="btn btn-outline-pill" style="gap: 0.4rem; display: inline-flex; align-items: center;">
            <i class="fa-solid fa-phone" style="color: var(--accent-1);"></i> Appeler
          </a>
        </div>
      </div>
    </nav>
  `;

  setTimeout(() => {
    document.getElementById('nav-brand')?.addEventListener('click', () => {
      onNavigate(currentUser ? (currentUser.role === 'admin' ? 'admin' : 'dashboard') : 'home');
    });

    document.querySelectorAll('.nav-pill-item[data-route]').forEach(btn => {
      btn.addEventListener('click', () => {
        const route = btn.getAttribute('data-route');
        if (route) onNavigate(route);
      });
    });

    document.getElementById('btn-nav-don')?.addEventListener('click', () => {
      window.showToast('Page de don en cours de finalisation. Merci pour votre soutien !', 'info');
    });

    document.getElementById('btn-cart')?.addEventListener('click', onOpenCart);

    document.getElementById('btn-theme-toggle')?.addEventListener('click', () => {
      const current = Storage.getTheme();
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      Storage.setTheme(nextTheme);
      renderNavbar(activeRoute, onNavigate, onOpenCart, onOpenAuthModal);
    });

    document.getElementById('btn-login-nav')?.addEventListener('click', () => onOpenAuthModal('login'));
    document.getElementById('nav-btn-espace')?.addEventListener('click', () => onNavigate(currentUser?.role === 'admin' ? 'admin' : 'dashboard'));
    
    document.getElementById('btn-logout')?.addEventListener('click', () => {
      Auth.logout();
      window.showToast('Déconnexion réussie', 'info');
      onNavigate('home');
    });
  }, 0);

  return html;
}
