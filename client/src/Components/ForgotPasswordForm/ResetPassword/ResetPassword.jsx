import React, { useContext, useEffect, useState } from "react";
import { assets } from "../../../assets/images/assets";
import { motion } from "framer-motion";
import { AppContext } from "../../../Context/AppContext";
import { useNavigate, useParams } from "react-router-dom";
import { ResetUserPassword } from "../../../Api/config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const { setShowResetPassword } = useContext(AppContext);
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    ResetUserPassword(id, token, { password })
      .then((result) => {
        console.log("Password reset successfully", result);
        toast.success("Password reset successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setShowResetPassword(false);
        setTimeout(() => {
          navigate("/");
        }, 3000);
      })
      .catch((err) => {
        console.error("Failed to reset password:", err);
        toast.error("Failed to reset password. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
        <ToastContainer />
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0.2, y: 100 }}
          transition={{ duration: 1 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-white p-10 rounded-xl text-slate-500 w-96"
        >
          <h1 className="text-center text-2xl text-neutral-700 font-medium">
            Reset Password
          </h1>
          <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
            <img src={assets.lock_icon} className="w-6 h-6" alt="Email Icon" />
            <input
              placeholder="Enter your New Password"
              required
              className="outline-none text-sm flex-grow"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-600 w-full text-white py-2 rounded-full mt-4"
          >
            Update
          </button>
          <img
            src={assets.cross_icon}
            className="absolute top-5 right-5 cursor-pointer"
            alt="Close"
            onClick={() => setShowResetPassword(false)}
          />
        </motion.form>
      </div>
    </>
  );
};

export default ResetPassword;
