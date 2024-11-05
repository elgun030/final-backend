import express from "express";
import {addToCart,getCartItems,updateCartItem,deleteCartItem} from "../Controller/basket.controller.js"

const router = express.Router();


router.post("/add", addToCart);
router.get("/", getCartItems);
router.patch("/", updateCartItem);
router.delete("/delete/:id", deleteCartItem);

export default router;
        