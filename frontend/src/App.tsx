import Navbar from '@/components/NavBarComponent/NavBar';
import AppRoutes from './routes/AppRoutes';
import { useUser } from '@clerk/clerk-react';

function App() {
  const { user, isLoaded } = useUser();

  const isAdmin = isLoaded && user?.publicMetadata?.role === 'ADMIN';

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isAdmin={isAdmin} />

      <main className="flex-grow">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
