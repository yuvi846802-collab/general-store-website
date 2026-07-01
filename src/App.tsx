import { Suspense, lazy } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import ErrorBoundary from "@/components/ErrorBoundary";

const NotFound = lazy(() => import("@/pages/not-found"));
const Home = lazy(() => import("@/pages/Home"));
const Page = lazy(() => import("@/pages/Page"));

import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminProducts from "@/pages/admin/Products";
import AdminProductEditor from "@/pages/admin/ProductEditor";
import AdminCategories from "@/pages/admin/Categories";
import AdminAnalytics from "@/pages/admin/Analytics";
import AdminSettings from "@/pages/admin/Settings";
import AdminOrders from "@/pages/admin/Orders";
import AdminCustomers from "@/pages/admin/Customers";
import AdminReviews from "@/pages/admin/Reviews";
import AdminMediaLibrary from "@/pages/admin/MediaLibrary";
import AdminUsers from "@/pages/admin/Users";
import AdminProfile from "@/pages/admin/Profile";
import AdminContentEditor from "@/pages/admin/ContentEditor";
import AdminInventory from "@/pages/admin/Inventory";
import AdminCoupons from "@/pages/admin/Coupons";
import AdminMarketing from "@/pages/admin/Marketing";
import AdminCreateEntity from "@/pages/admin/CreateEntity";

import AdminLayout from "@/layouts/AdminLayout";
const AuthProvider = lazy(() => import("@/context/AuthContext").then(m => ({ default: m.AuthProvider })));

const queryClient = new QueryClient();

function Router() {
  return (
    <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center">Loading...</div>}>
      <Switch>
        {/* Public Routes */}
        <Route path="/" component={Home} />
        <Route path="/about" component={Page} />
        <Route path="/faqs" component={Page} />
        <Route path="/help" component={Page} />
        <Route path="/returns" component={Page} />
        <Route path="/privacy" component={Page} />
        <Route path="/terms" component={Page} />
        <Route path="/track-order" component={Page} />
        <Route path="/contact" component={Page} />
        
        {/* Admin Public Route */}
        <Route path="/admin/login" component={AdminLogin} />

        {/* Admin Protected Routes */}
        <Route path="/admin/*">
          <AdminLayout>
            <Switch>
              <Route path="/admin/dashboard"><AdminDashboard /></Route>
              <Route path="/admin/create/:entity"><AdminCreateEntity /></Route>
              <Route path="/admin/products/new"><AdminProductEditor /></Route>
              <Route path="/admin/products/:id"><AdminProductEditor /></Route>
              <Route path="/admin/products"><AdminProducts /></Route>
              <Route path="/admin/categories"><AdminCategories /></Route>
              <Route path="/admin/inventory"><AdminInventory /></Route>
              <Route path="/admin/orders"><AdminOrders /></Route>
              <Route path="/admin/customers"><AdminCustomers /></Route>
              <Route path="/admin/reviews"><AdminReviews /></Route>
              <Route path="/admin/media"><AdminMediaLibrary /></Route>
              <Route path="/admin/users"><AdminUsers /></Route>
              <Route path="/admin/profile"><AdminProfile /></Route>
              <Route path="/admin/content/:section"><AdminContentEditor /></Route>
              <Route path="/admin/coupons"><AdminCoupons /></Route>
              <Route path="/admin/marketing"><AdminMarketing /></Route>
              <Route path="/admin/analytics"><AdminAnalytics /></Route>
              <Route path="/admin/settings"><AdminSettings /></Route>
              <Route>
                <div className="text-center py-20 text-muted-foreground">Page under construction</div>
              </Route>
            </Switch>
          </AdminLayout>
        </Route>

        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <Suspense fallback={<div className="h-screen w-screen bg-background flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>}>
            <AuthProvider>
              <TooltipProvider>
                <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                  <Router />
                </WouterRouter>
                <Toaster />
              </TooltipProvider>
            </AuthProvider>
          </Suspense>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;