/* ==========================================================================
   BNOT SÉMINAIRE - BOUTIQUE VIEW (MOBILE RESPONSIVE & FLOATING CART BUTTON)
   ========================================================================== */

import { Storage } from '../storage.js';
import { Auth } from '../auth.js';

let activeCategory = 'all';
let searchQuery = '';

export function renderBoutiqueView(onNavigate, activeTab = 'catalog') {
  const products = Storage.getProducts();
  const reservations = Storage.getReservations();
  const currentUser = Auth.getCurrentUser();
  const cartCount = Storage.getCartCount();

  const userReservations = currentUser ? reservations.filter(r => r.userId === currentUser.id || r.userEmail === currentUser.email) : [];

  let filteredProducts = products.filter(prod => {
    const matchesSearch = searchQuery === '' || 
      (prod.name || prod.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (prod.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    if (activeCategory === 'all') return matchesSearch;
    if (activeCategory === 'literie') return matchesSearch && (prod.title || prod.name || '').toLowerCase().match(/(couette|parure|oreiller|peignoir|serviette)/i);
    if (activeCategory === 'vetements') return matchesSearch && (prod.title || prod.name || '').toLowerCase().match(/(chemise|robe|jupe)/i);
    if (activeCategory === 'telephonie') return matchesSearch && (prod.title || prod.name || '').toLowerCase().match(/(téléphone|kasher|golan|nokia|zte|phone)/i);
    return matchesSearch;
  });

  const html = `
    <div class="boutique-view" style="max-width: 1240px; margin: 0 auto 4rem;">
      
      <!-- Boutique Header Banner -->
      <div style="text-align: center; margin-bottom: 2rem;">
        <span class="badge-pill-pink" style="margin-bottom: 0.75rem;">
          <i class="fa-solid fa-truck-fast"></i> Livraison gratuite au séminaire
        </span>
        <h1 style="font-family: var(--font-heading); font-size: 2.2rem; font-weight: 800; margin-bottom: 0.5rem;">
          Nos Équipements pour le Séminaire
        </h1>
        <p style="color: var(--text-muted); max-width: 680px; margin: 0 auto; font-size: 0.95rem;">
          Réservez vos articles indispensables en quelques clics. <strong>Réservation simple sans paiement immédiat</strong> — vos produits seront préparés et livrés à votre séminaire.
        </p>
      </div>

      <!-- Navigation Tabs (Catalogue vs Mes Réservations) -->
      <div class="tabs" style="justify-content: center; margin-bottom: 1.5rem;">
        <button class="tab-btn ${activeTab === 'catalog' ? 'active' : ''}" id="btn-tab-catalog">
          <i class="fa-solid fa-store"></i> Catalogue des Articles (${products.length})
        </button>
        ${currentUser ? `
          <button class="tab-btn ${activeTab === 'my-reservations' ? 'active' : ''}" id="btn-tab-my-res">
            <i class="fa-solid fa-boxes-packing"></i> Mes Réservations (${userReservations.length})
          </button>
        ` : ''}
      </div>

      ${activeTab === 'my-reservations' ? renderMyReservations(userReservations, onNavigate) : renderCatalog(filteredProducts, products.length)}
      
      <!-- Floating Cart Pill for Mobile -->
      <button class="mobile-cart-float-btn" id="btn-mobile-float-cart">
        <i class="fa-solid fa-cart-shopping"></i>
        <span>Mon Panier</span>
        <span class="badge-count" style="position: static; transform: none; width: 22px; height: 22px;">${cartCount}</span>
      </button>
    </div>
  `;

  setTimeout(() => {
    document.getElementById('btn-tab-catalog')?.addEventListener('click', () => onNavigate('boutique'));
    document.getElementById('btn-tab-my-res')?.addEventListener('click', () => onNavigate('my-reservations'));
    document.getElementById('btn-mobile-float-cart')?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('open-cart-drawer'));
    });

    bindCatalogEvents(onNavigate);
  }, 0);

  return html;
}

