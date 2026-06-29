import { productsData } from '@/constants/products';
import { fetchDashboardData } from '@/services/api';
import { productService } from '@/services/productService';

export interface SearchResult {
  id: string;
  title: string;
  module: string;
  description: string;
  url: string;
  iconName: string; // We'll map this to a Lucide icon in the component
}

// Statically defined modules/pages for global search
const STATIC_MODULES: SearchResult[] = [
  { id: 'dashboard', title: 'Dashboard', module: 'Main', description: 'Overview and analytics', url: '/admin/dashboard', iconName: 'Home' },
  { id: 'products', title: 'Products', module: 'Main', description: 'Manage store products', url: '/admin/products', iconName: 'Package' },
  { id: 'categories', title: 'Categories', module: 'Main', description: 'Product categories', url: '/admin/categories', iconName: 'Tag' },
  { id: 'orders', title: 'Orders', module: 'Main', description: 'View and manage orders', url: '/admin/orders', iconName: 'ShoppingCart' },
  { id: 'customers', title: 'Customers', module: 'Main', description: 'Customer directory and details', url: '/admin/customers', iconName: 'Users' },
  { id: 'inventory', title: 'Inventory', module: 'Main', description: 'Stock management', url: '/admin/inventory', iconName: 'Box' },
  { id: 'analytics', title: 'Analytics', module: 'Growth', description: 'Store performance metrics', url: '/admin/analytics', iconName: 'BarChart2' },
  { id: 'coupons', title: 'Coupons', module: 'Growth', description: 'Discount codes and promotions', url: '/admin/coupons', iconName: 'Percent' },
  { id: 'marketing', title: 'Marketing', module: 'Growth', description: 'Marketing campaigns', url: '/admin/marketing', iconName: 'Megaphone' },
  { id: 'reviews', title: 'Reviews', module: 'Growth', description: 'Customer reviews and ratings', url: '/admin/reviews', iconName: 'Star' },
  { id: 'social-media', title: 'Social Media', module: 'Content', description: 'Manage social links', url: '/admin/content?tab=social', iconName: 'Share2' },
  { id: 'hero-section', title: 'Hero Section', module: 'Content', description: 'Edit homepage hero banner', url: '/admin/content?tab=hero', iconName: 'Image' },
  { id: 'about', title: 'About Us', module: 'Content', description: 'Edit about page content', url: '/admin/content?tab=about', iconName: 'FileText' },
  { id: 'why-choose-us', title: 'Why Choose Us', module: 'Content', description: 'Edit store benefits', url: '/admin/content?tab=features', iconName: 'ShieldCheck' },
  { id: 'settings', title: 'Settings', module: 'System', description: 'Admin preferences and configuration', url: '/admin/settings', iconName: 'Settings' },
  { id: 'users', title: 'Users', module: 'System', description: 'Manage admin users', url: '/admin/users', iconName: 'UserCog' },
  { id: 'notifications', title: 'Notifications', module: 'System', description: 'View all alerts and notifications', url: '/admin/dashboard', iconName: 'Bell' },
];

