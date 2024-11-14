import express from "express";
import {
  createTicket,
  buyTicket,
  listTickets,
  getUserTickets,
  updateTicketStatus,
  getEventTickets,
} from "../Controller/ticket.controller.js";

const router = express.Router();

// Biletlerle ilgili diğer işlemler
router.get("/", listTickets);
router.get("/user/:userId", getUserTickets); // Kullanıcıya özel bilet listeleme
router.post("/create", createTicket); // Bilet oluşturma
router.post("/buy", buyTicket); // Bilet satın alma
router.patch("/update-status", updateTicketStatus); // Bilet durumu güncelleme

// Etkinlik biletlerini almak için route
router.get("/events/:eventId/tickets", getEventTickets);

export default router;
