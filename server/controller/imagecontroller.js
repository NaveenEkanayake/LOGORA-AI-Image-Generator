const UserModel = require("../models/usermodel");
const FormData = require("form-data");
const axios = require("axios");

const generateImages = async (req, res) => {
  try {
    const userId = req.id;
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).json({ message: "Prompt not provided" });
    }
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.creditBalance === 0) {
      return res.status(400).json({
        message: "Insufficient credit balance",
        creditBalance: user.creditBalance,
      });
    }
    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: {
          "x-api-key": process.env.IMAGE_GENERATION_API,
          ...formData.getHeaders(),
        },
        responseType: "arraybuffer",
      }
    );
    const base64Image = Buffer.from(data, "binary").toString("base64");
    const resultImage = `data:image/png;base64,${base64Image}`;
    user.creditBalance -= 1;
    await user.save();
    res.status(200).json({
      message: "Image Generation Successful",
      creditBalance: user.creditBalance,
      image: resultImage,
    });
  } catch (error) {
    console.error("Error in generateImages:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { generateImages };
