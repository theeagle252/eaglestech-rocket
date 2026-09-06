-- ============================================================
-- EaglesTech Full Backend Migration
-- Tables: user_profiles, categories, products, energy_products,
--         orders, order_items, repair_requests, consultation_requests
-- ============================================================

-- ─── 1. ENUM TYPES ────────────────────────────────────────────────────────────
DROP TYPE IF EXISTS public.user_role CASCADE;
CREATE TYPE public.user_role AS ENUM ('customer', 'admin');

DROP TYPE IF EXISTS public.order_status CASCADE;
CREATE TYPE public.order_status AS ENUM ('pending', 'processing', 'completed', 'cancelled');

DROP TYPE IF EXISTS public.delivery_method CASCADE;
CREATE TYPE public.delivery_method AS ENUM ('delivery', 'pickup');

DROP TYPE IF EXISTS public.repair_status CASCADE;
CREATE TYPE public.repair_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

DROP TYPE IF EXISTS public.availability_status CASCADE;
CREATE TYPE public.availability_status AS ENUM ('in-stock', 'low-stock', 'out-of-stock', 'coming-soon');

-- ─── 2. CORE TABLES ───────────────────────────────────────────────────────────

-- User Profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  role public.user_role DEFAULT 'customer'::public.user_role,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Product Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  image TEXT DEFAULT '',
  alt TEXT DEFAULT '',
  product_count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Products (regular shop products)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT '',
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  price BIGINT NOT NULL DEFAULT 0,
  original_price BIGINT,
  discount INTEGER DEFAULT 0,
  image TEXT DEFAULT '',
  alt TEXT DEFAULT '',
  rating NUMERIC(3,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  badge TEXT,
  featured BOOLEAN DEFAULT false,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Energy Product Subcategories
CREATE TABLE IF NOT EXISTS public.energy_subcategories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Energy Products
CREATE TABLE IF NOT EXISTS public.energy_products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT '',
  model TEXT DEFAULT '',
  subcategory_id TEXT REFERENCES public.energy_subcategories(id) ON DELETE SET NULL,
  price BIGINT NOT NULL DEFAULT 0,
  original_price BIGINT,
  discount INTEGER DEFAULT 0,
  images JSONB DEFAULT '[]'::jsonb,
  description TEXT DEFAULT '',
  warranty TEXT DEFAULT '',
  availability public.availability_status DEFAULT 'in-stock'::public.availability_status,
  badge TEXT,
  featured BOOLEAN DEFAULT false,
  rating NUMERIC(3,1) DEFAULT 0,
  reviews INTEGER DEFAULT 0,
  specs JSONB DEFAULT '[]'::jsonb,
  search_keywords TEXT[] DEFAULT ARRAY[]::TEXT[],
  related_ids TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_method public.delivery_method DEFAULT 'delivery'::public.delivery_method,
  delivery_address TEXT DEFAULT '',
  delivery_state TEXT DEFAULT '',
  delivery_city TEXT DEFAULT '',
  notes TEXT DEFAULT '',
  subtotal BIGINT NOT NULL DEFAULT 0,
  delivery_fee BIGINT DEFAULT 0,
  grand_total BIGINT NOT NULL DEFAULT 0,
  status public.order_status DEFAULT 'pending'::public.order_status,
  payment_method TEXT DEFAULT 'bank',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  product_image TEXT DEFAULT '',
  brand TEXT DEFAULT '',
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price BIGINT NOT NULL DEFAULT 0,
  total_price BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Repair Requests
CREATE TABLE IF NOT EXISTS public.repair_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  device_type TEXT NOT NULL,
  device_brand TEXT DEFAULT '',
  device_model TEXT DEFAULT '',
  issue_category TEXT NOT NULL,
  issue_description TEXT NOT NULL,
  status public.repair_status DEFAULT 'pending'::public.repair_status,
  admin_notes TEXT DEFAULT '',
  estimated_cost BIGINT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Consultation Requests
CREATE TABLE IF NOT EXISTS public.consultation_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  budget TEXT DEFAULT '',
  preferred_contact TEXT DEFAULT 'whatsapp',
  status TEXT DEFAULT 'pending',
  admin_notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ─── 3. INDEXES ───────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_energy_products_subcategory ON public.energy_products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_energy_products_featured ON public.energy_products(featured);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_repair_requests_user_id ON public.repair_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_consultation_requests_user_id ON public.consultation_requests(user_id);

-- ─── 4. FUNCTIONS ─────────────────────────────────────────────────────────────

-- Auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, avatar_url, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer')::public.user_role
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Admin check function (reads from auth metadata to avoid recursion)
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
  SELECT 1 FROM auth.users au
  WHERE au.id = auth.uid()
  AND (
    au.raw_user_meta_data->>'role' = 'admin'
    OR au.raw_app_meta_data->>'role' = 'admin'
  )
)
$$;

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- Generate order number
CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  seq_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(CAST(SUBSTRING(order_number FROM 4) AS INTEGER)), 2000) + 1
  INTO seq_num
  FROM public.orders
  WHERE order_number ~ '^ET-[0-9]+$';
  RETURN 'ET-' || seq_num::TEXT;
