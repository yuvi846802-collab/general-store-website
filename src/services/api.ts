import { ShoppingCart, Users, AlertCircle, MessageSquare, Star, Package, CheckCircle, RefreshCcw } from "lucide-react";

export const getAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};

export const API_URL = 'http://localhost:5000/api';

// Helper for fetch with credentials
export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (response.status === 401) {
    if (window.location.pathname !== '/admin/login') {
      window.location.href = '/admin/login';
    }
    throw new Error("Unauthorized. Please log in again.");
  }

  return response;
};

export type DashboardResponse = {
  summary: {
    revenue: { value: string; change: string; isPositive: boolean };
    orders: { value: string; change: string; isPositive: boolean };
    visitors: { value: string; change: string; isPositive: boolean };
    convRate: { value: string; change: string; isPositive: boolean };
  };
  alerts: {
    lowStock: number;
    outOfStock: number;
    pendingOrders: number;
    newMessages: number;
  };
  revenue: { name: string; total: number }[];
  salesByCategory: { name: string; value: number; color: string }[];
  orders: {
    id: number;
    name: string;
    customer: string;
    time: string;
    amount: number;
    status: "Completed" | "Processing" | "Cancelled";
  }[];
  activities: {
    title: string;
    desc: string;
    time: string;
    type: "order" | "alert" | "user" | "review" | "refund" | "payment" | "product";
  }[];
};

