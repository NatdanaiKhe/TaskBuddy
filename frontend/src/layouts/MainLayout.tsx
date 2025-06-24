import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
import { Footer } from "./Footer";
function MainLayout() {
  return (
    <div className="flex flex-col h-auto">
      <NavBar />
      <Outlet />
      <Footer />
    </div>
  );
}

export default MainLayout;
