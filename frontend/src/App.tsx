import { Routes, Route } from 'react-router-dom';
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import Login from '@pages/LoginPage/Login';
import Landing from '@pages/LandingPage/Landing';
import Account from '@pages/AccountPage/Account';
import FilterPage from '@pages/FilterPage/Filter';

function App() {
  return (
    <Routes>
      <Route path="/sign-in/*" element={<Login />} />
      <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
      <Route path="/" element={<Landing />} />
      <Route path="/account" element={<Account />} />
      <Route path="/filter" element={<FilterPage />} />
    </Routes>
  );
}

export default App;
