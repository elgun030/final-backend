import express from "express";
import {
  getAllRectangles,
  getSingleRectangle,
  createRectangle,
  deleteRectangle,
  editRectangle,
} from "../Controller/rectangle.controller.js";

const router = express.Router();

router.get("/", getAllRectangles);
router.get("/:id", getSingleRectangle);
router.post("/", createRectangle);
router.delete("/:id", deleteRectangle);
router.put("/:id", editRectangle);

export default router;
