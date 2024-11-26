import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/user.model.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true,
});

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

export const requestPasswordReset = async (req, res) => {
  const { email } = req.body;

  try {
    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Request",
      text: `Click the following link to reset your password: ${resetUrl}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Error sending email" });
      }
      console.log("Password reset email sent to:", email);
      return res.status(200).json({ message: "Password reset email sent" });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    console.log("Password reset token received:", token);

    if (!token) {
      return res.status(400).json({ message: "Token is required" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded.id);

    if (!user) {
      console.log("User not found for token:", token);
      return res.status(404).json({ message: "User not found" });
    }

    if (newPassword.length < 6) {
      console.log("Password too short:", newPassword);
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    console.log("Password successfully reset for user:", user.email);
    return res.status(200).json({ message: "Password successfully reset" });
  } catch (error) {
    console.error("Error in password reset:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const signUp = async (req, res) => {
  const {
    email,
    fullName,
    userName,
    password,
    confirmPassword,
    photo,
    isAdmin,
  } = req.body;

  const responseMessage = [
    ["fullName", "Valid"],
    ["userName", "Valid"],
    ["password", "Valid"],
    ["confirmPassword", "Valid"],
    ["photo", "Valid"],
    ["email", "Valid"],
    ["isAdmin", "Valid"],
  ];

  if (fullName.length < 3)
    responseMessage[0][1] = "Full name must be at least 3 characters";
  if (userName.length < 3)
    responseMessage[1][1] = "Username must be at least 3 characters";
  if (password.length < 6)
    responseMessage[2][1] = "Password must be at least 6 characters";
  if (confirmPassword !== password)
    responseMessage[3][1] = "Passwords do not match";
  if (!photo) responseMessage[4][1] = "Profile picture URL is required";

  if (responseMessage.some(([_, msg]) => msg !== "Valid")) {
    return res.status(400).json({ responseMessage });
  }

  try {
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      const userNameIndex = responseMessage.findIndex(
        ([field]) => field === "userName"
      );
      if (userNameIndex !== -1) {
        responseMessage[userNameIndex][1] = "Username already exists";
      }
      return res.status(400).json({ responseMessage });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      const emailIndex = responseMessage.findIndex(
        ([field]) => field === "email"
      );
      if (emailIndex !== -1) {
        responseMessage[emailIndex][1] = "Email already exists";
      }
      return res.status(400).json({ responseMessage });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      email,
      photo,
      fullName,
      userName,
      password: hashedPassword,
      isAdmin,
    });

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    return res.status(201).json({
      message: "User created successfully",
      data: newUser,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const signIn = async (req, res) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ userName });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Wrong username or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    res.cookie("token", token, {
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
    });

    return res.status(200).json({
      message: "Successfully logged in",
      data: user,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logOut = (req, res) => {
  try {
    res.cookie("token", "", {
      expires: new Date(0),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
    });

    return res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
