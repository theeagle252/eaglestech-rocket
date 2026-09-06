// ─── CONFIGURABLE BUSINESS SETTINGS ───────────────────────────────────────────
// Edit these values to update business info without touching component code

export const BUSINESS_CONFIG = {
  name: 'EaglesTech',
  fullName: 'EaglesTech Global Technologies',
  tagline: 'Affordable Tech. Premium Experience.',
  whatsappNumber: '+2348000000000', // Replace with real number
  email: 'hello@eaglestech.ng',
  phone: '+234 800 000 0000',
  address: 'Ogun State, Nigeria',
  openingHours: 'Mon–Sat: 8am – 8pm | Sun: 10am – 5pm',
  currency: '₦',
  studentsCount: '100+'
};

// ─── PRODUCT CATEGORIES ────────────────────────────────────────────────────────
export const CATEGORIES = [
{
  id: 'smartphones',
  name: 'Smartphones',
  description: 'Latest and affordable smartphones for everyday use.',
  image: "https://images.unsplash.com/photo-1583291023438-41cef6453b1f",
  alt: 'Modern smartphone on clean white surface with vibrant display',
  count: 48
},
{
  id: 'laptops',
  name: 'Laptops',
  description: 'Laptops for students, professionals and productivity.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_13bf21a24-1764661260931.png",
  alt: 'Open laptop on desk with bright screen in modern office setting',
  count: 32
},
{
  id: 'accessories',
  name: 'Accessories',
  description: 'Chargers, cables, power banks, earphones and cases.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_12466103e-1786111397904.png",
  alt: 'Collection of tech accessories including earbuds and charging cables',
  count: 120
},
{
  id: 'gadgets',
  name: 'Gadgets',
  description: 'Useful technology and smart gadgets for daily life.',
  image: "https://images.unsplash.com/photo-1628911772787-0192e81cdaa7",
  alt: 'Smartwatch and tech gadgets arranged on dark surface',
  count: 24
},
{
  id: 'gaming',
  name: 'Gaming',
  description: 'Gaming consoles and accessories for serious players.',
  image: "https://images.unsplash.com/photo-1616341317041-cf93b2389ef5",
  alt: 'Gaming controller with dramatic lighting on dark background',
  count: 18
},
{
  id: 'calculators',
  name: 'Calculators',
  description: 'Scientific calculators and student tech essentials.',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1e168df77-1767450214122.png",
  alt: 'Scientific calculator on student desk with notebooks and pens',
  count: 15
},
{
  id: 'energy',
  name: 'Energy & Power',
  description: 'Solar panels, inverters, power stations and backup solutions.',
  image: "https://images.unsplash.com/photo-1632884943447-474061c1ea63",
  alt: 'Solar panels on rooftop with bright blue sky and sunlight',
  count: 0
}];


