import express from 'express';
import { generateItinerary } from '../agents/Itinerary.js'; 
import { saveItinerary , getMyTrips,getTripById , deleteTrip } from '../controllers/Itinerary.js';
import { protect } from '../middlewares/authMiddleware.js';
// Create a new router instance
const router = express.Router();

router.post('/generate', generateItinerary);
router.post('/save', protect, saveItinerary);
router.get('/my-trips', protect, getMyTrips);
router.get('/:id', protect, getTripById);
router.delete('/:id', protect, deleteTrip);
export default router;