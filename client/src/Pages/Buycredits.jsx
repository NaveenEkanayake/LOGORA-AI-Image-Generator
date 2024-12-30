import React, { useContext } from "react";
import { assets, plans } from "../assets/images/assets";
import { AppContext } from "../Context/AppContext";
import { motion } from "framer-motion";
import NavBar from "../Components/NavBar/NavBar";
import Footer from "../Components/Footer/Footer";
import { Payment } from "../Api/config";
import Creditlogo from "../assets/images/creditlogo.png";

const Buycredits = () => {
  const { user } = useContext(AppContext);

  const handlePurchase = async (planId) => {
    if (!user) {
      alert("Please log in to purchase credits!");
      return;
    }

    try {
      const response = await Payment({ planId });
      if (response.url) {
        window.location.href = response.url;
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Failed to initiate payment. Please try again.");
    }
  };

  return (
    <>
      <NavBar />
      <motion.div
        initial={{ opacity: 0.2, y: 100 }}
        transition={{ duration: 1 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="min-h-[80vh] text-center pt-14 mb-10"
      >
        <button className="border border-gray-400 px-10 py-2 rounded-full mb-6">
          Our plans
        </button>
        <h1 className="text-center text-3xl font-medium mb-6 sm:mb-10">
          Choose the plan
        </h1>
        <div className="flex flex-wrap justify-center gap-6 text-left">
          {plans.map((items, index) => (
            <div
              key={index}
              className="bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500"
            >
              <img width={40} src={Creditlogo} alt="Plan Icon" />
              <p className="mt-3 mb-1 font-semibold">{items.id}</p>
              <p className="text-sm">{items.desc}</p>
              <p className="mt-6">
                <span className="text-3xl font-medium">${items.price}</span> /
                {items.credits}
              </p>
              <button
                onClick={() => handlePurchase(items.id)}
                className="w-full bg-gray-800 text-white mt-8 text-sm rounded-md py-2.5 min-w-52"
              >
                {user ? "Purchase" : " Get Started"}
              </button>
            </div>
          ))}
        </div>
      </motion.div>
      <Footer />
    </>
  );
};

export default Buycredits;
