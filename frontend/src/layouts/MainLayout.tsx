import { Outlet } from 'react-router-dom';
import DefaultNav from "@components/NavBarComponent/NavBar";

export default function MainLayout() {
  return (
    <>
      <DefaultNav />

      <div className="page-content">
        <Outlet />
      </div>
    </>
  );
}
