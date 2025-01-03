import { Switch } from "@/components/ui/Switch";
import { FaHamburger } from "react-icons/fa";
import ResponsiveNavBar from "./ResponsiveNavBar";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const NavBar = ({ darkMode, handleDarkMode, isAuthenticated, username, setIsAuthenticated, setUsername }) => {
  const [showNavBar, setShowNavBar] = useState(false);
  
  function logout(){
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    localStorage.removeItem("username")
    setIsAuthenticated(false)
    setUsername(null)
  }

  return (
    <>
      <nav className="max-container padding-x py-6 flex justify-between items-center  gap-6 sticky top-0 z-10 bg-[#FFFFFF] dark:bg-[#141624]">
        <Link to="/" className="text-[#141624] text-2xl dark:text-[#FFFFFF]">
          DevFolio
        </Link>
        <ul className="flex items-center  justify-end gap-9 text-[#3B3C4A] lg:flex-1 max-md:hidden dark:text-[#FFFFFF]">
          {isAuthenticated ? (
            <>
              <li>hi, {username}</li>
              <li onClick={logout} className="cursor-pointer">Sign out</li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/signin"
                  className={({ isActive }) => (isActive ? "active" : "")}>
                  Sign in
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/signup"
                  className={({ isActive }) => (isActive ? "active" : "")}>
                  Register
                </NavLink>
              </li>
            </>
          )}

          <li className="font-semibold">
            <NavLink
              to="/create"
              className={({ isActive }) => (isActive ? "active" : "")}>
              Create post
            </NavLink>
          </li>
        </ul>

        <Switch onCheckedChange={handleDarkMode} checked={darkMode} />
        <FaHamburger
          className="text-2xl cursor-pointer hidden max-md:block dark:text-white"
          onClick={() => setShowNavBar((curr) => !curr)}
        />
      </nav>

      {showNavBar && <ResponsiveNavBar />}
    </>
  );
};

NavBar.propTypes = {
  darkMode: PropTypes.bool.isRequired,
  handleDarkMode: PropTypes.func.isRequired,
};

export default NavBar;
