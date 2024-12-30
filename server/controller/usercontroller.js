const UserModel = require("../models/usermodel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendForgotPasswordEmail } = require("../Email/UpdatePassword");

//env file
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const Signup = async (req, res) => {
  const { fullname, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password." });
  }

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email.",
        user: existingUser,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new UserModel({
      fullname,
      email,
      password: hashedPassword,
    });

    await user.save();
    return res.status(201).json({
      message: "User created successfully!",
      user,
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const LoginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  try {
    const existingUser = await UserModel.findOne({ email });

    if (!existingUser) {
      return res
        .status(400)
        .json({ message: "User not found. Please sign up." });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
        fullname: existingUser.fullname,
      },
      JWT_SECRET_KEY,
      {
        expiresIn: "2h",
      }
    );
    res.cookie("token", token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 2),
      httpOnly: true,
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Login successful!",
      user: existingUser,
      token,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyUserToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  if (!cookies) {
    return res.status(404).json({ message: "No cookies found" });
  }
  const token = cookies
    .split(";")
    .find((cookie) => cookie.trim().startsWith("token="));
  if (!token) {
    return res.status(404).json({ message: "No Token Found" });
  }

  const actualToken = token.split("=")[1];
  if (!actualToken) {
    return res.status(404).json({ message: "No Token Found" });
  }

  try {
    const decodedUser = jwt.verify(actualToken, JWT_SECRET_KEY);
    req.id = decodedUser.id;
    req.email = decodedUser.email;
    req.fullname = decodedUser.fullname;
    req.userRole = decodedUser.role;
    console.log("Decoded User", decodedUser);
    next();
  } catch (err) {
    console.error("Token verification error:", err.message);
    return res.status(400).json({ message: "Invalid Token" });
  }
};

const getUser = async (req, res) => {
  const userId = req.id;
  try {
    const user = await UserModel.findById(userId, "-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    console.error("Get User error:", err.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const refreshToken = (req, res, next) => {
  const cookies = req.headers.cookie;
  const prevToken = cookies
    ? cookies
        .split(";")
        .find((c) => c.trim().startsWith("token="))
        .split("=")[1]
    : null;

  if (!prevToken) {
    return res.status(400).json({ message: "Couldn't find the token" });
  }

  jwt.verify(prevToken, JWT_SECRET_KEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "Authentication failed" });
    }

    // Generating a new token
    const token = jwt.sign({ id: user.id }, JWT_SECRET_KEY, {
      expiresIn: "2h",
    });
    res.clearCookie("token"); // Clear the old token
    res.cookie("token", token, {
      path: "/",
      expires: new Date(Date.now() + 1000 * 60 * 60 * 2),
      httpOnly: true,
      sameSite: "lax",
    });

    req.id = user.id;
    next();
  });
};

const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies || !cookies.token) {
    return res.status(400).json({ message: "No cookies or token found" });
  }

  const token = cookies.token;

  try {
    jwt.verify(token, JWT_SECRET_KEY);
    res.clearCookie("token", { httpOnly: true });
    return res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const userCredit = async (req, res) => {
  try {
    const userId = req.id;
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      credits: user.creditBalance,
      user: { fullname: user.fullname },
    });
  } catch (err) {
    console.error("User Credit error:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ status: "User not found" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET_KEY, {
      expiresIn: "1h",
    });
    const resetLink = `http://localhost:5173/ResetCustomer/${user._id}/${token}`;

    await sendForgotPasswordEmail(email, resetLink);

    res.send({ status: "Password reset email sent successfully" });
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    res.status(500).send({ status: "Error sending password reset email" });
  }
};

const resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.json({ status: "Error with Token" });
    } else {
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          return UserModel.findByIdAndUpdate(id, { password: hash });
        })
        .then((user) => {
          if (!user) {
            return res.json({ status: "User not found" });
          }
          res.json({ status: "Success" });
        })
        .catch((err) =>
          res.json({ status: "Error updating password", error: err })
        );
    }
  });
};

module.exports = {
  Signup,
  LoginUser,
  verifyUserToken,
  getUser,
  refreshToken,
  logout,
  userCredit,
  forgotPassword,
  resetPassword,
};
