import { useAuth } from "@/context/useAuth";
import { UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/login")}
          className="rounded-full p-2 hover:bg-gray-100"
        >
          <UserIcon className="h-6 w-6 text-gray-600" />
        </button>
        <button
          onClick={() => navigate("/register")}
          className="rounded-full bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Sign Up
        </button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer font-medium">
        {user.firstName + " " + user.lastName}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          {user.role === "customer" ? (
            <a href="bookings">Bookings</a>
          ) : (
            <a href="/">Dashboard</a>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem className="text-red-500" onClick={logout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserMenu;