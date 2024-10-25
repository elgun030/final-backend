import express from "express";
import {getAllEvents,getSingleEvent,createEvent,editEvent,deleteEvent} from "../Controller/events.controller.js"


const router = express.Router();

router.get("/", getAllEvents);
router.get("/:id", getSingleEvent);
router.post("/", createEvent);
router.patch("/:id", editEvent);
router.delete("/:id", deleteEvent);


export default router;



