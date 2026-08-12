/* ==========================================================================
   BNOT SÉMINAIRE - INSTALLATION EN ISRAËL PAGE & INTERACTIVE CHECKLIST
   ========================================================================== */

const STORAGE_KEY_STEPS = 'bnot_installation_completed_steps';

function getCompletedSteps() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_STEPS) || '[]');
  } catch (e) {
    return [];
  }
}

function saveCompletedSteps(steps) {
  try {
    localStorage.setItem(STORAGE_KEY_STEPS, JSON.stringify(steps));
  } catch (e) {}
}

export function renderInstallationView(onNavigate) {
  let completed = getCompletedSteps();
  const totalSteps = 7;

  const html = `
    <div class="installation-view" style="max-width: 1180px; margin: 0 auto 4rem; padding: 0 1rem;">

      <!-- Back button -->
      <div style="margin-bottom: 1.5rem;">
        <button class="btn btn-outline-pill" id="btn-install-back" style="font-size: 0.85rem;">
          <i class="fa-solid fa-arrow-left"></i> Retour aux services
        </button>
      </div>

      <!-- HERO SECTION (matching exact screenshot design) -->
      <div style="background: linear-gradient(135deg, #0B192C 0%, #1E3A5F 100%); border-radius: 28px; padding: 3rem 2.5rem; color: white; margin-bottom: 3rem; box-shadow: 0 20px 40px rgba(11, 25, 44, 0.15); overflow: hidden; position: relative;">
        
        <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 2.5rem; align-items: center;" class="hero-grid-responsive">
          
          <!-- Left Column: Copy & Actions -->
          <div>
            <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255, 255, 255, 0.12); backdrop-filter: blur(10px); padding: 0.4rem 1.1rem; border-radius: var(--radius-full); font-size: 0.78rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1.5rem; border: 1px solid rgba(255, 255, 255, 0.2);">
              <i class="fa-solid fa-plane-arrival" style="color: #FFB703;"></i> JE VIENS ÉTUDIER EN ISRAËL
            </div>

            <h1 style="font-family: var(--font-heading); font-size: clamp(2.2rem, 4vw, 3.2rem); font-weight: 800; line-height: 1.15; margin-bottom: 1.25rem; color: #FFFFFF;">
              Votre arrivée en Israël<br><span style="color: #FFB703;">commence ici</span>
            </h1>

            <p style="font-size: 1.05rem; line-height: 1.65; color: rgba(255, 255, 255, 0.85); margin-bottom: 2rem; max-width: 520px;">
              Vous venez étudier en Israël ? Bnot Séminaire vous accompagne avant votre départ, lors de votre arrivée et tout au long de votre parcours.
            </p>

            <div style="display: flex; flex-wrap: wrap; gap: 0.85rem; margin-bottom: 2rem;">
              <button class="btn" id="btn-hero-start-steps" style="background: linear-gradient(135deg, #FF9F1C 0%, #FF8552 100%); color: white; border: none; padding: 0.85rem 1.75rem; border-radius: var(--radius-full); font-weight: 700; font-size: 0.95rem; box-shadow: 0 4px 15px rgba(255, 159, 28, 0.35); transition: all 0.2s ease;">
                Commencer mon accompagnement <i class="fa-solid fa-arrow-right" style="margin-left: 0.4rem;"></i>
              </button>
              <button class="btn" id="btn-hero-contact-us" style="background: rgba(255, 255, 255, 0.95); color: #0B192C; border: none; padding: 0.85rem 1.75rem; border-radius: var(--radius-full); font-weight: 700; font-size: 0.95rem; transition: all 0.2s ease;">
                Nous contacter
              </button>
            </div>

            <!-- Sub-pills -->
            <div style="display: flex; flex-wrap: wrap; gap: 0.6rem;">
              <span style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); padding: 0.35rem 0.85rem; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.9);">
                <i class="fa-solid fa-clipboard-check" style="color: #FFB703; margin-right: 0.35rem;"></i> Avant le départ
              </span>
              <span style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); padding: 0.35rem 0.85rem; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.9);">
                <i class="fa-solid fa-plane-arrival" style="color: #FFB703; margin-right: 0.35rem;"></i> À l'arrivée
              </span>
              <span style="background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); padding: 0.35rem 0.85rem; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 600; color: rgba(255,255,255,0.9);">
                <i class="fa-solid fa-heart" style="color: #FFB703; margin-right: 0.35rem;"></i> Tout au long du parcours
              </span>
            </div>
          </div>

          <!-- Right Column: Visual Image Collage Grid (matching screenshot) -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem;" class="hero-image-grid">
            <div style="grid-row: span 2; border-radius: 20px; overflow: hidden; height: 260px; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
              <img src="assets/images/installation_israel.jpg" alt="Arrivée en Israël" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="border-radius: 20px; overflow: hidden; height: 125px; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
              <img src="assets/images/boutique_literie.jpg" alt="Installation" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div style="border-radius: 20px; overflow: hidden; height: 125px; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
              <img src="assets/images/koupat_holim.jpg" alt="Séminaire" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <!-- Bottom logo banner card -->
            <div style="grid-column: span 2; background: rgba(255, 255, 255, 0.95); border-radius: 20px; padding: 1rem 1.25rem; display: flex; align-items: center; justify-content: space-between; color: #0B192C; box-shadow: 0 10px 25px rgba(0,0,0,0.2);">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <img src="assets/images/bnot_logo_transparent.png" alt="Bnot Séminaire" style="height: 38px; object-fit: contain;">
                <div>
                  <div style="font-weight: 800; font-size: 0.9rem; line-height: 1.2;">Bnot Séminaire</div>
                  <div style="font-size: 0.72rem; color: var(--text-muted); font-weight: 600;">Accompagnement & Sécurité</div>
                </div>
              </div>
              <span class="badge badge-success" style="font-size: 0.75rem;"><i class="fa-solid fa-circle-check"></i> Partenaire certifié</span>
            </div>
          </div>

        </div>
      </div>

      <!-- SECTION 2: Ne partez pas seul en Israël -->
      <div style="margin-bottom: 3.5rem;">
        <div style="text-align: center; max-width: 720px; margin: 0 auto 2.5rem;">
          <h2 style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.75rem;">
            Ne partez pas seul en Israël
          </h2>
          <p style="font-size: 0.98rem; color: var(--text-muted); line-height: 1.7;">
            Entre les démarches administratives, l’installation et la recherche d’un cadre adapté, beaucoup de questions peuvent se poser. Bnot Séminaire accompagne les jeunes filles francophones pour arriver sereinement et bien commencer cette nouvelle étape.
          </p>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;">
          <!-- Feature 1 -->
          <div class="card" style="padding: 1.75rem; text-align: center; border-radius: 20px; transition: transform 0.2s ease;">
            <div style="width: 56px; height: 56px; border-radius: 16px; background: rgba(236, 72, 153, 0.12); color: var(--accent-1); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin: 0 auto 1.25rem;">
              <i class="fa-solid fa-map-location-dot"></i>
            </div>
            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; margin-bottom: 0.6rem;">
              Un chemin guidé
            </h3>
            <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; margin: 0;">
              Chaque étape est balisée : vous savez toujours quelle est la prochaine action.
            </p>
          </div>

          <!-- Feature 2 -->
          <div class="card" style="padding: 1.75rem; text-align: center; border-radius: 20px; transition: transform 0.2s ease;">
            <div style="width: 56px; height: 56px; border-radius: 16px; background: rgba(59, 130, 246, 0.12); color: #3B82F6; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin: 0 auto 1.25rem;">
              <i class="fa-solid fa-comments"></i>
            </div>
            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; margin-bottom: 0.6rem;">
              Une équipe francophone
            </h3>
            <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; margin: 0;">
              Des personnes qui connaissent le terrain et votre langue, à chaque étape.
            </p>
          </div>

          <!-- Feature 3 -->
          <div class="card" style="padding: 1.75rem; text-align: center; border-radius: 20px; transition: transform 0.2s ease;">
            <div style="width: 56px; height: 56px; border-radius: 16px; background: rgba(16, 185, 129, 0.12); color: #10B981; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; margin: 0 auto 1.25rem;">
              <i class="fa-solid fa-smile-beam"></i>
            </div>
            <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 800; margin-bottom: 0.6rem;">
              Une arrivée sereine
            </h3>
            <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.6; margin: 0;">
              Vous commencez votre nouvelle étape dans les meilleures conditions.
            </p>
          </div>
        </div>
      </div>

      <!-- SECTION 3: Mon parcours étape par étape (INTERACTIVE CHECKLIST) -->
      <div id="section-parcours" style="background: var(--bg-card); border-radius: 28px; border: 1px solid var(--border-color); padding: 2.5rem 2rem; box-shadow: var(--shadow-sm); margin-bottom: 3.5rem;">
        
        <div style="text-align: center; max-width: 700px; margin: 0 auto 2rem;">
          <span class="badge-pill-pink" style="margin-bottom: 0.75rem;">
            <i class="fa-solid fa-list-check"></i> Progression personnalisée
          </span>
          <h2 style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.75rem;">
            Mon parcours étape par étape
          </h2>
          <p style="font-size: 0.95rem; color: var(--text-muted); line-height: 1.6;">
            Un chemin clair, de la préparation de votre départ jusqu’à votre intégration dans la communauté. Cochez chaque étape au fur et à mesure : votre progression est gardée en mémoire sur cet appareil.
          </p>
        </div>

        <!-- Progress Counter Box -->
        <div id="progress-box-wrapper" style="max-width: 550px; margin: 0 auto 2.5rem; background: var(--bg-main); border: 1px solid var(--border-color); border-radius: 20px; padding: 1.5rem; text-align: center;">
          ${renderProgressWidget(completed, totalSteps)}
        </div>

        <!-- Steps List (01 to 07) -->
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">

          <!-- STEP 01 -->
          ${renderStepCard(1, 'Avant mon départ', 'Je prépare mon arrivée', 'Nous vous aidons à préparer votre arrivée sereinement, bien avant de monter dans l’avion.', [
            'Notre guide complet d’installation en Israël.',
            'Les informations pratiques essentielles.',
            'La checklist des choses importantes.',
            'Les conseils pour organiser votre départ.'
          ], completed.includes(1))}

          <!-- STEP 02 -->
          ${renderStepCard(2, 'Mon visa étudiant', 'Je prépare mon visa', 'Nous vous accompagnons dans vos démarches de visa étudiant afin de faciliter votre arrivée en Israël.', [
            'Comprendre les démarches.',
            'Préparer les documents.',
            'Déposer votre demande.',
            'Suivre votre dossier.'
          ], completed.includes(2))}

          <!-- STEP 03 -->
          ${renderStepCard(3, 'Mon assurance maladie', 'Je prépare ma couverture santé', 'Nous vous accompagnons pour effectuer votre inscription auprès des caisses d’assurance maladie israéliennes (Koupat Holim).', [], completed.includes(3))}

          <!-- STEP 04 -->
          ${renderStepCard(4, 'Mon autorisation ETA-IL', 'Je prépare mon entrée en Israël', 'Nous vous aidons à comprendre et effectuer votre demande ETA-IL lorsque celle-ci est nécessaire.', [], completed.includes(4))}

          <!-- STEP 05 -->
          ${renderStepCard(5, 'Mon installation', 'J’arrive avec tout le nécessaire', 'Pour faciliter votre installation, Bnot Séminaire propose des solutions pratiques dès votre arrivée.', [
            'Literie et kit d’installation.',
            'Informations utiles.',
            'Conseils pratiques.',
            'Contacts importants.'
          ], completed.includes(5))}

          <!-- STEP 06 -->
          ${renderStepCard(6, 'Rejoindre la communauté', 'Une fois arrivé, vous n’êtes pas seul', 'Après votre arrivée, vous pouvez rejoindre nos différents programmes et retrouver un cadre chaleureux.', [
            'Beth Hamidrach.',
            'Talmoudo Beyado.',
            'Ben Hazmanim.',
            'Shabbatot, Leil Chichi et événements.'
          ], completed.includes(6))}

          <!-- STEP 07 -->
          ${renderStepCard(7, 'Rester connecté', 'Recevez toutes les informations utiles', 'Rejoignez notre groupe WhatsApp pour recevoir les prochains événements et rester en lien avec l’équipe.', [
            'Groupe WhatsApp de l’association.',
            'Prochains événements.'
          ], completed.includes(7))}

        </div>
      </div>

      <!-- SECTION 4: Votre aventure commence -->
      <div style="background: linear-gradient(135deg, var(--accent-1-light) 0%, rgba(236, 72, 153, 0.15) 100%); border: 1.5px solid var(--accent-1); border-radius: 28px; padding: 3rem 2rem; text-align: center; box-shadow: var(--shadow-md);">
        <div style="width: 60px; height: 60px; border-radius: 50%; background: var(--accent-1); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin: 0 auto 1.25rem; box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);">
          <i class="fa-solid fa-paper-plane"></i>
        </div>
        <h2 style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.75rem;">
          Votre aventure commence
        </h2>
        <h3 style="font-size: 1.15rem; font-weight: 700; color: var(--accent-1); margin-bottom: 0.75rem;">
          Prêt pour votre aventure en Israël ?
        </h3>
        <p style="font-size: 0.95rem; color: var(--text-muted); max-width: 620px; margin: 0 auto 2rem; line-height: 1.6;">
          Notre équipe est là pour vous accompagner à chaque étape, avant votre départ et tout au long de votre parcours.
        </p>

        <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
          <button class="btn btn-pink-gradient btn-lg" id="btn-cta-start-parcours">
            <i class="fa-solid fa-route"></i> Commencer mon parcours
          </button>
          <button class="btn btn-outline-pill btn-lg" id="btn-cta-contact-assistance">
            <i class="fa-brands fa-whatsapp"></i> Contacter l'Assistance
          </button>
        </div>
      </div>

    </div>
  `;

  setTimeout(() => {
    // Back listener
    document.getElementById('btn-install-back')?.addEventListener('click', () => onNavigate('services'));
    
    // Hero buttons listeners
    document.getElementById('btn-hero-start-steps')?.addEventListener('click', () => {
      document.getElementById('section-parcours')?.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('btn-cta-start-parcours')?.addEventListener('click', () => {
      document.getElementById('section-parcours')?.scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('btn-hero-contact-us')?.addEventListener('click', () => onNavigate('contact'));
    document.getElementById('btn-cta-contact-assistance')?.addEventListener('click', () => onNavigate('contact'));

    // Step checkboxes toggle listeners
    document.querySelectorAll('.btn-toggle-step').forEach(btn => {
      btn.addEventListener('click', () => {
        const stepNum = parseInt(btn.getAttribute('data-step-num'), 10);
        let steps = getCompletedSteps();
        
        if (steps.includes(stepNum)) {
          steps = steps.filter(s => s !== stepNum);
        } else {
          steps.push(stepNum);
        }
        
        saveCompletedSteps(steps);

        // Update progress UI
        const progressWrap = document.getElementById('progress-box-wrapper');
        if (progressWrap) {
          progressWrap.innerHTML = renderProgressWidget(steps, totalSteps);
        }

        // Update card UI
        const isDone = steps.includes(stepNum);
        const card = document.getElementById(`step-card-${stepNum}`);
        if (card) {
          if (isDone) {
            card.style.borderColor = '#10B981';
            card.style.background = 'rgba(16, 185, 129, 0.04)';
          } else {
            card.style.borderColor = 'var(--border-color)';
            card.style.background = 'var(--bg-main)';
          }
        }

        btn.className = `btn btn-toggle-step ${isDone ? 'btn-success' : 'btn-outline-pill'}`;
        btn.innerHTML = isDone 
          ? '<i class="fa-solid fa-circle-check"></i> Fait ✓' 
          : '<i class="fa-regular fa-circle"></i> Marquer comme fait';
      });
    });
  }, 0);

  return html;
}

function renderProgressWidget(completedArray, total) {
  const count = completedArray.length;
  const percent = Math.round((count / total) * 100);

  return `
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.75rem;">
      <div style="font-weight: 800; font-size: 1.2rem; font-family: var(--font-heading);">
        <span style="color: var(--accent-1); font-size: 1.6rem;">${count}</span> / ${total}
      </div>
      <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-main);">
        Ma progression
      </div>
      <div style="font-weight: 700; font-size: 0.9rem; color: #10B981;">
        ${percent}% complété
      </div>
    </div>
    
    <div style="width: 100%; height: 10px; background: var(--border-color); border-radius: 10px; overflow: hidden;">
      <div style="width: ${percent}%; height: 100%; background: linear-gradient(90deg, var(--accent-1) 0%, #10B981 100%); transition: width 0.3s ease;"></div>
    </div>
  `;
}

function renderStepCard(num, badgeTitle, title, desc, points, isDone) {
  const padNum = num < 10 ? `0${num}` : `${num}`;

  return `
    <div id="step-card-${num}" style="background: ${isDone ? 'rgba(16, 185, 129, 0.04)' : 'var(--bg-main)'}; border: 1.5px solid ${isDone ? '#10B981' : 'var(--border-color)'}; border-radius: 20px; padding: 1.75rem; transition: all 0.2s ease;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem;">
        <div style="display: flex; align-items: center; gap: 1rem;">
          <div style="width: 48px; height: 48px; border-radius: 14px; background: ${isDone ? '#10B981' : 'var(--accent-1-light)'}; color: ${isDone ? '#FFF' : 'var(--accent-1)'}; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.2rem; font-family: var(--font-heading); flex-shrink: 0;">
            ${padNum}
          </div>
          <div>
            <span style="font-size: 0.78rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">${badgeTitle}</span>
            <h3 style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; color: var(--text-main); margin: 0.1rem 0 0;">
              ${title}
            </h3>
          </div>
        </div>

        <button class="btn btn-toggle-step ${isDone ? 'btn-success' : 'btn-outline-pill'}" data-step-num="${num}" style="font-size: 0.85rem; padding: 0.5rem 1.1rem;">
          ${isDone ? '<i class="fa-solid fa-circle-check"></i> Fait ✓' : '<i class="fa-regular fa-circle"></i> Marquer comme fait'}
        </button>
      </div>

      <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.6; margin-bottom: ${points && points.length > 0 ? '1rem' : '0'};">
        ${desc}
      </p>

      ${points && points.length > 0 ? `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 0.5rem; background: var(--bg-card); padding: 1rem 1.25rem; border-radius: 14px; border: 1px solid var(--border-color);">
          ${points.map(pt => `
            <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.88rem; color: var(--text-main); font-weight: 600;">
              <i class="fa-solid fa-check" style="color: var(--accent-1); font-size: 0.8rem;"></i> ${pt}
            </div>
          `).join('')}
        </div>
      ` : ''}
    </div>
  `;
}
