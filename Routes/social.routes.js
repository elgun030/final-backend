import express from "express";
import {getAllSocials,getSingleSocial,createSocial,editSocial,deleteSocial} from "../Controller/social.controller.js"


const router = express.Router();


router.get("/", getAllSocials);
router.get("/:id", getSingleSocial);
router.post("/", createSocial);
router.patch("/:id", editSocial);
router.delete("/:id", deleteSocial);

export default router;
