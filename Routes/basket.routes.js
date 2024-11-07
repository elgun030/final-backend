import express from "express";
import {
  addToCart,
  getCartItems,
  updateCartItem,
  deleteCartItem,
} from "../Controller/basket.controller.js";

const router = express.Router();

router.post("/add", addToCart);
router.get("/:userId", getCartItems);
router.patch("/", updateCartItem);
router.delete("/:userId/:productId", deleteCartItem);

export default router;
