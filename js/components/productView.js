/* ==========================================================================
   BNOT SÉMINAIRE - PRODUCT DETAIL VIEW COMPONENT
   ========================================================================== */

import { Storage } from '../storage.js';

function parseSizes(raw) {
  if (!raw || !Array.isArray(raw) || raw.length === 0) return [];
  if (typeof raw[0] === 'object' && raw[0].name !== undefined) return raw;
  return raw.map(s => ({ name: String(s), price: null }));
}

export function renderProductView(onNavigate, productId) {
  const products = Storage.getProducts();
  const prod = products.find(p => String(p.id) === String(productId));

  if (!prod) {
    return `
      <div style="max-width: 1240px; margin: 3rem auto; text-align: center; padding: 4rem 1.5rem;">
        <i class="fa-solid fa-circle-exclamation" style="font-size: 3rem; color: var(--danger); margin-bottom: 1rem;"></i>
        <h2 style="font-family: var(--font-heading); font-size: 1.8rem; margin-bottom: 0.5rem;">Article introuvable</h2>
        <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Cet article n'existe pas ou a été retiré de notre catalogue.</p>
        <button class="btn btn-pink-gradient" id="btn-pd-back-boutique">
          <i class="fa-solid fa-arrow-left"></i> Retourner à la Boutique
        </button>
      </div>
    `;
  }

  const isOutOfStock = prod.status === 'out_of_stock';
  const sizes = parseSizes(prod.sizes);
  const hasSizes = sizes.length > 0;
  const pricedSizes = sizes.filter(s => s.price !== null && s.price !== undefined && s.price !== '' && !isNaN(s.price));
  const minPrice = pricedSizes.length > 0 ? Math.min(...pricedSizes.map(s => parseFloat(s.price))) : prod.price;
  const hasPricedSizes = pricedSizes.length > 0;

  const images = (prod.images && Array.isArray(prod.images) && prod.images.length > 0)
    ? prod.images
    : (prod.image ? [prod.image] : ['https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=600&q=80']);
  const mainImage = images[0];

  const html = `
    <div class="product-detail-view" style="max-width: 1100px; margin: 0 auto 4rem; padding: 0 1rem;">
      
      <!-- Breadcrumb / Back Button -->
      <div style="margin-bottom: 1.5rem; display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; color: var(--text-muted);">
        <button class="btn btn-secondary btn-sm" id="btn-pd-back-top" style="border-radius: 20px; font-weight: 700;">
          <i class="fa-solid fa-arrow-left"></i> Retour à la Boutique
        </button>
        <span>/</span>
        <span style="color: var(--text-main); font-weight: 600;">${prod.title || prod.name}</span>
      </div>

      <!-- Main Product Container Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 2.5rem; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: var(--radius-lg); padding: 2rem; box-shadow: var(--shadow-sm);">
        
        <!-- Left Column: Gallery & Images -->
        <div>
          <div style="width: 100%; height: 380px; border-radius: var(--radius-md); overflow: hidden; background: var(--bg-main); border: 1px solid var(--border-color); display: flex; align-items: center; justify-content: center; position: relative;">
            <img id="pd-main-img" src="${mainImage}" alt="${prod.title || prod.name}" style="width: 100%; height: 100%; object-fit: contain;">
            
            ${isOutOfStock ? `
              <span class="badge badge-danger" style="position: absolute; top: 12px; left: 12px; font-size: 0.88rem; padding: 0.4rem 0.8rem; box-shadow: var(--shadow-sm);">
                🔴 Rupture de Stock
              </span>
            ` : ''}
          </div>

          ${images.length > 1 ? `
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem; overflow-x: auto; padding-bottom: 0.5rem;">
              ${images.map((imgUrl, idx) => `
                <img src="${imgUrl}" class="pd-thumb-btn" data-img-url="${imgUrl}" style="
                  width: 64px;
                  height: 64px;
                  object-fit: cover;
                  border-radius: 8px;
                  cursor: pointer;
                  border: 2px solid ${idx === 0 ? 'var(--accent-1)' : 'var(--border-color)'};
                  opacity: ${idx === 0 ? '1' : '0.7'};
                  transition: all 0.15s ease;
                ">
              `).join('')}
            </div>
          ` : ''}
        </div>

        <!-- Right Column: Product Details -->
        <div style="display: flex; flex-direction: column;">
          
          <!-- Product Title -->
          <h1 style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; line-height: 1.25; margin-bottom: 0.4rem;">
            ${prod.title || prod.name}
          </h1>

          <!-- Product Subtitle (if available) -->
          ${prod.subtitle ? `
            <div style="color: var(--accent-1); font-size: 1.05rem; font-weight: 700; margin-bottom: 1rem;">
              ${prod.subtitle}
            </div>
          ` : ''}

          <!-- Stock badge (ONLY shown if out of stock) -->
          ${isOutOfStock ? `
            <div style="margin-bottom: 1rem;">
              <span class="badge badge-danger" style="font-size: 0.85rem; padding: 0.35rem 0.75rem;">🔴 Rupture de Stock</span>
            </div>
          ` : ''}

          <!-- Price Display -->
          <div style="margin-bottom: 1.5rem; padding-bottom: 1.25rem; border-bottom: 1px solid var(--border-color);">
            <div id="pd-price-display">
              ${hasPricedSizes ? `
                <span style="font-size: 0.9rem; color: var(--text-muted); font-weight: 600;">À partir de </span>
                <span style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: var(--text-main);">${minPrice} ₪</span>
              ` : `
                <span style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: var(--text-main);">${prod.price} ₪</span>
              `}
            </div>
          </div>

          <!-- Size Selector (if available) -->
          ${hasSizes ? `
            <div style="margin-bottom: 1.75rem;">
              <label style="display: block; font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; margin-bottom: 0.6rem;">
                Choisir une taille *
              </label>
              <div id="pd-size-selector" style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                ${sizes.map(sz => `
                  <button class="pd-btn-size" data-size="${sz.name}" data-size-price="${sz.price !== null && sz.price !== undefined ? sz.price : ''}" style="
                    padding: 0.5rem 1rem;
                    border-radius: 10px;
                    font-size: 0.88rem;
                    font-weight: 700;
                    border: 2px solid var(--border-color);
                    background: var(--bg-main);
                    color: var(--text-main);
                    cursor: pointer;
                    transition: all 0.15s ease;
                    text-align: center;
                  ">
                    ${sz.name}${sz.price !== null && sz.price !== undefined ? ` <span style="font-size:0.75rem;font-weight:600;color:var(--text-muted);">(${sz.price} ₪)</span>` : ''}
                  </button>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Reservation Button -->
          <div style="margin-bottom: 2rem;">
            <button class="btn ${isOutOfStock ? 'btn-secondary' : 'btn-pink-gradient'} btn-lg" id="btn-pd-add-cart" style="width: 100%; min-height: 52px; font-size: 1.05rem; font-weight: 700; justify-content: center;" ${isOutOfStock ? 'disabled style="opacity:0.55;cursor:not-allowed;"' : ''}>
              <i class="fa-solid ${isOutOfStock ? 'fa-ban' : 'fa-cart-plus'}"></i>
              <span>${isOutOfStock ? 'Épuisé (Rupture de Stock)' : 'Réserver pour mon Séminaire'}</span>
            </button>
          </div>

          <!-- Description Section -->
          <div style="margin-bottom: 1.5rem;">
            <h3 style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; margin-bottom: 0.5rem;">
              Description de l'article
            </h3>
            <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; white-space: pre-line;">
              ${prod.description || 'Article de qualité spécialement préparé pour votre départ au séminaire.'}
            </p>
          </div>

          <!-- Services / Guarantees -->
          <div style="background: var(--bg-main); border: 1px solid var(--border-color); border-radius: var(--radius-md); padding: 1rem; display: flex; flex-direction: column; gap: 0.65rem; font-size: 0.85rem; color: var(--text-muted);">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <i class="fa-solid fa-truck-fast" style="color: var(--accent-1); font-size: 1rem;"></i>
              <span><strong>Livraison gratuite</strong> directement préparée à votre séminaire.</span>
            </div>
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <i class="fa-solid fa-shield-halved" style="color: var(--accent-1); font-size: 1rem;"></i>
              <span><strong>Réservation simple</strong> sans paiement immédiat obligatoire.</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  `;

  setTimeout(() => {
    document.getElementById('btn-pd-back-top')?.addEventListener('click', () => onNavigate('boutique'));
    document.getElementById('btn-pd-back-boutique')?.addEventListener('click', () => onNavigate('boutique'));

    // Thumbnail switcher
    document.querySelectorAll('.pd-thumb-btn').forEach(thumb => {
      thumb.addEventListener('click', () => {
        const imgUrl = thumb.getAttribute('data-img-url');
        const mainImg = document.getElementById('pd-main-img');
        if (mainImg) mainImg.src = imgUrl;

        document.querySelectorAll('.pd-thumb-btn').forEach(t => {
          t.style.borderColor = 'var(--border-color)';
          t.style.opacity = '0.7';
        });
        thumb.style.borderColor = 'var(--accent-1)';
        thumb.style.opacity = '1';
      });
    });

    // Size selection
    let selectedSize = null;
    let selectedPrice = prod.price;

    document.querySelectorAll('.pd-btn-size').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pd-btn-size').forEach(b => {
          b.style.background = 'var(--bg-main)';
          b.style.borderColor = 'var(--border-color)';
          b.style.color = 'var(--text-main)';
        });
        btn.style.background = 'var(--accent-1)';
        btn.style.borderColor = 'var(--accent-1)';
        btn.style.color = 'var(--text-main)';

        selectedSize = btn.getAttribute('data-size');
        const sizePrice = btn.getAttribute('data-size-price');
        if (sizePrice && sizePrice !== '') {
          selectedPrice = parseFloat(sizePrice);
        } else {
          selectedPrice = prod.price;
        }

        const priceDisplay = document.getElementById('pd-price-display');
        if (priceDisplay) {
          priceDisplay.innerHTML = `<span style="font-family: var(--font-heading); font-size: 2rem; font-weight: 800; color: var(--text-main);">${selectedPrice} ₪</span>`;
        }
      });
    });

    // Add to cart button
    document.getElementById('btn-pd-add-cart')?.addEventListener('click', () => {
      if (isOutOfStock) return;

      if (hasSizes && !selectedSize) {
        window.showToast('Veuillez d\'abord choisir une taille pour cet article.', 'warning');
        const selector = document.getElementById('pd-size-selector');
        if (selector) {
          selector.style.outline = '2px solid var(--accent-2)';
          selector.style.borderRadius = '8px';
          setTimeout(() => { selector.style.outline = ''; }, 1500);
        }
        return;
      }

      if (hasSizes) {
        Storage.addToCart({ ...prod, selectedSize, price: selectedPrice });
        window.showToast(`"${prod.name || prod.title}" (${selectedSize}) ajouté à votre panier !`, 'success');
      } else {
        Storage.addToCart(prod);
        window.showToast(`"${prod.name || prod.title}" ajouté à votre panier !`, 'success');
      }

      window.dispatchEvent(new Event('cart-updated'));
    });

  }, 0);

  return html;
}
