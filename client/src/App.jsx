import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Results from "./Pages/Results";
import Home from "./Pages/Home";
import Buycredits from "./Pages/Buycredits";
import LoginForm from "./Components/LoginForm/LoginForm";
import ForgotPasswordForm from "./Components/ForgotPasswordForm/ForgotPasswordForm";
import { AppContext } from "./Context/AppContext";
import ResetPassword from "./Components/ForgotPasswordForm/ResetPassword/ResetPassword";
import CompletePage from "./Pages/CompletePage";
import FailedPage from "./Pages/FailedPage";

const App = () => {
  const { showLogin, showForgotPassword, showResetPassword } =
    useContext(AppContext);

  return (
    <div className="px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50">
      {showLogin && <LoginForm />}
      {showForgotPassword && <ForgotPasswordForm />}
      {showResetPassword && <ResetPassword />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/results" element={<Results />} />
        <Route path="/buycredits" element={<Buycredits />} />
        <Route path="/ResetCustomer/:id/:token" element={<ResetPassword />} />
        <Route path="/completed" element={<CompletePage />} />
        <Route path="/Failed" element={<FailedPage />} />
      </Routes>
    </div>
  );
};

export default App;
