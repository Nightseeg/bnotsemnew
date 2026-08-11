/* ==========================================================================
   BNOT SÉMINAIRE - MAIN APPLICATION CONTROLLER & ROUTER (16 PRODUCTS CLEANED)
   ========================================================================== */

import { Storage } from './storage.js?v=1101';
import { Auth } from './auth.js?v=1101';
import { renderNavbar } from './components/navbar.js?v=1101';
import { renderHomeView } from './components/homeView.js?v=1101';
import { renderStudentDashboard } from './components/studentDash.js?v=1101';
import { renderKoupatView } from './components/koupatView.js?v=1101';
import { renderVisaView } from './components/visaView.js?v=1101';
import { renderBoutiqueView } from './components/boutiqueView.js?v=1101';
import { renderAdminView } from './components/adminView.js?v=1101';
import { renderContactView } from './components/contactView.js?v=1101';
import { showAuthModal } from './components/authModal.js?v=1101';
import { renderCartDrawer } from './components/cartDrawer.js?v=1101';
import { showServiceFormModal } from './components/formModal.js?v=1101';

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

function navigateTo(route, subParam = null) {
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
    <footer style="background: #081627; color: white; padding: 4.5rem 2rem 3rem; margin-top: auto; font-size: 0.92rem;">
      <div style="max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: 1.3fr 1fr 1fr 1.2fr; gap: 3rem;">
        
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
            <li><a href="#" class="footer-link-action" data-action="form-visa">Je viens étudier en Israël</a></li>
            <li><a href="#" class="footer-link-action" data-action="contact">À propos</a></li>
            <li><a href="#" class="footer-link-action" data-action="home">Tous les services</a></li>
            <li><a href="#" class="footer-link-action" data-action="form-visa">Visa étudiant</a></li>
            <li><a href="#" class="footer-link-action" data-action="form-koupat">Koupat Holim</a></li>
            <li><a href="#" class="footer-link-action" data-action="dvar">Dvar Torah</a></li>
            <li><a href="https://israel-entry.piba.gov.il/" target="_blank" style="color: #CBD5E1;">ETA-IL officiel</a></li>
          </ul>
        </div>

        <div>
          <h4 style="font-size: 1rem; font-weight: 700; color: #ffffff; margin-bottom: 1.2rem;">Plateforme</h4>
          <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.65rem; color: #CBD5E1;">
            <li><a href="#" class="footer-link-action" data-action="admin">Admin</a></li>
            <li><a href="#" class="footer-link-action" data-action="dashboard">Espace Élève</a></li>
            <li><a href="#" class="footer-link-action" data-action="evenements">Événements</a></li>
            <li><a href="#" class="footer-link-action" data-action="programme">Programme</a></li>
            <li><a href="#" class="footer-link-action" data-action="guide">Guide PDF</a></li>
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
            <li style="display: flex; align-items: center; gap: 0.6rem;">
              <i class="fa-solid fa-phone" style="color: #F97316;"></i>
              <span>+972 53 472 7103</span>
            </li>
            <li style="display: flex; align-items: flex-start; gap: 0.6rem; margin-top: 0.2rem;">
              <i class="fa-solid fa-location-dot" style="color: #F97316; margin-top: 3px;"></i>
              <span>17 Rehov Apisga, Bayit Vagan, Jérusalem</span>
            </li>
          </ul>
        </div>

      </div>

      <div style="max-width: 1240px; margin: 3rem auto 0; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.1); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; color: #64748B; font-size: 0.85rem;">
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
        if (action === 'form-visa') navigateTo('visa');
        else if (action === 'form-koupat') navigateTo('koupat');
        else if (action === 'contact') navigateTo('contact');
        else if (action === 'home') navigateTo('home');
        else if (action === 'admin') navigateTo('admin');
        else if (action === 'dashboard') navigateTo('dashboard');
        else if (action === 'dvar') window.showToast('Le Dvar Torah de la semaine sera publié chaque jeudi !', 'info');
        else window.showToast(`Section ${action} à venir !`, 'info');
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
});

document.addEventListener('DOMContentLoaded', async () => {
  await Storage.init();
  const savedTheme = Storage.getTheme();
  document.documentElement.setAttribute('data-theme', savedTheme);
  renderApp();
});
