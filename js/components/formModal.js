/* ==========================================================================
   BNOT SÉMINAIRE - FORMULAIRE OFFICIEL VISA ET KOUPAT HOLIM (SUPABASE CONNECTED)
   ========================================================================== */

import { Auth } from '../auth.js';
import { Storage } from '../storage.js';
import { SupabaseApi } from '../supabase.js';

export function showServiceFormModal(serviceTitle = 'Visa étudiant') {
  document.getElementById('modal-service-form')?.remove();

  const user = Auth.getCurrentUser();

  const modalHtml = `
    <div class="modal-overlay" id="modal-service-form">
      <div class="modal-content" style="max-width: 680px; padding: 0;">
        <div class="modal-header" style="background: var(--accent-1-light); border-bottom: 1px solid var(--border-color); padding: 1.5rem 2rem;">
          <div>
            <span class="badge-pill-pink" style="margin-bottom: 0.35rem; font-size: 0.72rem;">
              <i class="fa-solid fa-file-signature"></i> Dossier Officiel Supabase
            </span>
            <h3 class="modal-title" style="font-size: 1.4rem;">
              Formulaire ${serviceTitle}
            </h3>
          </div>
          <button class="modal-close" id="btn-close-service-form"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="modal-body" style="padding: 2rem;">
          <p style="font-size: 0.9rem; color: var(--text-muted); margin-bottom: 1.75rem; line-height: 1.5;">
            Veuillez compléter l'ensemble des informations et joindre vos documents pour la prise en charge de votre dossier de <strong>${serviceTitle}</strong> par l'équipe Bnot Séminaire.
          </p>

          <form id="form-official-administrative">
            
            <!-- SECTION 1: INFORMATIONS PERSONNELLES -->
            <div style="font-weight: 800; font-size: 0.95rem; color: var(--text-main); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 1rem; border-bottom: 2px solid var(--accent-1); padding-bottom: 0.4rem; display: flex; align-items: center; gap: 0.5rem;">
              <i class="fa-solid fa-user" style="color: var(--accent-1);"></i> 1. Informations Personnelles
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Prénom *</label>
                <input type="text" class="form-control" id="form-prenom" value="${user ? user.name.split(' ')[0] : ''}" placeholder="ex: Sarah" required>
              </div>

              <div class="form-group">
                <label class="form-label">Nom *</label>
                <input type="text" class="form-control" id="form-nom" value="${user ? user.name.split(' ').slice(1).join(' ') : ''}" placeholder="ex: Dupont" required>
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">E-mail *</label>
                <input type="email" class="form-control" id="form-email" value="${user ? user.email : ''}" placeholder="sarah@email.com" required>
              </div>

              <div class="form-group">
                <label class="form-label">Date de naissance *</label>
                <input type="date" class="form-control" id="form-dob" required>
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Téléphone perso *</label>
                <input type="tel" class="form-control" id="form-phone-perso" value="${user ? user.phone : ''}" placeholder="+33 6 12 34 56 78" required>
              </div>

              <div class="form-group">
                <label class="form-label">Téléphone des parents *</label>
                <input type="tel" class="form-control" id="form-phone-parents" placeholder="+33 6 98 76 54 32" required>
              </div>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Nationalité *</label>
                <input type="text" class="form-control" id="form-nationalite" value="Française" placeholder="ex: Française" required>
              </div>

              <div class="form-group">
                <label class="form-label">Numéro de passeport *</label>
                <input type="text" class="form-control" id="form-passport-num" value="${user ? user.passport : ''}" placeholder="ex: 22FR98765" required>
              </div>
            </div>

            <!-- SECTION 2: SÉJOUR ET SÉMINAIRE -->
            <div style="font-weight: 800; font-size: 0.95rem; color: var(--text-main); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 1.5rem; margin-bottom: 1rem; border-bottom: 2px solid var(--accent-1); padding-bottom: 0.4rem; display: flex; align-items: center; gap: 0.5rem;">
              <i class="fa-solid fa-graduation-cap" style="color: var(--accent-1);"></i> 2. Séminaire & Séjour
            </div>

            <div class="form-group">
              <label class="form-label">Séminaire de destination *</label>
              <input type="text" class="form-control" id="form-seminaire" value="${user ? user.seminary : ''}" placeholder="ex: Bnot Yaakov Jérusalem" required>
            </div>

            <div class="grid-2">
              <div class="form-group">
                <label class="form-label">Date d'arrivée prévue *</label>
                <input type="date" class="form-control" id="form-date-arrivee" value="${user ? user.arrivalDate : ''}" required>
              </div>

              <div class="form-group">
                <label class="form-label">Durée du séjour *</label>
                <select class="form-control" id="form-duree-sejour">
                  <option value="1 an (Année académique complète)">1 an (Année académique complète)</option>
                  <option value="10 mois (Programme standard)">10 mois (Programme standard)</option>
                  <option value="Autre durée">Autre durée</option>
                </select>
              </div>
            </div>

            <!-- SECTION 3: PIÈCES JUSTIFICATIVES -->
            <div style="font-weight: 800; font-size: 0.95rem; color: var(--text-main); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 1.5rem; margin-bottom: 1rem; border-bottom: 2px solid var(--accent-1); padding-bottom: 0.4rem; display: flex; align-items: center; gap: 0.5rem;">
              <i class="fa-solid fa-paperclip" style="color: var(--accent-1);"></i> 3. Documents à Joindre
            </div>

            <div style="display: flex; flex-direction: column; gap: 1rem; background: var(--bg-main); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 1.5rem;">
              <!-- Doc 1: Photo Passeport -->
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" style="font-size: 0.85rem;"><i class="fa-solid fa-passport" style="color: var(--accent-1);"></i> Photo du passeport (PDF ou JPG)</label>
                <input type="file" class="form-control" id="file-passeport" accept=".pdf,.png,.jpg,.jpeg">
              </div>

              <!-- Doc 2: Lettre acceptation -->
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" style="font-size: 0.85rem;"><i class="fa-solid fa-envelope-open-text" style="color: var(--accent-1);"></i> Lettre d'acceptation du séminaire (PDF ou JPG)</label>
                <input type="file" class="form-control" id="file-acceptation" accept=".pdf,.png,.jpg,.jpeg">
              </div>

              <!-- Doc 3: Photo identité -->
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" style="font-size: 0.85rem;"><i class="fa-solid fa-image" style="color: var(--accent-1);"></i> Photo d'identité récente (JPG ou PNG)</label>
                <input type="file" class="form-control" id="file-photo-id" accept=".png,.jpg,.jpeg">
              </div>

              <!-- Doc 4: Certificat de scolarité -->
              <div class="form-group" style="margin-bottom: 0;">
                <label class="form-label" style="font-size: 0.85rem;"><i class="fa-solid fa-certificate" style="color: var(--accent-1);"></i> Certificat de scolarité du séminaire (PDF ou JPG)</label>
                <input type="file" class="form-control" id="file-scolarite" accept=".pdf,.png,.jpg,.jpeg">
              </div>
            </div>

            <button type="submit" class="btn btn-pink-gradient btn-full btn-lg">
              <i class="fa-solid fa-cloud-arrow-up"></i> Soumettre mon Dossier Officiel Supabase
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const closeModal = () => document.getElementById('modal-service-form')?.remove();

  document.getElementById('btn-close-service-form')?.addEventListener('click', closeModal);

  document.getElementById('form-official-administrative')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const prenom = document.getElementById('form-prenom').value.trim();
    const nom = document.getElementById('form-nom').value.trim();
    const email = document.getElementById('form-email').value.trim();
    const phone_perso = document.getElementById('form-phone-perso').value.trim();
    const phone_parents = document.getElementById('form-phone-parents').value.trim();
    const dob = document.getElementById('form-dob').value;
    const nationalite = document.getElementById('form-nationalite').value.trim();
    const passport_num = document.getElementById('form-passport-num').value.trim();
    const seminaire = document.getElementById('form-seminaire').value.trim();
    const duree = document.getElementById('form-duree-sejour').value;

    // Send request to Supabase Table 'public.requests'
    await SupabaseApi.createRequest({
      kind: serviceTitle,
      prenom,
      nom,
      email,
      phone_perso,
      phone_parents,
      dob,
      nationalite,
      passport_num,
      duree,
      seminaire
    });

    if (user) {
      user.name = `${prenom} ${nom}`;
      user.seminary = seminaire;
      user.passport = passport_num;
      if (serviceTitle.toLowerCase().includes('visa')) {
        user.visaStatus = 'Documents soumis - En étude';
        user.visaProgress = 80;
      } else {
        user.koupatStatus = 'Dossier complet - En étude';
      }
      Storage.updateUser(user);
    }

    closeModal();
    window.showToast(`Merci ${prenom} ! Votre dossier "${serviceTitle}" a été enregistré dans Supabase avec succès !`, 'success');
  });
}
