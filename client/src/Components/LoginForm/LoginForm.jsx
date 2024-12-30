import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../Context/AppContext";
import Usericon from "../../assets/images/user.webp";
import { assets } from "../../assets/images/assets";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { registerCustomer, Logincustomer } from "../../Api/config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginForm = () => {
  const [state, setState] = useState("Login");
  const { setShowLogin, setShowForgotPassword } = useContext(AppContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [fullname, setFullname] = useState();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (state === "Login") {
        await Logincustomer({ email, password });
        toast.success("Logged in successfully!", { autoClose: 3000 });
        setTimeout(() => {
          navigate("/");
          window.location.reload();
        }, 3000);
      } else {
        await registerCustomer({ fullname, email, password });
        toast.success("Account created successfully!", { autoClose: 4000 });
        setState("Login");
      }
    } catch (error) {
      toast.error(
        `Failed to ${state === "Login" ? "log in" : "create account"}. ${
          error.message || "Please try again."
        }`,
        { autoClose: 3000 }
      );
    }
  };
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0.2, y: 100 }}
        transition={{ duration: 1 }}
        animate={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-white p-10 rounded-xl text-slate-500 w-96"
      >
        <h1 className="text-center text-2xl text-neutral-700 font-medium">
          {state === "Login" ? "Login" : "Signup"}
        </h1>
        <p className="text-sm text-center">
          {state === "Login"
            ? "Welcome back! Please login to continue."
            : "Welcome! Please sign up to get started."}
        </p>
        {state !== "Login" && (
          <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
            <img src={Usericon} className="w-6 h-6" alt="User Icon" />
            <input
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              type="text"
              name="fullname"
              placeholder="Fullname"
              required
              className="outline-none text-sm flex-grow"
            />
          </div>
        )}
        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.email_icon} className="w-6 h-6" alt="Email Icon" />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
            name="email"
            placeholder="Email"
            required
            className="outline-none text-sm flex-grow"
          />
        </div>
        <div className="border px-6 py-2 flex items-center gap-2 rounded-full mt-4">
          <img src={assets.lock_icon} className="w-6 h-6" alt="Lock Icon" />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            name="password"
            placeholder="Password"
            required
            className="outline-none text-sm flex-grow"
          />
        </div>
        {state === "Login" && (
          <p
            onClick={() => {
              setShowForgotPassword(true);
              setShowLogin(false);
            }}
            className="text-sm text-blue-600 my-4 cursor-pointer text-center"
          >
            Forgot Password?
          </p>
        )}
        <button className="bg-blue-600 w-full text-white py-2 rounded-full mt-4">
          {state === "Login" ? "Login" : "Create Account"}
        </button>
        <p className="mt-5 text-center">
          {state === "Login"
            ? "Don't have an account?"
            : "Already have an account?"}{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => setState(state === "Login" ? "Signup" : "Login")}
          >
            {state === "Login" ? "Sign Up" : "Login"}
          </span>
        </p>
        <img
          src={assets.cross_icon}
          className="absolute top-5 right-5 cursor-pointer"
          alt="Close"
          onClick={() => setShowLogin(false)}
        />
      </motion.form>
      <ToastContainer />
    </div>
  );
};

export default LoginForm;
