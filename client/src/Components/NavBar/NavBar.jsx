import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../assets/images/assets";
import { Link, useNavigate } from "react-router-dom";
import LoginButton from "./LoginButton/LoginButton";
import { AppContext } from "../../Context/AppContext";
import { verifyCustomer, getCredits, LogoutCustomer } from "../../Api/config";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../assets/images/logo.png";
const NavBar = () => {
  const [credits, setCredits] = useState(null);
  const navigate = useNavigate();
  const { user, setUser, setShowLogin } = useContext(AppContext);

  useEffect(() => {
    verifyCustomer()
      .then((data) => setUser(data.user))
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    if (!verifyCustomer()) {
      console.log("customer Id is required");
    } else {
      getCredits()
        .then((data) => setCredits(data.credits))
        .catch((error) => console.error(error));
    }
  }, []);
  const handleLogout = async () => {
    try {
      const result = await LogoutCustomer();
      if (result && result.message) {
        toast.success(result.message, {
          position: "top-right",
          autoClose: 3000,
        });
        setUser(false);
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      toast.error("An error occurred during logout", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };
  return (
    <div className="flex items-center justify-between py-4">
      <Link to="/">
        <img src={logo} className="w-28 sm:w-32 lg:w-40" />
      </Link>
      <div>
        {user ? (
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate("/buycredits")}
              className="flex items-center gap-2 bg-blue-100 px-4 sm:px-6 py-1.5 sm:py-3 rounded-full hover:scale-105 transition-all duration-700"
            >
              <img src={assets.credit_star} className="w-5" />
              <p className="text-xs sm:text-sm font-medium text-gray-600">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Credit left: {credits ? ` ${credits.toString().trim()}` : "0"}
                </p>
              </p>
            </button>
            <p className="max-sm:hidden pl-4 text-gray-600">
              Hi , {user ? ` ${user.fullname.trim()}` : "Guest"}
            </p>
            <div className="relative group">
              <img src={assets.profile_icon} className="w-10 drop-shadow" />
              <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12">
                <ul className="list-none m-0 p-2 bg-white rounded-md border text-sm">
                  <li
                    onClick={handleLogout}
                    className="py-1 px-2 cursor-pointer pr-10"
                  >
                    Logout
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 sm:gap-5">
            <p
              onClick={() => navigate("/buycredits")}
              className="cursor-pointer"
            >
              Pricing
            </p>
            <LoginButton onClick={() => setShowLogin(true)}>Login</LoginButton>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
