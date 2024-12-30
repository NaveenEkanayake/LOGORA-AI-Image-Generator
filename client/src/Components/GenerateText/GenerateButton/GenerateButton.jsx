import React, { useContext } from "react";
import { assets } from "../../../assets/images/assets";
import { motion } from "framer-motion";
import { AppContext } from "../../../Context/AppContext";
import { useNavigate } from "react-router-dom";

const GenerateButton = ({ children }) => {
  const { user, setShowLogin } = useContext(AppContext);
  const navigate = useNavigate();
  const onClickHandler = () => {
    if (user) {
      navigate("/results");
    } else {
      setShowLogin(true);
    }
  };

  return (
    <motion.button
      onClick={onClickHandler}
      className="inline-flex items-center gap-2 px-12 py-3 rounded-full bg-black text-white m-auto hover:scale-105 transition-all duration-500"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        default: { duration: 0.5 },
        opacity: { delay: 0.8, duration: 1 },
      }}
    >
      {children}
      <img className="h-6" src={assets.star_group} alt="Star Group" />
    </motion.button>
  );
};

export default GenerateButton;
