const express = require("express");
const { Payment } = require("../controller/paymentcontroller");
const { verifyUserToken } = require("../controller/usercontroller");
const router = express.Router();

router.post("/payment", verifyUserToken, Payment);

module.exports = router;
