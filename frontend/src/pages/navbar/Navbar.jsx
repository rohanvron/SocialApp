import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setMode, setLogout } from "../../state/authSlice";
import {
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Notifications as NotificationsIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const mode = useSelector((state) => state.mode);

  const fullName = `${user?.firstName || "User"} ${user?.lastName || "Name"}`;

  return (
    <nav
      className={`${
        mode === "light" ? "bg-white" : "bg-gray-800"
      } shadow-md transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span
              className="text-2xl font-bold text-primary-500 dark:text-primary-300 cursor-pointer"
              onClick={() => navigate("/home")}
            >
              SocialApp
            </span>
            <div className="hidden md:ml-6 md:flex md:items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className={`${
                    mode === "light"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-gray-700 text-white"
                  } rounded-full py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                />

                <SearchIcon className="absolute left-3 top-2.5 text-gray-400" />
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => dispatch(setMode())}
              className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-300"
            >
              {mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
            </button>
            <NotificationsIcon className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-300" />
            <div className="relative">
              <AccountCircleIcon
                className="text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-300 cursor-pointer"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                style={{ fontSize: "2.5rem" }}
              />
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1">
                  
                  <button
                    onClick={() => dispatch(setLogout())}
                    className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 w-full text-left"
                  >
                    <LogoutIcon className="mr-2" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 dark:text-gray-300"
            >
              {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <input
              type="text"
              placeholder="Search..."
              className={`w-full ${
                mode === "light"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-gray-700 text-white"
              } rounded-full py-2 px-4 mb-2 focus:outline-none focus:ring-2 focus:ring-primary-500`}
            />

            <button
              onClick={() => dispatch(setMode())}
              className="w-full text-left py-2 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {mode === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
            <button className="w-full text-left py-2 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
              Notifications
            </button>
            <button
              onClick={() => dispatch(setLogout())}
              className="w-full text-left py-2 px-3 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Log Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
