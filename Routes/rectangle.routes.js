import express from "express";
import{getAllRectangles,getSingleRectangle,createRectangle,editRectangle,deleteRectangle} from "../Controller/rectangle.controller.js"
const router = express.Router();


router.get("/", getAllRectangles);
router.get("/:id", getSingleRectangle);
router.post("/", createRectangle);
router.patch("/:id", editRectangle);
router.delete("/:id", deleteRectangle);


export default router;