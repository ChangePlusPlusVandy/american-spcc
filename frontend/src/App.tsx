import Navbar from '@/components/NavBarComponent/NavBar';
import AppRoutes from './routes/AppRoutes';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAdmin={isAdminRoute} />

      <main className="flex-grow">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
