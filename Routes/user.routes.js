import express from "express";
import {
  createUser,
  getUsers,
  getSingleUser,
  deleteUser,
} from "../Controller/user.controller.js";
import { addToCart } from "../Controller/product.controller.js";

const router = express.Router();

router.post("/", createUser);

router.get("/", getUsers);

router.get("/:id", getSingleUser);

router.delete("/:id", deleteUser);

router.post("/add-to-cart", addToCart);

export default router;