END;
$$;

-- ─── 5. ENABLE RLS ────────────────────────────────────────────────────────────
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.energy_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.repair_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

-- ─── 6. RLS POLICIES ──────────────────────────────────────────────────────────

-- user_profiles: users manage own, admins manage all
DROP POLICY IF EXISTS "users_manage_own_profile" ON public.user_profiles;
CREATE POLICY "users_manage_own_profile"
ON public.user_profiles FOR ALL TO authenticated
USING (id = auth.uid()) WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "admin_manage_all_profiles" ON public.user_profiles;
CREATE POLICY "admin_manage_all_profiles"
ON public.user_profiles FOR ALL TO authenticated
USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

-- categories: public read, admin write
DROP POLICY IF EXISTS "public_read_categories" ON public.categories;
CREATE POLICY "public_read_categories"
ON public.categories FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_manage_categories" ON public.categories;
CREATE POLICY "admin_manage_categories"
ON public.categories FOR ALL TO authenticated
USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

-- products: public read, admin write
DROP POLICY IF EXISTS "public_read_products" ON public.products;
CREATE POLICY "public_read_products"
ON public.products FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_manage_products" ON public.products;
CREATE POLICY "admin_manage_products"
ON public.products FOR ALL TO authenticated
USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

-- energy_subcategories: public read, admin write
DROP POLICY IF EXISTS "public_read_energy_subcategories" ON public.energy_subcategories;
CREATE POLICY "public_read_energy_subcategories"
ON public.energy_subcategories FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_manage_energy_subcategories" ON public.energy_subcategories;
CREATE POLICY "admin_manage_energy_subcategories"
ON public.energy_subcategories FOR ALL TO authenticated
USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

-- energy_products: public read, admin write
DROP POLICY IF EXISTS "public_read_energy_products" ON public.energy_products;
CREATE POLICY "public_read_energy_products"
ON public.energy_products FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_manage_energy_products" ON public.energy_products;
CREATE POLICY "admin_manage_energy_products"
ON public.energy_products FOR ALL TO authenticated
USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

-- orders: users see own orders, admins see all
DROP POLICY IF EXISTS "users_view_own_orders" ON public.orders;
CREATE POLICY "users_view_own_orders"
ON public.orders FOR SELECT TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "users_create_orders" ON public.orders;
CREATE POLICY "users_create_orders"
ON public.orders FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admin_manage_all_orders" ON public.orders;
CREATE POLICY "admin_manage_all_orders"
ON public.orders FOR ALL TO authenticated
USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

-- order_items: users see own via order, admins see all
DROP POLICY IF EXISTS "users_view_own_order_items" ON public.order_items;
CREATE POLICY "users_view_own_order_items"
ON public.order_items FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "users_create_order_items" ON public.order_items;
CREATE POLICY "users_create_order_items"
ON public.order_items FOR INSERT TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id AND o.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "admin_manage_all_order_items" ON public.order_items;
CREATE POLICY "admin_manage_all_order_items"
ON public.order_items FOR ALL TO authenticated
USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

-- repair_requests: users see own, admins see all
DROP POLICY IF EXISTS "users_manage_own_repair_requests" ON public.repair_requests;
CREATE POLICY "users_manage_own_repair_requests"
ON public.repair_requests FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "public_create_repair_requests" ON public.repair_requests;
CREATE POLICY "public_create_repair_requests"
ON public.repair_requests FOR INSERT TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "admin_manage_all_repair_requests" ON public.repair_requests;
CREATE POLICY "admin_manage_all_repair_requests"
ON public.repair_requests FOR ALL TO authenticated
USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