// ─── FEATURED PRODUCTS ─────────────────────────────────────────────────────────
export const FEATURED_PRODUCTS = [
{
  id: 'iphone-17-pro-max',
  name: 'iPhone 17 Pro Max',
  brand: 'Apple',
  category: 'smartphones',
  price: 1850000,
  originalPrice: 2100000,
  discount: 12,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_17b82fb7a-1772960574407.png",
  alt: 'iPhone 17 Pro Max in titanium finish on reflective surface with dark background',
  rating: 4.9,
  reviews: 47,
  inStock: true,
  badge: 'New',
  featured: true
},
{
  id: 'samsung-galaxy-s25-ultra',
  name: 'Samsung Galaxy S25 Ultra',
  brand: 'Samsung',
  category: 'smartphones',
  price: 1450000,
  originalPrice: 1600000,
  discount: 9,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1294d2923-1771486444013.png",
  alt: 'Samsung Galaxy S25 Ultra with S-Pen on dark gradient background',
  rating: 4.8,
  reviews: 63,
  inStock: true,
  badge: 'Hot',
  featured: true
},
{
  id: 'macbook-air-m3',
  name: 'MacBook Air M3',
  brand: 'Apple',
  category: 'laptops',
  price: 1950000,
  originalPrice: 2200000,
  discount: 11,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1230ca14e-1772228321576.png",
  alt: 'MacBook Air M3 open on minimalist desk in bright natural light',
  rating: 4.9,
  reviews: 29,
  inStock: true,
  badge: 'Best Seller',
  featured: true
},
{
  id: 'oraimo-freepods-4',
  name: 'Oraimo FreePods 4',
  brand: 'Oraimo',
  category: 'accessories',
  price: 28500,
  originalPrice: 35000,
  discount: 19,
  image: "https://images.unsplash.com/photo-1727174659485-0567349669d2",
  alt: 'White wireless earbuds with charging case on clean light background',
  rating: 4.6,
  reviews: 112,
  inStock: true,
  badge: 'Popular',
  featured: true
},
{
  id: 'dell-inspiron-15',
  name: 'Dell Inspiron 15',
  brand: 'Dell',
  category: 'laptops',
  price: 680000,
  originalPrice: 750000,
  discount: 9,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_13dd29d5e-1784648778249.png",
  alt: 'Dell Inspiron laptop open on student desk with books and notebook',
  rating: 4.5,
  reviews: 38,
  inStock: true,
  badge: 'Student Pick',
  featured: true
},
{
  id: 'anker-powerbank-20000',
  name: 'Anker PowerCore 20000',
  brand: 'Anker',
  category: 'accessories',
  price: 45000,
  originalPrice: null,
  discount: 0,
  image: "https://images.unsplash.com/photo-1563896716604-f949b1522097",
  alt: 'Black portable power bank with charging cables on white background',
  rating: 4.7,
  reviews: 85,
  inStock: true,
  badge: null,
  featured: true
},
{
  id: 'casio-fx-991ex',
  name: 'Casio FX-991EX Classwiz',
  brand: 'Casio',
  category: 'calculators',
  price: 18500,
  originalPrice: 22000,
  discount: 16,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_188022dbe-1785967224430.png",
  alt: 'Casio scientific calculator on student notebook in bright classroom',
  rating: 4.8,
  reviews: 156,
  inStock: true,
  badge: 'Exam Essential',
  featured: true
},
{
  id: 'xiaomi-redmi-note-13',
  name: 'Xiaomi Redmi Note 13 Pro',
  brand: 'Xiaomi',
  category: 'smartphones',
  price: 285000,
  originalPrice: 320000,
  discount: 11,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ba6bbe58-1772382695993.png",
  alt: 'Xiaomi Redmi Note 13 Pro in blue showing camera array on back',
  rating: 4.5,
  reviews: 74,
  inStock: true,
  badge: 'Value Pick',
  featured: true
}];


// ─── SHOP PRODUCTS (Extended) ──────────────────────────────────────────────────
export const ALL_PRODUCTS = [
...FEATURED_PRODUCTS,
{
  id: 'samsung-galaxy-a55',
  name: 'Samsung Galaxy A55',
  brand: 'Samsung',
  category: 'smartphones',
  price: 385000,
  originalPrice: 420000,
  discount: 8,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1d2e6e219-1772429765169.png",
  alt: 'Samsung Galaxy A55 in lavender color on gradient background',
  rating: 4.4,
  reviews: 52,
  inStock: true,
  badge: null,
  featured: false
},
{
  id: 'hp-pavilion-15',
  name: 'HP Pavilion 15',
  brand: 'HP',
  category: 'laptops',
  price: 595000,
  originalPrice: 650000,
  discount: 8,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_13969e3a2-1772638686979.png",
  alt: 'HP Pavilion 15 laptop on clean white desk in bright room',
  rating: 4.3,
  reviews: 31,
  inStock: true,
  badge: null,
  featured: false
},
{
  id: 'jbl-tune-760nc',
  name: 'JBL Tune 760NC',
  brand: 'JBL',
  category: 'accessories',
  price: 62000,
  originalPrice: 75000,
  discount: 17,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f1da1ceb-1767898618110.png",
  alt: 'JBL Tune 760NC wireless headphones in blue on white background',
  rating: 4.6,
  reviews: 43,
  inStock: true,
  badge: null,
  featured: false
},
{
  id: 'ps5-slim',
  name: 'PlayStation 5 Slim',
  brand: 'Sony',
  category: 'gaming',
  price: 780000,
  originalPrice: null,
  discount: 0,
  image: "https://images.unsplash.com/photo-1731405816630-ee493e354b5d",
  alt: 'PlayStation 5 Slim console in white on dark dramatic background',
  rating: 4.9,
  reviews: 28,
  inStock: false,
  badge: 'Coming Soon',
  featured: false
}];


