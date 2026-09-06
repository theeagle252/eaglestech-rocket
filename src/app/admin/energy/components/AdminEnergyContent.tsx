'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import {
  EnergyProduct,
  formatPrice,
  getAvailabilityLabel,
} from '@/lib/data';
import { energyProductService, energySubcategoryService } from '@/lib/supabaseService';

type Tab = 'products' | 'subcategories' | 'add';

const EMPTY_PRODUCT: Omit<EnergyProduct, 'id'> = {
  name: '',
  brand: '',
  model: '',
  subcategory: 'power-stations',
  price: 0,
  originalPrice: null,
  discount: 0,
  images: [{ src: '', alt: '' }],
  description: '',
  warranty: '',
  availability: 'in-stock',
  badge: null,
  featured: false,
  rating: 5,
  reviews: 0,
  specs: [{ label: '', value: '' }],
  searchKeywords: [],
  relatedIds: [],
};

export default function AdminEnergyContent() {
  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<EnergyProduct[]>([]);
  const [subcategories, setSubcategories] = useState<{ id: string; name: string }[]>([]);
  const [editingProduct, setEditingProduct] = useState<EnergyProduct | null>(null);
  const [form, setForm] = useState<Omit<EnergyProduct, 'id'>>(EMPTY_PRODUCT);
  const [newSubName, setNewSubName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const showSaved = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  // Load data from Supabase
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [prods, subs] = await Promise.all([
          energyProductService.getAll(),
          energySubcategoryService.getAll(),
        ]);
        setProducts(prods);
        setSubcategories(subs);
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // ── Product CRUD ──────────────────────────────────────────────────────────
  const handleEdit = (p: EnergyProduct) => {
    setEditingProduct(p);
    setForm({ ...p });
    setTab('add');
  };

  const handleDelete = async (id: string) => {
    try {
      await energyProductService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      setDeleteConfirm(null);
      showSaved();
    } catch (err: any) {
      setError(err.message || 'Failed to delete product');
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.brand || !form.price) return;
    setSaving(true);
    setError('');
    try {
      const productId = editingProduct?.id ||
        form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
      const saved = await energyProductService.upsert({ ...form, id: productId });
      if (editingProduct) {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? saved : p));
      } else {
        setProducts(prev => [...prev, saved]);
      }
      setEditingProduct(null);
      setForm(EMPTY_PRODUCT);
      setTab('products');
      showSaved();
    } catch (err: any) {
      setError(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setForm(EMPTY_PRODUCT);
    setTab('products');
  };

  // ── Spec helpers ──────────────────────────────────────────────────────────
  const addSpec = () => setForm(f => ({ ...f, specs: [...f.specs, { label: '', value: '' }] }));
  const removeSpec = (i: number) => setForm(f => ({ ...f, specs: f.specs.filter((_, idx) => idx !== i) }));
  const updateSpec = (i: number, field: 'label' | 'value', val: string) =>
    setForm(f => ({ ...f, specs: f.specs.map((s, idx) => idx === i ? { ...s, [field]: val } : s) }));

  // ── Image helpers ─────────────────────────────────────────────────────────
  const addImage = () => setForm(f => ({ ...f, images: [...f.images, { src: '', alt: '' }] }));
  const removeImage = (i: number) => setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));
  const updateImage = (i: number, field: 'src' | 'alt', val: string) =>
    setForm(f => ({ ...f, images: f.images.map((img, idx) => idx === i ? { ...img, [field]: val } : img) }));

  // ── Subcategory helpers ───────────────────────────────────────────────────
  const addSubcategory = async () => {
    if (!newSubName.trim()) return;
    const id = newSubName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    try {
      const sub = await energySubcategoryService.upsert({ id, name: newSubName.trim(), sort_order: subcategories.length });
      setSubcategories(prev => [...prev, sub]);
      setNewSubName('');
      showSaved();
    } catch (err: any) {
      setError(err.message || 'Failed to add subcategory');
    }
  };

  const removeSubcategory = async (id: string) => {
    if (id === 'all') return;
    try {
      await energySubcategoryService.delete(id);
      setSubcategories(prev => prev.filter(s => s.id !== id));
      showSaved();
    } catch (err: any) {
      setError(err.message || 'Failed to remove subcategory');
    }
  };

  const inputCls = 'w-full px-3 py-2.5 rounded-xl border border-border bg-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors';
  const labelCls = 'block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5';

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground text-sm">Loading energy products…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link href="/admin" className="text-xs text-muted-foreground hover:text-primary transition-colors">← Admin Dashboard</Link>
            </div>
            <h1 className="text-2xl font-extrabold text-foreground flex items-center gap-2">
              <span>⚡</span> Energy & Power Admin
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Manage all Energy & Power Solutions products and categories</p>
          </div>
          {saved && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-xl text-sm font-semibold">
              <Icon name="CheckCircleIcon" size={16} />
              Saved!
            </div>
          )}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-sm text-red-600">
            <Icon name="ExclamationCircleIcon" size={18} className="shrink-0" />
            {error}
            <button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">
              <Icon name="XMarkIcon" size={16} />
            </button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Products', value: products.length, icon: 'CubeIcon' },
            { label: 'In Stock', value: products.filter(p => p.availability === 'in-stock').length, icon: 'CheckCircleIcon' },
            { label: 'Featured', value: products.filter(p => p.featured).length, icon: 'StarIcon' },
            { label: 'Subcategories', value: subcategories.filter(s => s.id !== 'all').length, icon: 'TagIcon' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-border p-4">
              <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-6">
          {([
            { id: 'products', label: 'Products' },
            { id: 'subcategories', label: 'Subcategories' },
            { id: 'add', label: editingProduct ? 'Edit Product' : 'Add Product' },
          ] as { id: Tab; label: string }[]).map(t => (
            <button
              key={t.id}
              onClick={() => { if (t.id !== 'add') { setEditingProduct(null); setForm(EMPTY_PRODUCT); } setTab(t.id); }}
              className={`px-5 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                tab === t.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Products Tab ── */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">{products.length} products</p>
              <button
                onClick={() => { setEditingProduct(null); setForm(EMPTY_PRODUCT); setTab('add'); }}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-secondary transition-colors"
              >
                <Icon name="PlusIcon" size={16} />
                Add Product
              </button>
            </div>

            <div className="space-y-3">
              {products.map(p => {
                const avail = getAvailabilityLabel(p.availability);
                return (
                  <div key={p.id} className="bg-white rounded-2xl border border-border p-4 flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-muted shrink-0">
                      {p.images[0]?.src ? (
                        <AppImage src={p.images[0].src} alt={p.images[0].alt} fill className="object-cover" sizes="64px" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <Icon name="PhotoIcon" size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-bold text-foreground">{p.name}</p>
                        {p.featured && (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">Featured</span>
                        )}
                        {p.badge && (
                          <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs font-semibold rounded-full">{p.badge}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{p.brand} · {p.model}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm font-bold text-foreground">{formatPrice(p.price)}</span>
                        <span className={`text-xs font-semibold ${avail.color}`}>{avail.label}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleEdit(p)}
                        className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                        aria-label="Edit product"
                      >
                        <Icon name="PencilIcon" size={16} />
                      </button>
                      {deleteConfirm === p.id ? (
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleDelete(p.id)} className="px-3 py-1.5 bg-red-500 text-white text-xs font-bold rounded-lg">Confirm</button>
                          <button onClick={() => setDeleteConfirm(null)} className="px-3 py-1.5 bg-muted text-foreground text-xs font-bold rounded-lg">Cancel</button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(p.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-red-500 hover:border-red-300 transition-colors"
                          aria-label="Delete product"
                        >
                          <Icon name="TrashIcon" size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
              {products.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <Icon name="CubeIcon" size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">No energy products yet. Add your first product!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Subcategories Tab ── */}
        {tab === 'subcategories' && (
          <div className="max-w-lg">
            <p className="text-sm text-muted-foreground mb-5">Add or remove subcategories. These appear as filter pills on the Energy page.</p>
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                placeholder="New subcategory name (e.g. Wind Turbines)"
                value={newSubName}
                onChange={e => setNewSubName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSubcategory()}
                className={inputCls}
              />
              <button
                onClick={addSubcategory}
                className="px-4 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-secondary transition-colors shrink-0"
              >
                Add
              </button>
            </div>
            <div className="space-y-2">
              {subcategories.map(sub => (
                <div key={sub.id} className="flex items-center justify-between px-4 py-3 bg-white rounded-xl border border-border">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{sub.name}</p>
                    <p className="text-xs text-muted-foreground">ID: {sub.id}</p>
                  </div>
                  {sub.id !== 'all' && (
                    <button
                      onClick={() => removeSubcategory(sub.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
                      aria-label={`Remove ${sub.name}`}
                    >
                      <Icon name="XMarkIcon" size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Add / Edit Product Tab ── */}
        {tab === 'add' && (
          <div className="max-w-2xl">
            <h2 className="text-lg font-bold text-foreground mb-6">
              {editingProduct ? `Editing: ${editingProduct.name}` : 'Add New Energy Product'}
            </h2>
            <div className="space-y-5">
              {/* Basic Info */}
              <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
                <h3 className="text-sm font-bold text-foreground">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Product Name *</label>
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. 200W Solar Panel" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Brand *</label>
                    <input type="text" value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="e.g. Felicity Solar" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Model</label>
                    <input type="text" value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} placeholder="e.g. FS-M200W" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Subcategory</label>
                    <select value={form.subcategory} onChange={e => setForm(f => ({ ...f, subcategory: e.target.value }))} className={inputCls}>
                      {subcategories.filter(s => s.id !== 'all').map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Describe the product..." className={inputCls + ' resize-none'} />
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="bg-white rounded-2xl border border-border p-5 space-y-4">
                <h3 className="text-sm font-bold text-foreground">Pricing & Availability</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelCls}>Price (₦) *</label>
                    <input type="number" value={form.price || ''} onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))} placeholder="0" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Original Price (₦)</label>
                    <input type="number" value={form.originalPrice || ''} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value ? Number(e.target.value) : null }))} placeholder="Optional" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Discount (%)</label>
                    <input type="number" value={form.discount || ''} onChange={e => setForm(f => ({ ...f, discount: Number(e.target.value) }))} placeholder="0" className={inputCls} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>Availability</label>
                    <select value={form.availability} onChange={e => setForm(f => ({ ...f, availability: e.target.value as EnergyProduct['availability'] }))} className={inputCls}>
                      <option value="in-stock">In Stock</option>
                      <option value="low-stock">Low Stock</option>
                      <option value="out-of-stock">Out of Stock</option>
                      <option value="coming-soon">Coming Soon</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Badge (optional)</label>
                    <input type="text" value={form.badge || ''} onChange={e => setForm(f => ({ ...f, badge: e.target.value || null }))} placeholder="e.g. Best Seller" className={inputCls} />
                  </div>
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="w-4 h-4 accent-primary" />
                  <span className="text-sm font-medium text-foreground">Mark as Featured</span>
                </label>
              </div>

              {/* Warranty */}
              <div className="bg-white rounded-2xl border border-border p-5">
                <label className={labelCls}>Warranty</label>
                <input type="text" value={form.warranty} onChange={e => setForm(f => ({ ...f, warranty: e.target.value }))} placeholder="e.g. 1 Year Manufacturer Warranty" className={inputCls} />
              </div>

              {/* Images */}
              <div className="bg-white rounded-2xl border border-border p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Product Images</h3>
                  <button onClick={addImage} className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-secondary transition-colors">
                    <Icon name="PlusIcon" size={14} />Add Image
                  </button>
                </div>
                {form.images.map((img, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-2">
                      <input type="text" value={img.src} onChange={e => updateImage(i, 'src', e.target.value)} placeholder="Image URL" className={inputCls} />
                      <input type="text" value={img.alt} onChange={e => updateImage(i, 'alt', e.target.value)} placeholder="Alt text (describe the image)" className={inputCls} />
                    </div>
                    {form.images.length > 1 && (
                      <button onClick={() => removeImage(i)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-red-500 transition-colors mt-0.5 shrink-0">
                        <Icon name="XMarkIcon" size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Technical Specs */}
              <div className="bg-white rounded-2xl border border-border p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-foreground">Technical Specifications</h3>
                  <button onClick={addSpec} className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-secondary transition-colors">
                    <Icon name="PlusIcon" size={14} />Add Spec
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">Add only the specs relevant to this product type.</p>
                {form.specs.map((spec, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input type="text" value={spec.label} onChange={e => updateSpec(i, 'label', e.target.value)} placeholder="Label (e.g. Capacity)" className={inputCls} />
                    <input type="text" value={spec.value} onChange={e => updateSpec(i, 'value', e.target.value)} placeholder="Value (e.g. 256Wh)" className={inputCls} />
                    {form.specs.length > 1 && (
                      <button onClick={() => removeSpec(i)} className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-red-500 transition-colors shrink-0">
                        <Icon name="XMarkIcon" size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Search Keywords */}
              <div className="bg-white rounded-2xl border border-border p-5">
                <label className={labelCls}>Search Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={form.searchKeywords.join(', ')}
                  onChange={e => setForm(f => ({ ...f, searchKeywords: e.target.value.split(',').map(k => k.trim()).filter(Boolean) }))}
                  placeholder="solar, inverter, backup power, 100w"
                  className={inputCls}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={!form.name || !form.brand || !form.price || saving}
                  className="flex-1 py-3.5 bg-primary text-primary-foreground rounded-xl font-bold text-sm hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving…</>
                  ) : (
                    editingProduct ? 'Save Changes' : 'Add Product'
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3.5 border border-border rounded-xl font-semibold text-sm text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
