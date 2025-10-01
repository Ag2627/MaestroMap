import express from "express";
import { signup,signin , verifyEmail } from "../controllers/Auth.js";
const router = express.Router();


router.post("/signup",signup);
router.post("/signin",signin);
router.get("/verify-email", verifyEmail);

export default router;