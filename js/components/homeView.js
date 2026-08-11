/* ==========================================================================
   BNOT SÉMINAIRE - HOME PAGE VIEW (HERO BUTTONS UPDATED)
   ========================================================================== */

import { Storage } from '../storage.js';

export function renderHomeView(onNavigate, onOpenAuthModal) {
  const html = `
    <div class="home-view">
      <!-- SECTION 1: HERO SECTION -->
      <div style="padding: 2.5rem 0 4rem; margin-bottom: 3.5rem;">
        <div style="display: grid; grid-template-columns: 1.2fr 0.9fr; gap: 3rem; align-items: center;">
          
          <!-- LEFT COLUMN -->
          <div>
            <!-- Pill Badge Top -->
            <div style="display: inline-block; background: #FDEEE9; color: #D96B43; border: 1px solid #F8D7CC; font-size: 0.75rem; font-weight: 800; letter-spacing: 0.08em; padding: 0.35rem 1.1rem; border-radius: var(--radius-full); text-transform: uppercase; margin-bottom: 1.5rem;">
              FRANCE - ISRAËL
            </div>

            <!-- Big Title -->
            <h1 style="font-family: var(--font-serif); font-size: 3.6rem; font-weight: 700; color: var(--text-main); line-height: 1.1; margin-bottom: 1.25rem; letter-spacing: -0.02em;">
              Bnot Séminaire
            </h1>

            <!-- Description -->
            <p style="font-size: 1.1rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 2rem; max-width: 580px;">
              La plateforme de référence pour accompagner les jeunes filles de séminaire, étudiantes et leurs familles : Démarches administratives, boutique, événements, dons et plein d'autres choses à venir.
            </p>

            <!-- Buttons Row (Préparer mon arrivée & Découvrir la boutique) -->
            <div style="display: flex; flex-wrap: wrap; gap: 0.85rem; align-items: center; margin-bottom: 1rem;">
              <button class="btn btn-hero-dark" id="btn-hero-prepare" style="background: #0F2537; color: white; border-radius: var(--radius-full); padding: 0.85rem 2rem; font-weight: 700; box-shadow: 0 6px 20px rgba(15, 37, 55, 0.2);">
                Préparer mon arrivée
              </button>

              <button class="btn btn-outline-pill" id="btn-hero-boutique" style="padding: 0.85rem 1.8rem; font-weight: 700;">
                Découvrir la boutique
              </button>
            </div>
          </div>

          <!-- RIGHT COLUMN: FLOATING CARD -->
          <div>
            <div style="background: var(--bg-card); border-radius: 24px; padding: 2rem 1.8rem; box-shadow: 0 12px 40px rgba(65, 58, 74, 0.08); border: 1px solid var(--border-color);">
              <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin-bottom: 1.5rem;">
                Parcours nouvelle arrivante
              </h3>

              <div style="display: flex; flex-direction: column; gap: 0.9rem;">
                <!-- Row 1: Visa -->
                <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-main); border: 1px solid var(--border-color); padding: 0.85rem 1.25rem; border-radius: 16px;">
                  <span style="font-weight: 700; font-size: 0.92rem; color: var(--text-main);">Visa étudiant</span>
                  <button class="btn-hero-tag" id="btn-card-visa-nav" style="background: #FDF2EE; color: #E85D04; border: 1px solid #FCD7C6; padding: 0.3rem 0.9rem; border-radius: var(--radius-full); font-weight: 700; font-size: 0.8rem;">
                    Formulaire
                  </button>
                </div>

                <!-- Row 2: Koupat Holim -->
                <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-main); border: 1px solid var(--border-color); padding: 0.85rem 1.25rem; border-radius: 16px;">
                  <span style="font-weight: 700; font-size: 0.92rem; color: var(--text-main);">Koupat Holim</span>
                  <button class="btn-hero-tag" id="btn-card-koupat-nav" style="background: #FDF2EE; color: #E85D04; border: 1px solid #FCD7C6; padding: 0.3rem 0.9rem; border-radius: var(--radius-full); font-weight: 700; font-size: 0.8rem;">
                    Formulaire
                  </button>
                </div>

                <!-- Row 3: ETA-IL -->
                <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-main); border: 1px solid var(--border-color); padding: 0.85rem 1.25rem; border-radius: 16px;">
                  <span style="font-weight: 700; font-size: 0.92rem; color: var(--text-main);">ETA-IL</span>
                  <a href="https://israel-entry.piba.gov.il/" target="_blank" style="background: #EFF8FF; color: #175CD3; border: 1px solid #B2DDFF; padding: 0.3rem 0.9rem; border-radius: var(--radius-full); font-weight: 700; font-size: 0.8rem; text-decoration: none;">
                    Site officiel <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.7rem;"></i>
                  </a>
                </div>

                <!-- Row 4: Kit literie -->
                <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-main); border: 1px solid var(--border-color); padding: 0.85rem 1.25rem; border-radius: 16px;">
                  <span style="font-weight: 700; font-size: 0.92rem; color: var(--text-main);">Kit literie</span>
                  <button class="btn-hero-tag" id="btn-hero-card-boutique" style="background: #ECFDF3; color: #027A48; border: 1px solid #ABEFC6; padding: 0.3rem 0.9rem; border-radius: var(--radius-full); font-weight: 700; font-size: 0.8rem;">
                    Boutique
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- SECTION 2: PARCOURS VERS LE SÉMINAIRE -->
      <div style="margin-bottom: 2rem;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem;">
          <span class="badge-pill-pink">ACCOMPAGNEMENT SUR MESURE</span>
          <h2 style="font-family: var(--font-serif); font-size: 2.3rem; font-weight: 600; color: var(--text-main); text-align: right;">
            Votre parcours vers le séminaire
          </h2>
        </div>

        <div class="grid-3">
          <!-- Card 1 -->
          <div class="step-card">
            <div class="icon-badge-circle">
              <i class="fa-solid fa-check"></i>
            </div>
            <h3 class="step-card-title">1. Préparer mon arrivée</h3>
            <div class="step-card-subtitle">Prépare ton année. Nous préparons ton arrivée.</div>
            <p class="step-card-text">
              L'année de séminaire est une étape unique, consacrée à la Torah, à la construction personnelle et à l'épanouissement. Pour vous permettre de vous concentrer sur l'essentiel, nous vous accompagnons dans la préparation de votre arrivée en Israël, avec tout le nécessaire soigneusement sélectionné et disponible sur place.
            </p>
          </div>

          <!-- Card 2 -->
          <div class="step-card">
            <div class="icon-badge-circle">
              <i class="fa-solid fa-cart-shopping"></i>
            </div>
            <h3 class="step-card-title">2. Découvrir la boutique</h3>
            <div class="step-card-subtitle">Tout votre équipement prêt dès le premier jour.</div>
            <p class="step-card-text">
              Commandez votre kit literie complet, couettes, oreillers et linge de maison livrés directement dans votre séminaire ou logement avant votre arrivée en Israël.
            </p>
            <div style="margin-top: auto;">
              <button class="btn btn-outline-pill btn-full" id="btn-card-boutique">
                Découvrir la boutique
              </button>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="step-card">
            <div class="icon-badge-circle">
              <i class="fa-solid fa-user"></i>
            </div>
            <h3 class="step-card-title">3. Créer mon espace</h3>
            <div class="step-card-subtitle">Votre espace personnel sécurisé.</div>
            <p class="step-card-text">
              Renseignez vos démarches de visa étudiant, Koupat Holim, commandes boutique et suivez l'avancement de votre dossier en direct.
            </p>
            <div style="margin-top: auto;">
              <button class="btn btn-pink-gradient btn-full" id="btn-card-create-space">
                Créer mon espace
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    document.getElementById('btn-hero-prepare')?.addEventListener('click', () => onNavigate('services'));
    document.getElementById('btn-hero-boutique')?.addEventListener('click', () => onNavigate('boutique'));
    
    document.getElementById('btn-card-visa-nav')?.addEventListener('click', () => onNavigate('visa'));
    document.getElementById('btn-card-koupat-nav')?.addEventListener('click', () => onNavigate('koupat'));
    document.getElementById('btn-hero-card-boutique')?.addEventListener('click', () => onNavigate('boutique'));
    document.getElementById('btn-card-boutique')?.addEventListener('click', () => onNavigate('boutique'));
    document.getElementById('btn-card-create-space')?.addEventListener('click', () => onOpenAuthModal('signup'));
  }, 0);

  return html;
}
