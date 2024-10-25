import express from "express";
import {getAllFaqs,getSingleFaq,createFaq,editFaq,deleteFaq,} from "../Controller/faq.controller.js"


const router = express.Router();


router.get("/", getAllFaqs);
router.get("/:id", getSingleFaq);
router.post("/", createFaq);
router.patch("/:id", editFaq);
router.delete("/:id", deleteFaq);

export default router;



