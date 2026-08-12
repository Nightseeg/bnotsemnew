/* ==========================================================================
   BNOT SÉMINAIRE - STUDENT DASHBOARD COMPONENT
   ========================================================================== */

import { Auth } from '../auth.js';
import { Storage } from '../storage.js';

export function renderStudentDashboard(onNavigate) {
  const user = Auth.getCurrentUser();
  if (!user) {
    onNavigate('home');
    return '';
  }

  const userEmail = (user.email || '').toLowerCase().trim();
  const reservations = Storage.getReservations().filter(r => 
    (r.userId && r.userId === user.id) || 
    (r.userEmail && userEmail && r.userEmail.toLowerCase().trim() === userEmail)
  );
  const activeResCount = reservations.length;

  const koupatStatusColor = user.koupatStatus === 'Validé & Carte Prête' ? 'badge-success' : 
                          (user.koupatStatus === 'Soumis - En étude' ? 'badge-warning' : 'badge-danger');
  
  const visaStatusColor = user.visaStatus === 'Visa Délivré' ? 'badge-success' : 
                        (user.visaProgress > 40 ? 'badge-warning' : 'badge-info');

  const html = `
    <div class="student-dashboard">
      <div style="margin-bottom: 1.25rem; display: flex; align-items: center; justify-content: space-between;">
        <button class="btn btn-secondary btn-sm" id="btn-dash-back-home" style="border-radius: 20px; font-weight: 700;">
          <i class="fa-solid fa-house"></i> Retour à l'accueil
        </button>
      </div>

      <!-- Hero Banner -->
      <div class="hero-banner">
        <div class="hero-content">
          <div class="hero-tag">
            <i class="fa-solid fa-graduation-cap"></i> ${user.seminary || 'Séminaire en Israël'}
          </div>
          <h1 class="hero-title">Shalom ${user.name.split(' ')[0]} !</h1>
          <p class="hero-desc">
            Bienvenue sur votre espace personnel Bnot Séminaire. Suivez vos démarches pour votre assurance maladie (Koupat Holim), votre visa A/2 et vos équipements de séminaire.
          </p>
        </div>
      </div>

      <!-- Quick Status Grid -->
      <div class="grid-3" style="margin-bottom: 2rem;">
        <!-- Koupat Holim Summary -->
        <div class="card" style="display: flex; flex-direction: column;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(6, 182, 212, 0.15); color: var(--info); display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
              <i class="fa-solid fa-notes-medical"></i>
            </div>
            <span class="badge badge-warning" style="background: rgba(245, 158, 11, 0.15); color: #d97706; font-weight: 700;"><i class="fa-regular fa-clock"></i> Bientôt disponible</span>
          </div>
          <h3 style="font-family: var(--font-heading); font-size: 1.2rem; margin-bottom: 0.35rem;">Koupat Holim</h3>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.25rem;">
            Démarches d'inscription assurance maladie (Koupat Holim Maccabi).
          </p>
          <button class="btn btn-secondary btn-sm btn-full" style="margin-top: auto; opacity: 0.65; cursor: not-allowed;" disabled>
            <i class="fa-regular fa-clock"></i> Bientôt disponible
          </button>
        </div>

        <!-- Visa A/2 Summary -->
        <div class="card" style="display: flex; flex-direction: column;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(245, 158, 11, 0.15); color: var(--warning); display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
              <i class="fa-solid fa-passport"></i>
            </div>
            <span class="badge badge-warning" style="background: rgba(245, 158, 11, 0.15); color: #d97706; font-weight: 700;"><i class="fa-regular fa-clock"></i> Bientôt disponible</span>
          </div>
          <h3 style="font-family: var(--font-heading); font-size: 1.2rem; margin-bottom: 0.35rem;">Visa Étudiant A/2</h3>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.25rem;">
            Checklist et guide des démarches pour le visa d'études A/2.
          </p>
          <button class="btn btn-secondary btn-sm btn-full" style="margin-top: auto; opacity: 0.65; cursor: not-allowed;" disabled>
            <i class="fa-regular fa-clock"></i> Bientôt disponible
          </button>
        </div>

        <!-- Reservations Summary -->
        <div class="card" style="display: flex; flex-direction: column;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(225, 29, 72, 0.15); color: var(--primary); display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
              <i class="fa-solid fa-bag-shopping"></i>
            </div>
            <span class="badge badge-primary">${activeResCount} Réservation(s)</span>
          </div>
          <h3 style="font-family: var(--font-heading); font-size: 1.2rem; margin-bottom: 0.35rem;">Boutique & Matériel</h3>
          <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1.25rem;">
            Réservez vos articles essentiels (literie, bouilloires, adaptateurs) livrés directement à votre séminaire.
          </p>
          <button class="btn btn-primary btn-sm btn-full" style="margin-top: auto;" id="btn-go-reservations">
            Mes Réservations <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- Recent Reservations Section if any -->
      ${reservations.length > 0 ? `
        <div class="card" style="margin-bottom: 2rem;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
            <h3 class="section-title" style="margin-bottom: 0;"><i class="fa-solid fa-receipt"></i> Vos Dernières Réservations</h3>
            <button class="btn btn-secondary btn-sm" id="btn-view-all-res">Voir tout</button>
          </div>
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>N° Réservation</th>
                  <th>Date</th>
                  <th>Articles</th>
                  <th>Mode Livraison</th>
                  <th>Total</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                ${reservations.map(res => `
                  <tr>
                    <td><strong>#${res.id}</strong></td>
                    <td>${res.createdAt}</td>
                    <td>${res.items.map(i => `${i.name} (x${i.quantity})`).join(', ')}</td>
                    <td>${res.deliveryOption} (${res.deliveryDate})</td>
                    <td><strong style="color: var(--primary);">${res.totalPrice} ${res.currency}</strong></td>
                    <td>
                      <span class="badge ${res.status === 'Validée' ? 'badge-success' : (res.status === 'Prête' ? 'badge-info' : 'badge-warning')}">
                        ${res.status}
                      </span>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      ` : ''}

      <!-- Help Banner -->
      <div class="card" style="background: linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(225, 29, 72, 0.1)); border: 1px solid rgba(79, 70, 229, 0.2);">
        <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
          <div style="display: flex; align-items: center; gap: 1.25rem;">
            <div style="width: 50px; height: 50px; border-radius: 50%; background: #25D366; color: white; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; box-shadow: 0 4px 14px rgba(37, 211, 102, 0.3);">
              <i class="fa-brands fa-whatsapp"></i>
            </div>
            <div>
              <h4 style="font-family: var(--font-heading); font-size: 1.15rem; margin-bottom: 0.2rem;">Besoin d'aide pour vos démarches ?</h4>
              <p style="font-size: 0.88rem; color: var(--text-muted);">Notre équipe d'assistance est disponible sur WhatsApp pour vous accompagner avant et dès votre arrivée en Israël.</p>
            </div>
          </div>
          <a href="https://wa.me/972541234567?text=Bonjour,%20je%20suis%20${encodeURIComponent(user.name)}%20du%20séminaire%20${encodeURIComponent(user.seminary)}%20et%20j'ai%20une%20question." target="_blank" class="btn btn-accent">
            Contacter l'Assistance <i class="fa-solid fa-paper-plane"></i>
          </a>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    document.getElementById('btn-dash-back-home')?.addEventListener('click', () => onNavigate('home'));
    document.getElementById('btn-dash-boutique')?.addEventListener('click', () => onNavigate('boutique'));
    document.getElementById('btn-dash-koupat')?.addEventListener('click', () => onNavigate('koupat'));
    document.getElementById('btn-go-koupat')?.addEventListener('click', () => onNavigate('koupat'));
    document.getElementById('btn-go-visa')?.addEventListener('click', () => onNavigate('visa'));
    document.getElementById('btn-go-reservations')?.addEventListener('click', () => onNavigate('my-reservations'));
    document.getElementById('btn-view-all-res')?.addEventListener('click', () => onNavigate('my-reservations'));
  }, 0);

  return html;
}