-- consultation_requests: users see own, admins see all
DROP POLICY IF EXISTS "users_manage_own_consultation_requests" ON public.consultation_requests;
CREATE POLICY "users_manage_own_consultation_requests"
ON public.consultation_requests FOR ALL TO authenticated
USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "public_create_consultation_requests" ON public.consultation_requests;
CREATE POLICY "public_create_consultation_requests"
ON public.consultation_requests FOR INSERT TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "admin_manage_all_consultation_requests" ON public.consultation_requests;
CREATE POLICY "admin_manage_all_consultation_requests"
ON public.consultation_requests FOR ALL TO authenticated
USING (public.is_admin_user()) WITH CHECK (public.is_admin_user());

-- ─── 7. TRIGGERS ──────────────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS set_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER set_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_products_updated_at ON public.products;
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_energy_products_updated_at ON public.energy_products;
CREATE TRIGGER set_energy_products_updated_at
  BEFORE UPDATE ON public.energy_products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_orders_updated_at ON public.orders;
CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_repair_requests_updated_at ON public.repair_requests;
CREATE TRIGGER set_repair_requests_updated_at
  BEFORE UPDATE ON public.repair_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS set_consultation_requests_updated_at ON public.consultation_requests;
CREATE TRIGGER set_consultation_requests_updated_at
  BEFORE UPDATE ON public.consultation_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── 8. SEED DATA ─────────────────────────────────────────────────────────────

-- Categories
INSERT INTO public.categories (id, name, description, image, alt, product_count, sort_order) VALUES
  ('smartphones', 'Smartphones', 'Latest and affordable smartphones for everyday use.', 'https://images.unsplash.com/photo-1583291023438-41cef6453b1f', 'Modern smartphone on clean white surface with vibrant display', 48, 1),
  ('laptops', 'Laptops', 'Laptops for students, professionals and productivity.', 'https://img.rocket.new/generatedImages/rocket_gen_img_12466103e-1786111397904.png', 'Open laptop on desk with bright screen in modern office setting', 32, 2),
  ('accessories', 'Accessories', 'Chargers, cables, power banks, earphones and cases.', 'https://img.rocket.new/generatedImages/rocket_gen_img_12466103e-1786111397904.png', 'Collection of tech accessories including earbuds and charging cables', 120, 3),
  ('gadgets', 'Gadgets', 'Useful technology and smart gadgets for daily life.', 'https://images.unsplash.com/photo-1628911772787-0192e81cdaa7', 'Smartwatch and tech gadgets arranged on dark surface', 24, 4),
  ('gaming', 'Gaming', 'Gaming consoles and accessories for serious players.', 'https://images.unsplash.com/photo-1616341317041-cf93b2389ef5', 'Gaming controller with dramatic lighting on dark background', 18, 5),
  ('calculators', 'Calculators', 'Scientific calculators and student tech essentials.', 'https://img.rocket.new/generatedImages/rocket_gen_img_1e168df77-1767450214122.png', 'Scientific calculator on student desk with notebooks and pens', 15, 6),
  ('energy', 'Energy & Power', 'Solar panels, inverters, power stations and backup solutions.', 'https://images.unsplash.com/photo-1632884943447-474061c1ea63', 'Solar panels on rooftop with bright blue sky and sunlight', 0, 7)
ON CONFLICT (id) DO NOTHING;

-- Energy Subcategories
INSERT INTO public.energy_subcategories (id, name, sort_order) VALUES
  ('all', 'All Products', 0),
  ('power-stations', 'Power Stations', 1),
  ('solar-panels', 'Solar Panels', 2),
  ('inverters', 'Inverters', 3),
  ('batteries', 'Batteries', 4),
  ('solar-generators', 'Solar Generators', 5),
  ('rechargeable-fans', 'Rechargeable Fans', 6),
  ('rechargeable-lamps', 'Rechargeable Lamps', 7),
  ('power-banks', 'Power Banks', 8),
  ('solar-accessories', 'Solar Accessories', 9),
  ('dc-appliances', 'DC Appliances', 10),
  ('cables-connectors', 'Cables & Connectors', 11)
ON CONFLICT (id) DO NOTHING;