const COLORS = ['#2563EB', '#06B6D4', '#8B5CF6', '#10B981'];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchDashboardData = async (range: string): Promise<DashboardResponse> => {
  // Simulate network latency
  await delay(800 + Math.random() * 500);

  // Simulate an occasional API error for robustness testing (1 in 50 chance)
  if (Math.random() < 0.02) {
    throw new Error("Failed to fetch dashboard data.");
  }

  // Base Data structure
  const response: DashboardResponse = {
    summary: {
      revenue: { value: "₹0", change: "0%", isPositive: true },
      orders: { value: "0", change: "0%", isPositive: true },
      visitors: { value: "0", change: "0%", isPositive: true },
      convRate: { value: "0%", change: "0%", isPositive: true },
    },
    alerts: { lowStock: 24, outOfStock: 8, pendingOrders: 45, newMessages: 12 },
    revenue: [],
    salesByCategory: [
      { name: 'Grocery', value: 40, color: COLORS[0] },
      { name: 'Snacks', value: 30, color: COLORS[1] },
      { name: 'Beverages', value: 20, color: COLORS[2] },
      { name: 'Personal Care', value: 10, color: COLORS[3] },
    ],
    orders: [],
    activities: [
      { title: "New Order #8005", desc: "Customer ordered 3 items", time: "10 min ago", type: "order" },
      { title: "Inventory Alert", desc: "Basmati Rice running low", time: "1 hour ago", type: "alert" },
      { title: "New User Registered", desc: "rahul@example.com joined", time: "3 hours ago", type: "user" },
      { title: "Refund Processed", desc: "Order #7980 refunded", time: "5 hours ago", type: "refund" },
      { title: "5 Star Review", desc: "Great quality products!", time: "8 hours ago", type: "review" },
    ]
  };

  const generateOrders = (count: number, prefix: string) => {
    return Array.from({ length: count }).map((_, i) => ({
      id: 8000 + i + Math.floor(Math.random() * 1000),
      name: String.fromCharCode(65 + (i % 26)),
      customer: `Customer ${prefix} ${i + 1}`,
      time: 'Just now',
      amount: Math.floor(Math.random() * 2000) + 200,
      status: i % 4 === 0 ? "Processing" as const : (i % 7 === 0 ? "Cancelled" as const : "Completed" as const)
    }));
  };

  switch (range) {
    case "Today":
      response.summary = {
        revenue: { value: "₹12,400", change: "+5.2%", isPositive: true },
        orders: { value: "84", change: "+2.1%", isPositive: true },
        visitors: { value: "1,240", change: "-1.2%", isPositive: false },
        convRate: { value: "4.2%", change: "+0.5%", isPositive: true },
      };
      response.revenue = [
        { name: '8am', total: 200 }, { name: '10am', total: 500 }, { name: '12pm', total: 800 },
        { name: '2pm', total: 1200 }, { name: '4pm', total: 900 }, { name: '6pm', total: 600 }
      ];
      response.orders = generateOrders(6, 'Today');
      break;

    case "Yesterday":
      response.summary = {
        revenue: { value: "₹9,800", change: "-2.1%", isPositive: false },
        orders: { value: "65", change: "-1.5%", isPositive: false },
        visitors: { value: "980", change: "-5.0%", isPositive: false },
        convRate: { value: "3.8%", change: "+0.2%", isPositive: true },
      };
      response.revenue = [
        { name: '8am', total: 300 }, { name: '10am', total: 400 }, { name: '12pm', total: 600 },
        { name: '2pm', total: 800 }, { name: '4pm', total: 1100 }, { name: '6pm', total: 500 }
      ];
      response.orders = generateOrders(5, 'Yest');
      break;

    case "Last 7 Days":
    case "This Week":
      response.summary = {
        revenue: { value: "₹84,500", change: "+12.2%", isPositive: true },
        orders: { value: "542", change: "+8.1%", isPositive: true },
        visitors: { value: "8,450", change: "+4.2%", isPositive: true },
        convRate: { value: "5.6%", change: "+1.2%", isPositive: true },
      };
      response.revenue = [
        { name: 'Mon', total: 12000 }, { name: 'Tue', total: 21000 }, { name: 'Wed', total: 18000 },
        { name: 'Thu', total: 24000 }, { name: 'Fri', total: 32000 }, { name: 'Sat', total: 41000 }, { name: 'Sun', total: 38000 },
      ];
      response.orders = generateOrders(8, 'Week');
      break;
      
    case "Last Week":
      response.summary = {
        revenue: { value: "₹71,200", change: "-4.5%", isPositive: false },
        orders: { value: "480", change: "-3.2%", isPositive: false },
        visitors: { value: "7,900", change: "-2.1%", isPositive: false },
        convRate: { value: "5.1%", change: "-0.5%", isPositive: false },
      };
      response.revenue = [
        { name: 'Mon', total: 10000 }, { name: 'Tue', total: 15000 }, { name: 'Wed', total: 14000 },
        { name: 'Thu', total: 18000 }, { name: 'Fri', total: 25000 }, { name: 'Sat', total: 32000 }, { name: 'Sun', total: 28000 },
      ];
      response.orders = generateOrders(7, 'LWeek');
      break;

    case "This Month":
      response.summary = {
        revenue: { value: "₹4,24,500", change: "+24.2%", isPositive: true },
        orders: { value: "2,842", change: "+18.1%", isPositive: true },
        visitors: { value: "42,450", change: "+15.2%", isPositive: true },
        convRate: { value: "4.8%", change: "+2.2%", isPositive: true },
      };
      response.revenue = [
        { name: '1st-5th', total: 42000 }, { name: '6th-10th', total: 51000 }, { name: '11th-15th', total: 48000 },
        { name: '16th-20th', total: 64000 }, { name: '21st-25th', total: 82000 }, { name: '26th-31st', total: 91000 },
      ];
      response.salesByCategory = [
        { name: 'Grocery', value: 1400, color: COLORS[0] }, { name: 'Snacks', value: 1300, color: COLORS[1] },
        { name: 'Beverages', value: 1300, color: COLORS[2] }, { name: 'Personal Care', value: 1200, color: COLORS[3] },
      ];
      response.orders = generateOrders(10, 'Month');
      break;
      
    case "Last Month":
      response.summary = {
        revenue: { value: "₹3,41,800", change: "-8.4%", isPositive: false },
        orders: { value: "2,150", change: "-6.1%", isPositive: false },
        visitors: { value: "35,200", change: "-4.5%", isPositive: false },
        convRate: { value: "4.1%", change: "-0.8%", isPositive: false },
      };
      response.revenue = [
        { name: '1st-5th', total: 32000 }, { name: '6th-10th', total: 41000 }, { name: '11th-15th', total: 38000 },
        { name: '16th-20th', total: 54000 }, { name: '21st-25th', total: 62000 }, { name: '26th-31st', total: 71000 },
      ];
      response.orders = generateOrders(8, 'LMonth');
      break;

    case "Last 3 Months":
    case "Last 6 Months":
      response.summary = {
        revenue: { value: "₹12,84,500", change: "+34.2%", isPositive: true },
        orders: { value: "8,842", change: "+28.1%", isPositive: true },
        visitors: { value: "142,450", change: "+25.2%", isPositive: true },
        convRate: { value: "5.4%", change: "+3.2%", isPositive: true },
      };
      response.revenue = [
        { name: 'M1', total: 312000 }, { name: 'M2', total: 421000 }, { name: 'M3', total: 518000 },
      ];
      response.orders = generateOrders(10, 'Qtr');
      break;

    case "This Year":
    case "Last Year":
      response.summary = {
        revenue: { value: "₹45,24,500", change: "+42.2%", isPositive: true },
        orders: { value: "32,842", change: "+38.1%", isPositive: true },
        visitors: { value: "442,450", change: "+35.2%", isPositive: true },
        convRate: { value: "6.8%", change: "+4.2%", isPositive: true },
      };
      response.revenue = [
        { name: 'Jan', total: 212000 }, { name: 'Feb', total: 321000 }, { name: 'Mar', total: 418000 },
        { name: 'Apr', total: 324000 }, { name: 'May', total: 532000 }, { name: 'Jun', total: 641000 },
        { name: 'Jul', total: 712000 }, { name: 'Aug', total: 681000 }, { name: 'Sep', total: 745000 }
      ];
      response.salesByCategory = [
        { name: 'Grocery', value: 14000, color: COLORS[0] }, { name: 'Snacks', value: 13000, color: COLORS[1] },
        { name: 'Beverages', value: 13000, color: COLORS[2] }, { name: 'Personal Care', value: 12000, color: COLORS[3] },
      ];
      response.orders = generateOrders(12, 'Year');
      break;

    default: // Custom Range
      response.summary = {
        revenue: { value: "₹--", change: "--", isPositive: true },
        orders: { value: "--", change: "--", isPositive: true },
        visitors: { value: "--", change: "--", isPositive: true },
        convRate: { value: "--", change: "--", isPositive: true },
      };
      response.revenue = [];
      response.orders = [];
      response.salesByCategory = [];
      break;
  }

  return response;
};

export type CategoryFormData = {
  name: string;
  slug: string;
  description?: string;
  parentCategory?: string;
  status: "active" | "inactive";
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  featured: boolean;
  showOnHomepage: boolean;
  showInNav: boolean;
  displayOrder: number;
  image?: string | File | null;
  banner?: string | File | null;
  icon?: string;
  color?: string;
};

export const createCategory = async (data: CategoryFormData): Promise<{ id: string } & CategoryFormData> => {
  try {
    const response = await fetchWithAuth(`${API_URL}/categories`, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create category');
    }

    return result;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to connect to server');
  }
};

export type ProductFormData = {
  name: string;
  description?: string;
  price: number | string;
  originalPrice?: number | string;
  category: string;
  stock?: number | string;
  sku?: string;
  barcode?: string;
  tag?: string;
  status?: string;
  isPopular?: boolean;
  image?: string;
};


export const fetchPublicProducts = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_URL}/products`);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch products');
    }
    return result.data || result;
  } catch (error: any) {
    console.error('Fetch public products error:', error);
    return [];
  }
};

export const fetchPublicCategories = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Failed to fetch categories');
    }
    return result;
  } catch (error: any) {
    console.error('Fetch public categories error:', error);
    return [];
  }
};
