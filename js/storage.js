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
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    }

    // Direct Sync with Supabase
    await this.syncFromSupabase();
  },

  async syncFromSupabase() {
    try {
      const [sbProducts, sbOrders, sbProfiles] = await Promise.all([
        SupabaseApi.getProducts(),
        SupabaseApi.getOrders(),
        SupabaseApi.getProfiles()
      ]);

      if (sbProducts && sbProducts.length > 0) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(sbProducts));
      }

      if (sbOrders) {
        localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(sbOrders));
      }

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
      console.log('Supabase sync notice:', e);
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
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
  },

  saveProducts(products) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
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
    localStorage.setItem(STORAGE_KEYS.RESERVATIONS, JSON.stringify(reservations));
  },

  async addReservation(reservationData) {
    const reservations = this.getReservations();
    const newRes = {
      id: 'res-' + Math.floor(100 + Math.random() * 900),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'En attente',
      ...reservationData
    };
    reservations.unshift(newRes);
    this.saveReservations(reservations);
    this.clearCart();

    // Push to Supabase table orders
    await SupabaseApi.createOrder({
      userName: newRes.userName,
      userEmail: newRes.userEmail || '',
      userPhone: newRes.userPhone || '',
      userSeminary: newRes.userSeminary || '',
      items: newRes.items || [],
      totalPrice: newRes.totalPrice || 0
    });

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
    const existingIndex = cart.findIndex(item => String(item.productId) === String(product.id) && item.selectedSize === (product.selectedSize || null));
    if (existingIndex !== -1) {
      cart[existingIndex].quantity += quantity;
      if (product.price) cart[existingIndex].price = product.price;
    } else {
      cart.push({
        productId: product.id,
        name: product.name || product.title,
        price: product.price,
        selectedSize: product.selectedSize || null,
        image: product.image,
        currency: product.currency || '₪',
        quantity: quantity
      });
    }
    this.saveCart(cart);
    return cart;
  },

  removeFromCart(productId) {
    const cart = this.getCart().filter(item => item.productId !== productId);
    this.saveCart(cart);
    return cart;
  },

  updateCartQuantity(productId, quantity) {
    const cart = this.getCart();
    const idx = cart.findIndex(item => item.productId === productId);
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
