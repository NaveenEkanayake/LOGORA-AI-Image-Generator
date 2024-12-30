const express = require("express");
const { generateImages } = require("../controller/imagecontroller");
const { verifyUserToken } = require("../controller/usercontroller");
const router = express.Router();

router.post("/generate-image", verifyUserToken, generateImages);

module.exports = router;
