/* ==========================================================================
   BNOT SÉMINAIRE - SUPABASE BACKEND INTEGRATION (16 OFFICIAL PRODUCTS READY)
   ========================================================================== */

const SUPABASE_URL = 'https://fjbulpikjqlcnzhshjxe.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqYnVscGlranFsY256aHNoanhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYwMjQwMDAsImV4cCI6MjEwMTYwMDAwMH0._Cm7ezryqYeHOGlM3jNuSn1wOdukTwuHnqn6zykve0I';

export const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

// Curated high quality images map matching the 16 official items
const PRODUCT_IMAGE_MAP = {
  'serviettes': 'https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=600&q=80',
  'chemise bagir': 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=600&q=80',
  'chemise xsos': 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=600&q=80',
  'couette everest': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
  'couette matelassee': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80',
  'peignoir': 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=600&q=80',
  'blue ring': 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
  'cotton set': 'https://images.unsplash.com/photo-1617325247661-675ab4b64ae2?auto=format&fit=crop&w=600&q=80',
  'flanelle': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
  'oreiller fried classic': 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80',
  'oreiller fried premium': 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80',
  'golan': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
  'zte': 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=600&q=80',
  'class first': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
  'nokia': 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=600&q=80'
};

function resolveProductImage(p) {
  // Accept http URLs and base64 data URLs (uploaded images)
  if (p.image && (p.image.startsWith('http') || p.image.startsWith('data:'))) return p.image;
  const titleLower = (p.title || '').toLowerCase();
  for (const [key, url] of Object.entries(PRODUCT_IMAGE_MAP)) {
    if (titleLower.includes(key)) return url;
  }
  return 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80';
}

