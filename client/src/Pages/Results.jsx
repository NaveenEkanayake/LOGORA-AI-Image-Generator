import React, { useState, useEffect } from "react";
import { assets } from "../assets/images/assets";
import { motion } from "framer-motion";
import NavBar from "../Components/NavBar/NavBar";
import Footer from "../Components/Footer/Footer";
import { generateImages, getCredits, verifyCustomer } from "../Api/config";
import { useNavigate } from "react-router-dom";
import ResultImage from "../assets/images/Third.jpeg";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Results = () => {
  const [image, setImage] = useState(ResultImage);
  const navigate = useNavigate();
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [loading, SetLoading] = useState(false);
  const [input, setInput] = useState("");

  const checkCreditsAndGenerateImage = async (prompt) => {
    try {
      const creditData = await getCredits();
      if (creditData.success && creditData.credits === 0) {
        toast.error("Insufficient credits. Please buy more credits.");
        setTimeout(() => {
          navigate("/buycredits");
        }, 3000);
        return;
      }
      if (creditData.success && creditData.credits > 0) {
        const generatedImage = await generateImages(prompt);
        if (generatedImage) {
          setIsImageLoading(true);
          setImage(generatedImage);
          toast.success("Image generated successfully!");
        }
      }
    } catch (error) {
      console.error(
        "Error checking credits or generating image:",
        error.message
      );
      toast.error("An error occurred while generating the image.");
    } finally {
      SetLoading(false);
    }
  };

  useEffect(() => {
    const verifyCustomerAndCheckCredits = async () => {
      if (!verifyCustomer()) {
        toast.error("Customer ID is required.");
        return;
      }
      try {
        const creditData = await getCredits();
        console.log("Credits fetched: ", creditData);
        if (creditData.success && creditData.credits === 0) {
          toast.error("No credits available. Redirecting to buy credits.");
          setTimeout(() => {
            navigate("/buycredits");
          }, 3000);
        }
      } catch (error) {
        console.error("Error fetching credits:", error);
        toast.error("Failed to fetch credits. Please try again.");
      }
    };

    verifyCustomerAndCheckCredits();
  }, [navigate]);

  const handlesubmit = async (e) => {
    e.preventDefault();
    SetLoading(true);
    if (input) {
      await checkCreditsAndGenerateImage(input);
    }
  };

  return (
    <>
      <NavBar />
      <motion.form
        initial={{ opacity: 0.2, y: 100 }}
        transition={{ duration: 1 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onSubmit={handlesubmit}
        className="flex flex-col min-h-[90vh] justify-center items-center"
      >
        <div>
          <div className="relative">
            <img
              src={image}
              alt="Generated Image"
              className="max-w-sm rounded"
            />
            <span
              className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${
                loading ? "w-full transition-all duration-[10s]" : "w-0"
              }`}
            />
          </div>
          <p className={!loading ? "hidden" : "animate-pulse"}>Loading...</p>
        </div>
        {!isImageLoading && (
          <div className="flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full">
            <input
              onChange={(e) => setInput(e.target.value)}
              value={input}
              type="text"
              placeholder="Describe what you want to generate"
              className="flex-1 bg-transparent outline-none ml-8 max-sm:w-20 placeholder-color"
            />
            <button
              type="submit"
              className="bg-zinc-900 px-10 sm:px-16 py-3 rounded-full disabled:opacity-50"
            >
              Generate
            </button>
          </div>
        )}

        {isImageLoading && (
          <div className="flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full">
            <p
              onClick={() => {
                setIsImageLoading(false);
              }}
              className="bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer"
            >
              Generate Another
            </p>
            <a
              href={image}
              download
              className="bg-zinc-900 px-10 py-3 rounded-full cursor-pointer"
            >
              Download
            </a>
          </div>
        )}
      </motion.form>
      <Footer />
    </>
  );
};

export default Results;
