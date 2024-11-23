import express from "express";
import { signIn, signUp, logOut,requestPasswordReset,resetPassword } from "../Controller/auth.controller.js";

const router = express.Router();

router.post("/sign-in", signIn);
router.post("/sign-up", signUp);
router.post("/logOut", logOut);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);


// router.post("/logout", logout);

export default router;
