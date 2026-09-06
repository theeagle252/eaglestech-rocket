'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Icon from '@/components/ui/AppIcon';
import { formatPrice } from '@/lib/data';
import { orderService } from '@/lib/supabaseService';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// ── Static chart data (analytics) ─────────────────────────────────────────────
const DAILY_REVENUE = [
  { day: 'Mon', revenue: 185000, orders: 12 },
  { day: 'Tue', revenue: 240000, orders: 18 },
  { day: 'Wed', revenue: 198000, orders: 14 },
  { day: 'Thu', revenue: 320000, orders: 24 },
  { day: 'Fri', revenue: 410000, orders: 31 },
  { day: 'Sat', revenue: 520000, orders: 38 },
  { day: 'Sun', revenue: 290000, orders: 22 },
];

const WEEKLY_REVENUE = [
  { week: 'Wk 1', revenue: 1820000, orders: 134 },
  { week: 'Wk 2', revenue: 2150000, orders: 158 },
  { week: 'Wk 3', revenue: 1980000, orders: 142 },
  { week: 'Wk 4', revenue: 2640000, orders: 192 },
];

const MONTHLY_REVENUE = [
  { month: 'Apr', revenue: 5200000 },
  { month: 'May', revenue: 6800000 },
  { month: 'Jun', revenue: 7400000 },
  { month: 'Jul', revenue: 6900000 },
  { month: 'Aug', revenue: 8200000 },
  { month: 'Sep', revenue: 9100000 },
];

const CUSTOMER_GROWTH = [
  { month: 'Apr', customers: 42 },
  { month: 'May', customers: 58 },
  { month: 'Jun', customers: 71 },
  { month: 'Jul', customers: 65 },
  { month: 'Aug', customers: 89 },
  { month: 'Sep', customers: 104 },
];

const TOP_PRODUCTS = [
  { name: 'iPhone 17 Pro Max', category: 'Smartphones', sold: 38, revenue: 15200000, trend: 'up' },
  { name: 'MacBook Air M4', category: 'Laptops', sold: 24, revenue: 14400000, trend: 'up' },
  { name: 'Samsung Galaxy S25', category: 'Smartphones', sold: 31, revenue: 9300000, trend: 'up' },
  { name: 'itel PowerTank 500W', category: 'Energy', sold: 19, revenue: 3610000, trend: 'up' },
  { name: 'AirPods Pro 3', category: 'Accessories', sold: 45, revenue: 4050000, trend: 'down' },
];

const LOW_STOCK_ITEMS = [
  { name: 'iPhone 17 Pro Max 256GB', category: 'Smartphones', stock: 2, threshold: 5 },
  { name: 'MacBook Air M4 8GB', category: 'Laptops', stock: 1, threshold: 3 },
  { name: 'Samsung 65W Charger', category: 'Accessories', stock: 3, threshold: 10 },
  { name: 'Solar Panel 200W Mono', category: 'Energy', stock: 4, threshold: 8 },
  { name: 'Casio FX-991EX', category: 'Calculators', stock: 2, threshold: 5 },
];

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-green-100 text-green-700',
  processing: 'bg-blue-100 text-blue-700',
  pending: 'bg-amber-100 text-amber-700',
  cancelled: 'bg-red-100 text-red-700',
};

type RevenueView = 'daily' | 'weekly' | 'monthly';

