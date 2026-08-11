/* ==========================================================================
   BNOT SÉMINAIRE - AUTHENTICATION MODAL (WITH LEGEND & BIRTHDATE FIELD)
   ========================================================================== */

import { Auth } from '../auth.js';
import { SupabaseApi } from '../supabase.js';

export function showAuthModal(initialMode = 'login', onNavigate) {
  document.getElementById('modal-auth')?.remove();

  const isLogin = initialMode === 'login' || initialMode === 'admin-login';
  const isAdminLogin = initialMode === 'admin-login';

  const modalHtml = `
    <div class="modal-overlay" id="modal-auth">
      <div class="modal-content" style="max-width: 500px;">
        <div class="modal-header" style="display: flex; flex-direction: column; align-items: flex-start;">
          <div style="display: flex; justify-content: space-between; width: 100%; align-items: center;">
            <h3 class="modal-title" style="margin: 0;">
              <i class="fa-solid ${isLogin ? 'fa-arrow-right-to-bracket' : 'fa-user-plus'}" style="color: var(--text-main);"></i>
              ${isLogin ? (isAdminLogin ? 'Connexion Administration' : 'Connexion Élève') : 'Créer mon Compte Élève'}
            </h3>
            <button class="modal-close" id="btn-close-auth"><i class="fa-solid fa-xmark"></i></button>
          </div>
          ${!isLogin ? `
            <div style="font-size: 0.92rem; color: #D96B43; font-weight: 700; margin-top: 0.4rem; background: #FDEEE9; padding: 0.4rem 0.85rem; border-radius: var(--radius-full); border: 1px solid #F8D7CC;">
              <i class="fa-solid fa-bell"></i> Ne rate rien. On te tient informé.
            </div>
          ` : ''}
        </div>

        <div class="modal-body">
          <form id="form-auth">
            ${!isLogin ? `
              <div class="form-group">
                <label class="form-label">Nom et Prénom *</label>
                <input type="text" class="form-control" id="auth-name" placeholder="ex: Sarah Dupont" required>
              </div>

              <div class="grid-2">
                <div class="form-group">
                  <label class="form-label">Date de Naissance *</label>
                  <input type="date" class="form-control" id="auth-birthdate" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Téléphone / WhatsApp *</label>
                  <input type="text" class="form-control" id="auth-phone" placeholder="+33 6 12 34 56 78" required>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Séminaire en Israël *</label>
                <input type="text" class="form-control" id="auth-seminary" placeholder="ex: Bnot Yaakov" required>
              </div>
            ` : ''}

            <div class="form-group">
              <label class="form-label">Adresse Email *</label>
              <input type="email" class="form-control" id="auth-email" placeholder="nom@exemple.com" value="${isAdminLogin ? 'contact@bnotseminaire.com' : ''}" required>
            </div>

            <div class="form-group">
              <label class="form-label">Mot de passe *</label>
              <input type="password" class="form-control" id="auth-password" placeholder="••••••••" value="${isAdminLogin ? 'Meirguetta06' : ''}" required>
            </div>

            <button type="submit" class="btn btn-pink-gradient btn-full btn-lg" style="margin-top: 1rem;">
              <i class="fa-solid ${isLogin ? 'fa-right-to-bracket' : 'fa-check'}"></i>
              ${isLogin ? 'Se Connecter' : 'Créer Mon Compte'}
            </button>
          </form>

          <div style="text-align: center; margin-top: 1.25rem; font-size: 0.9rem; color: var(--text-muted);">
            ${isLogin ? `
              Vous n'avez pas de compte ? <a href="#" id="link-switch-auth" style="color: var(--text-main); font-weight: 700;">Inscrivez-vous ici</a>
            ` : `
              Déjà inscrite ? <a href="#" id="link-switch-auth" style="color: var(--text-main); font-weight: 700;">Connectez-vous</a>
            `}
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const closeModal = () => document.getElementById('modal-auth')?.remove();

  document.getElementById('btn-close-auth')?.addEventListener('click', closeModal);

  document.getElementById('link-switch-auth')?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal();
    showAuthModal(isLogin ? 'signup' : 'login', onNavigate);
  });

  // Form Submission
  document.getElementById('form-auth')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('auth-email').value;
    const password = document.getElementById('auth-password').value;

    if (isLogin) {
      const res = Auth.login(email, password);
      if (res.success) {
        window.showToast(`Bienvenue ${res.user.name} !`, 'success');
        closeModal();
        onNavigate(res.user.role === 'admin' ? 'admin' : 'dashboard');
      } else {
        window.showToast(res.message, 'danger');
      }
    } else {
      const name = document.getElementById('auth-name').value;
      const birthdate = document.getElementById('auth-birthdate')?.value || '';
      const seminary = document.getElementById('auth-seminary').value;
      const phone = document.getElementById('auth-phone').value;

      const res = Auth.register({
        name, email, password, seminary, phone, birthdate
      });

      if (res.success) {
        // Register profile in Supabase
        await SupabaseApi.createProfile({
          name: name,
          email: email,
          phone: phone,
          birth_date: birthdate,
          seminary: seminary,
          role: 'SEMINARISTE'
        });

        window.showToast('Compte créé avec succès ! Bienvenue.', 'success');
        closeModal();
        onNavigate('dashboard');
      } else {
        window.showToast(res.message, 'danger');
      }
    }
  });
}
