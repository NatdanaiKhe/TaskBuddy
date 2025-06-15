import { Outlet } from "react-router-dom"
import NavBar from "./NavBar";
function MainLayout() {
  return (
    <div className="flex flex-col h-screen">
      <NavBar />
      <Outlet />
    </div>
  );
}

export default MainLayout