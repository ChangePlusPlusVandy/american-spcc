import { Routes, Route } from 'react-router-dom';
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';

import Login from '@pages/LoginPage/Login';
import Signup from '@pages/SignUpPage/SignUp';
import Landing from '@pages/LandingPage/Landing';
import Account from '@pages/AccountPage/Account';
import FilterPage from '@pages/FilterPage/Filter';

import { OnboardingGuard } from '@/components/OnboardingGuardComponent/OnboardingGuard';

function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Landing />} />
      <Route path="/filter" element={<FilterPage />} />
      <Route path="/sign-in/*" element={<Login />} />
      <Route path="/sign-up/*" element={<Signup />} />
      <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />

      {/* PROTECTED ROUTES */}
      <Route
        path="/account"
        element={
          <OnboardingGuard>
            <Account />
          </OnboardingGuard>
        }
      />
    </Routes>
  );
}

export default App;
