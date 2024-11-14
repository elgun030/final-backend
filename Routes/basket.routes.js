import express from "express";
import {
  addToCart,
  getCartItems,
  updateCartItem,
  deleteCartItem,
} from "../Controller/basket.controller.js";

const router = express.Router();

// Sepete ürün eklemek
router.post("/add", addToCart);

// Kullanıcının sepetindeki ürünleri almak
router.get("/:userId", getCartItems);

// Sepet öğesini güncellemek (productId ile)
router.patch("/:productId", updateCartItem);  // Burada productId parametresi ekledik

// Sepet öğesini silmek
router.delete("/:userId/:productId", deleteCartItem);

export default router;
