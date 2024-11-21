import express from "express";
import {
  getAllNews,
  getSingleNews,
  createNews,
  editNews,
  deleteNews,
} from "../Controller/news.controller.js";

const router = express.Router();

router.get("/", getAllNews);
router.get("/:id", getSingleNews);
router.post("/", createNews);
router.put("/:id", editNews);
router.delete("/:id", deleteNews);

export default router;