// ─── ENERGY & POWER SOLUTIONS SUBCATEGORIES ───────────────────────────────────
export const ENERGY_SUBCATEGORIES = [
{ id: 'all', name: 'All Products' },
{ id: 'power-stations', name: 'Power Stations' },
{ id: 'solar-panels', name: 'Solar Panels' },
{ id: 'inverters', name: 'Inverters' },
{ id: 'batteries', name: 'Batteries' },
{ id: 'solar-generators', name: 'Solar Generators' },
{ id: 'rechargeable-fans', name: 'Rechargeable Fans' },
{ id: 'rechargeable-lamps', name: 'Rechargeable Lamps' },
{ id: 'power-banks', name: 'Power Banks' },
{ id: 'solar-accessories', name: 'Solar Accessories' },
{ id: 'dc-appliances', name: 'DC Appliances' },
{ id: 'cables-connectors', name: 'Cables & Connectors' }];


// ─── ENERGY PRODUCT TYPE ──────────────────────────────────────────────────────
export interface EnergyProduct {
  id: string;
  name: string;
  brand: string;
  model: string;
  subcategory: string;
  price: number;
  originalPrice: number | null;
  discount: number;
  images: {src: string;alt: string;}[];
  description: string;
  warranty: string;
  availability: 'in-stock' | 'low-stock' | 'out-of-stock' | 'coming-soon';
  badge: string | null;
  featured: boolean;
  rating: number;
  reviews: number;
  specs: {label: string;value: string;}[];
  searchKeywords: string[];
  relatedIds: string[];
}

