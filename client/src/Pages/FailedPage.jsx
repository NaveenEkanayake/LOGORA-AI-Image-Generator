import React, { useState } from "react";
import { motion } from "framer-motion";
import { ExclamationCircleIcon } from "@heroicons/react/24/solid";
import NavBar from "../Components/NavBar/NavBar";
import { assets } from "../assets/images/assets";
import { useNavigate } from "react-router-dom";

const FailedPage = () => {
  const [showModel, setShowModel] = useState(false);
  const navigate = useNavigate();

  // Close modal and navigate to home
  const handleClose = () => {
    setShowModel(false);
    navigate("/buycredits");
  };

  return (
    <>
      <NavBar />
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0.2, y: 100 }}
          transition={{ duration: 1 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-white p-10 rounded-xl text-slate-500 w-96"
        >
          <div className="flex flex-col items-center">
            <ExclamationCircleIcon className="w-20 h-20 text-red-500" />
            <h1 className="text-2xl font-bold text-neutral-700 mt-4">
              Payment Unsuccessful !!!
            </h1>
            <p className="text-center mt-2 text-sm text-gray-600">
              It seems like your Payment is unsuccessful. Feel free to try again
              or contact support if you need help.
            </p>
          </div>
          <img
            src={assets.cross_icon}
            className="absolute top-5 right-5 cursor-pointer"
            alt="Close"
            onClick={handleClose}
          />
        </motion.div>
      </div>
    </>
  );
};

export default FailedPage;
