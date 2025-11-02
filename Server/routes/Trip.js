import express from "express";
// import {
//   searchHotels,
// } from "../controllers/hotelController.js";

import { getTopHotelPriceRange } from "../controllers/hotelController.js";
import { fetchCityCode } from "../controllers/cityCodeController.js";
//import { getHotelEstimate } from "../controllers/hotelController.js";
import { orchestrateTrip } from "../controllers/Orchestrator.js";
import { getFlightCost } from "../agents/flightService.js";
import { findBestRoutes } from "../agents/Routes.js";
import { TopPlaces } from "../agents/TopPlaces.js";
import { OpenTripPlaces } from "../agents/OpenTripPlaces.js";
import { GooglePlaces } from "../agents/GooglePlaces.js";
import { TripWeather } from "../controllers/Weather.js";
import { EventsController } from "../controllers/Event.js";
import { planTrip } from '../agents/comparision.js';
const router = express.Router();

router.post("/plan", orchestrateTrip);
router.post("/weather",TripWeather);
router.post("/events",EventsController);
router.post('/find', findBestRoutes);
router.post("/topplaces", TopPlaces);
router.post("/opentripplaces", OpenTripPlaces);
router.post("/googleplaces",GooglePlaces);
router.post("/city-code", fetchCityCode);
router.post("/top-hotel-price-range", getTopHotelPriceRange);
// router.post("/search", searchHotels);
router.post('/plan-trip', planTrip);

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
