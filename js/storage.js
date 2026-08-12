/* ==========================================================================
   BNOT SÉMINAIRE - REAL DATA STORAGE & SUPABASE DB SYNC MANAGER
   ========================================================================== */

import { INITIAL_USERS, INITIAL_PRODUCTS } from './data.js';
import { SupabaseApi } from './supabase.js';

const STORAGE_KEYS = {
  USERS: 'bnotsem_users',
  PRODUCTS: 'bnotsem_products',
  RESERVATIONS: 'bnotsem_reservations',
  CURRENT_USER: 'bnotsem_current_user',
  CART: 'bnotsem_cart',
  THEME: 'bnotsem_theme'
};

let memoryProducts = null;

export const Storage = {
  async init() {
    // Purge old simulation mock data if present
    const existingUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    if (existingUsers.some(u => u.name === 'Chana Dupont' || u.name === 'Devora Levy')) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    } else if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }

    const existingRes = JSON.parse(localStorage.getItem(STORAGE_KEYS.RESERVATIONS) || '[]');
    if (existingRes.some(r => r.userName === 'Chana Dupont' || r.userName === 'Sarah Benchimol' || r.id === 'res-101')) {
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify([]));
    } else if (!localStorage.getItem(STORAGE_KEYS.RESERVATIONS)) {
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify([]));
    }

    if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
      this.saveProducts(INITIAL_PRODUCTS);
    }
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    }

    // Direct Sync with Supabase
    await this.syncFromSupabase();
  },

  async syncFromSupabase() {
    // 1. Products (Public catalog - always synced for all visitors)
    try {
      const sbProducts = await SupabaseApi.getProducts();
      if (sbProducts && sbProducts.length > 0) {
        this.saveProducts(sbProducts);
      }
    } catch (e) {
      console.warn('Supabase sync products error:', e);
    }

    // 2. Orders (Reservations list)
    try {
      const sbOrders = await SupabaseApi.getOrders();
      if (sbOrders) {
        localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(sbOrders));
      }
    } catch (e) {
      console.warn('Supabase sync orders error:', e);
    }

    // 3. Profiles (Registered students)
    try {
      const sbProfiles = await SupabaseApi.getProfiles();
      if (sbProfiles && sbProfiles.length > 0) {
        const currentLocal = this.getUsers();
        const mergedUsers = [...currentLocal];

        sbProfiles.forEach(p => {
          const existingIdx = mergedUsers.findIndex(u => u.email.toLowerCase() === p.email.toLowerCase());
          if (existingIdx !== -1) {
            mergedUsers[existingIdx] = {
              ...p,
              password: mergedUsers[existingIdx].password || p.password || ''
            };
          } else {
            mergedUsers.push(p);
          }
        });
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(mergedUsers));
      }
    } catch (e) {
      console.warn('Supabase sync profiles error:', e);
    }
  },

  reset() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify([]));
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  },

  // Users
  getUsers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
  },

  saveUsers(users) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getUserById(id) {
    return this.getUsers().find(u => u.id === id);
  },

  updateUser(updatedUser) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updatedUser };
      this.saveUsers(users);

      const currentUser = this.getCurrentUser();
      if (currentUser && currentUser.id === updatedUser.id) {
        this.setCurrentUser(users[index]);
      }
    }
  },

  // Session
  getCurrentUser() {
    const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return data ? JSON.parse(data) : null;
  },

  setCurrentUser(user) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  logoutUser() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
  },

  // Products
  getProducts() {
    if (memoryProducts && memoryProducts.length > 0) {
      return memoryProducts;
    }
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.length > 0) {
          memoryProducts = parsed;
          return parsed;
        }
      }
    } catch (e) {}
    return INITIAL_PRODUCTS;
  },

  saveProducts(products) {
    if (products && Array.isArray(products) && products.length > 0) {
      memoryProducts = products;
    }
    // Strip heavy base64 strings (>50KB data: URLs) before saving to localStorage to prevent QuotaExceededError
    const lightProducts = (products || []).map(p => {
      const sanitizeImg = (src) => (src && typeof src === 'string' && src.startsWith('data:') && src.length > 50000) ? '' : src;
      return {
        ...p,
        image: sanitizeImg(p.image),
        images: Array.isArray(p.images) ? p.images.map(sanitizeImg).filter(Boolean) : []
      };
    });

    try {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(lightProducts));
    } catch (e) {
      console.warn('localStorage quota reached for products, keeping in memory cache');
    }
  },

  async addProduct(product) {
    const added = await SupabaseApi.addProduct(product);
    const freshProducts = await SupabaseApi.getProducts();
    if (freshProducts && freshProducts.length > 0) {
      this.saveProducts(freshProducts);
      return freshProducts[0];
    }
    const products = this.getProducts();
    const newProduct = {
      id: 'prod-' + Date.now(),
      available: true,
      status: 'in_stock',
      stock: parseInt(product.stock) || 25,
      currency: '₪',
      ...product
    };
    products.unshift(newProduct);
    this.saveProducts(products);
    return newProduct;
  },

  async updateProduct(id, productData) {
    await SupabaseApi.updateProduct(id, productData);
    const freshProducts = await SupabaseApi.getProducts();
    if (freshProducts && freshProducts.length > 0) {
      this.saveProducts(freshProducts);
    } else {
      const products = this.getProducts();
      const idx = products.findIndex(p => String(p.id) === String(id));
      if (idx !== -1) {
        products[idx] = { ...products[idx], ...productData };
        this.saveProducts(products);
      }
    }
  },

  async updateProductStatus(id, newStatus) {
    await SupabaseApi.updateProductStatus(id, newStatus);
    const freshProducts = await SupabaseApi.getProducts();
    if (freshProducts && freshProducts.length > 0) {
      this.saveProducts(freshProducts);
    }
  },

  async deleteProduct(id) {
    await SupabaseApi.deleteProduct(id);
    const freshProducts = await SupabaseApi.getProducts();
    if (freshProducts) {
      this.saveProducts(freshProducts);
    } else {
      const products = this.getProducts().filter(p => String(p.id) !== String(id));
      this.saveProducts(products);
    }
  },

  // Reservations & Orders
  getReservations() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.RESERVATIONS) || '[]');
  },

  saveReservations(reservations) {
    // Strip heavy base64 images from items before saving to localStorage
    const light = reservations.map(r => ({
      ...r,
      items: (r.items || []).map(i => ({
        ...i,
        image: (i.image && i.image.startsWith('data:')) ? '' : (i.image || ''),
        images: undefined
      }))
    }));
    try {
      localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(light));
    } catch (e) {
      // If still too large, keep only last 50 orders
      try {
        localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(light.slice(0, 50)));
      } catch (e2) {
        console.warn('localStorage quota exceeded for reservations, clearing old data');
        localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify([]));
      }
    }
  },

  async addReservation(reservationData) {
    // Strip base64 images from cart items before sending to Supabase
    const cleanItems = (reservationData.items || []).map(i => ({
      productId: i.productId,
      name: i.name,
      price: i.price,
      quantity: i.quantity,
      selectedSize: i.selectedSize || null,
      currency: i.currency || '₪'
    }));

    const newRes = {
      id: 'res-' + Math.floor(100 + Math.random() * 900),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'En attente',
      ...reservationData,
      items: cleanItems
    };

    // Push to Supabase table orders FIRST
    await SupabaseApi.createOrder({
      userName: newRes.userName,
      userEmail: newRes.userEmail || reservationData.userEmail || '',
      userPhone: newRes.userPhone || '',
      userSeminary: newRes.userSeminary || '',
      items: cleanItems,
      totalPrice: newRes.totalPrice || 0,
      deliveryOption: newRes.deliveryOption || 'Livraison directe au séminaire',
      deliveryDate: newRes.deliveryDate || '',
      note: newRes.note || ''
    });

    // Re-sync orders from Supabase to get the fresh list including the new order
    const freshOrders = await SupabaseApi.getOrders();
    if (freshOrders) {
      this.saveReservations(freshOrders);
    } else {
      const reservations = this.getReservations();
      reservations.unshift(newRes);
      this.saveReservations(reservations);
    }

    // Send email notification to bnotseminaire@gmail.com via FormSubmit AJAX service
    try {
      const itemsList = cleanItems.map(i => `- ${i.name}${i.selectedSize ? ' (Taille: ' + i.selectedSize + ')' : ''} x${i.quantity} = ${i.price * i.quantity} ₪`).join('\n');
      fetch('https://formsubmit.co/ajax/bnotseminaire@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: `📦 NOUVELLE RÉSERVATION - ${newRes.userName} (${newRes.totalPrice} ₪)`,
          Client: newRes.userName,
          Email_Client: newRes.userEmail || 'Non spécifié',
          Telephone: newRes.userPhone || 'Non renseigné',
          Seminaire: newRes.userSeminary || 'Non spécifié',
          Mode_Livraison: newRes.deliveryOption || 'Livraison au séminaire',
          Date_Livraison: newRes.deliveryDate || 'Non spécifiée',
          Remarques: newRes.note || 'Aucune remarque',
          Montant_Total: `${newRes.totalPrice} ₪`,
          Articles_Reserves: itemsList
        })
      }).catch(err => console.warn('Notification email error:', err));
    } catch (e) {
      console.warn('FormSubmit dispatch error:', e);
    }

    this.clearCart();
    return newRes;
  },

  async updateReservationStatus(id, newStatus) {
    const resList = this.getReservations();
    const idx = resList.findIndex(r => r.id === id);
    if (idx !== -1) {
      resList[idx].status = newStatus;
      this.saveReservations(resList);
      if (resList[idx].full_id) {
        await SupabaseApi.updateOrderStatus(resList[idx].full_id, newStatus);
      }
    }
  },

  async cancelReservation(id) {
    const resList = this.getReservations();
    const idx = resList.findIndex(r => String(r.id) === String(id));
    if (idx !== -1) {
      const res = resList[idx];
      // Update status in Supabase first if it has a full_id
      if (res.full_id) {
        await SupabaseApi.updateOrderStatus(res.full_id, 'Annulée');
      }
      // Remove from local list
      resList.splice(idx, 1);
      this.saveReservations(resList);
    }
  },

  // Cart
  getCart() {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART) || '[]');
  },

  saveCart(cart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  },

  getCartCount() {
    const cart = this.getCart();
    return cart.reduce((total, item) => total + (item.quantity || 1), 0);
  },

  addToCart(product, quantity = 1) {
    const cart = this.getCart();
    const targetId = String(product.id || product.productId || '');
    const targetSize = product.selectedSize || null;

    const existingIndex = cart.findIndex(item => 
      String(item.productId) === targetId && 
      (item.selectedSize || null) === targetSize
    );

    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity;
      if (product.price) cart[existingIndex].price = product.price;
    } else {
      cart.push({
        productId: targetId,
        name: product.name || product.title,
        price: product.price,
        selectedSize: targetSize,
        image: product.image || (product.images && product.images[0]) || '',
        currency: product.currency || '₪',
        quantity: quantity
      });
    }
    this.saveCart(cart);
    return cart;
  },

  removeFromCart(productId, selectedSize = null) {
    const targetId = String(productId);
    const targetSize = selectedSize || null;
    const cart = this.getCart().filter(item => {
      const isSameId = String(item.productId) === targetId;
      const isSameSize = (item.selectedSize || null) === targetSize;
      return !(isSameId && isSameSize);
    });
    this.saveCart(cart);
    return cart;
  },

  updateCartQuantity(productId, selectedSize = null, quantity = 1) {
    const targetId = String(productId);
    const targetSize = selectedSize || null;
    const cart = this.getCart();
    const idx = cart.findIndex(item => 
      String(item.productId) === targetId && 
      (item.selectedSize || null) === targetSize
    );
    if (idx !== -1) {
      if (quantity <= 0) {
        cart.splice(idx, 1);
      } else {
        cart[idx].quantity = quantity;
      }
      this.saveCart(cart);
    }
    return cart;
  },

  clearCart() {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
  },

  getTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  },

  setTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
};
