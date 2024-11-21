import express from "express";
import {
  addEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent,
} from "../Controller/events.controller.js";

const router = express.Router();

router.get("/", getAllEvents);

router.get("/:id", getEventById);

router.post("/add", addEvent);

router.patch("/:id", updateEvent);

router.delete("/:id", deleteEvent);

export default router;
