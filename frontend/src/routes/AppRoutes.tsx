import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser, AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import Landing from '@pages/LandingPage/Landing';
import FilterPage from '@pages/FilterPage/Filter';
import Login from '@pages/LoginPage/Login';
import Signup from '@pages/SignUpPage/SignUp';
import Account from '@pages/AccountPage/Account';
import ResetPassword from '@pages/ResetPasswordPage/ResetPassword';
import AdminCenter from '@/pages/AdminPages/AdminCenterPage/AdminCenter';
import AdminRoute from '@/components/AdminRouteComponent/AdminRoute';
import AdminProfile from '@/pages/AdminPages/AdminCenterPage/AdminProfile';
import AdminContent from '@/pages/AdminPages/AdminCenterPage/AdminContent';
import AdminAnalytics from '@/pages/AdminPages/AdminCenterPage/AdminAnalytics';
import AdminCategoryContent from '@/pages/AdminPages/AdminCategoryContentPage/AdminCategoryContent';

function AccountRoute() {
  const { user, isLoaded } = useUser();
  if (!isLoaded) return null;
  if (!user) return <Navigate to="/sign-in" replace />;
  if (user.unsafeMetadata?.onboarding_complete !== true) {
    return <Navigate to="/sign-up?step=2" replace />;
  }

  return <Account />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Landing />} />
      <Route path="/login/*" element={<Login />} />
      <Route path="/filter" element={<FilterPage />} />
      <Route path="/sign-in/*" element={<Login />} />
      <Route path="/sign-up/*" element={<Signup />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />

      {/* PROTECTED */}
      <Route path="/account" element={<AccountRoute />} />

      {/* ADMIN */}
      <Route path="/admin" element={<AdminRoute />}>

      {/* ADMIN CENTER (WITH SIDEBAR) */}
      <Route path="admin-center" element={<AdminCenter />}>
        <Route index element={<Navigate to="content-management" replace />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="content-management" element={<AdminContent />} />
        <Route path="data-analytics" element={<AdminAnalytics />} />
      </Route>

      {/* CATEGORY VIEW (NO SIDEBAR) */}
      <Route
        path="admin-center/content-management/:category"
        element={<AdminCategoryContent />}
      />

      </Route>

    </Routes>
  );
}
