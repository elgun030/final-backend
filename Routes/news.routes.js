import express from "express";
import {
    getAllNews,
    getSingleNews,
    createNews,
    editNews,
    deleteNews
} from "../Controller/news.controller.js"; // Kontrolör dosyasının yoluna göre ayarlayın

const router = express.Router();

router.get("/", getAllNews); // Tüm haberleri listele
router.get("/:id", getSingleNews); // Tek bir haberi al
router.post("/", createNews); // Yeni haber ekle
router.put("/:id", editNews); // Haber güncelle
router.delete("/:id", deleteNews); // Haber sil

export default router;
