import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../Models/user.model.js";

export const checkAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;

    // Log: Decoded token bilgisi
    console.log("Decoded token:", decoded);

    // ObjectId geçerliliğini kontrol et
    if (!mongoose.Types.ObjectId.isValid(req.userId)) {
      return res.status(400).json({ error: "Invalid User ID" });
    }

    const user = await User.findById(req.userId);

    // Log: Kullanıcı bilgilerini kontrol et
    console.log("User fetched from DB:", user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ error: "Admin yetkisi gereklidir." });
    }

    // Admin yetkisi varsa, devam et
    next();
  } catch (error) {
    console.error("Error in checkAdmin middleware:", error);
    res.status(401).json({ error: "Invalid token" });
  }
};
