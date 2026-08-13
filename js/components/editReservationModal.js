/* ==========================================================================
   BNOT SÉMINAIRE - EDIT RESERVATION MODAL COMPONENT
   ========================================================================== */

import { Storage } from '../storage.js';

export function showEditReservationModal(res, onRefreshView) {
  document.getElementById('modal-edit-res')?.remove();

  // Create deep copy of items to allow live editing in modal
  let editableItems = JSON.parse(JSON.stringify(res.items || []));

  function calculateTotal() {
    return editableItems.reduce((sum, item) => sum + (parseFloat(item.price || 0) * parseInt(item.quantity || 1)), 0);
  }

  function renderItemsList() {
    const container = document.getElementById('edit-res-items-container');
    const totalDisplay = document.getElementById('edit-res-total-display');
    if (!container) return;

    if (editableItems.length === 0) {
      container.innerHTML = `<div style="text-align:center; padding:1.5rem; color:var(--text-muted); font-size:0.9rem;">Aucun article dans cette réservation.</div>`;
    } else {
      container.innerHTML = editableItems.map((item, idx) => `
        <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-main); padding:0.65rem 0.85rem; border-radius:10px; border:1px solid var(--border-color); gap:0.5rem; flex-wrap:wrap;">
          <div style="flex:1; min-width:180px;">
            <strong style="font-size:0.9rem; color:var(--text-main);">${item.name}</strong>
            ${item.selectedSize ? `<span style="background:var(--accent-1-light); border:1px solid var(--accent-1); border-radius:6px; padding:0.1rem 0.4rem; font-size:0.72rem; font-weight:700; margin-left:0.35rem;">${item.selectedSize}</span>` : ''}
            <div style="font-size:0.8rem; color:var(--text-muted);">${item.price} ₪ / unité</div>
          </div>

          <div style="display:flex; align-items:center; gap:0.6rem;">
            <div style="display:flex; align-items:center; gap:0.4rem; background:var(--bg-card); padding:0.15rem 0.4rem; border-radius:6px; border:1px solid var(--border-color);">
              <button type="button" class="btn-res-qty-minus" data-idx="${idx}" style="background:none; border:none; color:var(--text-main); font-weight:800; cursor:pointer; width:24px; height:24px;">-</button>
              <span style="font-size:0.88rem; font-weight:700; min-width:18px; text-align:center;">${item.quantity || 1}</span>
              <button type="button" class="btn-res-qty-plus" data-idx="${idx}" style="background:none; border:none; color:var(--text-main); font-weight:800; cursor:pointer; width:24px; height:24px;">+</button>
            </div>

            <button type="button" class="btn-res-item-remove" data-idx="${idx}" style="background:none; border:none; color:var(--danger); cursor:pointer; padding:0.3rem;" title="Supprimer cet article">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `).join('');
    }

    if (totalDisplay) {
      totalDisplay.textContent = `${calculateTotal()} ₪`;
    }

    // Bind quantity and remove buttons
    container.querySelectorAll('.btn-res-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        if (editableItems[idx].quantity > 1) {
          editableItems[idx].quantity -= 1;
        } else {
          editableItems.splice(idx, 1);
        }
        renderItemsList();
      });
    });

    container.querySelectorAll('.btn-res-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        editableItems[idx].quantity = (editableItems[idx].quantity || 1) + 1;
        renderItemsList();
      });
    });

    container.querySelectorAll('.btn-res-item-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-idx'));
        editableItems.splice(idx, 1);
        renderItemsList();
      });
    });
  }

  const modalHtml = `
    <div class="modal-overlay" id="modal-edit-res">
      <div class="modal-content" style="max-width: 620px;">
        <div class="modal-header">
          <h3 class="modal-title">
            <i class="fa-solid fa-pen-to-square" style="color: var(--accent-1);"></i>
            Modifier ma Réservation #${res.id}
          </h3>
          <button class="modal-close" id="btn-close-edit-res"><i class="fa-solid fa-xmark"></i></button>
        </div>

        <div class="modal-body" style="display: flex; flex-direction: column; gap: 1.2rem;">
          <form id="form-edit-res">

            <!-- Mode de livraison -->
            <div class="form-group">
              <label class="form-label"><i class="fa-solid fa-truck-fast"></i> Mode de livraison / retrait</label>
              <select class="form-control" id="edit-res-delivery">
                <option value="Livraison directe au séminaire" ${res.deliveryOption === 'Livraison directe au séminaire' ? 'selected' : ''}>Livraison directe au séminaire</option>
                <option value="Retrait sur place" ${res.deliveryOption === 'Retrait sur place' ? 'selected' : ''}>Retrait sur place</option>
              </select>
            </div>

            <!-- Date souhaitée -->
            <div class="form-group">
              <label class="form-label"><i class="fa-regular fa-calendar-days"></i> Date de livraison / retrait souhaitée</label>
              <input type="date" class="form-control" id="edit-res-date" value="${res.deliveryDate || ''}">
            </div>

            <!-- Remarques -->
            <div class="form-group">
              <label class="form-label"><i class="fa-solid fa-comment-dots"></i> Remarques ou instructions particulières</label>
              <textarea class="form-control" id="edit-res-note" rows="2" placeholder="ex: livrer devant la porte de la chambre...">${res.note || ''}</textarea>
            </div>

            <!-- Articles -->
            <div class="form-group">
              <label class="form-label"><i class="fa-solid fa-boxes-packing"></i> Articles réservés</label>
              <div id="edit-res-items-container" style="display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: 0.75rem;"></div>
            </div>

            <!-- Total -->
            <div style="display: flex; justify-content: space-between; align-items: center; background: var(--bg-main); padding: 0.85rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-top: 0.5rem;">
              <span style="font-weight: 700; color: var(--text-main);">Nouveau Montant Total :</span>
              <strong id="edit-res-total-display" style="font-family: var(--font-heading); font-size: 1.3rem; color: var(--accent-1);">${res.totalPrice} ₪</strong>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 0.75rem; margin-top: 1.25rem;">
              <button type="button" class="btn btn-secondary" id="btn-cancel-edit-res">Annuler</button>
              <button type="submit" class="btn btn-pink-gradient">
                <i class="fa-solid fa-floppy-disk"></i> Enregistrer les Modifications
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const closeModal = () => document.getElementById('modal-edit-res')?.remove();

  document.getElementById('btn-close-edit-res')?.addEventListener('click', closeModal);
  document.getElementById('btn-cancel-edit-res')?.addEventListener('click', closeModal);

  renderItemsList();

  document.getElementById('form-edit-res')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (editableItems.length === 0) {
      window.showToast('Votre réservation doit contenir au moins un article.', 'warning');
      return;
    }

    const deliveryOption = document.getElementById('edit-res-delivery').value;
    const deliveryDate = document.getElementById('edit-res-date').value;
    const note = document.getElementById('edit-res-note').value;

    window.showToast('Mise à jour de la réservation en cours...', 'info');

    await Storage.updateReservationDetails(res.id, {
      deliveryOption,
      deliveryDate,
      note,
      items: editableItems
    });

    window.showToast(`Réservation #${res.id} modifiée avec succès !`, 'success');
    closeModal();

    if (typeof onRefreshView === 'function') {
      onRefreshView();
    }
  });
}