-- Products
INSERT INTO public.products (id, name, brand, category_id, price, original_price, discount, image, alt, rating, reviews, in_stock, badge, featured) VALUES
  ('iphone-17-pro-max', 'iPhone 17 Pro Max', 'Apple', 'smartphones', 1850000, 2100000, 12, 'https://img.rocket.new/generatedImages/rocket_gen_img_17b82fb7a-1772960574407.png', 'iPhone 17 Pro Max in titanium finish on reflective surface with dark background', 4.9, 47, true, 'New', true),
  ('samsung-galaxy-s25-ultra', 'Samsung Galaxy S25 Ultra', 'Samsung', 'smartphones', 1450000, 1600000, 9, 'https://img.rocket.new/generatedImages/rocket_gen_img_1294d2923-1771486444013.png', 'Samsung Galaxy S25 Ultra with S-Pen on dark gradient background', 4.8, 63, true, 'Hot', true),
  ('macbook-air-m3', 'MacBook Air M3', 'Apple', 'laptops', 1950000, 2200000, 11, 'https://img.rocket.new/generatedImages/rocket_gen_img_1230ca14e-1772228321576.png', 'MacBook Air M3 open on minimalist desk in bright natural light', 4.9, 29, true, 'Best Seller', true),
  ('oraimo-freepods-4', 'Oraimo FreePods 4', 'Oraimo', 'accessories', 28500, 35000, 19, 'https://images.unsplash.com/photo-1727174659485-0567349669d2', 'White wireless earbuds with charging case on clean light background', 4.6, 112, true, 'Popular', true),
  ('dell-inspiron-15', 'Dell Inspiron 15', 'Dell', 'laptops', 680000, 750000, 9, 'https://img.rocket.new/generatedImages/rocket_gen_img_13dd29d5e-1784648778249.png', 'Dell Inspiron laptop open on student desk with books and notebook', 4.5, 38, true, 'Student Pick', true),
  ('anker-powerbank-20000', 'Anker PowerCore 20000', 'Anker', 'accessories', 45000, NULL, 0, 'https://images.unsplash.com/photo-1563896716604-f949b1522097', 'Black portable power bank with charging cables on white background', 4.7, 85, true, NULL, true),
  ('casio-fx-991ex', 'Casio FX-991EX Classwiz', 'Casio', 'calculators', 18500, 22000, 16, 'https://img.rocket.new/generatedImages/rocket_gen_img_188022dbe-1785967224430.png', 'Casio scientific calculator on student notebook in bright classroom', 4.8, 156, true, 'Exam Essential', true),
  ('xiaomi-redmi-note-13', 'Xiaomi Redmi Note 13 Pro', 'Xiaomi', 'smartphones', 285000, 320000, 11, 'https://img.rocket.new/generatedImages/rocket_gen_img_1ba6bbe58-1772382695993.png', 'Xiaomi Redmi Note 13 Pro in blue showing camera array on back', 4.5, 74, true, 'Value Pick', true),
  ('samsung-galaxy-a55', 'Samsung Galaxy A55', 'Samsung', 'smartphones', 385000, 420000, 8, 'https://img.rocket.new/generatedImages/rocket_gen_img_1d2e6e219-1772429765169.png', 'Samsung Galaxy A55 in lavender color on gradient background', 4.4, 52, true, NULL, false),
  ('hp-pavilion-15', 'HP Pavilion 15', 'HP', 'laptops', 595000, 650000, 8, 'https://img.rocket.new/generatedImages/rocket_gen_img_13969e3a2-1772638686979.png', 'HP Pavilion 15 laptop on clean white desk in bright room', 4.3, 31, true, NULL, false),
  ('jbl-tune-760nc', 'JBL Tune 760NC', 'JBL', 'accessories', 62000, 75000, 17, 'https://img.rocket.new/generatedImages/rocket_gen_img_1f1da1ceb-1767898618110.png', 'JBL Tune 760NC wireless headphones in blue on white background', 4.6, 43, true, NULL, false),
  ('ps5-slim', 'PlayStation 5 Slim', 'Sony', 'gaming', 780000, NULL, 0, 'https://images.unsplash.com/photo-1731405816630-ee493e354b5d', 'PlayStation 5 Slim console in white on dark dramatic background', 4.9, 28, false, 'Coming Soon', false)