export default function AdminDashboardContent() {
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [revenueView, setRevenueView] = useState<RevenueView>('daily');
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [orderStatusData, setOrderStatusData] = useState([
    { name: 'Completed', value: 68, color: '#22c55e' },
    { name: 'Pending', value: 18, color: '#f59e0b' },
    { name: 'Processing', value: 10, color: '#3b82f6' },
    { name: 'Cancelled', value: 4, color: '#ef4444' },
  ]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Redirect non-admins
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.replace('/admin-login');
    }
  }, [isAdmin, authLoading, router]);

  // Load real orders from Supabase
  useEffect(() => {
    if (!isAdmin) return;
    const loadOrders = async () => {
      setOrdersLoading(true);
      try {
        const orders = await orderService.getAll();
        setRecentOrders(orders.slice(0, 10));

        // Compute real order status breakdown
        if (orders.length > 0) {
          const counts: Record<string, number> = { completed: 0, pending: 0, processing: 0, cancelled: 0 };
          orders.forEach((o: any) => { counts[o.status] = (counts[o.status] || 0) + 1; });
          const total = orders.length;
          setOrderStatusData([
            { name: 'Completed', value: Math.round((counts.completed / total) * 100), color: '#22c55e' },
            { name: 'Pending', value: Math.round((counts.pending / total) * 100), color: '#f59e0b' },
            { name: 'Processing', value: Math.round((counts.processing / total) * 100), color: '#3b82f6' },
            { name: 'Cancelled', value: Math.round((counts.cancelled / total) * 100), color: '#ef4444' },
          ]);
        }
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setOrdersLoading(false);
      }
    };
    loadOrders();
  }, [isAdmin]);

  const dailyTotal = DAILY_REVENUE.reduce((s, d) => s + d.revenue, 0);
  const weeklyTotal = WEEKLY_REVENUE.reduce((s, d) => s + d.revenue, 0);
  const totalOrders = DAILY_REVENUE.reduce((s, d) => s + d.orders, 0);
  const totalCustomers = CUSTOMER_GROWTH[CUSTOMER_GROWTH.length - 1].customers;
  const customerGrowthPct = Math.round(
    ((CUSTOMER_GROWTH[CUSTOMER_GROWTH.length - 1].customers - CUSTOMER_GROWTH[0].customers) /
      CUSTOMER_GROWTH[0].customers) * 100
  );

  const revenueData =
    revenueView === 'daily' ? DAILY_REVENUE.map(d => ({ label: d.day, revenue: d.revenue }))
    : revenueView === 'weekly' ? WEEKLY_REVENUE.map(d => ({ label: d.week, revenue: d.revenue }))
    : MONTHLY_REVENUE.map(d => ({ label: d.month, revenue: d.revenue }));

  if (authLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-background border-b border-border sticky top-0 z-10">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <Icon name="ArrowLeftIcon" size={18} />
              <span className="text-sm">Back to Site</span>
            </Link>
            <span className="text-muted-foreground/40">|</span>
            <h1 className="text-xl font-extrabold text-foreground">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/energy" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
              <span>⚡</span> Energy Admin
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Today's Revenue", value: formatPrice(dailyTotal), sub: '+12% vs yesterday', icon: 'CurrencyDollarIcon', color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Weekly Sales', value: formatPrice(weeklyTotal), sub: '+8% vs last week', icon: 'ChartBarIcon', color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Total Orders', value: String(recentOrders.length || totalOrders), sub: 'All time orders', icon: 'ShoppingBagIcon', color: 'text-purple-600', bg: 'bg-purple-50' },
            { label: 'Total Customers', value: String(totalCustomers), sub: `+${customerGrowthPct}% growth`, icon: 'UsersIcon', color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map(kpi => (
            <div key={kpi.label} className="bg-background rounded-2xl border border-border p-5 flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl ${kpi.bg} flex items-center justify-center shrink-0`}>
                <Icon name={kpi.icon as any} size={22} className={kpi.color} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-medium mb-0.5">{kpi.label}</p>
                <p className="text-xl font-extrabold text-foreground truncate">{kpi.value}</p>
                <p className="text-xs text-green-600 font-medium mt-0.5">{kpi.sub}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart + Order Status */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-background rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-bold text-foreground">Revenue Overview</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Sales performance over time</p>
              </div>
              <div className="flex items-center gap-1 bg-muted rounded-xl p-1">
                {(['daily', 'weekly', 'monthly'] as RevenueView[]).map(v => (
                  <button
                    key={v}
                    onClick={() => setRevenueView(v)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                      revenueView === v ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `₦${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(val: number) => [formatPrice(val), 'Revenue']} contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Area type="monotone" dataKey="revenue" stroke="#16a34a" strokeWidth={2.5} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 5, fill: '#16a34a' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-background rounded-2xl border border-border p-6">
            <h2 className="text-base font-bold text-foreground mb-1">Order Status</h2>
            <p className="text-xs text-muted-foreground mb-5">Breakdown of all orders</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {orderStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(val: number) => [`${val}%`, '']} contentStyle={{ borderRadius: '10px', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {orderStatusData.map(s => (
                <div key={s.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: s.color }} />
                    <span className="text-xs text-muted-foreground">{s.name}</span>
                  </div>
                  <span className="text-xs font-bold text-foreground">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Sales + Customer Growth */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-background rounded-2xl border border-border p-6">
            <h2 className="text-base font-bold text-foreground mb-1">Daily Sales (This Week)</h2>
            <p className="text-xs text-muted-foreground mb-5">Orders per day</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={DAILY_REVENUE} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Bar dataKey="orders" fill="#16a34a" radius={[6, 6, 0, 0]} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Daily Avg Revenue</p>
                <p className="text-sm font-bold text-foreground mt-0.5">{formatPrice(Math.round(dailyTotal / 7))}</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Daily Avg Orders</p>
                <p className="text-sm font-bold text-foreground mt-0.5">{Math.round(totalOrders / 7)} orders</p>
              </div>
            </div>
          </div>

          <div className="bg-background rounded-2xl border border-border p-6">
            <h2 className="text-base font-bold text-foreground mb-1">Customer Growth</h2>
            <p className="text-xs text-muted-foreground mb-5">New customers per month</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={CUSTOMER_GROWTH} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: 12 }} />
                <Line type="monotone" dataKey="customers" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 4 }} activeDot={{ r: 6 }} name="Customers" />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-muted/50 rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Total Customers</p>
                <p className="text-sm font-bold text-foreground mt-0.5">{totalCustomers}</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-3">
                <p className="text-xs text-muted-foreground">Growth Rate</p>
                <p className="text-sm font-bold text-green-600 mt-0.5">+{customerGrowthPct}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products + Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-background rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-foreground">Top Products</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Best sellers this week</p>
              </div>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">This Week</span>
            </div>
            <div className="space-y-3">
              {TOP_PRODUCTS.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                  <span className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.category} · {p.sold} sold</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-foreground">{formatPrice(p.revenue)}</p>
                    <div className={`flex items-center justify-end gap-0.5 text-xs font-medium ${p.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                      <Icon name={p.trend === 'up' ? 'ArrowUpIcon' : 'ArrowDownIcon'} size={12} />
                      {p.trend === 'up' ? 'Rising' : 'Falling'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-background rounded-2xl border border-border p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base font-bold text-foreground">Low Stock Alerts</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Items needing restock</p>
              </div>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                {LOW_STOCK_ITEMS.length} alerts
              </span>
            </div>
            <div className="space-y-3">
              {LOW_STOCK_ITEMS.map(item => {
                const pct = Math.round((item.stock / item.threshold) * 100);
                const isOut = item.stock === 0;
                const isCritical = item.stock <= 2;
                return (
                  <div key={item.name} className={`p-3 rounded-xl border ${isCritical ? 'border-red-200 bg-red-50/50' : 'border-amber-200 bg-amber-50/50'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.category}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${isOut ? 'bg-red-100 text-red-700' : isCritical ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        {isOut ? 'Out of Stock' : `${item.stock} left`}
                      </span>
                    </div>
                    <div className="w-full bg-white/60 rounded-full h-1.5">
                      <div className={`h-1.5 rounded-full transition-all ${isCritical ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Threshold: {item.threshold} units</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Orders — from Supabase */}
        <div className="bg-background rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-bold text-foreground">Recent Orders</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Latest orders from customers</p>
            </div>
            {ordersLoading && <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['Order #', 'Customer', 'Total', 'Method', 'Status', 'Date'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-muted-foreground pb-3 pr-4 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentOrders.length > 0 ? recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 pr-4 font-mono text-xs font-semibold text-primary">{order.order_number}</td>
                    <td className="py-3 pr-4 font-medium text-foreground whitespace-nowrap">{order.customer_name}</td>
                    <td className="py-3 pr-4 font-bold text-foreground whitespace-nowrap">{formatPrice(order.grand_total)}</td>
                    <td className="py-3 pr-4 text-xs text-muted-foreground capitalize">{order.delivery_method}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                      {ordersLoading ? 'Loading orders…' : 'No orders yet. Orders placed by customers will appear here.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Weekly Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {WEEKLY_REVENUE.map(w => (
            <div key={w.week} className="bg-background rounded-2xl border border-border p-4">
              <p className="text-xs text-muted-foreground font-medium">{w.week} Revenue</p>
              <p className="text-lg font-extrabold text-foreground mt-1">{formatPrice(w.revenue)}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{w.orders} orders</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
