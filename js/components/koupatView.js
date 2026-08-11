/* ==========================================================================
   BNOT SÉMINAIRE - KOUPAT HOLIM OFFICIAL FORM VIEW (FULL PAGE FORM)
   ========================================================================== */

import { Auth } from '../auth.js';
import { SupabaseApi } from '../supabase.js';

export function renderKoupatView(onNavigate) {
  const user = Auth.getCurrentUser();

  const html = `
    <div class="koupat-official-view" style="max-width: 960px; margin: 0 auto 5rem; padding: 0 1rem;">
      <!-- Header Banner -->
      <div style="text-align: center; margin-bottom: 2.5rem;">
        <span class="badge-pill-pink" style="margin-bottom: 0.75rem;">
          <i class="fa-solid fa-notes-medical"></i> Couverture Santé Israël
        </span>
        <h1 style="font-family: var(--font-heading); font-size: 2.3rem; font-weight: 800; margin-bottom: 0.5rem;">
          Formulaire Officiel - Koupat Holim (Assurance Maladie)
        </h1>
        <p style="color: var(--text-muted); max-width: 650px; margin: 0 auto; font-size: 1rem;">
          Complétez vos informations pour obtenir gratuitement votre affiliation auprès de la Caisse de Santé de votre choix (Maccabi, Clalit, Meuhedet, Leumit).
        </p>
      </div>

      <!-- Main Form Card -->
      <div class="card" style="padding: 2.5rem; border-radius: 24px; box-shadow: var(--shadow-md);">
        <form id="form-koupat-official">
          
          <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; border-bottom: 2px solid var(--accent-1-light); padding-bottom: 0.5rem; margin-bottom: 1.5rem; color: var(--text-main);">
            1. Choix de la Caisse de Santé (Koupa)
          </h3>

          <div class="form-group">
            <label class="form-label">Caisse Maladie Souhaitée *</label>
            <select class="form-control" id="koupat-choice" required style="font-weight: 700;">
              <option value="Maccabi Health">🏥 Maccabi Health Services (Recommandée - 70% des séminaires)</option>
              <option value="Clalit Health">⚕️ Clalit Health Services (Grand réseau national)</option>
              <option value="Meuhedet">🏨 Meuhedet (Proximité Jérusalem & Bnei Brak)</option>
              <option value="Leumit">🩺 Leumit (Suivi personnalisé)</option>
            </select>
          </div>

          <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; border-bottom: 2px solid var(--accent-1-light); padding-bottom: 0.5rem; margin: 2rem 0 1.5rem; color: var(--text-main);">
            2. Informations Personnelles de l'Élève
          </h3>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Prénom *</label>
              <input type="text" class="form-control" id="koupat-prenom" placeholder="ex: Sarah" value="${user ? user.name.split(' ')[0] : ''}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Nom *</label>
              <input type="text" class="form-control" id="koupat-nom" placeholder="ex: Dupont" value="${user ? user.name.split(' ').slice(1).join(' ') : ''}" required>
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Adresse E-mail *</label>
              <input type="email" class="form-control" id="koupat-email" placeholder="sarah@exemple.com" value="${user ? user.email : ''}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Date de Naissance *</label>
              <input type="date" class="form-control" id="koupat-dob" required>
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Téléphone Personnel / WhatsApp *</label>
              <input type="tel" class="form-control" id="koupat-phone-perso" placeholder="+33 6 12 34 56 78" value="${user ? (user.phone || '') : ''}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Téléphone des Parents *</label>
              <input type="tel" class="form-control" id="koupat-phone-parents" placeholder="+33 6 98 76 54 32" required>
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Nationalité *</label>
              <input type="text" class="form-control" id="koupat-nationalite" placeholder="ex: Française" value="Française" required>
            </div>
            <div class="form-group">
              <label class="form-label">Numéro de Passeport *</label>
              <input type="text" class="form-control" id="koupat-passport" placeholder="22FR98765" value="${user ? (user.passport || '') : ''}" required>
            </div>
          </div>

          <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; border-bottom: 2px solid var(--accent-1-light); padding-bottom: 0.5rem; margin: 2rem 0 1.5rem; color: var(--text-main);">
            3. Séminaire & Séjour
          </h3>

          <div class="form-group">
            <label class="form-label">Séminaire de Destination en Israël *</label>
            <input type="text" class="form-control" id="koupat-seminaire" placeholder="ex: Bnot Yaakov - Jérusalem" value="${user ? (user.seminary || '') : ''}" required>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Date d'Arrivée Prévue en Israël *</label>
              <input type="date" class="form-control" id="koupat-arrival" required>
            </div>
            <div class="form-group">
              <label class="form-label">Durée du Séjour Prévue *</label>
              <select class="form-control" id="koupat-duree" required>
                <option value="1 an (Année complète)">1 an (Année complète de séminaire)</option>
                <option value="6 mois (1er semestre)">6 mois (1er semestre)</option>
                <option value="Autre durée">Autre durée</option>
              </select>
            </div>
          </div>

          <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700; border-bottom: 2px solid var(--accent-1-light); padding-bottom: 0.5rem; margin: 2rem 0 1.5rem; color: var(--text-main);">
            4. Pièces Justificatives (Uploads)
          </h3>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Photo du Passeport (Page d'identité) *</label>
              <input type="file" class="form-control" id="koupat-file-passport" accept="image/*,.pdf" required>
            </div>
            <div class="form-group">
              <label class="form-label">Photo d'Identité Récente *</label>
              <input type="file" class="form-control" id="koupat-file-photo" accept="image/*" required>
            </div>
          </div>

          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Lettre d'Acceptation du Séminaire *</label>
              <input type="file" class="form-control" id="koupat-file-letter" accept="image/*,.pdf" required>
            </div>
            <div class="form-group">
              <label class="form-label">Certificat de Scolarité du Séminaire *</label>
              <input type="file" class="form-control" id="koupat-file-certif" accept="image/*,.pdf" required>
            </div>
          </div>

          <div style="margin-top: 2.5rem; text-align: center;">
            <button type="submit" class="btn btn-pink-gradient btn-lg" style="padding: 1rem 3rem; font-size: 1.1rem;">
              <i class="fa-solid fa-file-medical"></i> Soumettre ma Demande Koupat Holim
            </button>
          </div>

        </form>
      </div>
    </div>
  `;

  setTimeout(() => {
    document.getElementById('form-koupat-official')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const prenom = document.getElementById('koupat-prenom').value.trim();
      const nom = document.getElementById('koupat-nom').value.trim();
      const email = document.getElementById('koupat-email').value.trim();
      const phonePerso = document.getElementById('koupat-phone-perso').value.trim();
      const phoneParents = document.getElementById('koupat-phone-parents').value.trim();
      const dob = document.getElementById('koupat-dob').value;
      const nationalite = document.getElementById('koupat-nationalite').value.trim();
      const passport = document.getElementById('koupat-passport').value.trim();
      const seminaire = document.getElementById('koupat-seminaire').value.trim();
      const arrival = document.getElementById('koupat-arrival').value;
      const duree = document.getElementById('koupat-duree').value;
      const koupa = document.getElementById('koupat-choice').value;

      // Save to Supabase requests table
      await SupabaseApi.createRequest({
        kind: `Koupat Holim (${koupa})`,
        prenom, nom, email,
        phone: phonePerso,
        parent_phone: phoneParents,
        dob, nationalite,
        passport_number: passport,
        school: seminaire,
        person_status: `Caisse: ${koupa} | Arrivée: ${arrival} | Durée: ${duree}`
      });

      window.showToast(`Merci ${prenom} ! Votre demande d'affiliation Koupat Holim (${koupa}) a été enregistrée avec succès.`, 'success');
      onNavigate(user ? 'dashboard' : 'home');
    });
  }, 0);

  return html;
}