ON CONFLICT (id) DO NOTHING;

-- Energy Products
INSERT INTO public.energy_products (id, name, brand, model, subcategory_id, price, original_price, discount, images, description, warranty, availability, badge, featured, rating, reviews, specs, search_keywords, related_ids) VALUES
  ('itel-powertank-100w', 'itel PowerTank 100W Portable Station', 'itel', 'PowerTank PT-100', 'power-stations', 185000, 220000, 16,
   '[{"src":"https://img.rocket.new/generatedImages/rocket_gen_img_1e503fc20-1764871052167.png","alt":"itel PowerTank 100W portable power station with multiple output ports on white background"},{"src":"https://img.rocket.new/generatedImages/rocket_gen_img_4ad579b09-1788551006074.png","alt":"itel PowerTank 100W power station charging a laptop and phone simultaneously"}]'::jsonb,
   'The itel PowerTank 100W is a compact portable power station designed for Nigerian homes and outdoor use.', '1 Year Manufacturer Warranty', 'in-stock'::public.availability_status, 'Best Seller', true, 4.7, 34,
   '[{"label":"Capacity","value":"256Wh (71,111mAh)"},{"label":"Output Wattage","value":"100W continuous / 200W peak"},{"label":"Battery Type","value":"LiFePO4"},{"label":"Solar Input","value":"Up to 60W"},{"label":"AC Charging Time","value":"~3 hours"},{"label":"USB Ports","value":"2 x USB-A, 1 x USB-C 45W PD"},{"label":"Weight","value":"2.8 kg"}]'::jsonb,
   ARRAY['itel','powertank','portable power station','backup power','power outage','lifepo4'],
   ARRAY['100w-solar-panel','solar-charge-controller-20a','rechargeable-fan-16inch']),
  ('100w-solar-panel', '100W Monocrystalline Solar Panel', 'Felicity Solar', 'FS-M100W', 'solar-panels', 65000, 78000, 17,
   '[{"src":"https://img.rocket.new/generatedImages/rocket_gen_img_1e81d969f-1774267330911.png","alt":"Monocrystalline solar panel on rooftop with bright blue sky and sunlight"},{"src":"https://img.rocket.new/generatedImages/rocket_gen_img_18370b9c4-1767450362454.png","alt":"Close-up of solar panel cells showing monocrystalline structure in sunlight"}]'::jsonb,
   'High-efficiency 100W monocrystalline solar panel with 21% efficiency rating.', '10 Years Product Warranty / 25 Years Performance Warranty', 'in-stock'::public.availability_status, 'Popular', true, 4.8, 52,
   '[{"label":"Wattage","value":"100W"},{"label":"Panel Type","value":"Monocrystalline"},{"label":"Efficiency","value":"21%"},{"label":"Connector","value":"MC4"},{"label":"Weight","value":"7.5 kg"}]'::jsonb,
   ARRAY['solar panel','monocrystalline','100w','felicity','solar energy','off-grid'],
   ARRAY['solar-charge-controller-20a','itel-powertank-100w','200ah-solar-battery']),
  ('1kva-inverter', '1KVA Pure Sine Wave Inverter', 'Luminous', 'Eco Volt Neo 1050', 'inverters', 95000, 115000, 17,
   '[{"src":"https://img.rocket.new/generatedImages/rocket_gen_img_114a6e210-1786021548979.png","alt":"Luminous 1KVA pure sine wave inverter unit on white background showing front panel"},{"src":"https://img.rocket.new/generatedImages/rocket_gen_img_16e8282ac-1778658398891.png","alt":"Inverter connected to battery bank in home setup with cables"}]'::jsonb,
   'The Luminous Eco Volt Neo 1050 is a reliable 1KVA pure sine wave inverter perfect for Nigerian homes.', '2 Years Manufacturer Warranty', 'in-stock'::public.availability_status, 'Top Rated', true, 4.6, 41,
   '[{"label":"Power Rating","value":"1KVA / 800W"},{"label":"Input Voltage","value":"12V DC"},{"label":"Output Voltage","value":"220-240V AC"},{"label":"Wave Type","value":"Pure Sine Wave"},{"label":"Battery Compatibility","value":"Lead Acid, Tubular, Lithium"}]'::jsonb,
   ARRAY['inverter','1kva','luminous','pure sine wave','power backup','nepa','home inverter'],
   ARRAY['200ah-solar-battery','100w-solar-panel','solar-charge-controller-20a']),
  ('200ah-solar-battery', '200Ah Tubular Solar Battery', 'Luminous', 'Red Charge RC 25000', 'batteries', 145000, 165000, 12,
   '[{"src":"https://img.rocket.new/generatedImages/rocket_gen_img_169e68a1b-1778148573861.png","alt":"Luminous 200Ah tubular battery on white background showing terminals and label"},{"src":"https://img.rocket.new/generatedImages/rocket_gen_img_16e8282ac-1778658398891.png","alt":"Solar battery bank connected to inverter system in home installation"}]'::jsonb,
   'The Luminous Red Charge 200Ah tubular battery is engineered for deep-cycle solar applications.', '3 Years Manufacturer Warranty', 'in-stock'::public.availability_status, NULL, false, 4.5, 29,
   '[{"label":"Capacity","value":"200Ah at C20"},{"label":"Battery Type","value":"Tubular Flooded Lead Acid"},{"label":"Voltage","value":"12V"},{"label":"Cycle Life","value":"1500+ cycles at 80% DoD"},{"label":"Weight","value":"62 kg"}]'::jsonb,
   ARRAY['battery','tubular battery','200ah','luminous','solar battery','inverter battery','deep cycle'],
   ARRAY['1kva-inverter','100w-solar-panel','solar-charge-controller-20a']),
  ('solar-charge-controller-20a', '20A MPPT Solar Charge Controller', 'Epever', 'Tracer 2210AN', 'solar-accessories', 28500, 35000, 19,
   '[{"src":"https://images.unsplash.com/photo-1662340696153-ebc6941a0b4b","alt":"Epever MPPT solar charge controller mounted on wall with display showing charging status"},{"src":"https://images.unsplash.com/photo-1677545468789-2ebf6cb2b6ff","alt":"Solar charge controller connected to solar panel and battery bank in off-grid system"}]'::jsonb,
   'The Epever Tracer 2210AN is a 20A MPPT solar charge controller with advanced maximum power point tracking.', '1 Year Manufacturer Warranty', 'in-stock'::public.availability_status, 'MPPT', false, 4.7, 18,
   '[{"label":"Type","value":"MPPT"},{"label":"Rated Charge Current","value":"20A"},{"label":"System Voltage","value":"12V / 24V Auto"},{"label":"MPPT Efficiency","value":">99.5%"},{"label":"Display","value":"LCD with backlight"}]'::jsonb,
   ARRAY['charge controller','mppt','solar controller','epever','20a','solar accessories'],
   ARRAY['100w-solar-panel','200ah-solar-battery','1kva-inverter']),
  ('rechargeable-fan-16inch', '16-Inch Rechargeable Standing Fan', 'Binatone', 'StandFan RF-1600', 'rechargeable-fans', 42000, 52000, 19,
   '[{"src":"https://img.rocket.new/generatedImages/rocket_gen_img_1a85a6358-1768702746968.png","alt":"Binatone 16-inch rechargeable standing fan in white on clean background"},{"src":"https://img.rocket.new/generatedImages/rocket_gen_img_476d6aff3-1788551006982.png","alt":"Rechargeable fan in use in a Nigerian home during power outage"}]'::jsonb,
   'Stay cool during power outages with the Binatone 16-inch rechargeable standing fan.', '1 Year Manufacturer Warranty', 'in-stock'::public.availability_status, 'Hot Pick', true, 4.5, 67,
   '[{"label":"Blade Size","value":"16 inches"},{"label":"Battery Capacity","value":"12V / 7Ah Lead Acid"},{"label":"Runtime","value":"Up to 8 hours (low speed)"},{"label":"Speed Settings","value":"3 (Low / Medium / High)"},{"label":"Remote Control","value":"Yes"}]'::jsonb,
   ARRAY['rechargeable fan','standing fan','binatone','16 inch','power outage fan','battery fan'],
   ARRAY['itel-powertank-100w','rechargeable-lamp-solar','100w-solar-panel']),
  ('rechargeable-lamp-solar', 'Solar Rechargeable LED Lamp', 'Jackery', 'SolarLamp SL-200', 'rechargeable-lamps', 12500, 16000, 22,
   '[{"src":"https://img.rocket.new/generatedImages/rocket_gen_img_406f63efa-1788551006916.png","alt":"Solar rechargeable LED lamp glowing on table in dark room"},{"src":"https://images.unsplash.com/photo-1662601311129-a288e9db505c","alt":"Solar lamp with small solar panel charging outdoors in sunlight"}]'::jsonb,
   'Bright, portable solar rechargeable LED lamp with built-in solar panel.', '6 Months Warranty', 'in-stock'::public.availability_status, 'Budget Pick', false, 4.3, 88,
   '[{"label":"Light Output","value":"200 lumens"},{"label":"Battery","value":"2000mAh Li-ion"},{"label":"Runtime","value":"Up to 12 hours (low mode)"},{"label":"IP Rating","value":"IP44 (splash-proof)"},{"label":"Weight","value":"280g"}]'::jsonb,
   ARRAY['solar lamp','rechargeable lamp','led lamp','solar light','emergency light','jackery'],
   ARRAY['rechargeable-fan-16inch','itel-powertank-100w','solar-charge-controller-20a']),
  ('3kva-solar-generator', '3KVA Solar Generator System', 'Felicity Solar', 'SolarGen 3000', 'solar-generators', 850000, 980000, 13,
   '[{"src":"https://img.rocket.new/generatedImages/rocket_gen_img_4c090952c-1788551006482.png","alt":"Felicity Solar 3KVA solar generator system with panels and battery bank"},{"src":"https://img.rocket.new/generatedImages/rocket_gen_img_1a1075541-1766961751312.png","alt":"Solar generator system installed in Nigerian home with inverter and battery setup"}]'::jsonb,
   'Complete 3KVA solar generator system for Nigerian homes and small businesses.', '2 Years System Warranty', 'in-stock'::public.availability_status, 'Complete System', true, 4.8, 15,
   '[{"label":"Inverter Rating","value":"3KVA / 2400W"},{"label":"Battery Capacity","value":"200Ah (included)"},{"label":"Solar Input","value":"Up to 400W"},{"label":"Output Voltage","value":"220V AC Pure Sine Wave"},{"label":"Backup Time","value":"6-10 hours (typical home load)"}]'::jsonb,
   ARRAY['solar generator','3kva','solar system','felicity','home solar','hybrid inverter','complete system'],
   ARRAY['100w-solar-panel','200ah-solar-battery','1kva-inverter'])
