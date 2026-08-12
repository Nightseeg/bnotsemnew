/* ==========================================================================
   BNOT SÉMINAIRE - ADMIN DASHBOARD MODULE (IMAGE FILE UPLOADER & EDITING)
   ========================================================================== */

import { Auth } from '../auth.js';
import { Storage } from '../storage.js';
import { SupabaseApi } from '../supabase.js';

let activeAdminTab = 'overview';
let cachedRequests = [];

export function renderAdminView(onNavigate, subTab) {
  const user = Auth.getCurrentUser();
  if (!user || user.email.trim().toLowerCase() !== 'contact@bnotseminaire.com' || !Auth.isAdmin()) {
    window.showToast('Accès réservé exclusivement à l\'administrateur contact@bnotseminaire.com', 'danger');
    onNavigate('home');
    return '';
  }

  if (subTab) activeAdminTab = subTab;

  const users = Storage.getUsers().filter(u => u.role === 'student' && u.email !== 'contact@bnotseminaire.com');
  const reservations = Storage.getReservations();
  const products = Storage.getProducts();
  const totalReservedAmount = reservations.reduce((sum, r) => sum + r.totalPrice, 0);

  SupabaseApi.getRequests().then(reqs => {
    if (reqs) cachedRequests = reqs;
  });

  const html = `
    <div class="admin-view">
      <!-- Admin Header -->
      <div style="margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div>
          <span class="badge-pill-pink" style="margin-bottom: 0.5rem;"><i class="fa-solid fa-crown"></i> Compte Administrateur Exclusif (contact@bnotseminaire.com)</span>
          <h1 style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 800;">
            Panneau de Gestion Bnot Séminaire
          </h1>
          <p style="color: var(--text-muted);">Accès complet aux 16 articles Supabase, demandes formulaires, profils et réservations.</p>
        </div>

        <button class="btn btn-outline-pill" id="btn-admin-refresh" title="Rafraîchir depuis Supabase">
          <i class="fa-solid fa-arrows-rotate"></i> Synchroniser Supabase
        </button>
      </div>

      <!-- Admin Tabs -->
      <div class="tabs">
        <button class="tab-btn ${activeAdminTab === 'overview' ? 'active' : ''}" data-tab="overview">
          <i class="fa-solid fa-chart-pie"></i> Vue Globale & KPI
        </button>
        <button class="tab-btn ${activeAdminTab === 'requests' ? 'active' : ''}" data-tab="requests">
          <i class="fa-solid fa-file-signature"></i> Demandes Formulaires (${cachedRequests.length})
        </button>
        <button class="tab-btn ${activeAdminTab === 'girls' ? 'active' : ''}" data-tab="girls">
          <i class="fa-solid fa-users-gear"></i> Élèves & Profils (${users.length})
        </button>
        <button class="tab-btn ${activeAdminTab === 'reservations' ? 'active' : ''}" data-tab="reservations">
          <i class="fa-solid fa-boxes-packing"></i> Commandes Boutique (${reservations.length})
        </button>
        <button class="tab-btn ${activeAdminTab === 'products' ? 'active' : ''}" data-tab="products">
          <i class="fa-solid fa-store"></i> Produits Boutique (${products.length})
        </button>
      </div>

      <!-- Tab Content Area -->
      ${renderAdminTabContent(activeAdminTab, users, reservations, products, totalReservedAmount, onNavigate)}
    </div>
  `;

  setTimeout(() => {
    document.querySelectorAll('.admin-view .tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activeAdminTab = btn.getAttribute('data-tab');
        onNavigate('admin', activeAdminTab);
      });
    });

    document.getElementById('btn-admin-refresh')?.addEventListener('click', async () => {
      window.showToast('Synchronisation des 16 articles Supabase en cours...', 'info');
      await Storage.syncFromSupabase();
      cachedRequests = (await SupabaseApi.getRequests()) || [];
      window.showToast('Données Supabase à jour !', 'success');
      onNavigate('admin', activeAdminTab);
    });

    bindTabEventListeners(activeAdminTab, users, reservations, products, onNavigate);
  }, 0);

  return html;
}

function renderAdminTabContent(tab, users, reservations, products, totalReservedAmount, onNavigate) {
  if (tab === 'requests') {
    return renderRequestsTab(cachedRequests);
  } else if (tab === 'girls') {
    return renderGirlsTab(users, reservations);
  } else if (tab === 'reservations') {
    return renderReservationsTab(reservations);
  } else if (tab === 'products') {
    return renderProductsTab(products);
  } else {
    return renderOverviewTab(users, reservations, products, totalReservedAmount);
  }
}

