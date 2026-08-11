/* ==========================================================================
   BNOT SÉMINAIRE - NOS SERVICES (DEDICATED FULL PAGE VIEW WITH CUSTOM VISA IMAGE)
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
        
        <!-- Card 1: Koupat Holim -->
        <div style="background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); overflow: hidden; display: grid; grid-template-columns: 0.9fr 1.1fr; height: 100%;">
          <div style="height: 100%; min-height: 280px; position: relative;">
            <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80" alt="Koupat Holim" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="padding: 2rem 1.8rem; display: flex; flex-direction: column;">
            <h3 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.75rem; line-height: 1.2;">
              Koupat Holim
            </h3>
            <div style="font-weight: 700; font-size: 0.92rem; color: var(--text-main); margin-bottom: 0.75rem;">
              Votre couverture santé en Israël, sans stress.
            </div>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
              Nous vous accompagnons gratuitement dans toutes vos démarches afin d’obtenir rapidement votre affiliation Koupat Holim (Maccabi, Clalit, Meuhedet, Leumit).
            </p>
            <div style="margin-top: auto; display: flex; flex-direction: column; gap: 0.65rem; align-items: flex-end;">
              <button class="btn btn-service-go-koupat" style="background: #0F2537; color: white; border-radius: var(--radius-full); padding: 0.6rem 1.4rem; font-size: 0.85rem; font-weight: 700;">
                Accéder au Formulaire
              </button>
              <button class="btn btn-outline-pill btn-service-form" data-service="Koupat Holim" style="padding: 0.55rem 1.25rem; font-size: 0.85rem;">
                En savoir plus
              </button>
            </div>
          </div>
        </div>

        <!-- Card 2: Visa étudiant (A/2) - CUSTOM IMAGE -->
        <div style="background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); overflow: hidden; display: grid; grid-template-columns: 0.9fr 1.1fr; height: 100%;">
          <div style="height: 100%; min-height: 280px; position: relative;">
            <img src="assets/images/visa_etudiant.jpg?v=2101" alt="Visa étudiant A/2" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="padding: 2rem 1.8rem; display: flex; flex-direction: column;">
            <h3 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.75rem; line-height: 1.2;">
              Visa étudiant (A/2)
            </h3>
            <div style="font-weight: 700; font-size: 0.92rem; color: var(--text-main); margin-bottom: 0.75rem;">
              Étudiez en Israël en toute sérénité.
            </div>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
              De la première demande au renouvellement, notre équipe vous accompagne à chaque étape auprès des services du Consulat et du Misrad HaPnim.
            </p>
            <div style="margin-top: auto; display: flex; flex-direction: column; gap: 0.65rem; align-items: flex-end;">
              <button class="btn btn-service-go-visa" style="background: #0F2537; color: white; border-radius: var(--radius-full); padding: 0.6rem 1.4rem; font-size: 0.85rem; font-weight: 700;">
                Accéder au Formulaire
              </button>
              <button class="btn btn-outline-pill btn-service-form" data-service="Visa étudiant" style="padding: 0.55rem 1.25rem; font-size: 0.85rem;">
                Déposer mon dossier
              </button>
            </div>
          </div>
        </div>

        <!-- Card 3: ETA-IL -->
        <div style="background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); overflow: hidden; display: grid; grid-template-columns: 0.9fr 1.1fr; height: 100%;">
          <div style="height: 100%; min-height: 280px; position: relative;">
            <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80" alt="ETA-IL" style="width: 100%; height: 100%; object-fit: cover;">
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
            <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80" alt="Installation" style="width: 100%; height: 100%; object-fit: cover;">
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
          <img src="https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80" alt="Boutique literie" style="width: 100%; height: 100%; object-fit: cover;">
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
    
    document.querySelectorAll('.btn-service-go-koupat').forEach(btn => {
      btn.addEventListener('click', () => onNavigate('koupat'));
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
