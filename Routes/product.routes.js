import express from "express";
import {createProduct,getProducts,getSingleProduct,editProduct,deleteProduct} from "../Controller/product.controller.js";


const router = express.Router();


router.post("/", createProduct); 
router.get("/", getProducts); 
router.get("/:id", getSingleProduct); 
router.patch("/:id", editProduct); 
router.delete("/:id", deleteProduct); 

export default router;