// ─── ENERGY PRODUCTS DATA ─────────────────────────────────────────────────────
export const ENERGY_PRODUCTS: EnergyProduct[] = [
{
  id: 'itel-powertank-100w',
  name: 'itel PowerTank 100W Portable Station',
  brand: 'itel',
  model: 'PowerTank PT-100',
  subcategory: 'power-stations',
  price: 185000,
  originalPrice: 220000,
  discount: 16,
  images: [
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_1e503fc20-1764871052167.png", alt: 'itel PowerTank 100W portable power station with multiple output ports on white background' },
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_4ad579b09-1788551006074.png", alt: 'itel PowerTank 100W power station charging a laptop and phone simultaneously' }],

  description: 'The itel PowerTank 100W is a compact portable power station designed for Nigerian homes and outdoor use. Keep your devices, fans, and lights running during power outages with 100W continuous output and a 256Wh LiFePO4 battery.',
  warranty: '1 Year Manufacturer Warranty',
  availability: 'in-stock',
  badge: 'Best Seller',
  featured: true,
  rating: 4.7,
  reviews: 34,
  specs: [
  { label: 'Capacity', value: '256Wh (71,111mAh)' },
  { label: 'Output Wattage', value: '100W continuous / 200W peak' },
  { label: 'Battery Type', value: 'LiFePO4 (Lithium Iron Phosphate)' },
  { label: 'Solar Input', value: 'Up to 60W (MC4 connector)' },
  { label: 'AC Charging Time', value: '~3 hours' },
  { label: 'AC Outlets', value: '1 × 100W AC' },
  { label: 'USB Ports', value: '2 × USB-A, 1 × USB-C 45W PD' },
  { label: 'DC Output', value: '12V/10A car port' },
  { label: 'Weight', value: '2.8 kg' },
  { label: 'Dimensions', value: '260 × 170 × 195 mm' }],

  searchKeywords: ['itel', 'powertank', 'portable power station', 'backup power', 'power outage', 'lifepo4'],
  relatedIds: ['100w-solar-panel', 'solar-charge-controller-20a', 'rechargeable-fan-16inch']
},
{
  id: '100w-solar-panel',
  name: '100W Monocrystalline Solar Panel',
  brand: 'Felicity Solar',
  model: 'FS-M100W',
  subcategory: 'solar-panels',
  price: 65000,
  originalPrice: 78000,
  discount: 17,
  images: [
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_1e81d969f-1774267330911.png", alt: 'Monocrystalline solar panel on rooftop with bright blue sky and sunlight' },
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_18370b9c4-1767450362454.png", alt: 'Close-up of solar panel cells showing monocrystalline structure in sunlight' }],

  description: 'High-efficiency 100W monocrystalline solar panel with 21% efficiency rating. Ideal for home solar systems, portable power stations, and off-grid setups. Built to withstand Nigerian weather conditions.',
  warranty: '10 Years Product Warranty / 25 Years Performance Warranty',
  availability: 'in-stock',
  badge: 'Popular',
  featured: true,
  rating: 4.8,
  reviews: 52,
  specs: [
  { label: 'Wattage', value: '100W' },
  { label: 'Panel Type', value: 'Monocrystalline' },
  { label: 'Efficiency', value: '21%' },
  { label: 'Open Circuit Voltage (Voc)', value: '22.5V' },
  { label: 'Short Circuit Current (Isc)', value: '5.83A' },
  { label: 'Max Power Voltage (Vmp)', value: '18.9V' },
  { label: 'Max Power Current (Imp)', value: '5.29A' },
  { label: 'Dimensions', value: '1050 × 670 × 35 mm' },
  { label: 'Weight', value: '7.5 kg' },
  { label: 'Frame', value: 'Anodized Aluminium Alloy' },
  { label: 'Connector', value: 'MC4' }],

  searchKeywords: ['solar panel', 'monocrystalline', '100w', 'felicity', 'solar energy', 'off-grid'],
  relatedIds: ['solar-charge-controller-20a', 'itel-powertank-100w', '200ah-solar-battery']
},
{
  id: '1kva-inverter',
  name: '1KVA Pure Sine Wave Inverter',
  brand: 'Luminous',
  model: 'Eco Volt Neo 1050',
  subcategory: 'inverters',
  price: 95000,
  originalPrice: 115000,
  discount: 17,
  images: [
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_114a6e210-1786021548979.png", alt: 'Luminous 1KVA pure sine wave inverter unit on white background showing front panel' },
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_16e8282ac-1778658398891.png", alt: 'Inverter connected to battery bank in home setup with cables' }],

  description: 'The Luminous Eco Volt Neo 1050 is a reliable 1KVA pure sine wave inverter perfect for Nigerian homes. Powers fans, lights, TVs, and small appliances during NEPA outages. Compatible with all battery types.',
  warranty: '2 Years Manufacturer Warranty',
  availability: 'in-stock',
  badge: 'Top Rated',
  featured: true,
  rating: 4.6,
  reviews: 41,
  specs: [
  { label: 'Power Rating', value: '1KVA / 800W' },
  { label: 'Input Voltage', value: '12V DC' },
  { label: 'Output Voltage', value: '220–240V AC' },
  { label: 'Wave Type', value: 'Pure Sine Wave' },
  { label: 'Output Frequency', value: '50Hz' },
  { label: 'Battery Compatibility', value: 'Lead Acid, Tubular, Lithium' },
  { label: 'Charging Current', value: '10A' },
  { label: 'Efficiency', value: '>85%' },
  { label: 'Overload Protection', value: 'Yes' },
  { label: 'Short Circuit Protection', value: 'Yes' }],

  searchKeywords: ['inverter', '1kva', 'luminous', 'pure sine wave', 'power backup', 'nepa', 'home inverter'],
  relatedIds: ['200ah-solar-battery', '100w-solar-panel', 'solar-charge-controller-20a']
},
{
  id: '200ah-solar-battery',
  name: '200Ah Tubular Solar Battery',
  brand: 'Luminous',
  model: 'Red Charge RC 25000',
  subcategory: 'batteries',
  price: 145000,
  originalPrice: 165000,
  discount: 12,
  images: [
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_169e68a1b-1778148573861.png", alt: 'Luminous 200Ah tubular battery on white background showing terminals and label' },
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_16e8282ac-1778658398891.png", alt: 'Solar battery bank connected to inverter system in home installation' }],

  description: 'The Luminous Red Charge 200Ah tubular battery is engineered for deep-cycle solar applications. With superior charge acceptance and long service life, it is the ideal companion for your home solar or inverter system.',
  warranty: '3 Years Manufacturer Warranty',
  availability: 'in-stock',
  badge: null,
  featured: false,
  rating: 4.5,
  reviews: 29,
  specs: [
  { label: 'Capacity', value: '200Ah at C20' },
  { label: 'Battery Type', value: 'Tubular Flooded Lead Acid' },
  { label: 'Voltage', value: '12V' },
  { label: 'Technology', value: 'Tall Tubular' },
  { label: 'Charge Current (Max)', value: '20A' },
  { label: 'Self Discharge', value: '<3% per month' },
  { label: 'Cycle Life', value: '1500+ cycles at 80% DoD' },
  { label: 'Weight', value: '62 kg' },
  { label: 'Dimensions', value: '505 × 191 × 410 mm' }],

  searchKeywords: ['battery', 'tubular battery', '200ah', 'luminous', 'solar battery', 'inverter battery', 'deep cycle'],
  relatedIds: ['1kva-inverter', '100w-solar-panel', 'solar-charge-controller-20a']
},
{
  id: 'solar-charge-controller-20a',
  name: '20A MPPT Solar Charge Controller',
  brand: 'Epever',
  model: 'Tracer 2210AN',
  subcategory: 'solar-accessories',
  price: 28500,
  originalPrice: 35000,
  discount: 19,
  images: [
  { src: "https://images.unsplash.com/photo-1662340696153-ebc6941a0b4b", alt: 'Epever MPPT solar charge controller mounted on wall with display showing charging status' },
  { src: "https://images.unsplash.com/photo-1677545468789-2ebf6cb2b6ff", alt: 'Solar charge controller connected to solar panel and battery bank in off-grid system' }],

  description: 'The Epever Tracer 2210AN is a 20A MPPT solar charge controller with advanced maximum power point tracking for up to 30% more energy harvest compared to PWM controllers. Features LCD display and RS485 communication.',
  warranty: '1 Year Manufacturer Warranty',
  availability: 'in-stock',
  badge: 'MPPT',
  featured: false,
  rating: 4.7,
  reviews: 18,
  specs: [
  { label: 'Type', value: 'MPPT (Maximum Power Point Tracking)' },
  { label: 'Rated Charge Current', value: '20A' },
  { label: 'System Voltage', value: '12V / 24V Auto' },
  { label: 'Max Solar Input', value: '260W (12V) / 520W (24V)' },
  { label: 'Max PV Open Circuit Voltage', value: '100V' },
  { label: 'MPPT Efficiency', value: '>99.5%' },
  { label: 'Self Consumption', value: '<6mA' },
  { label: 'Display', value: 'LCD with backlight' },
  { label: 'Communication', value: 'RS485' },
  { label: 'Operating Temperature', value: '-25°C to 55°C' }],

  searchKeywords: ['charge controller', 'mppt', 'solar controller', 'epever', '20a', 'solar accessories'],
  relatedIds: ['100w-solar-panel', '200ah-solar-battery', '1kva-inverter']
},
{
  id: 'rechargeable-fan-16inch',
  name: '16-Inch Rechargeable Standing Fan',
  brand: 'Binatone',
  model: 'StandFan RF-1600',
  subcategory: 'rechargeable-fans',
  price: 42000,
  originalPrice: 52000,
  discount: 19,
  images: [
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_1a85a6358-1768702746968.png", alt: 'Binatone 16-inch rechargeable standing fan in white on clean background' },
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_476d6aff3-1788551006982.png", alt: 'Rechargeable fan in use in a Nigerian home during power outage' }],

  description: 'Stay cool during power outages with the Binatone 16-inch rechargeable standing fan. Up to 8 hours of operation on a single charge, 3-speed settings, and a built-in LED light for added convenience.',
  warranty: '1 Year Manufacturer Warranty',
  availability: 'in-stock',
  badge: 'Hot Pick',
  featured: true,
  rating: 4.5,
  reviews: 67,
  specs: [
  { label: 'Blade Size', value: '16 inches' },
  { label: 'Battery Capacity', value: '12V / 7Ah Lead Acid' },
  { label: 'Runtime', value: 'Up to 8 hours (low speed)' },
  { label: 'Charging Time', value: '6–8 hours' },
  { label: 'Speed Settings', value: '3 (Low / Medium / High)' },
  { label: 'Built-in Light', value: 'Yes (LED)' },
  { label: 'Remote Control', value: 'Yes' },
  { label: 'AC/DC Operation', value: 'Yes (works on both)' },
  { label: 'Height', value: 'Adjustable 100–130 cm' }],

  searchKeywords: ['rechargeable fan', 'standing fan', 'binatone', '16 inch', 'power outage fan', 'battery fan'],
  relatedIds: ['itel-powertank-100w', 'rechargeable-lamp-solar', '100w-solar-panel']
},
{
  id: 'rechargeable-lamp-solar',
  name: 'Solar Rechargeable LED Lamp',
  brand: 'Jackery',
  model: 'SolarLamp SL-200',
  subcategory: 'rechargeable-lamps',
  price: 12500,
  originalPrice: 16000,
  discount: 22,
  images: [
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_406f63efa-1788551006916.png", alt: 'Solar rechargeable LED lamp glowing on table in dark room' },
  { src: "https://images.unsplash.com/photo-1662601311129-a288e9db505c", alt: 'Solar lamp with small solar panel charging outdoors in sunlight' }],

  description: 'Bright, portable solar rechargeable LED lamp with built-in solar panel. Charges via sunlight or USB. Perfect for students, homes, and outdoor use. Up to 12 hours of light on a full charge.',
  warranty: '6 Months Warranty',
  availability: 'in-stock',
  badge: 'Budget Pick',
  featured: false,
  rating: 4.3,
  reviews: 88,
  specs: [
  { label: 'Light Output', value: '200 lumens' },
  { label: 'Battery', value: '2000mAh Li-ion' },
  { label: 'Solar Panel', value: 'Built-in 1W monocrystalline' },
  { label: 'Charging', value: 'Solar or USB-C' },
  { label: 'Runtime', value: 'Up to 12 hours (low mode)' },
  { label: 'Light Modes', value: '3 (High / Low / Flash)' },
  { label: 'IP Rating', value: 'IP44 (splash-proof)' },
  { label: 'Weight', value: '280g' }],

  searchKeywords: ['solar lamp', 'rechargeable lamp', 'led lamp', 'solar light', 'emergency light', 'jackery'],
  relatedIds: ['rechargeable-fan-16inch', 'itel-powertank-100w', 'solar-charge-controller-20a']
},
{
  id: '3kva-solar-generator',
  name: '3KVA Solar Generator System',
  brand: 'Felicity Solar',
  model: 'SolarGen 3000',
  subcategory: 'solar-generators',
  price: 850000,
  originalPrice: 980000,
  discount: 13,
  images: [
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_4c090952c-1788551006482.png", alt: 'Felicity Solar 3KVA solar generator system with panels and battery bank' },
  { src: "https://img.rocket.new/generatedImages/rocket_gen_img_1a1075541-1766961751312.png", alt: 'Solar generator system installed in Nigerian home with inverter and battery setup' }],

  description: 'Complete 3KVA solar generator system for Nigerian homes and small businesses. Includes 3KVA hybrid inverter, 200Ah battery bank, and 400W solar input capability. Eliminate generator noise and fuel costs.',
  warranty: '2 Years System Warranty',
  availability: 'in-stock',
  badge: 'Complete System',
  featured: true,
  rating: 4.8,
  reviews: 15,
  specs: [
  { label: 'Inverter Rating', value: '3KVA / 2400W' },
  { label: 'Battery Capacity', value: '200Ah (included)' },
  { label: 'Solar Input', value: 'Up to 400W' },
  { label: 'Output Voltage', value: '220V AC Pure Sine Wave' },
  { label: 'Grid/Generator Charging', value: 'Yes (hybrid)' },
  { label: 'Battery Type', value: 'Tubular Lead Acid' },
  { label: 'Backup Time', value: '6–10 hours (typical home load)' },
  { label: 'Expandable', value: 'Yes (add more panels/batteries)' }],

  searchKeywords: ['solar generator', '3kva', 'solar system', 'felicity', 'home solar', 'hybrid inverter', 'complete system'],
  relatedIds: ['100w-solar-panel', '200ah-solar-battery', '1kva-inverter']
}];


// ─── HERO STAGE PRODUCTS ───────────────────────────────────────────────────────
export const STAGE_PRODUCTS = [
{
  id: 'iphone-17-pro-max',
  name: 'iPhone 17 Pro Max',
  brand: 'Apple',
  price: 1850000,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_17b82fb7a-1772960574407.png",
  alt: 'iPhone 17 Pro Max titanium finish on dark reflective surface with dramatic studio lighting',
  tag: 'Just Arrived',
  tagColor: 'accent',
  description: 'Titanium. Powerful. Beautiful.'
},
{
  id: 'oraimo-freepods-4',
  name: 'Oraimo FreePods 4',
  brand: 'Oraimo',
  price: 28500,
  image: "https://images.unsplash.com/photo-1585155784229-aff921ccfa10",
  alt: 'Oraimo FreePods 4 wireless earbuds floating in air against clean white background',
  tag: 'Student Fave',
  tagColor: 'primary',
  description: 'Crystal clear audio. All day comfort.'
},
{
  id: 'macbook-air-m3',
  name: 'MacBook Air M3',
  brand: 'Apple',
  price: 1950000,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1230ca14e-1772228321576.png",
  alt: 'MacBook Air M3 open on minimalist desk showing bright display in natural light',
  tag: 'Best Seller',
  tagColor: 'accent',
  description: 'Impossibly thin. Unbelievably powerful.'
},
{
  id: 'samsung-galaxy-s25-ultra',
  name: 'Samsung Galaxy S25 Ultra',
  brand: 'Samsung',
  price: 1450000,
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1294d2923-1771486444013.png",
  alt: 'Samsung Galaxy S25 Ultra in phantom black showing S-Pen and camera system',
  tag: 'Hot Deal',
  tagColor: 'primary',
  description: 'AI-powered. Built for creators.'
}];


// ─── TESTIMONIALS ──────────────────────────────────────────────────────────────
export const TESTIMONIALS = [
{
  id: 1,
  name: 'Adaeze Okonkwo',
  role: '300L Engineering Student, FUNAAB',
  avatar: 'https://i.pravatar.cc/100?img=47',
  rating: 5,
  text: 'I bought my Casio FX-991EX just before my exams and it arrived the same day. EaglesTech saved me! The price was way better than any other shop on campus.'
},
{
  id: 2,
  name: 'Tunde Fashola',
  role: 'Young Professional, Abeokuta',
  avatar: 'https://i.pravatar.cc/100?img=12',
  rating: 5,
  text: 'They helped me pick the right laptop for my design work within my budget. Honest advice, no pressure. My MacBook Air arrived in perfect condition.'
},
{
  id: 3,
  name: 'Chisom Eze',
  role: '200L Computer Science, MAPOLY',
  avatar: 'https://i.pravatar.cc/100?img=32',
  rating: 5,
  text: 'My phone screen cracked and they fixed it within 2 hours. Professional service, genuine parts. EaglesTech is my go-to for anything tech.'
}];


// ─── TRUST FEATURES ────────────────────────────────────────────────────────────
export const TRUST_FEATURES = [
{
  icon: 'ShieldCheckIcon',
  title: 'Quality Products',
  description: 'Reliable technology products selected with customers in mind.'
},
{
  icon: 'ChatBubbleLeftRightIcon',
  title: 'Expert Support',
  description: 'Get help choosing, setting up or troubleshooting your devices.'
},
{
  icon: 'WrenchScrewdriverIcon',
  title: 'Reliable Repairs',
  description: 'Professional device repair and technical assistance.'
},
{
  icon: 'TruckIcon',
  title: 'Easy Ordering',
  description: 'Browse online and order conveniently with fast delivery.'
}];


// ─── REPAIR CATEGORIES ─────────────────────────────────────────────────────────
export const REPAIR_CATEGORIES = [
{ id: 'screen', name: 'Screen Problems', icon: 'DevicePhoneMobileIcon' },
{ id: 'battery', name: 'Battery Issues', icon: 'BoltIcon' },
{ id: 'charging', name: 'Charging Problems', icon: 'BoltIcon' },
{ id: 'software', name: 'Software Issues', icon: 'CpuChipIcon' },
{ id: 'diagnostics', name: 'Phone Diagnostics', icon: 'MagnifyingGlassIcon' },
{ id: 'general', name: 'General Faults', icon: 'WrenchScrewdriverIcon' }];


// ─── FORMAT HELPERS ────────────────────────────────────────────────────────────
export function formatPrice(amount: number): string {
  return `₦${amount.toLocaleString('en-NG')}`;
}

export function getWhatsAppLink(message?: string): string {
  const number = BUSINESS_CONFIG.whatsappNumber.replace('+', '');
  const text = message || `Hello EaglesTech, I'd like to get more information.`;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function getAvailabilityLabel(availability: EnergyProduct['availability']): {label: string;color: string;} {
  switch (availability) {
    case 'in-stock':return { label: 'In Stock', color: 'text-green-600' };
    case 'low-stock':return { label: 'Low Stock', color: 'text-amber-600' };
    case 'out-of-stock':return { label: 'Out of Stock', color: 'text-red-500' };
    case 'coming-soon':return { label: 'Coming Soon', color: 'text-blue-500' };
  }
}