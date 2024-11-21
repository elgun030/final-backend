// routes.js
import express from "express";
import { protectRoutes } from "../Middleware/protectRoutes.js"; 

const router = express.Router();

router.get("/protected-route", protectRoutes, (req, res) => {
 
  res.json({
    message: "Token verified, access granted!",
    userId: req.userId,
  });
});

export default router;
