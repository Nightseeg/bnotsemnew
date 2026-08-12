/* ==========================================================================
   BNOT SÉMINAIRE - MAIN APPLICATION CONTROLLER (V=2701 ALL 5 PHOTOS UPDATED)
   ========================================================================== */

import { Storage } from './storage.js';
import { Auth } from './auth.js';
import { renderNavbar } from './components/navbar.js';
import { renderHomeView } from './components/homeView.js';
import { renderServicesView } from './components/servicesView.js';
import { renderStudentDashboard } from './components/studentDash.js';
import { renderKoupatView } from './components/koupatView.js';
import { renderVisaView } from './components/visaView.js';
import { renderBoutiqueView } from './components/boutiqueView.js';
import { renderAdminView } from './components/adminView.js';
import { renderContactView } from './components/contactView.js';
import { showAuthModal } from './components/authModal.js';
import { renderCartDrawer } from './components/cartDrawer.js';

let currentRoute = 'home';
let currentSubParam = null;

window.showToast = function(message, type = 'info') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = {
    success: 'fa-circle-check',
    warning: 'fa-triangle-exclamation',
    danger: 'fa-circle-exclamation',
    info: 'fa-circle-info'
  };

  const toast = document.createElement('div');
  toast.className = `toast border-${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${icons[type] || icons.info}" style="color: var(--${type}); font-size: 1.2rem;"></i>
    <div>${message}</div>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

async function navigateTo(route, subParam = null) {
  currentRoute = route;
  currentSubParam = subParam;

  if (route.startsWith('admin')) {
    if (!Auth.isAdmin()) {
      window.showToast('Accès réservé exclusivement à l\'administrateur contact@bnotseminaire.com', 'danger');
      showAuthModal('admin-login', navigateTo);
      currentRoute = 'home';
    }
  }

  if (route === 'dashboard' || route === 'my-reservations') {
    if (!Auth.isAuthenticated()) {
      showAuthModal('login', navigateTo);
      currentRoute = 'home';
    }
  }

  // For boutique routes, always sync fresh from Supabase first
  if (route === 'boutique' || route === 'my-reservations') {
    await Storage.syncFromSupabase();
  }

  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderApp() {
  const app = document.getElementById('app');
  if (!app) return;

  const currentUser = Auth.getCurrentUser();

  if (currentRoute === 'home' && currentUser) {
    currentRoute = currentUser.role === 'admin' ? 'admin' : 'dashboard';
  }

  const navbarHtml = renderNavbar(currentRoute, navigateTo, () => renderCartDrawer(navigateTo), (mode) => showAuthModal(mode, navigateTo));

  let mainContentHtml = '';

  switch (currentRoute) {
    case 'services':
      mainContentHtml = renderServicesView(navigateTo);
      break;
    case 'dashboard':
      mainContentHtml = renderStudentDashboard(navigateTo);
      break;
    case 'koupat':
      mainContentHtml = renderKoupatView(navigateTo);
      break;
    case 'visa':
      mainContentHtml = renderVisaView(navigateTo);
      break;
    case 'boutique':
      mainContentHtml = renderBoutiqueView(navigateTo, 'catalog');
      break;
    case 'my-reservations':
      mainContentHtml = renderBoutiqueView(navigateTo, 'my-reservations');
      break;
    case 'contact':
      mainContentHtml = renderContactView(navigateTo);
      break;
    case 'admin':
    case 'admin-girls':
    case 'admin-orders':
    case 'admin-requests':
    case 'admin-products':
      const adminTab = currentRoute === 'admin-girls' ? 'girls' : (currentRoute === 'admin-orders' ? 'reservations' : (currentRoute === 'admin-requests' ? 'requests' : (currentRoute === 'admin-products' ? 'products' : currentSubParam)));
      mainContentHtml = renderAdminView(navigateTo, adminTab);
      break;
    case 'home':
    default:
      mainContentHtml = renderHomeView(navigateTo, (mode) => showAuthModal(mode, navigateTo));
      break;
  }

  const footerHtml = `
    <footer style="background: #081627; color: white; padding: 3.5rem 1.5rem 2.5rem; margin-top: auto; font-size: 0.92rem;">
      <div style="max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: 1.3fr 1fr 1fr 1.2fr; gap: 2.5rem;">
        
        <div>
          <h3 style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; margin-bottom: 1rem; color: #ffffff;">
            Bnot Séminaire
          </h3>
          <p style="color: #94A3B8; line-height: 1.6; max-width: 280px;">
            Accompagnement des jeunes francophones en Israël, avant leur départ et pendant leur parcours.
          </p>
        </div>

        <div>
          <h4 style="font-size: 1rem; font-weight: 700; color: #ffffff; margin-bottom: 1.2rem;">Services</h4>
          <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.65rem; color: #CBD5E1;">
            <li><a href="#" class="footer-link-action" data-action="services">Nos Services</a></li>
            <li><a href="#" class="footer-link-action" data-action="form-visa">Visa étudiant A/2</a></li>
            <li><a href="#" class="footer-link-action" data-action="services">Koupat Holim</a></li>
            <li><a href="https://israel-entry.piba.gov.il/" target="_blank" style="color: #CBD5E1;">ETA-IL officiel</a></li>
          </ul>
        </div>

        <div>
          <h4 style="font-size: 1rem; font-weight: 700; color: #ffffff; margin-bottom: 1.2rem;">Plateforme</h4>
          <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.65rem; color: #CBD5E1;">
            <li><a href="#" class="footer-link-action" data-action="admin">Espace Admin</a></li>
            <li><a href="#" class="footer-link-action" data-action="dashboard">Espace Élève</a></li>
            <li><a href="#" class="footer-link-action" data-action="contact">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 style="font-size: 1rem; font-weight: 700; color: #ffffff; margin-bottom: 1.2rem;">Dons & Partenaires</h4>
          <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.65rem; color: #CBD5E1;">
            <li><a href="https://toratyaacov.fr" target="_blank" rel="noopener noreferrer" style="color: #CBD5E1;"><i class="fa-solid fa-heart" style="color: #F97316; margin-right: 0.4rem;"></i> Faire un don</a></li>
            <li><a href="https://www.binianadeiad.com/" target="_blank" rel="noopener noreferrer" style="color: #CBD5E1;"><i class="fa-solid fa-handshake" style="color: #F97316; margin-right: 0.4rem;"></i> Binyan Adei Ad</a></li>
          </ul>
        </div>

        <div>
          <h4 style="font-size: 1rem; font-weight: 700; color: #ffffff; margin-bottom: 1.2rem;">Contact</h4>
          <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.75rem; color: #CBD5E1;">
            <li style="display: flex; align-items: center; gap: 0.6rem;">
              <i class="fa-brands fa-whatsapp" style="color: #F97316;"></i>
              <a href="https://wa.me/972534727103" target="_blank" style="color: #CBD5E1;">Groupe WhatsApp</a>
            </li>
            <li style="display: flex; align-items: center; gap: 0.6rem;">
              <i class="fa-solid fa-envelope" style="color: #F97316;"></i>
              <a href="mailto:contact@bnotseminaire.com" style="color: #CBD5E1;">contact@bnotseminaire.com</a>
            </li>
            <li style="display: flex; align-items: center; gap: 0.6rem;">
              <i class="fa-solid fa-phone" style="color: #F97316;"></i>
              <span>+33 7 67 96 71 48</span>
            </li>
          </ul>
        </div>

      </div>

      <div style="max-width: 1240px; margin: 2.5rem auto 0; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; color: #64748B; font-size: 0.85rem;">
        <div>&copy; ${new Date().getFullYear()} Bnot Séminaire Israël — Tous droits réservés.</div>
        <div style="display: flex; gap: 1.5rem;">
          <a href="#" class="footer-link-action" data-action="home" style="color: #64748B;">Mentions Légales</a>
          <a href="#" class="footer-link-action" data-action="contact" style="color: #64748B;">Contact</a>
        </div>
      </div>
    </footer>
  `;

  app.innerHTML = `
    ${navbarHtml}
    <main class="main-content">
      ${mainContentHtml}
    </main>
    ${footerHtml}
  `;

  setTimeout(() => {
    document.querySelectorAll('.footer-link-action').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const action = link.getAttribute('data-action');
        if (action === 'services') navigateTo('services');
        else if (action === 'form-visa') navigateTo('visa');
        else if (action === 'form-koupat') navigateTo('services');
        else if (action === 'contact') navigateTo('contact');
        else if (action === 'home') navigateTo('home');
        else if (action === 'admin') navigateTo('admin');
        else if (action === 'dashboard') navigateTo('dashboard');
        else navigateTo('home');
      });
    });
  }, 0);
}

window.addEventListener('cart-updated', () => {
  const currentUser = Auth.getCurrentUser();
  const navbarContainer = document.querySelector('.navbar');
  if (navbarContainer) {
    const updatedNav = renderNavbar(currentRoute, navigateTo, () => renderCartDrawer(navigateTo), (mode) => showAuthModal(mode, navigateTo));
    navbarContainer.outerHTML = updatedNav;
  }
  const drawer = document.getElementById('cart-drawer');
  if (drawer && drawer.classList.contains('open')) {
    renderCartDrawer(navigateTo);
  }
});

window.addEventListener('open-cart-drawer', () => {
  renderCartDrawer(navigateTo);
});

document.addEventListener('DOMContentLoaded', async () => {
  await Storage.init();
  document.documentElement.setAttribute('data-theme', 'light');
  renderApp();
});
