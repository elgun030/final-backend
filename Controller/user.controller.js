import User from "../Models/user.model.js";
import bcrypt from "bcrypt";

export const createUser = async (req, res) => {
  try {
    const { email, password, fullName, userName, photo } = req.body;

    if (!email || !password || !fullName || !userName || !photo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({
      $or: [{ email }, { userName }, { photo }],
    });
    if (userExists) {
      let conflictField = "";
      if (userExists.email === email) conflictField = "Email";
      else if (userExists.userName === userName) conflictField = "Username";
      else if (userExists.photo === photo) conflictField = "Photo";

      return res
        .status(400)
        .json({ message: `${conflictField} already exists` });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      fullName,
      userName,
      photo,
    });
    await newUser.save();

    const userResponse = {
      id: newUser._id,
      email: newUser.email,
      fullName: newUser.fullName,
      userName: newUser.userName,
      photo: newUser.photo,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    res
      .status(201)
      .json({ message: "User created successfully", user: userResponse });
  } catch (error) {
    console.error("Error in createUser:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } already exists`,
      });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsers:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getSingleUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in getSingleUser:", error);
    res.status(500).json({ message: "Error fetching user" });
  }
};

export const editUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Kullanıcının varlığını kontrol etme
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const { email, password, fullName, userName, photo } = req.body;

    const updateData = { email, fullName, userName, photo };

    if (password) {
      // Eğer şifre varsa, hashleme yapıyoruz
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    res
      .status(200)
      .json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error in editUser:", error);
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        message: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } already exists`,
      });
    }
    res
      .status(500)
      .json({ message: "Error editing user", error: error.message }); // Daha detaylı hata mesajı
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Deleting user with ID:", userId);

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    res.status(500).json({ message: "Error deleting user", error });
  }
};
