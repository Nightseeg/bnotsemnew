/* ==========================================================================
   BNOT SÉMINAIRE - AUTHENTICATION MODULE (STRICT ADMIN PROTECTION)
   ========================================================================== */

import { Storage } from './storage.js';
import { SupabaseApi } from './supabase.js';

const ADMIN_EMAIL = 'contact@bnotseminaire.com';

export const Auth = {
  login(email, password) {
    const users = Storage.getUsers();
    const cleanEmail = email.trim().toLowerCase();

    // Check official admin credentials (ONLY contact@bnotseminaire.com)
    if (cleanEmail === ADMIN_EMAIL && password === 'Meirguetta06') {
      const adminUser = {
        id: 'usr-admin-prod',
        name: 'Administrateur Bnot Séminaire',
        email: ADMIN_EMAIL,
        role: 'admin',
        seminary: 'Direction Général Bnot Séminaire'
      };
      Storage.setCurrentUser(adminUser);
      return { success: true, user: adminUser };
    }

    const user = users.find(u => u.email.toLowerCase() === cleanEmail);

    if (user) {
      // Validate password if user has one stored
      if (user.password && user.password !== password) {
        return { success: false, message: 'Email ou mot de passe incorrect.' };
      }
      // If user profile had no password stored (synced profile), save provided password
      if (!user.password) {
        user.password = password;
        Storage.updateUser(user);
      }

      // Force non-admin email to student role even if role field says admin
      if (user.email.toLowerCase() !== ADMIN_EMAIL) {
        user.role = 'student';
      }
      Storage.setCurrentUser(user);
      return { success: true, user };
    }
    return { success: false, message: 'Email ou mot de passe incorrect.' };
  },

  register(studentData) {
    const users = Storage.getUsers();
    const cleanEmail = studentData.email.trim().toLowerCase();

    const existing = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'Un compte existe déjà avec cette adresse email.' };
    }

    const newUser = {
      id: 'usr-' + Date.now(),
      name: studentData.name,
      email: cleanEmail,
      password: studentData.password,
      role: 'student', // ALWAYS student role for registration
      phone: studentData.phone || '',
      whatsapp: studentData.phone ? studentData.phone.replace(/[^0-9+]/g, '') : '',
      seminary: studentData.seminary || 'Séminaire Non Spécifié',
      passport: '',
      arrivalDate: '',
      koupatFund: '',
      koupatStatus: 'Non débuté',
      visaStatus: 'Non débuté',
      visaProgress: 0,
      uploadedDocs: [],
      createdAt: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);
    Storage.saveUsers(users);
    Storage.setCurrentUser(newUser);

    // Sync profile to Supabase
    SupabaseApi.createProfile({
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
      role: 'student'
    }).catch(e => console.warn('Supabase profile create notice:', e));

    return { success: true, user: newUser };
  },

  sendPasswordResetLink(email) {
    const users = Storage.getUsers();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanEmail === ADMIN_EMAIL) {
      return { success: false, message: 'Le mot de passe de l\'administrateur principal se gère directement dans le panneau de configuration.' };
    }

    const user = users.find(u => u.email && u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, message: 'Aucun compte trouvé avec cette adresse e-mail.' };
    }

    // Generate token valid for 15 minutes
    const token = 'rst-' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
    Storage.saveResetToken(cleanEmail, token);

    const resetLink = `https://www.bnotseminaire.com/?reset_token=${token}`;

    // Send email with reset link via FormSubmit AJAX service
    try {
      fetch('https://formsubmit.co/ajax/' + encodeURIComponent(cleanEmail), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `🔑 Lien de réinitialisation de mot de passe - Bnot Séminaire`,
          Client: user.name,
          Email: user.email,
          Lien_de_reinitialisation: resetLink,
          Message: `Bonjour ${user.name},\n\nVous avez demandé la réinitialisation de votre mot de passe sur Bnot Séminaire.\n\nVeuillez cliquer sur le lien ci-dessous pour choisir votre nouveau mot de passe :\n${resetLink}\n\nCe lien est valable 15 minutes.\nSi vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.`
        })
      }).catch(err => console.warn('Reset email dispatch error:', err));
    } catch (e) {
      console.warn('Reset email exception:', e);
    }

    return { success: true, message: `Un e-mail contenant le lien de réinitialisation a été envoyé à ${cleanEmail}` };
  },

  resetPasswordWithToken(token, newPassword) {
    const tokenData = Storage.getResetTokenData(token);
    if (!tokenData) {
      return { success: false, message: 'Le lien de réinitialisation est invalide ou a expiré. Veuillez refaire une demande.' };
    }

    const users = Storage.getUsers();
    const userIndex = users.findIndex(u => u.email && u.email.toLowerCase() === tokenData.email);

    if (userIndex !== -1) {
      users[userIndex].password = newPassword;
      Storage.saveUsers(users);
      Storage.removeResetToken(token);
      return { success: true, message: 'Votre mot de passe a été réinitialisé avec succès !' };
    }

    return { success: false, message: 'Compte introuvable.' };
  },

  logout() {
    Storage.logoutUser();
  },

  getCurrentUser() {
    return Storage.getCurrentUser();
  },

  isAuthenticated() {
    return !!Storage.getCurrentUser();
  },

  // STRICT REQUIREMENT: Only contact@bnotseminaire.com is allowed as admin
  isAdmin() {
    const user = Storage.getCurrentUser();
    return !!user && user.email.trim().toLowerCase() === ADMIN_EMAIL;
  }
};