function renderCatalog(products, totalCount) {
  return `
    <!-- Filters & Search Bar -->
    <div style="background: var(--bg-card); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 2rem; box-shadow: var(--shadow-sm);">
      <div style="display: flex; gap: 1rem; align-items: center; justify-content: space-between; flex-wrap: wrap;">
        
        <!-- Category Filter Pills -->
        <div style="display: flex; gap: 0.4rem; overflow-x: auto; padding-bottom: 0.25rem; -webkit-overflow-scrolling: touch; width: 100%; max-width: 650px;">
          <button class="btn btn-sm ${activeCategory === 'all' ? 'btn-pink-gradient' : 'btn-outline-pill'}" data-cat="all" style="font-size: 0.82rem; padding: 0.4rem 1rem;">
            Tous (${totalCount})
          </button>
          <button class="btn btn-sm ${activeCategory === 'literie' ? 'btn-pink-gradient' : 'btn-outline-pill'}" data-cat="literie" style="font-size: 0.82rem; padding: 0.4rem 1rem;">
            🛏️ Literie & Bain
          </button>
          <button class="btn btn-sm ${activeCategory === 'vetements' ? 'btn-pink-gradient' : 'btn-outline-pill'}" data-cat="vetements" style="font-size: 0.82rem; padding: 0.4rem 1rem;">
            👔 Vetements
          </button>
          <button class="btn btn-sm ${activeCategory === 'telephonie' ? 'btn-pink-gradient' : 'btn-outline-pill'}" data-cat="telephonie" style="font-size: 0.82rem; padding: 0.4rem 1rem;">
            📱 Téléphonie Kasher
          </button>
        </div>

        <!-- Search Input -->
        <div style="position: relative; flex: 1; min-width: 220px;">
          <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
          <input type="text" id="search-boutique" class="form-control" placeholder="Rechercher un article..." value="${searchQuery}" style="padding-left: 2.6rem; min-height: 42px;">
        </div>

      </div>
    </div>

    <!-- Product Grid (2 columns on mobile, 4 on desktop) -->
    ${products.length === 0 ? `
      <div class="card" style="text-align: center; padding: 4rem 1.5rem;">
        <i class="fa-solid fa-box-open" style="font-size: 3rem; color: var(--text-subtle); margin-bottom: 1rem;"></i>
        <h3 style="font-family: var(--font-heading); font-size: 1.3rem;">Aucun produit ne correspond à votre recherche</h3>
        <p style="color: var(--text-muted); font-size: 0.9rem;">Essayez un autre mot-clé ou filtrez par catégorie.</p>
      </div>
    ` : `
      <div class="grid-4 boutique-grid">
        ${products.map(prod => renderProductCard(prod)).join('')}
      </div>
    `}
  `;
}

function renderProductCard(prod) {
  const isOutOfStock = prod.status === 'out_of_stock';

  return `
    <div class="product-card">
      <div class="product-image-wrap">
        <img src="${prod.image}" alt="${prod.title || prod.name}" class="product-image" loading="lazy">
        <span class="badge ${isOutOfStock ? 'badge-danger' : 'badge-success'}" style="position: absolute; top: 10px; left: 10px; box-shadow: var(--shadow-sm);">
          ${isOutOfStock ? '🔴 Rupture' : '🟢 Disponible'}
        </span>
      </div>

      <div class="product-details">
        <div class="product-title">${prod.title || prod.name}</div>
        <div class="product-desc">${prod.description || ''}</div>
        
        <div class="product-footer">
          <div class="product-price">${prod.price} ₪</div>
          
          <button class="btn ${isOutOfStock ? 'btn-secondary' : 'btn-pink-gradient'} btn-sm btn-add-cart" data-id="${prod.id}" ${isOutOfStock ? 'disabled style="opacity: 0.55; cursor: not-allowed;"' : ''}>
            <i class="fa-solid ${isOutOfStock ? 'fa-ban' : 'fa-cart-plus'}"></i>
            <span>${isOutOfStock ? 'Épuisé' : 'Réserver'}</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function renderMyReservations(reservations, onNavigate) {
  return `
    <div class="card">
      <h3 class="section-title"><i class="fa-solid fa-boxes-packing"></i> Historique de mes Réservations</h3>
      ${reservations.length === 0 ? `
        <p style="color: var(--text-muted); text-align: center; padding: 2rem;">Vous n'avez pas encore effectué de réservation. Parcourez notre catalogue d'équipements pour passer commande !</p>
      ` : `
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          ${reservations.map(res => `
            <div style="background: var(--bg-main); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                <div>
                  <span style="font-weight: 800; font-size: 1.05rem;">Commande #${res.id}</span>
                  <span style="font-size: 0.82rem; color: var(--text-muted); margin-left: 0.5rem;">(${res.createdAt})</span>
                </div>
                <span class="badge ${res.status === 'Validée' ? 'badge-success' : 'badge-warning'}">
                  ${res.status}
                </span>
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
                ${res.items.map(item => `
                  <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                    <span>${item.name} <strong>x${item.quantity || 1}</strong></span>
                    <strong>${item.price * (item.quantity || 1)} ₪</strong>
                  </div>
                `).join('')}
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 0.75rem;">
                <span style="font-size: 0.88rem; color: var(--text-muted);">Mode : Réservation livrée au séminaire</span>
                <strong style="font-size: 1.2rem; color: var(--text-main);">${res.totalPrice} ₪</strong>
              </div>
            </div>
          `).join('')}
        </div>
      `}
    </div>
  `;
}

function bindCatalogEvents(onNavigate) {
  document.querySelectorAll('[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      activeCategory = btn.getAttribute('data-cat');
      onNavigate('boutique');
    });
  });

  const searchInput = document.getElementById('search-boutique');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      const products = Storage.getProducts();
      const filtered = products.filter(p => (p.name || p.title || '').toLowerCase().includes(searchQuery.toLowerCase()));
      const grid = document.querySelector('.boutique-grid');
      if (grid) {
        grid.innerHTML = filtered.map(prod => renderProductCard(prod)).join('');
        bindAddButtons();
      }
    });
  }

  bindAddButtons();
}

function bindAddButtons() {
  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const prodId = btn.getAttribute('data-id');
      const products = Storage.getProducts();
      const prod = products.find(p => p.id === prodId);
      if (prod && prod.status !== 'out_of_stock') {
        Storage.addToCart(prod);
        window.showToast(`"${prod.name || prod.title}" ajouté à votre panier !`, 'success');
        window.dispatchEvent(new Event('cart-updated'));
      }
    });
  });
}
