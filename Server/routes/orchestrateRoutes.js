import express from "express";
import { orchestrateTrip } from "../controllers/orchestratorController.js";

const router = express.Router();

// POST /api/orchestrator/plan
router.post("/plan", orchestrateTrip);

export default router;
