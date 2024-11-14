import express from "express";
import {
  getAllEvents,
  getSingleEvent,
  createEvent,
  editEvent,
  deleteEvent,
} from "../Controller/events.controller.js";
import { protectRoutes } from "../Middleware/protectRoutes.js";
import { checkAdmin } from "../Middleware/checkAdmin.js";

const router = express.Router();

router.get("/", getAllEvents);

router.get("/:id", getSingleEvent);

router.post("/", protectRoutes, checkAdmin, createEvent);

router.patch("/:id", protectRoutes, checkAdmin, editEvent);

router.delete("/:id", protectRoutes, checkAdmin, deleteEvent);

export default router;
