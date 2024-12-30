import React from "react";
import GenerateButton from "./GenerateButton/GenerateButton";
import { motion } from "framer-motion";

const GenerateText = () => {
  return (
    <motion.div
      initial={{ opacity: 0.2, y: 100 }}
      transition={{ duration: 1 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="pb-16 text-center"
    >
      <h1 className="text-2xl md:text-3xl lg:text-4xl mt-4 font-semibold text-neutral-800 py-6 md:py-16">
        See the magic. Try now
      </h1>
      <GenerateButton>Generate Images</GenerateButton>
    </motion.div>
  );
};

export default GenerateText;
