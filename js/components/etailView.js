/* ==========================================================================
   BNOT SÉMINAIRE - ETA-IL INFO PAGE
   ========================================================================== */

export function renderEtailView(onNavigate) {
  const html = `
    <div style="max-width: 820px; margin: 0 auto 4rem; padding: 0 1rem;">

      <!-- Back button -->
      <div style="margin-bottom: 1.5rem;">
        <button class="btn btn-outline-pill" id="btn-etail-back" style="font-size: 0.85rem;">
          <i class="fa-solid fa-arrow-left"></i> Retour
        </button>
      </div>

      <!-- Hero Header -->
      <div style="background: linear-gradient(135deg, #0F2537 0%, #1B3A5C 100%); border-radius: 24px; padding: 2.5rem 2rem; margin-bottom: 2rem; color: white; position: relative; overflow: hidden;">
        <div style="position: absolute; top: -30px; right: -30px; width: 150px; height: 150px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>
        <div style="position: absolute; bottom: -20px; left: -20px; width: 100px; height: 100px; background: rgba(255,255,255,0.03); border-radius: 50%;"></div>
        <div style="position: relative; z-index: 1;">
          <div style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255,255,255,0.12); padding: 0.35rem 0.9rem; border-radius: var(--radius-full); font-size: 0.8rem; font-weight: 700; margin-bottom: 1rem;">
            <i class="fa-solid fa-plane-departure"></i> Autorisation de voyage
          </div>
          <h1 style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; margin-bottom: 0.75rem; line-height: 1.2;">
            Autorisation électronique d'entrée en Israël
          </h1>
          <p style="font-size: 0.95rem; opacity: 0.85; max-width: 600px; line-height: 1.6;">
            L'ETA-IL est une autorisation de voyage électronique à obtenir avant le départ pour pouvoir embarquer vers Israël dans certaines situations.
          </p>
        </div>
      </div>

      <!-- Bnei Yeshivot accompagnement -->
      <div style="background: rgba(16, 185, 129, 0.08); border: 1px solid rgba(16, 185, 129, 0.2); border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem;">
        <div style="display: flex; align-items: flex-start; gap: 1rem;">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(16, 185, 129, 0.15); color: #10B981; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;">
            <i class="fa-solid fa-hand-holding-heart"></i>
          </div>
          <div>
            <h3 style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.3rem;">
              Bnei Yeshivot vous accompagne gratuitement
            </h3>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin: 0;">
              Notre objectif est de rendre chaque démarche plus claire, plus simple et mieux suivie pour les étudiants francophones qui viennent étudier en Israël.
            </p>
          </div>
        </div>
      </div>

      <!-- Nouvelle procédure -->
      <div class="card" style="margin-bottom: 1.5rem; padding: 1.75rem;">
        <h2 style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.75rem;">
          <i class="fa-solid fa-file-circle-check" style="color: var(--accent-1); margin-right: 0.4rem;"></i>
          Nouvelle procédure d'entrée
        </h2>
        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.7; margin-bottom: 0.75rem;">
          Depuis le 1er janvier 2025, une procédure d'autorisation électronique d'entrée en Israël est mise en place pour certains voyageurs.
        </p>
        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.7; margin: 0;">
          Elle concerne notamment les personnes qui ne disposent pas d'un numéro d'identité israélien ou d'un visa étudiant valide.
        </p>
      </div>

      <!-- Qui doit effectuer une demande ? -->
      <div class="card" style="margin-bottom: 1.5rem; padding: 1.75rem;">
        <h2 style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; color: var(--text-main); margin-bottom: 1rem;">
          <i class="fa-solid fa-users" style="color: var(--info); margin-right: 0.4rem;"></i>
          Qui doit effectuer une demande ?
        </h2>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          <div style="display: flex; align-items: flex-start; gap: 0.75rem; background: var(--bg-main); padding: 1rem; border-radius: 12px; border: 1px solid var(--border-color);">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(6, 182, 212, 0.12); color: var(--info); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.85rem;">
              <i class="fa-solid fa-passport"></i>
            </div>
            <p style="font-size: 0.88rem; color: var(--text-main); margin: 0; line-height: 1.5;">Les personnes venant en Israël avec un <strong>passeport étranger</strong>.</p>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 0.75rem; background: var(--bg-main); padding: 1rem; border-radius: 12px; border: 1px solid var(--border-color);">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(6, 182, 212, 0.12); color: var(--info); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.85rem;">
              <i class="fa-solid fa-id-card"></i>
            </div>
            <p style="font-size: 0.88rem; color: var(--text-main); margin: 0; line-height: 1.5;">Les personnes qui ne possèdent <strong>pas encore de Mispar Zehout</strong>.</p>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 0.75rem; background: var(--bg-main); padding: 1rem; border-radius: 12px; border: 1px solid var(--border-color);">
            <div style="width: 32px; height: 32px; border-radius: 50%; background: rgba(6, 182, 212, 0.12); color: var(--info); display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 0.85rem;">
              <i class="fa-solid fa-graduation-cap"></i>
            </div>
            <p style="font-size: 0.88rem; color: var(--text-main); margin: 0; line-height: 1.5;">Les étudiants qui n'ont <strong>pas encore obtenu leur visa étudiant</strong> avant l'arrivée.</p>
          </div>
        </div>
      </div>

      <!-- Pourquoi faire cette demande ? -->
      <div class="card" style="margin-bottom: 1.5rem; padding: 1.75rem;">
        <h2 style="font-family: var(--font-heading); font-size: 1.3rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.75rem;">
          <i class="fa-solid fa-circle-question" style="color: var(--warning); margin-right: 0.4rem;"></i>
          Pourquoi faire cette demande ?
        </h2>
        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.7; margin-bottom: 0.75rem;">
          L'ETA-IL est nécessaire pour voyager vers Israël. Elle <strong>ne remplace pas un visa étudiant</strong> et ne donne pas un statut d'étudiant en Israël.
        </p>
        <p style="font-size: 0.9rem; color: var(--text-muted); line-height: 1.7; margin: 0;">
          Elle permet uniquement d'obtenir une <strong>autorisation de voyage</strong> avant l'arrivée sur le territoire israélien.
        </p>
      </div>

      <!-- Info cards row -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.5rem;">
        <!-- Coût et validité -->
        <div class="card" style="padding: 1.5rem;">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(168, 85, 247, 0.12); color: #A855F7; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; margin-bottom: 0.75rem;">
            <i class="fa-solid fa-coins"></i>
          </div>
          <h3 style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem;">
            Coût et validité
          </h3>
          <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 0.5rem;">
            La demande d'ETA-IL est soumise à des frais administratifs de <strong>25 NIS</strong>.
          </p>
          <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin: 0;">
            L'autorisation est valable pendant <strong>deux ans</strong>, ou jusqu'à l'expiration du passeport selon la première échéance.
          </p>
        </div>

        <!-- Délais de réponse -->
        <div class="card" style="padding: 1.5rem;">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(59, 130, 246, 0.12); color: #3B82F6; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; margin-bottom: 0.75rem;">
            <i class="fa-solid fa-clock"></i>
          </div>
          <h3 style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.5rem;">
            Délais de réponse
          </h3>
          <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin: 0;">
            La majorité des demandes reçoivent une réponse rapidement. Dans certains cas, le traitement peut prendre jusqu'à <strong>72 heures</strong>.
          </p>
        </div>
      </div>

      <!-- Pour les mineurs -->
      <div style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.2); border-radius: 16px; padding: 1.5rem; margin-bottom: 2rem;">
        <div style="display: flex; align-items: flex-start; gap: 1rem;">
          <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(245, 158, 11, 0.15); color: #F59E0B; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;">
            <i class="fa-solid fa-child"></i>
          </div>
          <div>
            <h3 style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 800; color: var(--text-main); margin-bottom: 0.3rem;">
              Pour les mineurs
            </h3>
            <p style="font-size: 0.88rem; color: var(--text-muted); line-height: 1.6; margin: 0;">
              Les personnes âgées de moins de 18 ans ne peuvent pas effectuer seules une demande d'ETA-IL. La demande doit être réalisée par un <strong>adulte responsable</strong>.
            </p>
          </div>
        </div>
      </div>

      <!-- CTA -->
      <div style="text-align: center;">
        <a href="https://israel-entry.piba.gov.il/" target="_blank" class="btn btn-primary btn-lg" style="padding: 0.75rem 2rem; font-size: 0.95rem;">
          <i class="fa-solid fa-arrow-up-right-from-square"></i> Accéder au site officiel ETA-IL
        </a>
      </div>

    </div>
  `;

  setTimeout(() => {
    document.getElementById('btn-etail-back')?.addEventListener('click', () => onNavigate('services'));
  }, 0);

  return html;
}
