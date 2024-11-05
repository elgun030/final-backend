import express from "express";
import {
  createChoreographerEvent,
  getAllChoreographerEvents,
  getChoreographerEventById,
  editChoreographerEvent, // edit fonksiyonunu içe aktar
  deleteChoreographerEvent,
} from "../Controller/choreographerEvent.controller.js";

const router = express.Router();

router.post("/", createChoreographerEvent);
router.get("/", getAllChoreographerEvents);
router.get("/:id", getChoreographerEventById);
router.put("/:id", editChoreographerEvent); // update yerine edit
router.delete("/:id", deleteChoreographerEvent);

export default router;
