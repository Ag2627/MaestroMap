import express from "express";
import { orchestrateTrip } from "../controllers/Orchestrator.js";
import { getFlightCost } from "../agents/Budget.js";
import { findBestRoutes } from "../agents/Routes.js";
import { TopPlaces } from "../agents/TopPlaces.js";
import { OpenTripPlaces } from "../agents/OpenTripPlaces.js";
import { GooglePlaces } from "../agents/GooglePlaces.js";
const router = express.Router();

router.post("/plan", orchestrateTrip);
router.post('/find', findBestRoutes);
router.post("/topplaces", TopPlaces);
router.post("/opentripplaces", OpenTripPlaces);
router.post("/googleplaces",GooglePlaces);


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
