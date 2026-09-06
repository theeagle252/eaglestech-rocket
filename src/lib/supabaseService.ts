'use client';

import { createClient } from '@/lib/supabase/client';

function isSchemaError(error: any): boolean {
  if (!error) return false;
  if (error.code && typeof error.code === 'string') {
    const errorClass = error.code.substring(0, 2);
    if (errorClass === '42') return true;
    if (errorClass === '23') return false;
    if (errorClass === '08') return true;
  }
  if (error.message) {
    const patterns = [
      /relation.*does not exist/i,
      /column.*does not exist/i,
      /function.*does not exist/i,
      /syntax error/i,
      /type.*does not exist/i,
    ];
    return patterns.some(p => p.test(error.message));
  }
  return false;
}

// ─── CATEGORIES ───────────────────────────────────────────────────────────────
export const categoryService = {
  async getAll() {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return data || [];
    } catch (err: any) {
      console.error('categoryService.getAll error:', err.message);
      throw err;
    }
  },
};

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
export const productService = {
  async getAll() {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return (data || []).map(mapProduct);
    } catch (err: any) {
      console.error('productService.getAll error:', err.message);
      throw err;
    }
  },

  async getFeatured() {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false });
      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return (data || []).map(mapProduct);
    } catch (err: any) {
      console.error('productService.getFeatured error:', err.message);
      throw err;
    }
  },

  async getById(id: string) {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) {
        if (isSchemaError(error)) throw error;
        return null;
      }
      return data ? mapProduct(data) : null;
    } catch (err: any) {
      console.error('productService.getById error:', err.message);
      throw err;
    }
  },

  async getByCategory(categoryId: string) {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .order('featured', { ascending: false });
      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return (data || []).map(mapProduct);
    } catch (err: any) {
      console.error('productService.getByCategory error:', err.message);
      throw err;
    }
  },

  async search(query: string) {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,brand.ilike.%${query}%,category_id.ilike.%${query}%`)
        .order('featured', { ascending: false })
        .limit(20);
      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return (data || []).map(mapProduct);
    } catch (err: any) {
      console.error('productService.search error:', err.message);
      throw err;
    }
  },

  async upsert(product: any) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('products')
      .upsert(mapProductToDb(product), { onConflict: 'id' })
      .select()
      .single();
    if (error) throw error;
    return mapProduct(data);
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) throw error;
  },
};

// ─── ENERGY SUBCATEGORIES ─────────────────────────────────────────────────────
export const energySubcategoryService = {
  async getAll() {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('energy_subcategories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return data || [];
    } catch (err: any) {
      console.error('energySubcategoryService.getAll error:', err.message);
      throw err;
    }
  },

  async upsert(sub: { id: string; name: string; sort_order?: number }) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('energy_subcategories')
      .upsert(sub, { onConflict: 'id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from('energy_subcategories').delete().eq('id', id);
    if (error) throw error;
  },
};

// ─── ENERGY PRODUCTS ──────────────────────────────────────────────────────────
export const energyProductService = {
  async getAll() {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('energy_products')
        .select('*')
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });
      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return (data || []).map(mapEnergyProduct);
    } catch (err: any) {
      console.error('energyProductService.getAll error:', err.message);
      throw err;
    }
  },

  async getFeatured() {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('energy_products')
        .select('*')
        .eq('featured', true)
        .order('created_at', { ascending: false });
      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return (data || []).map(mapEnergyProduct);
    } catch (err: any) {
      console.error('energyProductService.getFeatured error:', err.message);
      throw err;
    }
  },

  async getById(id: string) {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('energy_products')
        .select('*')
        .eq('id', id)
        .maybeSingle();
      if (error) {
        if (isSchemaError(error)) throw error;
        return null;
      }
      return data ? mapEnergyProduct(data) : null;
    } catch (err: any) {
      console.error('energyProductService.getById error:', err.message);
      throw err;
    }
  },

  async getBySubcategory(subcategoryId: string) {
    const supabase = createClient();
    try {
      const query = supabase.from('energy_products').select('*');
      const filtered = subcategoryId === 'all' ? query : query.eq('subcategory_id', subcategoryId);
      const { data, error } = await filtered.order('featured', { ascending: false });
      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return (data || []).map(mapEnergyProduct);
    } catch (err: any) {
      console.error('energyProductService.getBySubcategory error:', err.message);
      throw err;
    }
  },

  async search(query: string) {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('energy_products')
        .select('*')
        .or(`name.ilike.%${query}%,brand.ilike.%${query}%,model.ilike.%${query}%,description.ilike.%${query}%`)
        .order('featured', { ascending: false })
        .limit(20);
      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return (data || []).map(mapEnergyProduct);
    } catch (err: any) {
      console.error('energyProductService.search error:', err.message);
      throw err;
    }
  },

  async upsert(product: any) {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('energy_products')
      .upsert(mapEnergyProductToDb(product), { onConflict: 'id' })
      .select()
      .single();
    if (error) throw error;
    return mapEnergyProduct(data);
  },

  async delete(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from('energy_products').delete().eq('id', id);
    if (error) throw error;
  },
};

// ─── ORDERS ───────────────────────────────────────────────────────────────────
export const orderService = {
  async create(orderData: {
    userId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deliveryMethod: 'delivery' | 'pickup';
    deliveryAddress?: string;
    deliveryState?: string;
    deliveryCity?: string;
    notes?: string;
    subtotal: number;
    deliveryFee: number;
    grandTotal: number;
    paymentMethod: string;
    items: Array<{
      productId: string;
      productName: string;
      productImage: string;
      brand: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }>;
  }) {
    const supabase = createClient();

    // Generate order number
    const { data: orderNumData } = await supabase.rpc('generate_order_number');
    const orderNumber = orderNumData || `ET-${Date.now()}`;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: orderData.userId,
        customer_name: orderData.customerName,
        customer_email: orderData.customerEmail,
        customer_phone: orderData.customerPhone,
        delivery_method: orderData.deliveryMethod,
        delivery_address: orderData.deliveryAddress || '',
        delivery_state: orderData.deliveryState || '',
        delivery_city: orderData.deliveryCity || '',
        notes: orderData.notes || '',
        subtotal: orderData.subtotal,
        delivery_fee: orderData.deliveryFee,
        grand_total: orderData.grandTotal,
        payment_method: orderData.paymentMethod,
        status: 'pending',
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Insert order items
    const items = orderData.items.map(item => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName,
      product_image: item.productImage,
      brand: item.brand,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      total_price: item.totalPrice,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(items);
    if (itemsError) throw itemsError;

    return { ...order, orderNumber };
  },

  async getByUser(userId: string) {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return data || [];
    } catch (err: any) {
      console.error('orderService.getByUser error:', err.message);
      throw err;
    }
  },

  async getAll() {
    const supabase = createClient();
    try {
      // Use SECURITY DEFINER RPC to bypass RLS for admin access
      const { data, error } = await supabase.rpc('admin_get_all_orders');
      if (error) {
        if (isSchemaError(error)) throw error;
        console.error('orderService.getAll RPC error:', error.message);
        return [];
      }
      return data || [];
    } catch (err: any) {
      console.error('orderService.getAll error:', err.message);
      throw err;
    }
  },

  async updateStatus(id: string, status: string) {
    const supabase = createClient();
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (error) throw error;
  },
};

// ─── REPAIR REQUESTS ──────────────────────────────────────────────────────────
export const repairService = {
  async create(data: {
    userId?: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    deviceType: string;
    deviceBrand?: string;
    deviceModel?: string;
    issueCategory: string;
    issueDescription: string;
  }) {
    const supabase = createClient();
    const { data: result, error } = await supabase
      .from('repair_requests')
      .insert({
        user_id: data.userId || null,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone,
        device_type: data.deviceType,
        device_brand: data.deviceBrand || '',
        device_model: data.deviceModel || '',
        issue_category: data.issueCategory,
        issue_description: data.issueDescription,
        status: 'pending',
      })
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  async getAll() {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('repair_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return data || [];
    } catch (err: any) {
      console.error('repairService.getAll error:', err.message);
      throw err;
    }
  },

  async updateStatus(id: string, status: string, adminNotes?: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('repair_requests')
      .update({ status, admin_notes: adminNotes || '' })
      .eq('id', id);
    if (error) throw error;
  },
};

// ─── CONSULTATION REQUESTS ────────────────────────────────────────────────────
export const consultationService = {
  async create(data: {
    userId?: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    subject: string;
    message: string;
    budget?: string;
    preferredContact?: string;
  }) {
    const supabase = createClient();
    const { data: result, error } = await supabase
      .from('consultation_requests')
      .insert({
        user_id: data.userId || null,
        customer_name: data.customerName,
        customer_email: data.customerEmail,
        customer_phone: data.customerPhone,
        subject: data.subject,
        message: data.message,
        budget: data.budget || '',
        preferred_contact: data.preferredContact || 'whatsapp',
        status: 'pending',
      })
      .select()
      .single();
    if (error) throw error;
    return result;
  },

  async getAll() {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('consultation_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        if (isSchemaError(error)) throw error;
        return [];
      }
      return data || [];
    } catch (err: any) {
      console.error('consultationService.getAll error:', err.message);
      throw err;
    }
  },

  async updateStatus(id: string, status: string, adminNotes?: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from('consultation_requests')
      .update({ status, admin_notes: adminNotes || '' })
      .eq('id', id);
    if (error) throw error;
  },
};

// ─── MAPPERS ──────────────────────────────────────────────────────────────────
function mapProduct(row: any) {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category_id,
    price: row.price,
    originalPrice: row.original_price,
    discount: row.discount,
    image: row.image,
    alt: row.alt,
    rating: row.rating,
    reviews: row.reviews,
    inStock: row.in_stock,
    badge: row.badge,
    featured: row.featured,
    description: row.description,
  };
}

function mapProductToDb(product: any) {
  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    category_id: product.category || product.category_id,
    price: product.price,
    original_price: product.originalPrice ?? product.original_price ?? null,
    discount: product.discount || 0,
    image: product.image || '',
    alt: product.alt || '',
    rating: product.rating || 0,
    reviews: product.reviews || 0,
    in_stock: product.inStock ?? product.in_stock ?? true,
    badge: product.badge || null,
    featured: product.featured || false,
    description: product.description || '',
  };
}

function mapEnergyProduct(row: any) {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    model: row.model,
    subcategory: row.subcategory_id,
    price: row.price,
    originalPrice: row.original_price,
    discount: row.discount,
    images: Array.isArray(row.images) ? row.images : (row.images || []),
    description: row.description,
    warranty: row.warranty,
    availability: row.availability,
    badge: row.badge,
    featured: row.featured,
    rating: row.rating,
    reviews: row.reviews,
    specs: Array.isArray(row.specs) ? row.specs : (row.specs || []),
    searchKeywords: row.search_keywords || [],
    relatedIds: row.related_ids || [],
  };
}

function mapEnergyProductToDb(product: any) {
  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    model: product.model || '',
    subcategory_id: product.subcategory || product.subcategory_id,
    price: product.price,
    original_price: product.originalPrice ?? product.original_price ?? null,
    discount: product.discount || 0,
    images: product.images || [],
    description: product.description || '',
    warranty: product.warranty || '',
    availability: product.availability || 'in-stock',
    badge: product.badge || null,
    featured: product.featured || false,
    rating: product.rating || 0,
    reviews: product.reviews || 0,
    specs: product.specs || [],
    search_keywords: product.searchKeywords || product.search_keywords || [],
    related_ids: product.relatedIds || product.related_ids || [],
  };
}
