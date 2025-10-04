import express from 'express';
import { generateItinerary } from '../agents/Itinerary.js'; 

// Create a new router instance
const router = express.Router();

router.post('/generate', generateItinerary);


export default router;