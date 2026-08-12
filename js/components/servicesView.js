/* ==========================================================================
   BNOT SÉMINAIRE - NOS SERVICES (WITH ALL 5 CUSTOM USER UPLOADED PHOTOS)
   ========================================================================== */

import { showServiceFormModal } from './formModal.js';

export function renderServicesView(onNavigate) {
  const html = `
    <div class="services-official-view" style="max-width: 1240px; margin: 0 auto 5rem; padding: 0 1rem;">
      <!-- Header Banner -->
      <div style="text-align: center; margin-bottom: 3.5rem;">
        <span class="badge-pill-pink" style="margin-bottom: 0.75rem;">
          <i class="fa-solid fa-hand-holding-heart"></i> Accompagnement Complet
        </span>
        <h1 style="font-family: var(--font-serif); font-size: 3.2rem; font-weight: 700; color: var(--text-main); margin-bottom: 0.75rem;">
          Nos Services
        </h1>
        <p style="color: var(--text-muted); max-width: 680px; margin: 0 auto; font-size: 1.05rem; line-height: 1.6;">
          Avant votre arrivée comme pendant votre année en Israël, notre équipe vous accompagne dans toutes les démarches essentielles pour vous installer sereinement.
        </p>
      </div>

      <!-- 2 Columns Grid of Split Horizontal Cards -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; margin-bottom: 2.5rem;" class="grid-2">
        
        <!-- Card 1: Koupat Holim (Bientôt disponible - CUSTOM PHOTO) -->
        <div style="background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); overflow: hidden; display: grid; grid-template-columns: 0.9fr 1.1fr; height: 100%;">
          <div style="height: 100%; min-height: 280px; position: relative;">
            <img src="assets/images/koupat_holim.jpg?v=2701" alt="Koupat Holim Maccabi" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="padding: 2rem 1.8rem; display: flex; flex-direction: column;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.5rem;">
              <h3 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--text-main); line-height: 1.2; margin: 0;">
                Koupat Holim
              </h3>
              <span style="background: #F1F5F9; color: #475569; border: 1px solid #E2E8F0; padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-weight: 700; font-size: 0.75rem; white-space: nowrap;">
                <i class="fa-solid fa-clock"></i> Bientôt disponible
              </span>
            </div>
            <div style="font-weight: 700; font-size: 0.92rem; color: var(--text-main); margin-bottom: 0.75rem;">
              Votre couverture santé en Israël, sans stress.
            </div>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
              Nous vous accompagnerons gratuitement dans toutes vos démarches afin d’obtenir rapidement votre affiliation Koupat Holim (Maccabi, Clalit, Meuhedet, Leumit).
            </p>
            <div style="margin-top: auto; display: flex; flex-direction: column; gap: 0.65rem; align-items: flex-end;">
              <button class="btn" disabled style="background: #F1F5F9; color: #94A3B8; border: 1px solid #E2E8F0; border-radius: var(--radius-full); padding: 0.6rem 1.4rem; font-size: 0.85rem; font-weight: 700; cursor: not-allowed;">
                <i class="fa-solid fa-lock"></i> Bientôt disponible
              </button>
            </div>
          </div>
        </div>

        <!-- Card 2: Visa étudiant (A/2) (Bientôt disponible) -->
        <div style="background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); overflow: hidden; display: grid; grid-template-columns: 0.9fr 1.1fr; height: 100%;">
          <div style="height: 100%; min-height: 280px; position: relative;">
            <img src="assets/images/visa_etudiant.jpg?v=2701" alt="Visa étudiant A/2" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="padding: 2rem 1.8rem; display: flex; flex-direction: column;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; margin-bottom: 0.5rem;">
              <h3 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--text-main); line-height: 1.2; margin: 0;">
                Visa étudiant (A/2)
              </h3>
              <span style="background: #F1F5F9; color: #475569; border: 1px solid #E2E8F0; padding: 0.25rem 0.75rem; border-radius: var(--radius-full); font-weight: 700; font-size: 0.75rem; white-space: nowrap;">
                <i class="fa-solid fa-clock"></i> Bientôt disponible
              </span>
            </div>
            <div style="font-weight: 700; font-size: 0.92rem; color: var(--text-main); margin-bottom: 0.75rem;">
              Étudiez en Israël en toute sérénité.
            </div>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
              De la première demande au renouvellement, notre équipe vous accompagnera à chaque étape auprès des services du Consulat et du Misrad HaPnim.
            </p>
            <div style="margin-top: auto; display: flex; flex-direction: column; gap: 0.65rem; align-items: flex-end;">
              <button class="btn" disabled style="background: #F1F5F9; color: #94A3B8; border: 1px solid #E2E8F0; border-radius: var(--radius-full); padding: 0.6rem 1.4rem; font-size: 0.85rem; font-weight: 700; cursor: not-allowed;">
                <i class="fa-solid fa-lock"></i> Bientôt disponible
              </button>
            </div>
          </div>
        </div>

        <!-- Card 3: ETA-IL -->
        <div style="background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); overflow: hidden; display: grid; grid-template-columns: 0.9fr 1.1fr; height: 100%;">
          <div style="height: 100%; min-height: 280px; position: relative;">
            <img src="assets/images/eta_il.jpg?v=2701" alt="ETA-IL" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="padding: 2rem 1.8rem; display: flex; flex-direction: column;">
            <h3 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.75rem; line-height: 1.2;">
              ETA-IL
            </h3>
            <div style="font-weight: 700; font-size: 0.92rem; color: var(--text-main); margin-bottom: 0.75rem;">
              Préparez votre entrée en Israël en quelques clics.
            </div>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
              Nous vous guidons pour effectuer votre demande d’ETA-IL rapidement et sans erreur avant votre vol.
            </p>
            <div style="margin-top: auto; display: flex; flex-direction: column; gap: 0.65rem; align-items: flex-end;">
              <button class="btn btn-service-form" data-service="ETA-IL" style="background: #0F2537; color: white; border-radius: var(--radius-full); padding: 0.6rem 1.4rem; font-size: 0.85rem; font-weight: 700;">
                En savoir plus
              </button>
              <a href="https://israel-entry.piba.gov.il/" target="_blank" class="btn btn-outline-pill" style="padding: 0.55rem 1.25rem; font-size: 0.85rem;">
                Site officiel <i class="fa-solid fa-arrow-up-right-from-square"></i>
              </a>
            </div>
          </div>
        </div>

        <!-- Card 4: Installation en Israël -->
        <div style="background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); overflow: hidden; display: grid; grid-template-columns: 0.9fr 1.1fr; height: 100%;">
          <div style="height: 100%; min-height: 280px; position: relative;">
            <img src="assets/images/installation_israel.jpg?v=2701" alt="Installation en Israël" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="padding: 2rem 1.8rem; display: flex; flex-direction: column;">
            <h3 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.75rem; line-height: 1.2;">
              Installation en Israël
            </h3>
            <div style="font-weight: 700; font-size: 0.92rem; color: var(--text-main); margin-bottom: 0.75rem;">
              Tout ce qu’il faut pour bien démarrer votre nouvelle vie.
            </div>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
              Retrouvez toutes les informations essentielles et l'aide personnalisée pour préparer votre arrivée.
            </p>
            <div style="margin-top: auto; display: flex; flex-direction: column; gap: 0.65rem; align-items: flex-end;">
              <button class="btn btn-service-form" data-service="Installation en Israël" style="background: #0F2537; color: white; border-radius: var(--radius-full); padding: 0.6rem 1.4rem; font-size: 0.85rem; font-weight: 700;">
                En savoir plus
              </button>
              <button class="btn btn-outline-pill btn-service-form" data-service="Installation en Israël" style="padding: 0.55rem 1.25rem; font-size: 0.85rem;">
                Faire une demande
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- Card 5: Boutique literie (Full width split card) -->
      <div style="background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); overflow: hidden; display: grid; grid-template-columns: 0.9fr 1.1fr; max-width: 900px; margin: 0 auto;">
        <div style="height: 100%; min-height: 280px; position: relative;">
          <img src="assets/images/boutique_literie.jpg?v=2701" alt="Boutique literie & Équipements" style="width: 100%; height: 100%; object-fit: cover;">
        </div>
        <div style="padding: 2rem 1.8rem; display: flex; flex-direction: column;">
          <h3 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.75rem; line-height: 1.2;">
            Boutique literie & Équipements
          </h3>
          <div style="font-weight: 700; font-size: 0.92rem; color: var(--text-main); margin-bottom: 0.75rem;">
            Installez-vous dès votre arrivée.
          </div>
          <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
            Commandez votre kit de literie complet, couettes, oreillers, téléphone kasher et retrouvez votre matériel livré au séminaire.
          </p>
          <div style="margin-top: auto; display: flex; flex-direction: column; gap: 0.65rem; align-items: flex-end;">
            <button class="btn btn-service-go-boutique" style="background: #0F2537; color: white; border-radius: var(--radius-full); padding: 0.6rem 1.4rem; font-size: 0.85rem; font-weight: 700;">
              Voir la boutique
            </button>
            <button class="btn btn-pink-gradient" id="btn-kit-order-direct" style="padding: 0.55rem 1.25rem; font-size: 0.85rem;">
              Commander mon kit
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    document.querySelectorAll('.btn-service-go-boutique').forEach(btn => {
      btn.addEventListener('click', () => onNavigate('boutique'));
    });

    document.querySelectorAll('.btn-service-go-visa').forEach(btn => {
      btn.addEventListener('click', () => onNavigate('visa'));
    });

    document.getElementById('btn-kit-order-direct')?.addEventListener('click', () => onNavigate('boutique'));

    // Service form modal triggers
    document.querySelectorAll('.btn-service-form').forEach(btn => {
      btn.addEventListener('click', () => {
        const service = btn.getAttribute('data-service');
        showServiceFormModal(service);
      });
    });
  }, 0);

  return html;
}
