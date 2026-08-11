/* ==========================================================================
   BNOT SÉMINAIRE - SUPABASE BACKEND INTEGRATION (16 OFFICIAL PRODUCTS READY)
   ========================================================================== */

const SUPABASE_URL = 'https://fjbulpikjqlcnzhshjxe.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Y1SmObFfrqRVxHNrtquE8A_2P7xJoDJ';

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
  if (p.image && p.image.startsWith('http')) return p.image;
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
        return {
          id: p.id,
          name: p.title || 'Article Séminaire',
          title: p.title || 'Article Séminaire',
          description: p.description || 'Équipement de qualité pour votre année de séminaire.',
          price: parseFloat(p.price) || 0,
          currency: '₪',
          image: imageUrl,
          status: p.status || 'in_stock',
          stock: p.status === 'out_of_stock' ? 0 : 25,
          available: p.status !== 'out_of_stock',
          tag: p.status === 'out_of_stock' ? 'Rupture de Stock' : 'Disponible'
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
      const { data, error } = await supabase
        .from('products')
        .insert([{
          title: product.name || product.title,
          description: product.description || '',
          price: product.price || 0,
          image: product.image || '',
          status: 'in_stock'
        }])
        .select();
      if (error) throw error;
      return data[0];
    } catch (e) {
      console.error('Supabase add product error:', e);
      return null;
    }
  },

  async updateProduct(id, productData) {
    if (!supabase) return false;
    try {
      const { error } = await supabase
        .from('products')
        .update({
          title: productData.title || productData.name,
          price: productData.price,
          description: productData.description,
          image: productData.image,
          status: productData.status
        })
        .eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.error('Supabase update product error:', e);
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

      return data.map(o => ({
        id: o.id.substring(0, 8),
        full_id: o.id,
        userName: o.customer_name || 'Élève',
        userEmail: o.customer_email || '',
        userPhone: o.customer_phone || '',
        userSeminary: o.school || 'Séminaire Non Spécifié',
        items: o.items || [],
        totalPrice: parseFloat(o.total_amount) || 0,
        currency: '₪',
        deliveryOption: 'Livraison au séminaire',
        deliveryDate: new Date(o.created_at).toISOString().split('T')[0],
        status: o.status === 'pending' ? 'En attente' : (o.status === 'validated' ? 'Validée' : o.status),
        createdAt: new Date(o.created_at).toISOString().replace('T', ' ').substring(0, 16)
      }));
    } catch (e) {
      return null;
    }
  },

  async createOrder(orderData) {
    if (!supabase) return null;
    try {
      const { data, error } = await supabase
        .from('orders')
        .insert([{
          customer_name: orderData.userName,
          customer_email: orderData.userEmail || '',
          customer_phone: orderData.userPhone || '',
          school: orderData.userSeminary || '',
          items: orderData.items || [],
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