export const SupabaseApi = {
  // ----------------------------------------------------
  // PRODUCTS (Table: public.products)
  // ----------------------------------------------------
  async getProducts() {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: true });
        
      if (error) {
        console.warn('Supabase fetch products error:', error.message);
        return null;
      }

      return data.map((p) => {
        const imageUrl = resolveProductImage(p);
        const images = (p.images && Array.isArray(p.images) && p.images.length > 0)
          ? p.images
          : (imageUrl ? [imageUrl] : []);
        return {
          id: p.id,
          name: p.title || 'Article Séminaire',
          title: p.title || 'Article Séminaire',
          subtitle: p.subtitle || '',
          description: p.description || 'Équipement de qualité pour votre année de séminaire.',
          price: parseFloat(p.price) || 0,
          currency: '₪',
          image: images[0] || imageUrl,
          images: images,
          status: p.status || 'in_stock',
          stock: p.status === 'out_of_stock' ? 0 : 25,
          available: p.status !== 'out_of_stock',
          tag: p.status === 'out_of_stock' ? 'Rupture de Stock' : 'Disponible',
          sizes: p.sizes || []
        };
      });
    } catch (e) {
      console.warn('Supabase products exception:', e);
      return null;
    }
  },

  async addProduct(product) {
    if (!supabase) return null;
    try {
      const images = (product.images && Array.isArray(product.images) && product.images.length > 0)
        ? product.images
        : (product.image ? [product.image] : []);
      const { data, error } = await supabase
        .from('products')
        .insert([{
          title: product.name || product.title,
          subtitle: product.subtitle || '',
          description: product.description || '',
          price: product.price || 0,
          image: images[0] || product.image || '',
          images: images,
          status: 'in_stock',
          sizes: product.sizes || []
        }])
        .select();
      if (error) {
        console.warn('Supabase add product notice:', error.message);
      }
      return data ? data[0] : null;
    } catch (e) {
      console.warn('Supabase add product exception:', e);
      return null;
    }
  },

  async updateProduct(id, productData) {
    if (!supabase) return false;
    try {
      const images = (productData.images && Array.isArray(productData.images) && productData.images.length > 0)
        ? productData.images
        : (productData.image ? [productData.image] : []);
      const payload = {
        title: productData.title || productData.name,
        subtitle: productData.subtitle || '',
        price: productData.price,
        description: productData.description || '',
        status: productData.status || 'in_stock',
        sizes: productData.sizes || [],
        images: images,
        image: images[0] || productData.image || ''
      };

      // Check if product exists in Supabase by ID
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('id', id);

      if (existing && existing.length > 0) {
        const { error } = await supabase
          .from('products')
          .update(payload)
          .eq('id', id);
        if (error) console.warn('Supabase update product error:', error.message);
        return true;
      } else {
        // Insert as new product in Supabase
        const { data: inserted, error } = await supabase
          .from('products')
          .insert([payload])
          .select();
        if (error) {
          console.warn('Supabase insert product error:', error.message);
          return false;
        }
        return inserted && inserted[0] ? inserted[0].id : true;
      }
    } catch (e) {
      console.warn('Supabase update product exception:', e);
      return false;
    }
  },

  async updateProductStatus(id, newStatus) {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('products')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Supabase update product status error:', e);
      return false;
    }
  },

  async deleteProduct(id) {
    if (!supabase) return null;
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Supabase delete product error:', e);
      return false;
    }
  },

  // ----------------------------------------------------
  // ORDERS (Table: public.orders)
  // ----------------------------------------------------
  async getOrders() {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) return null;

      return data.map(o => {
        const rawItems = o.items || [];
        let meta = {};
        if (Array.isArray(rawItems)) {
          const metaObj = rawItems.find(i => i && i._meta);
          if (metaObj && metaObj._meta) meta = metaObj._meta;
        }

        const itemsList = Array.isArray(rawItems) ? rawItems.filter(i => i && i.name) : [];

        let formattedDateTime = '';
        if (o.created_at) {
          const d = new Date(o.created_at);
          formattedDateTime = d.toLocaleDateString('fr-FR') + ' ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        }

        return {
          id: o.id.substring(0, 8),
          full_id: o.id,
          userName: o.customer_name || 'Élève',
          userEmail: o.customer_email || '',
          userPhone: o.customer_phone || '',
          userSeminary: o.school || 'Séminaire Non Spécifié',
          items: itemsList,
          totalPrice: parseFloat(o.total_amount) || 0,
          currency: '₪',
          deliveryOption: meta.deliveryOption || 'Livraison directe au séminaire',
          deliveryDate: meta.deliveryDate || '',
          note: meta.note || '',
          status: o.status === 'pending' ? 'En attente' : (o.status === 'validated' ? 'Validée' : o.status),
          createdAt: formattedDateTime || (o.created_at ? new Date(o.created_at).toISOString().replace('T', ' ').substring(0, 16) : '')
        };
      });
    } catch (e) {
      return null;
    }
  },

  async createOrder(orderData) {
    if (!supabase) return null;
    try {
      const itemsPayload = (orderData.items || []).map(i => ({
        productId: i.productId,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        selectedSize: i.selectedSize || null,
        currency: i.currency || '₪'
      }));

      // Store metadata inside jsonb items array
      itemsPayload.push({
        _meta: {
          deliveryOption: orderData.deliveryOption || 'Livraison directe au séminaire',
          deliveryDate: orderData.deliveryDate || '',
          note: orderData.note || ''
        }
      });

      const { data, error } = await supabase
        .from('orders')
        .insert([{
          customer_name: orderData.userName,
          customer_email: orderData.userEmail || '',
          customer_phone: orderData.userPhone || '',
          school: orderData.userSeminary || '',
          items: itemsPayload,
          total_amount: orderData.totalPrice || 0,
          status: 'pending'
        }])
        .select();
      if (error) throw error;
      return data[0];
    } catch (e) {
      console.error('Supabase create order error:', e);
      return null;
    }
  },

  async updateOrderStatus(id, newStatus) {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Supabase update order status error:', e);
      return false;
    }
  },

  // ----------------------------------------------------
  // REQUESTS (Table: public.requests)
  // ----------------------------------------------------
  async getRequests() {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) return null;
      return data;
    } catch (e) {
      return null;
    }
  },

  async createRequest(reqData) {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('requests')
        .insert([{
          kind: reqData.kind || 'DEMARCHE',
          first_name: reqData.prenom || reqData.first_name || '',
          last_name: reqData.nom || reqData.last_name || '',
          email: reqData.email || '',
          phone: reqData.phone_perso || reqData.phone || '',
          parent_phone: reqData.phone_parents || reqData.parent_phone || '',
          birth_date: reqData.dob && reqData.dob.length > 0 ? reqData.dob : null,
          nationality: reqData.nationalite || reqData.nationality || 'Française',
          passport_number: reqData.passport_num || reqData.passport_number || '',
          person_status: reqData.duree || reqData.person_status || '',
          school: reqData.seminaire || reqData.school || ''
        }])
        .select();
      if (error) throw error;
      return data[0];
    } catch (e) {
      console.error('Supabase create request error:', e);
      return null;
    }
  },

  // ----------------------------------------------------
  // PROFILES (Table: public.profiles)
  // ----------------------------------------------------
  async getProfiles() {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) return null;
      return data.map(p => ({
        id: p.id,
        name: p.name || 'Élève',
        email: p.email,
        phone: p.phone || '',
        role: p.role === 'ADMIN' ? 'admin' : 'student',
        seminary: 'Séminaire en Israël',
        createdAt: new Date(p.created_at).toISOString().split('T')[0]
      }));
    } catch (e) {
      return null;
    }
  },

  async createProfile(profileData) {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          name: profileData.name,
          email: profileData.email,
          phone: profileData.phone || '',
          role: profileData.role || 'SEMINARISTE'
        }])
        .select();
      if (error) throw error;
      return data[0];
    } catch (e) {
      console.error('Supabase create profile error:', e);
      return null;
    }
  }
};