ON CONFLICT (id) DO NOTHING;

-- Admin user (password: EaglesTech2026!)
DO $$
DECLARE
  admin_uuid UUID;
BEGIN
  -- Check if admin already exists
  SELECT id INTO admin_uuid FROM auth.users WHERE email = 'admin@eaglestech.ng' LIMIT 1;

  IF admin_uuid IS NULL THEN
    admin_uuid := gen_random_uuid();

    INSERT INTO auth.users (
      id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
      confirmation_token, email_change, email_change_token_new, email_change_token_current,
      recovery_token, phone_change, phone_change_token,
      created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
      is_sso_user, is_anonymous
    ) VALUES (
      admin_uuid,
      '00000000-0000-0000-0000-000000000000',
      'authenticated',
      'authenticated',
      'admin@eaglestech.ng',
      crypt('EaglesTech2026!', gen_salt('bf', 10)),
      now(),
      '', '', '', '', '', '', '',
      now(), now(),
      jsonb_build_object('full_name', 'EaglesTech Admin', 'role', 'admin'),
      jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[], 'role', 'admin'),
      false, false
    );

    -- Insert companion identity row required for email/password sign-in
    INSERT INTO auth.identities (
      id,
      user_id,
      provider,
      provider_id,
      identity_data,
      last_sign_in_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      admin_uuid,
      'email',
      admin_uuid::TEXT,
      jsonb_build_object('sub', admin_uuid::TEXT, 'email', 'admin@eaglestech.ng'),
      now(),
      now(),
      now()
    );

    -- Create admin profile
    INSERT INTO public.user_profiles (id, email, full_name, avatar_url, role)
    VALUES (admin_uuid, 'admin@eaglestech.ng', 'EaglesTech Admin', '', 'admin'::public.user_role)
    ON CONFLICT (id) DO NOTHING;

  END IF;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Admin user creation skipped: %', SQLERRM;
END $$;
