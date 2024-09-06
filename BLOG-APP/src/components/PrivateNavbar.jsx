import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import logo from '../assets/image/logo.png';
import testImage from '../assets/image/testImage.jpg'; 
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const PrivateNavbar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [profileImage, setProfileImage] = useState(testImage); 
  const [storageChange, setStorageChange] = useState(0);

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const res = await axiosInstance.get("/auth/profile-pic");
        const filename = res.data.data.profilePic.id; 
        const response = await axiosInstance.get(`/file/signed-url/${filename}`);
        const data = response.data;
  
        if (data.status && data.data && data.data.signedUrl) {
          setProfileImage(data.data.signedUrl);
        } else {
          setProfileImage(testImage); 
        }
      } catch (error) {
        setProfileImage(testImage); 
      }
    };
  
    fetchProfileImage();
  }, [storageChange]);

  useEffect(() => {
    const handleStorageChange = () => {
      setStorageChange(prev => prev + 1); 
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


  const handleLogout = () => {
    window.localStorage.removeItem("UserData");
    toast.success("Logout Successful", { position: "bottom-center", autoClose: true });
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <NavLink to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={logo} className="h-8" alt="Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            DEBLOG
          </span>
        </NavLink>

        <div className="flex items-center space-x-2 md:order-2">
          {/* Profile Picture */}
          <NavLink to="/profile">
            <img
              src={profileImage}
              alt="Profile"
              className="w-10 h-10 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500"
            />
          </NavLink>
          
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={toggleDropdown}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-default"
            aria-expanded={isDropdownOpen}
          >
            <span className="sr-only">Open main menu</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
        </div>

        <div
          className={`${isDropdownOpen ? "block" : "hidden"} w-full md:block md:w-auto`} id="navbar-default"
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
              <NavLink
                to="/"
                onClick={closeDropdown}
                className={({ isActive }) =>
                  isActive
                    ? "block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                    : "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                }
                aria-current="page"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/post"
                onClick={closeDropdown}
                className={({ isActive }) =>
                  isActive
                    ? "block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                    : "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                }
              >
                Articles
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/category"
                onClick={closeDropdown}
                className={({ isActive }) =>
                  isActive
                    ? "block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                    : "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                }
              >
                Categories
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/profile"
                onClick={closeDropdown}
                className={({ isActive }) =>
                  isActive
                    ? "block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                    : "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                }
              >
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/settings"
                onClick={closeDropdown}
                className={({ isActive }) =>
                  isActive
                    ? "block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                    : "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                }
              >
                Settings
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  isActive
                    ? "block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white md:dark:text-blue-500"
                    : "block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                }
                onClick={handleLogout}
              >
                Logout
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default PrivateNavbar;
