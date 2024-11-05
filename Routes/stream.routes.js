import express from "express";
import {
  getAllStreams,
  getSingleStream,
  createStream,
  editStream,
  deleteStream,
} from "../Controller/stream.controller.js";
const router = express.Router();

router.get("/", getAllStreams);
router.get("/:id", getSingleStream);
router.post("/", createStream);
router.patch("/:id", editStream);
router.delete("/:id", deleteStream);
export default router;
