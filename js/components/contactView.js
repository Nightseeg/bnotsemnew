/* ==========================================================================
   BNOT SÉMINAIRE - CONTACT PAGE VIEW (SUPABASE CONNECTED)
   ========================================================================== */

import { SupabaseApi } from '../supabase.js';

export function renderContactView(onNavigate) {
  const html = `
    <div class="contact-page-view" style="margin-top: -2rem;">
      
      <!-- HERO BANNER CONTACT (DARK NAVY GRADIENT MATCHING SCREENSHOT) -->
      <div style="background: linear-gradient(135deg, #0A192F, #0E2A47); color: white; padding: 4.5rem 2rem 5rem; border-radius: 0 0 32px 32px; margin-bottom: 4rem; position: relative; overflow: hidden;">
        <div style="max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: 1.2fr 0.8fr; align-items: center; gap: 2rem;">
          <div>
            <!-- Badge Top -->
            <div style="display: inline-block; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2); font-size: 0.72rem; font-weight: 800; letter-spacing: 0.1em; padding: 0.35rem 1.1rem; border-radius: var(--radius-full); text-transform: uppercase; margin-bottom: 1.25rem; color: #E2E8F0;">
              NOUS CONTACTER
            </div>

            <!-- Big Title -->
            <h1 style="font-family: var(--font-serif); font-size: 3.8rem; font-weight: 700; margin-bottom: 1.25rem; line-height: 1.1;">
              Contact
            </h1>

            <!-- Description -->
            <p style="font-size: 1.15rem; color: #CBD5E1; line-height: 1.6; max-width: 580px;">
              Une question, une demande d'accompagnement ou un besoin pratique ? Notre équipe vous répond en France comme en Israël.
            </p>
          </div>

          <!-- Right Decorative Graphic -->
          <div style="display: flex; justify-content: flex-end; opacity: 0.4;">
            <div style="width: 220px; height: 180px; border: 3px solid rgba(255,255,255,0.2); border-radius: 24px; position: relative; display: flex; align-items: center; justify-content: center; font-size: 4rem; color: rgba(255,255,255,0.4);">
              <i class="fa-solid fa-book-open"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT GRID (2 COLUMNS MATCHING SCREENSHOT) -->
      <div style="max-width: 1240px; margin: 0 auto 5rem; padding: 0 1.5rem;">
        <div style="display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 3rem; align-items: start;">
          
          <!-- LEFT COLUMN: ENVOYER UN MESSAGE FORM CARD -->
          <div style="background: var(--bg-card); border-radius: 24px; border: 1px solid var(--border-color); padding: 2.8rem 2.2rem; box-shadow: var(--shadow-sm);">
            <h2 style="font-family: var(--font-serif); font-size: 2.2rem; font-weight: 700; color: var(--text-main); margin-bottom: 1.75rem;">
              Envoyer un message
            </h2>

            <form id="form-contact-page">
              <div class="grid-2">
                <div class="form-group">
                  <label class="form-label">Nom complet *</label>
                  <input type="text" class="form-control" id="contact-name" placeholder="ex: Sarah Dupont" required style="padding: 0.85rem 1rem;">
                </div>
                <div class="form-group">
                  <label class="form-label">Email *</label>
                  <input type="email" class="form-control" id="contact-email" placeholder="nom@exemple.com" required style="padding: 0.85rem 1rem;">
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Message *</label>
                <textarea class="form-control" id="contact-message" rows="5" placeholder="Écrivez votre message ici..." required style="padding: 0.85rem 1rem;"></textarea>
              </div>

              <div style="margin-top: 1.5rem;">
                <button type="submit" class="btn" style="background: #0F2537; color: white; border-radius: var(--radius-full); padding: 0.85rem 2.2rem; font-weight: 700; font-size: 0.95rem;">
                  Envoyer
                </button>
              </div>
            </form>
          </div>

          <!-- RIGHT COLUMN: 4 STACKED CARDS -->
          <div style="display: flex; flex-direction: column; gap: 1.25rem;">
            
            <!-- Card 1: WhatsApp -->
            <div style="background: var(--bg-card); border-radius: 20px; border: 1px solid var(--border-color); padding: 1.5rem 1.8rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.5rem;">
                <i class="fa-brands fa-whatsapp" style="color: #25D366; font-size: 1.3rem;"></i>
                <h3 style="font-family: var(--font-heading); font-size: 1.2rem; font-weight: 800; color: var(--text-main);">WhatsApp</h3>
              </div>
              <p style="font-size: 0.88rem; color: var(--text-muted); margin-bottom: 1rem;">
                Recevez les annonces et les prochaines activités de l'association.
              </p>
              <a href="https://wa.me/972534727103" target="_blank" style="display: flex; align-items: center; justify-content: space-between; background: var(--bg-main); border: 1px solid var(--border-color); padding: 0.85rem 1.25rem; border-radius: 14px; text-decoration: none;">
                <div>
                  <div style="font-weight: 700; font-size: 0.9rem; color: var(--text-main);">Rejoindre le groupe</div>
                  <div style="font-size: 0.78rem; color: var(--text-muted);">Annonces et activités</div>
                </div>
                <i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 0.85rem; color: var(--text-muted);"></i>
              </a>
            </div>

            <!-- Card 2: Email -->
            <div style="background: var(--bg-card); border-radius: 20px; border: 1px solid var(--border-color); padding: 1.5rem 1.8rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.75rem;">
                <i class="fa-solid fa-envelope" style="color: var(--accent-1); font-size: 1.2rem;"></i>
                <h3 style="font-family: var(--font-heading); font-size: 1.2rem; font-weight: 800; color: var(--text-main);">Email</h3>
              </div>
              <a href="mailto:contact@bnotseminaire.com" style="font-weight: 800; font-size: 1rem; color: var(--text-main);">
                contact@bnotseminaire.com
              </a>
            </div>

            <!-- Card 3: Téléphone -->
            <div style="background: var(--bg-card); border-radius: 20px; border: 1px solid var(--border-color); padding: 1.5rem 1.8rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.75rem;">
                <i class="fa-solid fa-phone" style="color: var(--accent-1); font-size: 1.2rem;"></i>
                <h3 style="font-family: var(--font-heading); font-size: 1.2rem; font-weight: 800; color: var(--text-main);">Téléphone</h3>
              </div>
              <div style="font-size: 0.92rem; color: var(--text-main); display: flex; flex-direction: column; gap: 0.35rem;">
                <div>France : <strong>+33 7 67 96 71 48</strong></div>
                <div>Israël : <strong>+972 53 472 7103</strong></div>
              </div>
            </div>

            <!-- Card 4: Adresse -->
            <div style="background: var(--bg-card); border-radius: 20px; border: 1px solid var(--border-color); padding: 1.5rem 1.8rem; box-shadow: var(--shadow-sm);">
              <div style="display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.75rem;">
                <i class="fa-solid fa-location-dot" style="color: var(--accent-1); font-size: 1.2rem;"></i>
                <h3 style="font-family: var(--font-heading); font-size: 1.2rem; font-weight: 800; color: var(--text-main);">Adresse</h3>
              </div>
              <div style="font-size: 0.92rem; color: var(--text-muted);">
                17 Rehov Apisga, Bayit Vagan, Jérusalem
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    document.getElementById('form-contact-page')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value.trim();
      const email = document.getElementById('contact-email').value.trim();
      const message = document.getElementById('contact-message').value.trim();

      // Submit request to Supabase public.requests table
      await SupabaseApi.createRequest({
        kind: 'CONTACT',
        prenom: name.split(' ')[0] || name,
        nom: name.split(' ').slice(1).join(' ') || '',
        email: email,
        person_status: message,
        seminaire: 'Prise de contact web'
      });

      window.showToast(`Merci ${name} ! Votre message a été enregistré dans Supabase avec succès.`, 'success');
      document.getElementById('form-contact-page').reset();
    });
  }, 0);

  return html;
}