export const searchService = {
  // Simulates fuzzy matching logic
  fuzzyMatch: (query: string, target: string): boolean => {
    if (!query) return true;
    if (!target) return false;
    const q = query.toLowerCase().replace(/\s+/g, '');
    const t = target.toLowerCase();
    
    // Exact partial match is prioritized
    if (t.includes(q)) return true;
    if (t.includes(query.toLowerCase())) return true;
    
    // Fuzzy match (characters in sequence)
    let qIdx = 0;
    for (let i = 0; i < t.length && qIdx < q.length; i++) {
      if (t[i] === q[qIdx]) {
        qIdx++;
      }
    }
    return qIdx === q.length;
  },

  searchGlobal: async (query: string, activeFilter: string = 'All'): Promise<SearchResult[]> => {
    const results: SearchResult[] = [];
    const q = query ? query.toLowerCase() : '';

    const matchesFilter = (moduleName: string) => {
      if (activeFilter === 'All') return true;
      if (activeFilter === 'System' && (moduleName === 'System' || moduleName === 'Dashboard')) return true;
      if (activeFilter === 'Content' && moduleName === 'Content') return true;
      return moduleName === activeFilter;
    };

    // 1. Search Static Modules
    STATIC_MODULES.forEach(module => {
      if (!matchesFilter(module.module)) return;
      if (
        searchService.fuzzyMatch(q, module.title) ||
        searchService.fuzzyMatch(q, module.description) ||
        searchService.fuzzyMatch(q, module.module)
      ) {
        results.push(module);
      }
    });

    // 2. Search Products
    try {
      if (matchesFilter('Products')) {
        const products = await productService.getProducts();
        products.forEach(p => {
          if (
            searchService.fuzzyMatch(q, p.name) ||
            searchService.fuzzyMatch(q, p.category) ||
            searchService.fuzzyMatch(q, p.tag || '') ||
            searchService.fuzzyMatch(q, `SKU: ${p.id}`)
          ) {
            results.push({
              id: `prod-${p.id}`,
              title: p.name,
              module: 'Products',
              description: `SKU: PRD-${p.id.padStart(4, '0')} • ${p.category} • ₹${p.price}`,
              url: `/admin/products?search=${p.id}`,
              iconName: 'Package'
            });
          }
        });
      }
    } catch (e) {
      console.error(e);
    }

    // 3. Search Dashboard Data (Orders, Customers from Orders, Activities, etc.)
    try {
      // For this global search we fetch general recent data
      const dashboard = await fetchDashboardData('This Month');
      
      // Orders & Customers
      if (matchesFilter('Orders') || matchesFilter('Customers')) {
        dashboard.orders.forEach(order => {
          if (
            searchService.fuzzyMatch(q, `order #${order.id}`) ||
            searchService.fuzzyMatch(q, order.customer) ||
            searchService.fuzzyMatch(q, order.status) ||
            searchService.fuzzyMatch(q, order.id.toString())
          ) {
            // Add Order match
            if (matchesFilter('Orders')) {
              results.push({
                id: `ord-${order.id}`,
                title: `Order #${order.id}`,
                module: 'Orders',
                description: `Customer: ${order.customer} • Status: ${order.status}`,
                url: `/admin/orders?search=${order.id}`,
                iconName: 'ShoppingCart'
              });
            }

            // Add Customer match if customer name matches
            if (matchesFilter('Customers') && searchService.fuzzyMatch(q, order.customer)) {
              // Avoid duplicate customers simply
              const custId = `cust-${order.customer.replace(/\s+/g, '-').toLowerCase()}`;
              if (!results.find(r => r.id === custId)) {
                results.push({
                  id: custId,
                  title: order.customer,
                  module: 'Customers',
                  description: `Customer Profile`,
                  url: `/admin/customers?search=${encodeURIComponent(order.customer)}`,
                  iconName: 'User'
                });
              }
            }
          }
        });
      }

      // Categories from Dashboard Sales
      if (matchesFilter('Categories')) {
        dashboard.salesByCategory.forEach(cat => {
          if (searchService.fuzzyMatch(q, cat.name)) {
            results.push({
              id: `cat-db-${cat.name}`,
              title: cat.name,
              module: 'Categories',
              description: `Category Analytics`,
              url: `/admin/categories?search=${encodeURIComponent(cat.name)}`,
              iconName: 'Tag'
            });
          }
        });
      }

      // Activities/Reviews/Alerts
      dashboard.activities.forEach((act, idx) => {
        const typeMap: Record<string, { module: string, icon: string, url: string }> = {
          'review': { module: 'Reviews', icon: 'Star', url: '/admin/reviews' },
          'order': { module: 'Orders', icon: 'ShoppingCart', url: '/admin/orders' },
          'alert': { module: 'Inventory', icon: 'AlertTriangle', url: '/admin/inventory' },
          'user': { module: 'Users', icon: 'UserPlus', url: '/admin/users' },
          'refund': { module: 'Orders', icon: 'RefreshCcw', url: '/admin/orders' },
          'payment': { module: 'Orders', icon: 'CreditCard', url: '/admin/orders' },
          'product': { module: 'Products', icon: 'Package', url: '/admin/products' },
        };
        const meta = typeMap[act.type] || { module: 'Dashboard', icon: 'Activity', url: '/admin/dashboard' };
        
        if (!matchesFilter(meta.module)) return;

        if (searchService.fuzzyMatch(q, act.title) || searchService.fuzzyMatch(q, act.desc)) {
          results.push({
            id: `act-${idx}`,
            title: act.title,
            module: meta.module,
            description: act.desc,
            url: meta.url,
            iconName: meta.icon
          });
        }
      });
    } catch (e) {
      console.error(e);
    }

    // Limit to 50 results to keep rendering fast and UI clean
    return results.slice(0, 50);
  }
};
