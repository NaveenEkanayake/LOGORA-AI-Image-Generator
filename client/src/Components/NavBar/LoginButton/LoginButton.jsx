import React, { useContext } from "react";
import { AppContext } from "../../../Context/AppContext";

const LoginButton = () => {
  const { setShowLogin } = useContext(AppContext);

  return (
    <button
      className="bg-zinc-800 text-white px-7 py-2 sm:px-10 text-sm rounded-full"
      onClick={() => setShowLogin(true)}
    >
      Login
    </button>
  );
};

export default LoginButton;
