import express from "express";
import {
  getAllGallery,
  getSingleGallery,
  createGallery,
  editGallery,
  deleteGallery,
} from "../Controller/gallery.controller.js";

const router = express.Router();

router.get("/", getAllGallery);
router.get("/:id", getSingleGallery);
router.post("/add", createGallery);
router.patch("/:id", editGallery);
router.delete("/:id", deleteGallery);

export default router;
