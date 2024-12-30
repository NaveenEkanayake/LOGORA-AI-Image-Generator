import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import { assets } from "../../assets/images/assets";
import { motion } from "framer-motion";
import { SendUserForgotPassword } from "../../Api/config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPasswordForm = () => {
  const { setShowForgotPassword } = useContext(AppContext);
  const [email, setEmail] = useState();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();

    SendUserForgotPassword({ email })
      .then((result) => {
        console.log("Password reset email sent successfully", result);
        toast.success("Password reset email sent successfully!", {
          position: "top-right",
          autoClose: 3000,
        });

        setTimeout(() => {
          navigate("/");
        }, 3000);
      })
      .catch((err) => {
        console.error("Failed to send password reset email:", err);
        toast.error("Failed to send password reset email. Please try again.", {
          position: "top-right",
          autoClose: 3000,
        });
      });
  };
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <ToastContainer />
      <motion.form
        onSubmit={handleSubmit} // Use onSubmit instead of onClick
        initial={{ opacity: 0.2, y: 100 }}
        transition={{ duration: 1 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white p-10 rounded-xl text-slate-500 w-96"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          Forgot Password
        </h1>
        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.email_icon} className="w-6 h-6" alt="Email Icon" />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="outline-none text-sm flex-grow"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 w-full text-white py-2 rounded-full mt-4"
        >
          Send
        </button>
        <img
          src={assets.cross_icon}
          className="absolute top-5 right-5 cursor-pointer"
          alt="Close"
          onClick={() => setShowForgotPassword(false)}
        />
      </motion.form>
    </div>
  );
};

export default ForgotPasswordForm;
