import express from "express";
import { orchestrateTrip } from "../controllers/Orchestrator.js";

const router = express.Router();

router.post("/plan", orchestrateTrip);

export default router;