function renderOverviewTab(users, reservations, products, totalReservedAmount) {
  return `
    <div class="grid-4" style="margin-bottom: 2rem;">
      <div class="card">
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Demandes Formulaires</div>
        <div style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 800; color: var(--text-main); margin: 0.2rem 0;">${cachedRequests.length}</div>
        <div style="font-size: 0.82rem; color: var(--success);"><i class="fa-solid fa-database"></i> Table requests Supabase</div>
      </div>

      <div class="card">
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Profils Élèves</div>
        <div style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 800; color: var(--text-main); margin: 0.2rem 0;">
          ${users.length}
        </div>
        <div style="font-size: 0.82rem; color: var(--text-muted);">Table profiles Supabase</div>
      </div>

      <div class="card">
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Commandes Boutique</div>
        <div style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 800; color: var(--text-main); margin: 0.2rem 0;">
          ${reservations.length}
        </div>
        <div style="font-size: 0.82rem; color: var(--text-muted);">Table orders Supabase</div>
      </div>

      <div class="card">
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Articles Catalogue</div>
        <div style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 800; color: var(--text-main); margin: 0.2rem 0;">
          ${products.length}
        </div>
        <div style="font-size: 0.82rem; color: var(--text-muted);">16 Articles réels Supabase</div>
      </div>
    </div>

    <!-- Quick Table of Requests -->
    <div class="card">
      <h3 class="section-title"><i class="fa-solid fa-file-signature"></i> Dernières Demandes Reçues (Table requests)</h3>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Type Demande</th>
              <th>Nom & Prénom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Séminaire</th>
              <th>Passeport</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${cachedRequests.length === 0 ? `
              <tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">Aucune demande enregistrée dans la table requests. Soumettez un formulaire sur le site pour la voir apparaître ici en direct.</td></tr>
            ` : cachedRequests.map(req => `
              <tr>
                <td><span class="badge badge-pill-pink">${req.kind || 'Demande'}</span></td>
                <td><strong>${req.first_name || ''} ${req.last_name || ''}</strong></td>
                <td>${req.email || '-'}</td>
                <td>${req.phone || '-'}</td>
                <td>${req.school || '-'}</td>
                <td><code>${req.passport_number || '-'}</code></td>
                <td>
                  <button class="btn btn-outline-pill btn-sm btn-view-req-detail" data-id="${req.id}">
                    <i class="fa-solid fa-eye"></i> Voir Formulaire Complet
                  </button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderRequestsTab(requests) {
  return `
    <div class="card">
      <h3 class="section-title"><i class="fa-solid fa-file-signature"></i> Toutes les Demandes Formulaires (Table Supabase requests)</h3>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Domaine</th>
              <th>Élève</th>
              <th>Email & Tél Perso</th>
              <th>Tél Parents</th>
              <th>Séminaire</th>
              <th>Passeport</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${requests.length === 0 ? `
              <tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 2rem;">Aucune demande enregistrée dans Supabase. Soumettez un formulaire sur la page d'accueil ou Contact.</td></tr>
            ` : requests.map(req => `
              <tr>
                <td><code>#${(req.id || '').substring(0, 6)}</code></td>
                <td><span class="badge badge-pill-pink">${req.kind}</span></td>
                <td><strong>${req.first_name} ${req.last_name}</strong></td>
                <td>${req.email}<br><small style="color: var(--text-muted);">${req.phone}</small></td>
                <td>${req.parent_phone || '-'}</td>
                <td>${req.school || '-'}</td>
                <td><code>${req.passport_number || '-'}</code></td>
                <td>
                  <div style="display: flex; gap: 0.4rem;">
                    <button class="btn btn-outline-pill btn-sm btn-view-req-detail" data-id="${req.id}">
                      <i class="fa-solid fa-folder-open"></i> Détails
                    </button>
                    <a href="https://wa.me/${(req.phone || '').replace(/[^0-9]/g, '')}?text=Bonjour%20${encodeURIComponent(req.first_name)},%20concernant%20votre%20demande%20de%20${encodeURIComponent(req.kind)}..." target="_blank" class="btn btn-outline-pill btn-sm">
                      <i class="fa-brands fa-whatsapp"></i> WhatsApp
                    </a>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderGirlsTab(users, reservations) {
  return `
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <h3 class="section-title" style="margin: 0;"><i class="fa-solid fa-address-book"></i> Répertoire des Profils & Commandes (Table profiles)</h3>
      </div>

      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Élève</th>
              <th>Séminaire</th>
              <th>Passeport</th>
              <th>Koupat Holim</th>
              <th>Visa A/2</th>
              <th>Commandes</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${users.length === 0 ? `
              <tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">Aucun profil inscrit pour le moment. Tout nouveau compte créé s'affichera ici en direct.</td></tr>
            ` : users.map(girl => {
              const girlRes = reservations.filter(r => r.userId === girl.id || r.userEmail === girl.email);
              return `
                <tr>
                  <td>
                    <strong>${girl.name}</strong><br>
                    <span style="font-size: 0.78rem; color: var(--text-muted);">${girl.email}</span>
                  </td>
                  <td>${girl.seminary}</td>
                  <td><code>${girl.passport || 'N/A'}</code></td>
                  <td><span class="badge badge-info">${girl.koupatFund ? girl.koupatFund.toUpperCase() : 'Aucune'}</span></td>
                  <td>
                    <span class="badge ${girl.visaProgress === 100 ? 'badge-success' : 'badge-warning'}">${girl.visaStatus || 'N/A'}</span>
                  </td>
                  <td>
                    <span class="badge badge-primary">${girlRes.length} commande(s)</span>
                  </td>
                  <td>
                    <button class="btn btn-outline-pill btn-sm btn-inspect-girl" data-id="${girl.id}">
                      <i class="fa-solid fa-folder-open"></i> Gérer Dossier
                    </button>
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderReservationsTab(reservations) {
  return `
    <div class="card">
      <h3 class="section-title"><i class="fa-solid fa-boxes-stacked"></i> Commandes & Réservations (Table orders)</h3>
      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>ID Commande</th>
              <th>Élève</th>
              <th>Séminaire</th>
              <th>Articles Commandés</th>
              <th>Montant Total</th>
              <th>Statut Supabase</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${reservations.length === 0 ? `
              <tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 2rem;">Aucune commande enregistrée pour l'instant. Les commandes passées sur la boutique apparaîtront ici en direct.</td></tr>
            ` : reservations.map(res => `
              <tr>
                <td><strong>#${res.id}</strong><br><span style="font-size: 0.75rem; color: var(--text-muted);">${res.createdAt}</span></td>
                <td><strong>${res.userName}</strong><br><span style="font-size: 0.78rem; color: var(--text-muted);">${res.userPhone || res.userEmail}</span></td>
                <td>${res.userSeminary}</td>
                <td>
                  <ul style="padding-left: 1rem; font-size: 0.85rem;">
                    ${res.items.map(i => `<li>${i.name} (x${i.quantity || 1})</li>`).join('')}
                  </ul>
                </td>
                <td><strong style="color: var(--text-main); font-size: 1.1rem;">${res.totalPrice} ${res.currency || '₪'}</strong></td>
                <td>
                  <select class="form-control select-change-status" data-id="${res.id}" style="padding: 0.3rem 0.5rem; font-size: 0.82rem;">
                    <option value="pending" ${res.status === 'En attente' || res.status === 'pending' ? 'selected' : ''}>pending (En attente)</option>
                    <option value="validated" ${res.status === 'Validée' || res.status === 'validated' ? 'selected' : ''}>validated (Validée)</option>
                    <option value="delivered" ${res.status === 'Livrée' || res.status === 'delivered' ? 'selected' : ''}>delivered (Livrée)</option>
                  </select>
                </td>
                <td>
                  <a href="https://wa.me/${(res.userPhone || '').replace(/[^0-9]/g, '')}?text=Bonjour%20${encodeURIComponent(res.userName)},%20de%20l'équipe%20Bnot%20Séminaire..." target="_blank" class="btn btn-outline-pill btn-sm">
                    <i class="fa-brands fa-whatsapp"></i> WhatsApp
                  </a>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderProductsTab(products) {
  return `
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h3 class="section-title" style="margin: 0;"><i class="fa-solid fa-boxes-packing"></i> Catalogue des Articles (Table Supabase products)</h3>
          <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0.2rem 0 0;">Modifiez les prix, titres, tailles disponibles, importez des photos, passez en Rupture de Stock, ou ajoutez/supprimez des articles.</p>
        </div>
        <button class="btn btn-pink-gradient" id="btn-admin-add-product">
          <i class="fa-solid fa-plus"></i> Ajouter un Article dans Supabase
        </button>
      </div>

      <div class="table-responsive">
        <table class="table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Nom du Produit</th>
              <th>Prix (₪)</th>
              <th>Tailles</th>
              <th>État du Stock (Supabase)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${products.map(prod => {
              const sizes = Array.isArray(prod.sizes) ? prod.sizes : [];
              const parsedSizes = sizes.length > 0 && typeof sizes[0] === 'object' ? sizes : sizes.map(s => ({name: String(s), price: null}));
              return `
              <tr>
                <td><img src="${prod.image}" alt="${prod.name}" style="width: 48px; height: 48px; border-radius: 8px; object-fit: cover; border: 1px solid var(--border-color);"></td>
                <td>
                  <strong>${prod.name || prod.title}</strong><br>
                  <span style="font-size: 0.78rem; color: var(--text-muted);">${(prod.description || '').substring(0, 50)}...</span>
                </td>
                <td><strong>${prod.price} ₪</strong></td>
                <td>
                  ${parsedSizes.length > 0
                    ? parsedSizes.map(s => `<span style="display:inline-block;background:var(--accent-1-light);border:1px solid var(--accent-1);border-radius:6px;padding:0.15rem 0.5rem;font-size:0.75rem;font-weight:700;margin:0.1rem;">${s.name}${s.price !== null && s.price !== undefined ? ` (${s.price}₪)` : ''}</span>`).join('')
                    : '<span style="color:var(--text-subtle);font-size:0.82rem;">Aucune</span>'}
                </td>
                <td>
                  <select class="form-control select-prod-stock" data-id="${prod.id}" style="padding: 0.3rem 0.5rem; font-size: 0.82rem; font-weight: 700; color: ${prod.status === 'out_of_stock' ? 'var(--danger)' : 'var(--success)'}">
                    <option value="in_stock" ${prod.status !== 'out_of_stock' ? 'selected' : ''}>🟢 En Stock (Disponible)</option>
                    <option value="out_of_stock" ${prod.status === 'out_of_stock' ? 'selected' : ''}>🔴 Rupture de Stock</option>
                  </select>
                </td>
                <td>
                  <div style="display: flex; gap: 0.4rem;">
                    <button class="btn btn-outline-pill btn-sm btn-edit-product" data-id="${prod.id}">
                      <i class="fa-solid fa-pen"></i> Modifier
                    </button>
                    <button class="btn btn-secondary btn-sm btn-delete-product" data-id="${prod.id}" style="color: var(--danger);">
                      <i class="fa-solid fa-trash"></i> Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            `}).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}


function bindTabEventListeners(tab, users, reservations, products, onNavigate) {
  document.querySelectorAll('.btn-view-req-detail').forEach(btn => {
    btn.addEventListener('click', () => {
      const reqId = btn.getAttribute('data-id');
      const req = cachedRequests.find(r => r.id === reqId);
      if (req) showRequestDetailModal(req);
    });
  });

  document.querySelectorAll('.btn-inspect-girl').forEach(btn => {
    btn.addEventListener('click', () => {
      const girlId = btn.getAttribute('data-id');
      const girl = users.find(u => u.id === girlId);
      if (girl) showGirlDetailModal(girl, reservations, onNavigate);
    });
  });

  document.querySelectorAll('.select-change-status').forEach(select => {
    select.addEventListener('change', async (e) => {
      const resId = select.getAttribute('data-id');
      const newStatus = e.target.value;
      await Storage.updateReservationStatus(resId, newStatus);
      window.showToast(`Statut de la commande mis à jour sur Supabase : ${newStatus}`, 'success');
    });
  });

  document.querySelectorAll('.select-prod-stock').forEach(select => {
    select.addEventListener('change', async (e) => {
      const prodId = select.getAttribute('data-id');
      const newStatus = e.target.value;
      await Storage.updateProductStatus(prodId, newStatus);
      window.showToast(`État du stock mis à jour sur Supabase : ${newStatus === 'out_of_stock' ? 'Rupture de Stock' : 'En Stock'}`, newStatus === 'out_of_stock' ? 'warning' : 'success');
      onNavigate('admin', 'products');
    });
  });

  document.querySelectorAll('.btn-edit-product').forEach(btn => {
    btn.addEventListener('click', () => {
      const prodId = btn.getAttribute('data-id');
      const prod = products.find(p => p.id === prodId);
      if (prod) showEditProductModal(prod, onNavigate);
    });
  });

  document.getElementById('btn-admin-add-product')?.addEventListener('click', () => {
    showAddProductModal(onNavigate);
  });

  document.querySelectorAll('.btn-delete-product').forEach(btn => {
    btn.addEventListener('click', async () => {
      const prodId = btn.getAttribute('data-id');
      if (confirm('Voulez-vous vraiment supprimer cet article dans Supabase ?')) {
        await Storage.deleteProduct(prodId);
        window.showToast('Article supprimé de Supabase !', 'info');
        onNavigate('admin', 'products');
      }
    });
  });
}

function showEditProductModal(prod, onNavigate) {
  let productImages = (prod.images && Array.isArray(prod.images) && prod.images.length > 0)
    ? [...prod.images]
    : (prod.image ? [prod.image] : []);
  const existingSizes = Array.isArray(prod.sizes) ? prod.sizes.map(s => typeof s === 'object' ? s : {name: String(s), price: null}) : [];

  const modalHtml = `
    <div class="modal-overlay" id="modal-edit-product">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title"><i class="fa-solid fa-pen-to-square" style="color: var(--text-main);"></i> Modifier l'Article (Supabase)</h3>
          <button class="modal-close" id="btn-close-edit-prod-modal"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Titre de l'Article *</label>
            <input type="text" class="form-control" id="edit-prod-name" value="${prod.name || prod.title}" required>
          </div>
          <div class="form-group">
            <label class="form-label">Sous-titre (Optionnel)</label>
            <input type="text" class="form-control" id="edit-prod-subtitle" value="${prod.subtitle || ''}" placeholder="ex: Pack 100% Coton Supérieur">
          </div>
          <div class="grid-2">
            <div class="form-group">
              <label class="form-label">Prix (₪) *</label>
              <input type="number" class="form-control" id="edit-prod-price" value="${prod.price}" required>
            </div>
            <div class="form-group">
              <label class="form-label">Statut du Stock</label>
              <select class="form-control" id="edit-prod-status">
                <option value="in_stock" ${prod.status !== 'out_of_stock' ? 'selected' : ''}>🟢 En Stock (Disponible)</option>
                <option value="out_of_stock" ${prod.status === 'out_of_stock' ? 'selected' : ''}>🔴 Rupture de Stock</option>
              </select>
            </div>
          </div>

          <!-- Tailles avec Prix -->
          <div class="form-group">
            <label class="form-label"><i class="fa-solid fa-ruler" style="color: var(--accent-1);"></i> Tailles disponibles avec prix spécifique</label>
            <div id="edit-sizes-container" style="display:flex;flex-direction:column;gap:0.5rem;margin-bottom:0.75rem;"></div>
            <button type="button" class="btn btn-outline-pill btn-sm" id="btn-add-edit-size" style="font-size:0.82rem;"><i class="fa-solid fa-plus"></i> Ajouter une taille</button>
          </div>

          <!-- Photo Upload & Multi-Image Gallery -->
          <div class="form-group">
            <label class="form-label"><i class="fa-solid fa-images" style="color: var(--accent-1);"></i> Photos de l'Article (Plusieurs photos autorisées)</label>
            <div id="edit-img-gallery" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(75px, 1fr)); gap: 0.5rem; margin-bottom: 0.75rem;"></div>
            <div id="edit-img-drop-zone" style="
              border: 2px dashed var(--border-color);
              border-radius: var(--radius-md);
              padding: 1rem;
              text-align: center;
              cursor: pointer;
              transition: all 0.2s ease;
              background: var(--bg-main);
              position: relative;
            ">
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem;">
                <i class="fa-solid fa-cloud-arrow-up" style="font-size: 1.3rem; color: var(--accent-1); display: block; margin-bottom: 0.3rem;"></i>
                <strong>Cliquer pour ajouter des photos</strong> (sélection multiple) ou glisser-déposer
              </div>
              <div style="font-size: 0.75rem; color: var(--text-subtle);">JPG, PNG, WEBP acceptés</div>
              <input type="file" id="edit-prod-file" accept="image/*" multiple style="position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;">
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-control" id="edit-prod-desc" rows="3">${prod.description || ''}</textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="btn-cancel-edit-prod">Annuler</button>
          <button class="btn btn-pink-gradient" id="btn-submit-edit-prod">Enregistrer dans Supabase</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const closeModal = () => document.getElementById('modal-edit-product')?.remove();

  // Multi-image gallery renderer
  function renderEditGallery() {
    const galleryEl = document.getElementById('edit-img-gallery');
    if (!galleryEl) return;
    if (productImages.length === 0) {
      galleryEl.innerHTML = '<div style="grid-column: 1/-1; color: var(--text-muted); font-size: 0.8rem; text-align: center; padding: 0.4rem;">Aucune photo sélectionnée</div>';
      return;
    }
    galleryEl.innerHTML = productImages.map((imgUrl, i) => `
      <div style="position: relative; border-radius: 8px; overflow: hidden; border: 2px solid ${i === 0 ? 'var(--accent-1)' : 'var(--border-color)'}; aspect-ratio: 1; background: var(--bg-card);">
        <img src="${imgUrl}" style="width: 100%; height: 100%; object-fit: cover;">
        ${i === 0 ? '<span style="position: absolute; bottom: 2px; left: 2px; background: var(--accent-1); color: var(--text-main); font-size: 0.62rem; font-weight: 800; padding: 1px 4px; border-radius: 4px;">Principale</span>' : ''}
        <button type="button" class="btn-remove-edit-img" data-idx="${i}" style="
          position: absolute;
          top: 2px;
          right: 2px;
          background: rgba(225, 29, 72, 0.9);
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 0.65rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        "><i class="fa-solid fa-xmark"></i></button>
      </div>
    `).join('');

    galleryEl.querySelectorAll('.btn-remove-edit-img').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-idx'));
        productImages.splice(idx, 1);
        renderEditGallery();
      });
    });
  }
  renderEditGallery();

  // Dynamic size rows
  const sizesContainer = document.getElementById('edit-sizes-container');
  let sizesData = [...existingSizes];
  
  function renderSizeRows() {
    sizesContainer.innerHTML = sizesData.map((sz, i) => `
      <div style="display:flex;gap:0.5rem;align-items:center;" data-size-idx="${i}">
        <input type="text" class="form-control edit-sz-name" value="${sz.name}" placeholder="ex: 50x100 ou M" style="flex:1;min-height:40px;">
        <input type="number" class="form-control edit-sz-price" value="${sz.price !== null && sz.price !== undefined ? sz.price : ''}" placeholder="Prix (₪)" style="width:100px;min-height:40px;">
        <button type="button" class="btn btn-secondary btn-sm edit-sz-remove" data-idx="${i}" style="color:var(--danger);min-height:40px;width:40px;"><i class="fa-solid fa-trash"></i></button>
      </div>
    `).join('');
    sizesContainer.querySelectorAll('.edit-sz-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        sizesData.splice(parseInt(btn.getAttribute('data-idx')), 1);
        renderSizeRows();
      });
    });
  }
  renderSizeRows();

  document.getElementById('btn-add-edit-size')?.addEventListener('click', () => {
    sizesData.push({ name: '', price: null });
    renderSizeRows();
  });

  const dropZone = document.getElementById('edit-img-drop-zone');
  const fileInput = document.getElementById('edit-prod-file');

  function handleImageFiles(files) {
    if (!files || files.length === 0) return;
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        productImages.push(e.target.result);
        renderEditGallery();
      };
      reader.readAsDataURL(file);
    });
  }

  fileInput?.addEventListener('change', (e) => handleImageFiles(e.target.files));

  // Drag and drop support
  dropZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--accent-1)';
    dropZone.style.background = 'var(--accent-1-light)';
  });
  dropZone?.addEventListener('dragleave', () => {
    dropZone.style.borderColor = 'var(--border-color)';
    dropZone.style.background = 'var(--bg-main)';
  });
  dropZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--border-color)';
    dropZone.style.background = 'var(--bg-main)';
    handleImageFiles(e.dataTransfer.files);
  });

  document.getElementById('btn-close-edit-prod-modal')?.addEventListener('click', closeModal);
  document.getElementById('btn-cancel-edit-prod')?.addEventListener('click', closeModal);

  document.getElementById('btn-submit-edit-prod')?.addEventListener('click', async () => {
    const name = document.getElementById('edit-prod-name').value.trim();
    const subtitle = document.getElementById('edit-prod-subtitle').value.trim();
    const price = parseFloat(document.getElementById('edit-prod-price').value) || 0;
    const status = document.getElementById('edit-prod-status').value;
    const description = document.getElementById('edit-prod-desc').value.trim();
    // Gather sizes from dynamic rows
    const sizeRows = document.querySelectorAll('#edit-sizes-container [data-size-idx]');
    const sizes = [];
    sizeRows.forEach(row => {
      const name = row.querySelector('.edit-sz-name').value.trim();
      const priceVal = row.querySelector('.edit-sz-price').value.trim();
      if (name) sizes.push({ name, price: priceVal !== '' ? parseFloat(priceVal) : null });
    });

    await Storage.updateProduct(prod.id, {
      title: name,
      name: name,
      subtitle: subtitle,
      price: price,
      status: status,
      image: productImages[0] || prod.image,
      images: productImages,
      description: description,
      sizes: sizes
    });

    window.showToast(`L'article "${name}" a été mis à jour avec succès !`, 'success');
    closeModal();
    onNavigate('admin', 'products');
  });
}

