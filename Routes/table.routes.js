import express from "express";
import {
  createTable,
  listTables,
  getTableTickets,
} from "../Controller/table.controller.js";
import { checkAdmin } from "../Middleware/checkAdmin.js"; // Admin kontrolü

const router = express.Router();

router.get("/", listTables); // Masaları listele
router.get("/:tableId/tickets", getTableTickets); // Belirli bir masanın biletlerini listele
router.post("/create",checkAdmin, createTable); // Yeni masa oluştur

export default router;
