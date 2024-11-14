// routes.js
import express from "express";
import { protectRoutes } from "../Middleware/protectRoutes.js"; // protectRoutes dosyasını import et

const router = express.Router();

// Korumalı route
router.get("/protected-route", protectRoutes, (req, res) => {
  // Burada, token doğrulandıktan sonra kullanıcı bilgilerine req.userId ile erişilebilir
  res.json({
    message: "Token doğrulandı, erişim sağlandı!",
    userId: req.userId, // Örnek olarak, doğrulanan kullanıcı ID'sini gönder
  });
});

export default router;
