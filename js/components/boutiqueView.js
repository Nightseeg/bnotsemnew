/* ==========================================================================
   BNOT SÉMINAIRE - BOUTIQUE VIEW (MOBILE RESPONSIVE & FLOATING CART BUTTON)
   ========================================================================== */

import { Storage } from '../storage.js';
import { Auth } from '../auth.js';

let activeCategory = 'all';
let searchQuery = '';

// Helper to normalize sizes: supports both [{name,price}] and ["S","M"] legacy formats
function parseSizes(raw) {
  if (!raw || !Array.isArray(raw) || raw.length === 0) return [];
  if (typeof raw[0] === 'object' && raw[0].name !== undefined) return raw;
  return raw.map(s => ({ name: String(s), price: null }));
}

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

    // Cancel reservation buttons
    document.querySelectorAll('.btn-cancel-res').forEach(btn => {
      btn.addEventListener('click', async () => {
        const resId = btn.getAttribute('data-res-id');
        if (!resId) return;

        // Confirmation dialog
        const confirmed = window.confirm('Êtes-vous sûr(e) de vouloir annuler cette réservation ? Cette action est irréversible.');
        if (!confirmed) return;

        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Annulation...';

        await Storage.cancelReservation(resId);

        window.showToast('Réservation annulée avec succès.', 'info');

        // Remove card from DOM immediately without full page reload
        const card = document.getElementById(`res-card-${resId}`);
        if (card) {
          card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => card.remove(), 300);
        }
      });
    });

    bindCatalogEvents(onNavigate);
  }, 0);

  return html;
}

