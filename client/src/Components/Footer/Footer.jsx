import React from "react";
import { assets } from "../../assets/images/assets";
import logo from "../../assets/images/logo.png";

const Footer = () => {
  return (
    <div className="flex items-center justify-between gap-4 py-3 mt-20">
      <img src={logo } width={150} />
      <p className="flex-1 border-l border-gray-400 pl-4 text-gray-500 max-sm:hidden">
        Copyright @LOGORA.dev | All right reserved.
      </p>
      <div className="flex gap-2.5 cursor-pointer">
        <img src={assets.facebook_icon} width={35} />
        <img src={assets.twitter_icon} width={35} />
        <img src={assets.instagram_icon} width={35} />
      </div>
    </div>
  );
};

export default Footer;
