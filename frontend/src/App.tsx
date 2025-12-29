import Navbar from '@/components/NavBarComponent/NavBar';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
