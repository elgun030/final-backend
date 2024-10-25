import express from "express";
import {
  createUser,
  getUsers,
  getSingleUser,
  editUser,
  deleteUser,
} from "../Controller/user.controller.js";

const router = express.Router();

router.post("/", createUser);

router.get("/", getUsers);

router.get("/:id", getSingleUser);

router.put("/:id", editUser);

router.delete("/:id", deleteUser);

export default router;
