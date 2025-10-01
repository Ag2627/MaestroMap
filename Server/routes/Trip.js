import express from "express";
import { orchestrateTrip } from "../controllers/Orchestrator.js";
import { getFlightCost } from "../agents/Budget.js";

const router = express.Router();

router.post("/plan", orchestrateTrip);

router.post("/test-flight", async (req, res) => {
  try {
    const { source, destination } = req.body;
    const flight = await getFlightCost(source, destination, 'INR');
    res.json(flight);
  } catch (err) {
    console.error("Flight test error:", err.message);
    res.status(500).json({ error: "Flight test failed" });
  }
});

export default router;