function showAddProductModal(onNavigate) {
  let productImages = [];

  const modalHtml = `
    <div class="modal-overlay" id="modal-add-product">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title"><i class="fa-solid fa-plus-circle" style="color: var(--text-main);"></i> Ajouter un Produit (Supabase)</h3>
          <button class="modal-close" id="btn-close-prod-modal"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">Titre du Produit *</label>
            <input type="text" class="form-control" id="new-prod-name" placeholder="ex: Adaptateur Universel Israël" required>
          </div>
          <div class="form-group">
            <label class="form-label">Sous-titre (Optionnel)</label>
            <input type="text" class="form-control" id="new-prod-subtitle" placeholder="ex: Pack 100% Coton Supérieur">
          </div>
          <div class="form-group">
            <label class="form-label">Prix (₪) *</label>
            <input type="number" class="form-control" id="new-prod-price" placeholder="150" value="100" required>
          </div>

          <!-- Photo Upload & Multi-Image Gallery -->
          <div class="form-group">
            <label class="form-label"><i class="fa-solid fa-images" style="color: var(--accent-1);"></i> Photos de l'Article (Plusieurs photos autorisées)</label>
            <div id="new-img-gallery" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(75px, 1fr)); gap: 0.5rem; margin-bottom: 0.75rem;"></div>
            <div id="new-img-drop-zone" style="
              border: 2px dashed var(--border-color);
              border-radius: var(--radius-md);
              padding: 1rem;
              text-align: center;
              cursor: pointer;
              transition: all 0.2s ease;
              background: var(--bg-main);
              position: relative;
            ">
              <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.25rem;">
                <i class="fa-solid fa-cloud-arrow-up" style="font-size: 1.3rem; color: var(--accent-1); display: block; margin-bottom: 0.3rem;"></i>
                <strong>Cliquer pour ajouter des photos</strong> (sélection multiple) ou glisser-déposer
              </div>
              <div style="font-size: 0.75rem; color: var(--text-subtle);">JPG, PNG, WEBP acceptés</div>
              <input type="file" id="new-prod-file" accept="image/*" multiple style="position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%;">
            </div>
          </div>

          <!-- Tailles avec Prix -->
          <div class="form-group">
            <label class="form-label"><i class="fa-solid fa-ruler" style="color: var(--accent-1);"></i> Tailles disponibles avec prix <span style="font-weight:400;color:var(--text-muted);font-size:0.82rem;">(laisser vide si pas de taille)</span></label>
            <div id="new-sizes-container" style="display:flex;flex-direction:column;gap:0.5rem;margin-bottom:0.75rem;"></div>
            <button type="button" class="btn btn-outline-pill btn-sm" id="btn-add-new-size" style="font-size:0.82rem;"><i class="fa-solid fa-plus"></i> Ajouter une taille</button>
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-control" id="new-prod-desc" rows="3" placeholder="Description de l'article..."></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" id="btn-cancel-add-prod">Annuler</button>
          <button class="btn btn-pink-gradient" id="btn-submit-add-prod">Ajouter dans Supabase</button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const closeModal = () => document.getElementById('modal-add-product')?.remove();

  function renderNewGallery() {
    const galleryEl = document.getElementById('new-img-gallery');
    if (!galleryEl) return;
    if (productImages.length === 0) {
      galleryEl.innerHTML = '<div style="grid-column: 1/-1; color: var(--text-muted); font-size: 0.8rem; text-align: center; padding: 0.4rem;">Aucune photo sélectionnée</div>';
      return;
    }
    galleryEl.innerHTML = productImages.map((imgUrl, i) => `
      <div style="position: relative; border-radius: 8px; overflow: hidden; border: 2px solid ${i === 0 ? 'var(--accent-1)' : 'var(--border-color)'}; aspect-ratio: 1; background: var(--bg-card);">
        <img src="${imgUrl}" style="width: 100%; height: 100%; object-fit: cover;">
        ${i === 0 ? '<span style="position: absolute; bottom: 2px; left: 2px; background: var(--accent-1); color: var(--text-main); font-size: 0.62rem; font-weight: 800; padding: 1px 4px; border-radius: 4px;">Principale</span>' : ''}
        <button type="button" class="btn-remove-new-img" data-idx="${i}" style="
          position: absolute;
          top: 2px;
          right: 2px;
          background: rgba(225, 29, 72, 0.9);
          color: #fff;
          border: none;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          font-size: 0.65rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        "><i class="fa-solid fa-xmark"></i></button>
      </div>
    `).join('');

    galleryEl.querySelectorAll('.btn-remove-new-img').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(btn.getAttribute('data-idx'));
        productImages.splice(idx, 1);
        renderNewGallery();
      });
    });
  }
  renderNewGallery();

  // Dynamic size rows
  const sizesContainer = document.getElementById('new-sizes-container');
  let sizesData = [];
  
  function renderSizeRows() {
    sizesContainer.innerHTML = sizesData.map((sz, i) => `
      <div style="display:flex;gap:0.5rem;align-items:center;" data-size-idx="${i}">
        <input type="text" class="form-control new-sz-name" value="${sz.name}" placeholder="ex: 50x100 ou XL" style="flex:1;min-height:40px;">
        <input type="number" class="form-control new-sz-price" value="${sz.price !== null && sz.price !== undefined ? sz.price : ''}" placeholder="Prix (₪)" style="width:100px;min-height:40px;">
        <button type="button" class="btn btn-secondary btn-sm new-sz-remove" data-idx="${i}" style="color:var(--danger);min-height:40px;width:40px;"><i class="fa-solid fa-trash"></i></button>
      </div>
    `).join('');
    sizesContainer.querySelectorAll('.new-sz-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        sizesData.splice(parseInt(btn.getAttribute('data-idx')), 1);
        renderSizeRows();
      });
    });
  }
  renderSizeRows();

  document.getElementById('btn-add-new-size')?.addEventListener('click', () => {
    sizesData.push({ name: '', price: null });
    renderSizeRows();
  });

  const dropZone = document.getElementById('new-img-drop-zone');
  const fileInput = document.getElementById('new-prod-file');

  function handleImageFiles(files) {
    if (!files || files.length === 0) return;
    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        productImages.push(e.target.result);
        renderNewGallery();
      };
      reader.readAsDataURL(file);
    });
  }

  fileInput?.addEventListener('change', (e) => handleImageFiles(e.target.files));

  dropZone?.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--accent-1)';
    dropZone.style.background = 'var(--accent-1-light)';
  });
  dropZone?.addEventListener('dragleave', () => {
    dropZone.style.borderColor = 'var(--border-color)';
    dropZone.style.background = 'var(--bg-main)';
  });
  dropZone?.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.style.borderColor = 'var(--border-color)';
    dropZone.style.background = 'var(--bg-main)';
    handleImageFiles(e.dataTransfer.files);
  });

  document.getElementById('btn-close-prod-modal')?.addEventListener('click', closeModal);
  document.getElementById('btn-cancel-add-prod')?.addEventListener('click', closeModal);

  document.getElementById('btn-submit-add-prod')?.addEventListener('click', async () => {
    const name = document.getElementById('new-prod-name').value.trim();
    const subtitle = document.getElementById('new-prod-subtitle').value.trim();
    if (!name) {
      alert('Veuillez saisir un nom de produit');
      return;
    }
    // Gather sizes from dynamic rows
    const sizeRows = document.querySelectorAll('#new-sizes-container [data-size-idx]');
    const sizes = [];
    sizeRows.forEach(row => {
      const name = row.querySelector('.edit-sz-name, .new-sz-name').value.trim();
      const priceVal = row.querySelector('.edit-sz-price, .new-sz-price').value.trim();
      if (name) sizes.push({ name, price: priceVal !== '' ? parseFloat(priceVal) : null });
    });

    const defaultImg = 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80';
    const finalImages = productImages.length > 0 ? productImages : [defaultImg];

    await Storage.addProduct({
      name: name,
      title: name,
      subtitle: subtitle,
      price: parseFloat(document.getElementById('new-prod-price').value) || 0,
      image: finalImages[0],
      images: finalImages,
      description: document.getElementById('new-prod-desc').value.trim() || 'Article de qualité pour le séminaire.',
      sizes: sizes
    });

    window.showToast(`Produit "${name}" créé dans Supabase !`, 'success');
    closeModal();
    onNavigate('admin', 'products');
  });
}

function showRequestDetailModal(req) {
  const modalHtml = `
    <div class="modal-overlay" id="modal-req-detail">
      <div class="modal-content" style="max-width: 750px;">
        <div class="modal-header">
          <h3 class="modal-title"><i class="fa-solid fa-file-signature" style="color: var(--text-main);"></i> Détails Complet du Formulaire (${req.kind})</h3>
          <button class="modal-close" id="btn-close-req-modal"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body" style="display: flex; flex-direction: column; gap: 1.5rem;">
          
          <div style="background: var(--bg-main); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <h4 style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--text-main); margin-bottom: 1rem;">
              1. Informations Élève & Contact
            </h4>
            <div class="grid-2" style="font-size: 0.92rem; row-gap: 0.75rem;">
              <div><strong>Prénom :</strong> ${req.first_name || '-'}</div>
              <div><strong>Nom :</strong> ${req.last_name || '-'}</div>
              <div><strong>E-mail :</strong> ${req.email || '-'}</div>
              <div><strong>Date de Naissance :</strong> ${req.birth_date || '-'}</div>
              <div><strong>Téléphone Perso :</strong> ${req.phone || '-'}</div>
              <div><strong>Téléphone Parents :</strong> ${req.parent_phone || '-'}</div>
              <div><strong>Nationalité :</strong> ${req.nationality || '-'}</div>
              <div><strong>N° Passeport :</strong> <code>${req.passport_number || '-'}</code></div>
            </div>
          </div>

          <div style="background: var(--bg-main); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <h4 style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--text-main); margin-bottom: 1rem;">
              2. Séminaire & Détails du Séjour
            </h4>
            <div style="font-size: 0.92rem; display: flex; flex-direction: column; gap: 0.5rem;">
              <div><strong>Séminaire de Destination :</strong> ${req.school || '-'}</div>
              <div><strong>Détails du Séjour / Statut :</strong> ${req.person_status || '-'}</div>
              <div><strong>Date d'Enregistrement :</strong> ${new Date(req.created_at).toLocaleString()}</div>
            </div>
          </div>

          <div style="background: var(--bg-main); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <h4 style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--text-main); margin-bottom: 0.75rem;">
              3. Pièces Justificatives (Status Upload)
            </h4>
            <ul style="padding-left: 1.2rem; font-size: 0.88rem; color: var(--success);">
              <li>✔ Photo du Passeport reçue</li>
              <li>✔ Photo d'Identité Récente reçue</li>
              <li>✔ Lettre d'Acceptation du Séminaire reçue</li>
              <li>✔ Certificat de Scolarité reçu</li>
            </ul>
          </div>

        </div>
        <div class="modal-footer">
          <a href="https://wa.me/${(req.phone || '').replace(/[^0-9]/g, '')}?text=Bonjour%20${encodeURIComponent(req.first_name)},%20concernant%20votre%20demande%20de%20${encodeURIComponent(req.kind)}..." target="_blank" class="btn btn-outline-pill">
            <i class="fa-brands fa-whatsapp"></i> Contacter par WhatsApp
          </a>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const closeModal = () => document.getElementById('modal-req-detail')?.remove();
  document.getElementById('btn-close-req-modal')?.addEventListener('click', closeModal);
}

