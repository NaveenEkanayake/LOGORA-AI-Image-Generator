const express = require("express");
const {
  Signup,
  LoginUser,
  verifyUserToken,
  getUser,
  refreshToken,
  logout,
  userCredit,
  forgotPassword,
  resetPassword,
} = require("../controller/usercontroller");
const router = express.Router();

router.post("/signup", Signup);
router.post("/login", LoginUser);
router.get("/verifyusertoken", verifyUserToken, getUser);
router.get("/refresh", refreshToken, verifyUserToken, getUser);
router.post("/logout", verifyUserToken, logout);
router.get("/credits", verifyUserToken, userCredit);
router.post("/Customerforgotpassword", forgotPassword);
router.post("/ResetPassword/:id/:token", resetPassword);

module.exports = router;
