import express from "express";
// import {protectRoutes} from "../Middleware/protectRoutes.js";

import {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
} from "../Controller/ticket.controller.js";

const router = express.Router();
// router.use(protectRoutes);

router.post("/", createTicket);
router.get("/", getTickets);
router.get("/:id", getTicketById);
router.patch("/:id", updateTicket);
router.delete("/:id", deleteTicket);

export default router;
