/* ==========================================================================
   BNOT SÉMINAIRE - SHOPPING CART DRAWER & RESERVATION CHECKOUT
   ========================================================================== */

import { Auth } from '../auth.js';
import { Storage } from '../storage.js';
import { showAuthModal } from './authModal.js';

export function renderCartDrawer(onNavigate) {
  // Remove existing drawer element if any
  document.getElementById('cart-drawer-wrap')?.remove();

  const cart = Storage.getCart();
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const html = `
    <div id="cart-drawer-wrap">
      <div class="cart-drawer" id="cart-drawer">
        <div class="cart-header">
          <h3 style="font-family: var(--font-heading); font-size: 1.25rem; font-weight: 700;">
            <i class="fa-solid fa-shopping-bag" style="color: var(--primary);"></i> Panier de Réservation
          </h3>
          <button class="btn-icon" id="btn-close-cart"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="cart-items">
          ${cart.length === 0 ? `
            <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
              <i class="fa-solid fa-cart-flatbed" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
              <p style="font-weight: 600; font-size: 1rem;">Votre panier est vide</p>
              <p style="font-size: 0.85rem; margin-top: 0.35rem;">Parcourez la boutique pour réserver vos équipements.</p>
            </div>
          ` : `
            ${cart.map(item => `
              <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-details">
                  <div class="cart-item-title">${item.name}${item.selectedSize ? ` <span style="background:var(--accent-1-light);border:1px solid var(--accent-1);border-radius:6px;padding:0.1rem 0.45rem;font-size:0.72rem;font-weight:700;margin-left:0.3rem;">${item.selectedSize}</span>` : ''}</div>
                  <div class="cart-item-price">${item.price} ${item.currency || '₪'}</div>
                  
                  <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.5rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem; background: rgba(0,0,0,0.15); padding: 0.2rem 0.5rem; border-radius: var(--radius-sm);">
                      <button class="btn-cart-qty" data-id="${item.productId}" data-action="minus" style="font-weight: 700;">-</button>
                      <span style="font-size: 0.88rem; font-weight: 700;">${item.quantity}</span>
                      <button class="btn-cart-qty" data-id="${item.productId}" data-action="plus" style="font-weight: 700;">+</button>
                    </div>

                    <button class="btn-cart-remove" data-id="${item.productId}" style="color: var(--danger); font-size: 0.85rem;">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          `}
        </div>

        ${cart.length > 0 ? `
          <div class="cart-footer">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
              <span style="font-size: 1rem; color: var(--text-muted);">Total Réservé :</span>
              <span style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 800; color: var(--primary);">${totalPrice} ₪</span>
            </div>

            <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 1rem; background: rgba(16, 185, 129, 0.1); padding: 0.6rem; border-radius: var(--radius-sm); border: 1px solid rgba(16, 185, 129, 0.2);">
              <i class="fa-solid fa-shield-check" style="color: var(--success);"></i> <strong>Réservation Sans Paiement Immédiat</strong>. Réglez lors du retrait ou sur la facture du séminaire.
            </div>

            <button class="btn btn-primary btn-full btn-lg" id="btn-checkout-reservation">
              <i class="fa-solid fa-calendar-check"></i> Confirmer la Réservation
            </button>
          </div>
        ` : ''}
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', html);

  const drawer = document.getElementById('cart-drawer');
  setTimeout(() => drawer?.classList.add('open'), 10);

  const closeDrawer = () => {
    drawer?.classList.remove('open');
    setTimeout(() => document.getElementById('cart-drawer-wrap')?.remove(), 350);
  };

  document.getElementById('btn-close-cart')?.addEventListener('click', closeDrawer);

  // Quantity and remove listeners
  document.querySelectorAll('.btn-cart-qty').forEach(btn => {
    btn.addEventListener('click', () => {
      const prodId = btn.getAttribute('data-id');
      const action = btn.getAttribute('data-action');
      const item = cart.find(i => i.productId === prodId);
      if (item) {
        const newQty = action === 'plus' ? item.quantity + 1 : item.quantity - 1;
        Storage.updateCartQuantity(prodId, newQty);
        window.dispatchEvent(new CustomEvent('cart-updated'));
        renderCartDrawer(onNavigate);
      }
    });
  });

  document.querySelectorAll('.btn-cart-remove').forEach(btn => {
    btn.addEventListener('click', () => {
      const prodId = btn.getAttribute('data-id');
      Storage.removeFromCart(prodId);
      window.dispatchEvent(new CustomEvent('cart-updated'));
      renderCartDrawer(onNavigate);
    });
  });

  // Checkout Reservation Button
  document.getElementById('btn-checkout-reservation')?.addEventListener('click', () => {
    const user = Auth.getCurrentUser();
    if (!user) {
      closeDrawer();
      window.showToast('Veuillez vous connecter pour valider votre réservation', 'warning');
      showAuthModal('login', onNavigate);
      return;
    }
    closeDrawer();
    showCheckoutModal(user, cart, totalPrice, onNavigate);
  });
}

function showCheckoutModal(user, cart, totalPrice, onNavigate) {
  const modalHtml = `
    <div class="modal-overlay" id="modal-checkout">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title"><i class="fa-solid fa-receipt" style="color: var(--primary);"></i> Finaliser ma Réservation</h3>
          <button class="modal-close" id="btn-close-checkout"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="modal-body">
          <div style="margin-bottom: 1.25rem;">
            <div style="font-size: 0.88rem; color: var(--text-muted);">Réservation effectuée par :</div>
            <div style="font-weight: 700; font-size: 1.05rem;">${user.name} (${user.seminary || 'Séminaire'})</div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">📱 ${user.phone || 'Non renseigné'}</div>
          </div>

          <div class="form-group">
            <label class="form-label">Mode de Livraison / Retrait</label>
            <select class="form-control" id="checkout-delivery-opt">
              <option value="Livraison directe au séminaire">Livraison directe au séminaire</option>
              <option value="Retrait sur place le jour d'arrivée">Retrait sur place le jour d'arrivée</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Date de livraison / retrait souhaitée</label>
            <input type="date" class="form-control" id="checkout-delivery-date" value="${user.arrivalDate || new Date().toISOString().split('T')[0]}">
          </div>

          <div class="form-group">
            <label class="form-label">Remarques ou instructions particulières (Optionnel)</label>
            <textarea class="form-control" id="checkout-note" rows="2" placeholder="ex: Livrer au secrétariat, contacter sur WhatsApp avant passage..."></textarea>
          </div>

          <!-- Summary list -->
          <div style="background: rgba(0,0,0,0.15); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); margin-top: 1rem;">
            <div style="font-size: 0.85rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.5rem; text-transform: uppercase;">Récapitulatif des articles (${cart.length})</div>
            ${cart.map(i => `
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 0.35rem;">
                <span>${i.name} (x${i.quantity})</span>
                <strong>${i.price * i.quantity} ₪</strong>
              </div>
            `).join('')}
            <div style="display: flex; justify-content: space-between; font-size: 1.1rem; font-weight: 800; border-top: 1px solid var(--border-color); padding-top: 0.5rem; margin-top: 0.5rem; color: var(--primary);">
              <span>Montant Total Réservé</span>
              <span>${totalPrice} ₪</span>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" id="btn-cancel-checkout">Annuler</button>
          <button class="btn btn-primary btn-lg" id="btn-confirm-final-reservation">
            <i class="fa-solid fa-check"></i> Valider ma Réservation
          </button>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  const closeModal = () => document.getElementById('modal-checkout')?.remove();

  document.getElementById('btn-close-checkout')?.addEventListener('click', closeModal);
  document.getElementById('btn-cancel-checkout')?.addEventListener('click', closeModal);

  document.getElementById('btn-confirm-final-reservation')?.addEventListener('click', () => {
    const deliveryOption = document.getElementById('checkout-delivery-opt').value;
    const deliveryDate = document.getElementById('checkout-delivery-date').value;
    const note = document.getElementById('checkout-note').value.trim();

    const newRes = Storage.addReservation({
      userId: user.id,
      userName: user.name,
      userPhone: user.phone || '',
      userSeminary: user.seminary || 'Séminaire Non Spécifié',
      items: cart,
      totalPrice: totalPrice,
      currency: '₪',
      deliveryDate: deliveryDate,
      deliveryOption: deliveryOption,
      note: note
    });

    closeModal();
    window.showToast(`Réservation #${newRes.id} enregistrée avec succès !`, 'success');
    window.dispatchEvent(new CustomEvent('cart-updated'));
    onNavigate('my-reservations');
  });
}
