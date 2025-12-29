import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser, AuthenticateWithRedirectCallback } from '@clerk/clerk-react';

import Landing from '@pages/LandingPage/Landing';
import FilterPage from '@pages/FilterPage/Filter';
import Login from '@pages/LoginPage/Login';
import Signup from '@pages/SignUpPage/SignUp';
import Account from '@pages/AccountPage/Account';

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
      <Route path="/filter" element={<FilterPage />} />
      <Route path="/sign-in/*" element={<Login />} />
      <Route path="/sign-up/*" element={<Signup />} />
      <Route
        path="/sso-callback"
        element={<AuthenticateWithRedirectCallback />}
      />

      {/* PROTECTED */}
      <Route path="/account" element={<AccountRoute />} />
    </Routes>
  );
}
