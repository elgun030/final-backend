import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/user.model.js";

const omitPassword = (user) => {
  const { password, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
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
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable not defined");
    }

    const auth = await User.findOne({ userName });
    if (auth) {
      const userNameIndex = responseMessage.findIndex(
        ([field]) => field === "userName"
      );
      if (userNameIndex !== -1) {
        responseMessage[userNameIndex][1] = "Username already exists";
      }
      return res.status(400).json({ responseMessage });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAuth = await User.create({
      email,
      photo,
      fullName,
      userName,
      password: hashedPassword,
      userName,
      isAdmin,
    });

    const token = jwt.sign({ id: newAuth._id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    return res.status(201).json({
      responseMessage: "User created successfully",
      data: omitPassword(newAuth),
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ responseMessage: "Internal Server Error" });
  }
};

export const signIn = async (req, res) => {
  const { userName, password } = req.body;

  try {
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET environment variable not defined");
    }

    const existingUser = await User.findOne({ userName });

    if (
      !existingUser ||
      !(await bcrypt.compare(password, existingUser.password))
    ) {
      return res.status(401).send({ message: "Wrong username or password" });
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
      expiresIn: "15d",
    });

    res.cookie("token", token, {
      expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      path: "/",
    });

    return res.status(200).send({
      message: "Successfully logged in",
      data: omitPassword(existingUser),
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ responseMessage: "Internal Server Error" });
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

// export const logout = async (req, res) => {
//   res.cookie("jwt", "", {
//     expires: new Date(0),
//     httpOnly: true,
//     path: "/",
//     sameSite: 'Strict'
//   });

//   res.status(200).send("Başarıyla çıkış yapıldı");
// };
