import React from "react";
import Header from "../Components/Header/Header";
import Steps from "../Components/Steps/Steps";
import Description from "../Components/Description/Description";
import Testimonials from "../Components/Testimonials/Testimonials";
import GenerateText from "../Components/Generatetext/GenerateText";
import NavBar from "../Components/NavBar/NavBar";
import Footer from "../Components/Footer/Footer";

const Home = () => {
  return (
    <div>
      <NavBar />
      <Header />
      <Steps />
      <Description />
      <Testimonials />
      <GenerateText />
      <Footer />
    </div>
  );
};

export default Home;
