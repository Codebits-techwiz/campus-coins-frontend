import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/AppContext';
import { PublicLayout } from './layouts/PublicLayout';
import { StudentLayout } from './layouts/StudentLayout';
import { AdminLayout } from './layouts/AdminLayout';
import Home from './pages/public/Home';
import Features from './pages/public/Features';
import HowItWorks from './pages/public/HowItWorks';
import Pricing from './pages/public/Pricing';
import Testimonials from './pages/public/Testimonials';
import Faq from './pages/public/Faq';
import Sitemap from './pages/public/Sitemap';
import BackendBlueprint from './pages/public/BackendBlueprint';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import AdminLogin from './pages/auth/AdminLogin';
import Dashboard from './pages/student/Dashboard';
import Transactions from './pages/student/Transactions';
import Categories from './pages/student/Categories';
import Budgets from './pages/student/Budgets';
import Reports from './pages/student/Reports';
import Recurring from './pages/student/Recurring';
import Insights from './pages/student/Insights';
import Profile from './pages/student/Profile';
import Bookmarks from './pages/student/Bookmarks';
import ResetPassword from './pages/auth/ResetPassword';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCategories from './pages/admin/AdminCategories';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminTipTemplates from './pages/admin/AdminTipTemplates';
import AdminStats from './pages/admin/AdminStats';
import { PageLoader, RouteLoader } from './components/PageLoader';

function RequireStudent() {
  const { role, authLoading } = useApp();
  if (authLoading) return <PageLoader />;
  if (role !== 'student') return <Navigate to="/login" replace />;
  return <StudentLayout />;
}

function RequireAdmin() {
  const { role, authLoading } = useApp();
  if (authLoading) return <PageLoader />;
  if (role !== 'admin') return <Navigate to="/admin-login" replace />;
  return <AdminLayout />;
}

function RedirectIfLoggedIn({ to }) {
  const { role, authLoading } = useApp();
  if (authLoading) return <PageLoader />;
  if (role === 'student') return <Navigate to="/app" replace />;
  if (role === 'admin') return <Navigate to="/admin" replace />;
  return to;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <RouteLoader />
      <Routes>

        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/backend-blueprint" element={<BackendBlueprint />} />
          <Route
            path="/login"
            element={<RedirectIfLoggedIn to={<Login />} />}
          />
          <Route
            path="/register"
            element={<RedirectIfLoggedIn to={<Register />} />}
          />
          <Route
            path="/signup"
            element={<RedirectIfLoggedIn to={<Register />} />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/admin-login"
            element={<RedirectIfLoggedIn to={<AdminLogin />} />}
          />
        </Route>


        <Route path="/app" element={<RequireStudent />}>
          <Route index element={<Dashboard />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="categories" element={<Categories />} />
          <Route path="budgets" element={<Budgets />} />
          <Route path="reports" element={<Reports />} />
          <Route path="recurring" element={<Recurring />} />
          <Route path="insights" element={<Insights />} />
          <Route path="bookmarks" element={<Bookmarks />} />
          <Route path="profile" element={<Profile />} />
        </Route>


        <Route path="/admin" element={<RequireAdmin />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="announcements" element={<AdminAnnouncements />} />
          <Route path="tip-templates" element={<AdminTipTemplates />} />
          <Route path="stats" element={<AdminStats />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  console.log("App render");
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
