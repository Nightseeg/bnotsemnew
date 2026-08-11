/* ==========================================================================
   BNOT SÉMINAIRE - BOUTIQUE MODULE (LIVE SUPABASE STOCK INTEGRATED)
   ========================================================================== */

import { Auth } from '../auth.js';
import { Storage } from '../storage.js';

let searchQuery = '';

export function renderBoutiqueView(onNavigate, subView = 'catalog') {
  const user = Auth.getCurrentUser();
  const products = Storage.getProducts();

  if (subView === 'my-reservations') {
    return renderMyReservationsView(user, onNavigate);
  }

  const filteredProducts = products.filter(prod => {
    return (prod.name || prod.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
           (prod.description || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  const html = `
    <div class="boutique-view">
      <!-- Banner -->
      <div style="margin-bottom: 2rem; text-align: center;">
        <span class="badge-pill-pink" style="margin-bottom: 0.5rem;">
          <i class="fa-solid fa-store"></i> Boutique Bnot Séminaire
        </span>
        <h1 style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 800; margin-bottom: 0.5rem;">
          Nos Équipements pour le Séminaire
        </h1>
        <p style="color: var(--text-muted); max-width: 680px; margin: 0 auto; font-size: 1rem;">
          Réservez vos articles indispensables en quelques clics. <strong>Réservation simple sans paiement immédiat</strong> — vos produits seront préparés et livrés à votre séminaire.
        </p>
      </div>

      <!-- Search Bar Simple -->
      <div class="card" style="margin-bottom: 2rem; padding: 1rem 1.25rem;">
        <div style="display: flex; gap: 1rem; align-items: center; justify-content: space-between; flex-wrap: wrap;">
          <div style="font-weight: 700; font-size: 1.1rem;">
            Catalogue des Articles (${filteredProducts.length})
          </div>

          <div style="position: relative; min-width: 280px;">
            <input type="text" class="form-control" id="input-search-prod" placeholder="Rechercher un article..." value="${searchQuery}" style="padding-left: 2.4rem;">
            <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
          </div>
        </div>
      </div>

      <!-- Products Grid -->
      ${filteredProducts.length === 0 ? `
        <div class="card" style="text-align: center; padding: 3rem;">
          <i class="fa-solid fa-box-open" style="font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem;"></i>
          <h3>Aucun article trouvé</h3>
          <p style="color: var(--text-muted);">Essayez de modifier votre recherche.</p>
        </div>
      ` : `
        <div class="grid-4" style="margin-bottom: 3rem;">
          ${filteredProducts.map(prod => {
            const isOutOfStock = prod.status === 'out_of_stock' || prod.available === false;
            return `
              <div class="product-card" style="${isOutOfStock ? 'opacity: 0.75;' : ''}">
                <div class="product-image-wrap" style="position: relative;">
                  <img src="${prod.image}" alt="${prod.name}" class="product-image">
                  ${isOutOfStock ? `
                    <span class="badge" style="position: absolute; top: 10px; left: 10px; font-size: 0.75rem; background: var(--danger); color: white; padding: 0.3rem 0.8rem; border-radius: var(--radius-full);">
                      🔴 Rupture de Stock
                    </span>
                  ` : `
                    <span class="badge badge-pill-pink product-badge" style="position: absolute; top: 10px; left: 10px; font-size: 0.7rem;">
                      Disponible
                    </span>
                  `}
                </div>
                <div class="product-details">
                  <h3 class="product-title">${prod.name || prod.title}</h3>
                  <p class="product-desc">${prod.description}</p>
                  <div class="product-footer">
                    <div>
                      <span class="product-price">${prod.price} ${prod.currency || '₪'}</span>
                      <div style="font-size: 0.75rem; color: ${isOutOfStock ? 'var(--danger)' : 'var(--success)'}; font-weight: 700;">
                        ${isOutOfStock ? 'Épuisé' : 'En stock'}
                      </div>
                    </div>
                    ${isOutOfStock ? `
                      <button class="btn btn-secondary btn-sm" disabled style="cursor: not-allowed; opacity: 0.6;">
                        <i class="fa-solid fa-ban"></i> Indisponible
                      </button>
                    ` : `
                      <button class="btn btn-pink-gradient btn-sm btn-add-to-cart" data-id="${prod.id}">
                        <i class="fa-solid fa-cart-plus"></i> Réserver
                      </button>
                    `}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    </div>
  `;

  setTimeout(() => {
    const searchInput = document.getElementById('input-search-prod');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        onNavigate('boutique');
      });
    }

    document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
      btn.addEventListener('click', () => {
        const prodId = btn.getAttribute('data-id');
        const prod = products.find(p => p.id === prodId);
        if (prod && prod.status !== 'out_of_stock') {
          Storage.addToCart(prod, 1);
          window.showToast(`"${prod.name || prod.title}" ajouté à votre panier de réservation !`, 'success');
          window.dispatchEvent(new CustomEvent('cart-updated'));
        }
      });
    });
  }, 0);

  return html;
}

function renderMyReservationsView(user, onNavigate) {
  if (!user) {
    onNavigate('home');
    return '';
  }

  const reservations = Storage.getReservations().filter(r => r.userId === user.id || r.userEmail === user.email);

  const html = `
    <div class="my-reservations-view">
      <div style="margin-bottom: 2rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
        <div>
          <h1 style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800;">Mes Réservations d'Équipements</h1>
          <p style="color: var(--text-muted);">Suivez l'état de préparation et de livraison de vos articles réservés.</p>
        </div>
        <button class="btn btn-primary" id="btn-back-to-boutique">
          <i class="fa-solid fa-store"></i> Continuer mes Réservations
        </button>
      </div>

      ${reservations.length === 0 ? `
        <div class="card" style="text-align: center; padding: 4rem 2rem;">
          <div style="width: 70px; height: 70px; border-radius: 50%; background: var(--accent-1-light); color: var(--text-main); display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 1.5rem;">
            <i class="fa-solid fa-bag-shopping"></i>
          </div>
          <h3 style="font-family: var(--font-heading); font-size: 1.4rem; margin-bottom: 0.5rem;">Vous n'avez aucune réservation en cours</h3>
          <p style="color: var(--text-muted); max-width: 450px; margin: 0 auto 1.5rem;">Parcourez notre boutique pour choisir vos parures de lit, koum-koum de Shabbat et adaptateurs avant votre arrivée.</p>
          <button class="btn btn-pink-gradient btn-lg" id="btn-empty-go-store">
            Découvrir la Boutique <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      ` : `
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          ${reservations.map(res => `
            <div class="card">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem;">
                <div>
                  <span class="badge badge-primary" style="margin-bottom: 0.5rem;">Commande #${res.id}</span>
                  <div style="font-size: 0.85rem; color: var(--text-muted);">Passée le ${res.createdAt}</div>
                </div>
                <div>
                  <span class="badge ${res.status === 'Livrée' ? 'badge-success' : 'badge-warning'}" style="font-size: 0.9rem; padding: 0.4rem 1rem;">
                    ${res.status}
                  </span>
                </div>
              </div>

              <ul style="list-style: none; padding: 0; display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem;">
                ${res.items.map(item => `
                  <li style="display: flex; align-items: center; justify-content: space-between; font-size: 0.95rem;">
                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                      <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; border-radius: 6px; object-fit: cover;">
                      <span><strong>${item.name}</strong> (x${item.quantity || 1})</span>
                    </div>
                    <strong>${item.price * (item.quantity || 1)} ₪</strong>
                  </li>
                `).join('')}
              </ul>

              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border-color); padding-top: 1rem;">
                <span style="font-weight: 700; color: var(--text-muted);">Montant Total</span>
                <span style="font-family: var(--font-heading); font-size: 1.4rem; font-weight: 800; color: var(--text-main);">${res.totalPrice} ₪</span>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;

  setTimeout(() => {
    document.getElementById('btn-back-to-boutique')?.addEventListener('click', () => onNavigate('boutique'));
    document.getElementById('btn-empty-go-store')?.addEventListener('click', () => onNavigate('boutique'));
  }, 0);

  return html;
}
