import jwt from "jsonwebtoken";
export const protectRoutes = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.userId = decoded.id; 
    next();
  } catch (error) {
    console.error("Error in token verification:", error); 
    return res.status(401).json({ message: "Invalid token" });
  }
};
