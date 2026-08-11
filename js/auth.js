/* ==========================================================================
   BNOT SÉMINAIRE - AUTHENTICATION MODULE (STRICT ADMIN PROTECTION)
   ========================================================================== */

import { Storage } from './storage.js';

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

    const user = users.find(u => u.email.toLowerCase() === cleanEmail && u.password === password);

    if (user) {
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
    return { success: true, user: newUser };
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
