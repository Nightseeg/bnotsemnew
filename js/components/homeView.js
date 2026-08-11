/* ==========================================================================
   BNOT SÉMINAIRE - HOME PAGE VIEW (HERO & NOS SERVICES MATCHING USER IMAGES)
   ========================================================================== */

import { Storage } from '../storage.js';
import { showServiceFormModal } from './formModal.js';

export function renderHomeView(onNavigate, onOpenAuthModal) {
  const html = `
    <div class="home-view">
      <!-- SECTION 1: HERO SECTION (2 COLUMNS MATCHING SCREENSHOT EXACTLY) -->
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

            <!-- Buttons Row -->
            <div style="display: flex; flex-wrap: wrap; gap: 0.85rem; align-items: center; margin-bottom: 1rem;">
              <button class="btn btn-hero-primary" id="btn-hero-study" style="background: linear-gradient(135deg, #F9832A, #E85D04); color: white; border-radius: var(--radius-full); padding: 0.85rem 1.8rem; font-weight: 700; box-shadow: 0 6px 20px rgba(232, 93, 4, 0.25);">
                Je viens étudier en Israël
              </button>

              <button class="btn btn-outline-pill" id="btn-hero-don" style="padding: 0.85rem 1.6rem; font-weight: 700;">
                Faire un don
              </button>

              <button class="btn btn-hero-dark" id="btn-hero-register" style="background: #0F2537; color: white; border-radius: var(--radius-full); padding: 0.85rem 1.8rem; font-weight: 700; box-shadow: 0 6px 20px rgba(15, 37, 55, 0.2);">
                M'inscrire
              </button>
            </div>

            <!-- Secondary Button Row below -->
            <div>
              <button class="btn btn-outline-pill" id="btn-hero-dvar" style="padding: 0.65rem 1.4rem; font-size: 0.88rem; font-weight: 600;">
                Dvar Torah de la semaine
              </button>
            </div>
          </div>

          <!-- RIGHT COLUMN: FLOATING CARD (MATCHING SCREENSHOT EXACTLY) -->
          <div>
            <div style="background: var(--bg-card); border-radius: 24px; padding: 2rem 1.8rem; box-shadow: 0 12px 40px rgba(65, 58, 74, 0.08); border: 1px solid var(--border-color);">
              <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; color: var(--text-main); margin-bottom: 1.5rem;">
                Parcours nouvelle arrivante
              </h3>

              <div style="display: flex; flex-direction: column; gap: 0.9rem;">
                <!-- Row 1: Visa -->
                <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-main); border: 1px solid var(--border-color); padding: 0.85rem 1.25rem; border-radius: 16px;">
                  <span style="font-weight: 700; font-size: 0.92rem; color: var(--text-main);">Visa étudiant</span>
                  <button class="btn-hero-tag btn-hero-form" data-service="Visa étudiant" style="background: #FDF2EE; color: #E85D04; border: 1px solid #FCD7C6; padding: 0.3rem 0.9rem; border-radius: var(--radius-full); font-weight: 700; font-size: 0.8rem;">
                    Formulaire
                  </button>
                </div>

                <!-- Row 2: Koupat Holim -->
                <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-main); border: 1px solid var(--border-color); padding: 0.85rem 1.25rem; border-radius: 16px;">
                  <span style="font-weight: 700; font-size: 0.92rem; color: var(--text-main);">Koupat Holim</span>
                  <button class="btn-hero-tag btn-hero-form" data-service="Koupat Holim" style="background: #FDF2EE; color: #E85D04; border: 1px solid #FCD7C6; padding: 0.3rem 0.9rem; border-radius: var(--radius-full); font-weight: 700; font-size: 0.8rem;">
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
      <div style="margin-bottom: 4.5rem;">
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

      <!-- SECTION 3: NOS SERVICES (HORIZONTAL SPLIT CARDS WITH IMAGES MATCHING SCREENSHOT EXACTLY) -->
      <div style="margin-bottom: 4rem;">
        <!-- Header Row -->
        <div style="display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem; margin-bottom: 3rem;">
          <h2 style="font-family: var(--font-serif); font-size: 3rem; font-weight: 700; color: var(--text-main);">
            Nos services
          </h2>
          <p style="font-size: 0.98rem; color: var(--text-muted); line-height: 1.6; max-width: 540px;">
            Avant l’arrivée comme pendant l’année, notre équipe vous accompagne dans les démarches qui comptent pour vous installer sereinement et garder un lien clair avec Bnot Séminaire.
          </p>
        </div>

        <!-- 2 Columns Grid of Split Horizontal Cards -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; margin-bottom: 2rem;">
          
          <!-- Card 1: Assurance maladie (Matching Screenshot) -->
          <div style="background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); overflow: hidden; display: grid; grid-template-columns: 0.9fr 1.1fr; height: 100%;">
            <div style="height: 100%; min-height: 280px; position: relative;">
              <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80" alt="Assurance maladie" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="padding: 2rem 1.8rem; display: flex; flex-direction: column;">
              <h3 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.75rem; line-height: 1.2;">
                Assurance maladie
              </h3>
              <div style="font-weight: 700; font-size: 0.92rem; color: var(--text-main); margin-bottom: 0.75rem;">
                Votre couverture santé en Israël, sans stress.
              </div>
              <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
                Nous vous accompagnons gratuitement dans toutes vos démarches afin d’obtenir rapidement votre assurance maladie.
              </p>
              <div style="margin-top: auto; display: flex; flex-direction: column; gap: 0.65rem; align-items: flex-end;">
                <button class="btn btn-service-go-koupat" style="background: #0F2537; color: white; border-radius: var(--radius-full); padding: 0.6rem 1.4rem; font-size: 0.85rem; font-weight: 700;">
                  En savoir plus
                </button>
                <button class="btn btn-outline-pill btn-service-form" data-service="Assurance maladie" style="padding: 0.55rem 1.25rem; font-size: 0.85rem;">
                  Faire une demande
                </button>
              </div>
            </div>
          </div>

          <!-- Card 2: Visa étudiant (Matching Screenshot) -->
          <div style="background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); overflow: hidden; display: grid; grid-template-columns: 0.9fr 1.1fr; height: 100%;">
            <div style="height: 100%; min-height: 280px; position: relative;">
              <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=600&q=80" alt="Visa étudiant" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="padding: 2rem 1.8rem; display: flex; flex-direction: column;">
              <h3 style="font-family: var(--font-heading); font-size: 1.6rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.75rem; line-height: 1.2;">
                Visa étudiant
              </h3>
              <div style="font-weight: 700; font-size: 0.92rem; color: var(--text-main); margin-bottom: 0.75rem;">
                Étudiez en Israël en toute sérénité.
              </div>
              <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
                De la première demande au renouvellement, notre équipe vous accompagne à chaque étape de votre dossier.
              </p>
              <div style="margin-top: auto; display: flex; flex-direction: column; gap: 0.65rem; align-items: flex-end;">
                <button class="btn btn-service-go-visa" style="background: #0F2537; color: white; border-radius: var(--radius-full); padding: 0.6rem 1.4rem; font-size: 0.85rem; font-weight: 700;">
                  En savoir plus
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
                Nous vous guidons pour effectuer votre demande d’ETA-IL rapidement et sans erreur.
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
                Retrouvez toutes les informations essentielles pour préparer sereinement votre arrivée en Israël.
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
              Boutique literie
            </h3>
            <div style="font-weight: 700; font-size: 0.92rem; color: var(--text-main); margin-bottom: 0.75rem;">
              Installez-vous dès votre arrivée.
            </div>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 1.5rem;">
              Commandez votre kit de literie complet et retrouvez un logement prêt à vous accueillir.
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
    </div>
  `;

  setTimeout(() => {
    // Navigation handlers
    document.getElementById('btn-hero-study')?.addEventListener('click', () => showServiceFormModal('Visa étudiant'));
    document.getElementById('btn-hero-don')?.addEventListener('click', () => window.showToast('Page de don en cours de préparation.', 'info'));
    document.getElementById('btn-hero-register')?.addEventListener('click', () => onOpenAuthModal('signup'));
    document.getElementById('btn-hero-dvar')?.addEventListener('click', () => window.showToast('Le Dvar Torah de la semaine sera publié chaque jeudi !', 'info'));
    
    document.getElementById('btn-hero-card-boutique')?.addEventListener('click', () => onNavigate('boutique'));
    document.getElementById('btn-card-boutique')?.addEventListener('click', () => onNavigate('boutique'));
    
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
    document.getElementById('btn-card-create-space')?.addEventListener('click', () => onOpenAuthModal('signup'));

    // Service form modal triggers
    document.querySelectorAll('.btn-hero-form, .btn-service-form').forEach(btn => {
      btn.addEventListener('click', () => {
        const service = btn.getAttribute('data-service');
        showServiceFormModal(service);
      });
    });
  }, 0);

  return html;
}