function showGirlDetailModal(girl, reservations, onNavigate) {
  const girlReservations = reservations.filter(r => r.userId === girl.id || r.userEmail === girl.email);

  const modalHtml = `
    <div class="modal-overlay" id="modal-girl-detail">
      <div class="modal-content" style="max-width: 750px;">
        <div class="modal-header">
          <h3 class="modal-title"><i class="fa-solid fa-user-graduate" style="color: var(--text-main);"></i> Dossier de ${girl.name}</h3>
          <button class="modal-close" id="btn-close-girl-modal"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <div class="modal-body" style="display: flex; flex-direction: column; gap: 1.5rem;">
          
          <div class="grid-2">
            <div>
              <label class="form-label" style="color: var(--text-muted);">Informations Personnelles</label>
              <div style="font-weight: 700; font-size: 1.1rem;">${girl.name}</div>
              <div style="font-size: 0.88rem; color: var(--text-muted);">${girl.email}</div>
              <div style="font-size: 0.88rem;">📱 ${girl.phone || 'Non renseigné'}</div>
              <div style="font-size: 0.88rem;">🏫 ${girl.seminary}</div>
            </div>

            <div>
              <label class="form-label" style="color: var(--text-muted);">Statut Administratif</label>
              <div style="margin-bottom: 0.5rem;">
                <span style="font-size: 0.8rem;">Koupat Holim :</span>
                <strong style="color: var(--text-main);">${girl.koupatFund ? girl.koupatFund.toUpperCase() : 'Non choisie'}</strong>
              </div>
              <div>
                <span style="font-size: 0.8rem;">Visa A/2 :</span>
                <strong style="color: var(--text-main);">${girl.visaStatus || 'Non commencé'}</strong>
              </div>
            </div>
          </div>

          <div style="background: var(--bg-main); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
            <h4 style="font-family: var(--font-heading); font-size: 1.1rem; color: var(--text-main); margin-bottom: 0.75rem;">
              <i class="fa-solid fa-shopping-bag"></i> Commandes Passées (${girlReservations.length})
            </h4>

            ${girlReservations.length === 0 ? `
              <p style="font-size: 0.88rem; color: var(--text-muted);">Aucune commande enregistrée pour cette élève.</p>
            ` : `
              <div style="display: flex; flex-direction: column; gap: 1rem;">
                ${girlReservations.map(res => `
                  <div style="background: var(--bg-card); padding: 0.85rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color);">
                    <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 0.9rem; margin-bottom: 0.5rem;">
                      <span>Commande #${res.id}</span>
                      <span style="color: var(--text-main);">${res.totalPrice} ${res.currency || '₪'}</span>
                    </div>
                    <ul style="padding-left: 1.2rem; font-size: 0.85rem; color: var(--text-muted);">
                      ${res.items.map(i => `<li>${i.name} (x${i.quantity || 1}) - ${i.price} ₪</li>`).join('')}
                    </ul>
                  </div>
                `).join('')}
              </div>
            `}
          </div>
        </div>

        <div class="modal-footer">
          <a href="https://wa.me/${(girl.phone || '').replace(/[^0-9]/g, '')}?text=Shalom%20${encodeURIComponent(girl.name)},%20de%20l'équipe%20Bnot%20Séminaire..." target="_blank" class="btn btn-outline-pill">
            <i class="fa-brands fa-whatsapp"></i> Contacter WhatsApp
          </a>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const closeModal = () => document.getElementById('modal-girl-detail')?.remove();
  document.getElementById('btn-close-girl-modal')?.addEventListener('click', closeModal);
}