function renderCatalog(products, totalCount) {
  return `
    <!-- Filters & Search Bar -->
    <div style="background: var(--bg-card); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 2rem; box-shadow: var(--shadow-sm);">
      <!-- Search Input -->
      <div style="position: relative;">
        <i class="fa-solid fa-magnifying-glass" style="position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-muted);"></i>
        <input type="text" id="search-boutique" class="form-control" placeholder="Rechercher un article..." value="${searchQuery}" style="padding-left: 2.6rem; min-height: 42px;">
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
  const sizes = parseSizes(prod.sizes);
  const hasSizes = sizes.length > 0;
  const pricedSizes = sizes.filter(s => s.price !== null && s.price !== undefined && s.price !== '' && !isNaN(s.price));
  const minPrice = pricedSizes.length > 0 ? Math.min(...pricedSizes.map(s => parseFloat(s.price))) : prod.price;
  const hasPricedSizes = pricedSizes.length > 0;

  const images = (prod.images && Array.isArray(prod.images) && prod.images.length > 0)
    ? prod.images
    : (prod.image ? [prod.image] : ['https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80']);
  const mainImage = images[0] || 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80';

  return `
    <div class="product-card">
      <div class="product-image-wrap">
        <img src="${mainImage}" alt="${prod.title || prod.name}" class="product-image" id="main-img-${prod.id}" loading="lazy">
        <span class="badge ${isOutOfStock ? 'badge-danger' : 'badge-success'}" style="position: absolute; top: 10px; left: 10px; box-shadow: var(--shadow-sm);">
          ${isOutOfStock ? '\ud83d\udd34 Rupture' : '\ud83d\udfe2 Disponible'}
        </span>
      </div>

      ${images.length > 1 ? `
        <div style="display: flex; gap: 0.35rem; padding: 0.5rem 0.75rem; background: var(--bg-main); border-bottom: 1px solid var(--border-color); overflow-x: auto;">
          ${images.map((imgUrl, idx) => `
            <img src="${imgUrl}" class="thumb-img-btn" data-product-id="${prod.id}" data-img-url="${imgUrl}" style="
              width: 40px;
              height: 40px;
              object-fit: cover;
              border-radius: 6px;
              cursor: pointer;
              border: 2px solid ${idx === 0 ? 'var(--accent-1)' : 'transparent'};
              opacity: ${idx === 0 ? '1' : '0.65'};
              transition: all 0.15s ease;
            ">
          `).join('')}
        </div>
      ` : ''}

      <div class="product-details">
        <div class="product-title">${prod.title || prod.name}</div>
        <div class="product-desc">${prod.description || ''}</div>

        ${hasSizes ? `
          <div style="margin-bottom: 0.75rem;">
            <div style="font-size: 0.75rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.4rem;">Choisir la taille</div>
            <div class="size-selector" data-product-id="${prod.id}" style="display: flex; flex-wrap: wrap; gap: 0.35rem;">
              ${sizes.map(sz => `
                <button class="btn-size" data-size="${sz.name}" data-size-price="${sz.price !== null && sz.price !== undefined ? sz.price : ''}" style="
                  padding: 0.3rem 0.65rem;
                  border-radius: 8px;
                  font-size: 0.78rem;
                  font-weight: 700;
                  border: 1.5px solid var(--border-color);
                  background: var(--bg-main);
                  color: var(--text-main);
                  cursor: pointer;
                  transition: all 0.15s ease;
                  line-height: 1.3;
                  text-align: center;
                ">${sz.name}${sz.price !== null && sz.price !== undefined ? `<br><span style="font-size:0.7rem;font-weight:600;color:var(--text-muted);">${sz.price} \u20aa</span>` : ''}</button>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <div class="product-footer">
          <div class="product-price" id="price-display-${prod.id}">${hasPricedSizes ? `<span style="font-size:0.82rem;color:var(--text-muted);font-weight:600;">À partir de </span><strong style="font-size:1.25rem;font-weight:800;color:var(--text-main);">${minPrice} \u20aa</strong>` : `${prod.price} \u20aa`}</div>
          
          <button class="btn ${isOutOfStock ? 'btn-secondary' : 'btn-pink-gradient'} btn-sm btn-add-cart" data-id="${prod.id}" data-has-sizes="${hasSizes}" data-base-price="${prod.price}" ${isOutOfStock ? 'disabled style="opacity: 0.55; cursor: not-allowed;"' : ''}>
            <i class="fa-solid ${isOutOfStock ? 'fa-ban' : 'fa-cart-plus'}"></i>
            <span>${isOutOfStock ? '\u00c9puis\u00e9' : 'R\u00e9server'}</span>
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
            <div style="background: var(--bg-main); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1.25rem;" id="res-card-${res.id}">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                <div>
                  <span style="font-weight: 800; font-size: 1.05rem;">Commande #${res.id}</span>
                  <span style="font-size: 0.82rem; color: var(--text-muted); margin-left: 0.5rem;">(${res.createdAt})</span>
                </div>
                <span class="badge ${res.status === 'Validée' ? 'badge-success' : res.status === 'Annulée' ? 'badge-danger' : 'badge-warning'}">
                  ${res.status}
                </span>
              </div>

              <div style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 1rem;">
                ${res.items.map(item => `
                  <div style="display: flex; justify-content: space-between; font-size: 0.9rem;">
                    <span>${item.name}${item.selectedSize ? ` (${item.selectedSize})` : ''} <strong>x${item.quantity || 1}</strong></span>
                    <strong>${item.price * (item.quantity || 1)} \u20aa</strong>
                  </div>
                `).join('')}
              </div>

              <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 0.75rem; flex-wrap: wrap; gap: 0.5rem;">
                <span style="font-size: 0.88rem; color: var(--text-muted);">Mode : Réservation livrée au séminaire</span>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <strong style="font-size: 1.2rem; color: var(--text-main);">${res.totalPrice} \u20aa</strong>
                  ${res.status !== 'Annulée' ? `
                    <button class="btn btn-sm btn-cancel-res" data-res-id="${res.id}" style="
                      background: transparent;
                      border: 1.5px solid var(--danger);
                      color: var(--danger);
                      padding: 0.35rem 0.85rem;
                      border-radius: var(--radius-sm);
                      font-size: 0.82rem;
                      font-weight: 700;
                      cursor: pointer;
                      display: inline-flex;
                      align-items: center;
                      gap: 0.35rem;
                      transition: all 0.15s ease;
                    "
                    onmouseover="this.style.background='var(--danger)';this.style.color='#fff';"
                    onmouseout="this.style.background='transparent';this.style.color='var(--danger)';">
                      <i class="fa-solid fa-xmark"></i> Annuler
                    </button>
                  ` : ''}
                </div>
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
  // Thumbnail switching for multi-image products
  document.querySelectorAll('.thumb-img-btn').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const prodId = thumb.getAttribute('data-product-id');
      const imgUrl = thumb.getAttribute('data-img-url');
      const mainImg = document.getElementById(`main-img-${prodId}`);
      if (mainImg) mainImg.src = imgUrl;

      const container = thumb.parentElement;
      if (container) {
        container.querySelectorAll('.thumb-img-btn').forEach(t => {
          t.style.borderColor = 'transparent';
          t.style.opacity = '0.65';
        });
        thumb.style.borderColor = 'var(--accent-1)';
        thumb.style.opacity = '1';
      }
    });
  });

  // Size button selection highlight + price update
  document.querySelectorAll('.size-selector').forEach(selector => {
    const productId = selector.getAttribute('data-product-id');
    selector.querySelectorAll('.btn-size').forEach(btn => {
      btn.addEventListener('click', () => {
        // Reset all
        selector.querySelectorAll('.btn-size').forEach(b => {
          b.style.background = 'var(--bg-main)';
          b.style.borderColor = 'var(--border-color)';
          b.style.color = 'var(--text-main)';
          b.removeAttribute('data-selected');
        });
        // Highlight selected
        btn.style.background = 'var(--accent-1)';
        btn.style.borderColor = 'var(--accent-1)';
        btn.style.color = 'var(--text-main)';
        btn.setAttribute('data-selected', 'true');

        // Update displayed price if this size has its own price
        const sizePrice = btn.getAttribute('data-size-price');
        const priceDisplay = document.getElementById(`price-display-${productId}`);
        if (priceDisplay && sizePrice && sizePrice !== '') {
          priceDisplay.innerHTML = `${sizePrice} \u20aa`;
          priceDisplay.style.fontFamily = 'var(--font-heading)';
          priceDisplay.style.fontWeight = '800';
          priceDisplay.style.fontSize = '1.25rem';
          priceDisplay.style.color = 'var(--text-main)';
        }
      });
    });
  });

  document.querySelectorAll('.btn-add-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const prodId = btn.getAttribute('data-id');
      const hasSizes = btn.getAttribute('data-has-sizes') === 'true';
      const products = Storage.getProducts();
      const prod = products.find(p => String(p.id) === String(prodId));
      if (!prod || prod.status === 'out_of_stock') return;

      if (hasSizes) {
        const selector = document.querySelector(`.size-selector[data-product-id="${prodId}"]`);
        const selectedBtn = selector ? selector.querySelector('.btn-size[data-selected="true"]') : null;
        if (!selectedBtn) {
          window.showToast('Veuillez choisir une taille avant d\'ajouter au panier.', 'warning');
          if (selector) {
            selector.style.outline = '2px solid var(--accent-2)';
            selector.style.borderRadius = '8px';
            setTimeout(() => { selector.style.outline = ''; }, 1500);
          }
          return;
        }
        const selectedSize = selectedBtn.getAttribute('data-size');
        const sizePrice = selectedBtn.getAttribute('data-size-price');
        const finalPrice = (sizePrice && sizePrice !== '') ? parseFloat(sizePrice) : prod.price;
        Storage.addToCart({ ...prod, selectedSize, price: finalPrice });
        window.showToast(`"${prod.name || prod.title}" (${selectedSize}) ajouté au panier !`, 'success');
      } else {
        Storage.addToCart(prod);
        window.showToast(`"${prod.name || prod.title}" ajouté à votre panier !`, 'success');
      }
      window.dispatchEvent(new Event('cart-updated'));
      window.dispatchEvent(new CustomEvent('open-cart-drawer'));
    });
  });
}
