import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

// === THIS IS THE UPDATED GET ROUTE WITH FULL FILTERING ===
// It handles requests like:
// /api/events?city=mumbai
// /api/events?city=delhi&startDate=2025-10-20
// /api/events?city=bangalore&startDate=2025-11-01&endDate=2025-11-10

router.get('/events', async (req, res) => {
  try {
    const { city, startDate, endDate } = req.query;
    const filter = {};

    // 1. Add city filter if provided (case-insensitive)
    if (city) {
      // We use a regular expression for a case-insensitive search on the nested 'city' field.
      filter['venue.city'] = new RegExp(city, 'i');
    }

    // 2. Build the date range query
    const dateQuery = {};
    if (startDate) {
      // $gte means "greater than or equal to"
      dateQuery.$gte = new Date(startDate);
    }
    if (endDate) {
      // $lte means "less than or equal to"
      const endOfDay = new Date(endDate);
      endOfDay.setUTCHours(23, 59, 59, 999); // Set to the end of the day in UTC
      dateQuery.$lte = endOfDay;
    }

    // 3. Add the date query to the main filter if a date was provided
    if (Object.keys(dateQuery).length > 0) {
      filter.startDate = dateQuery;
    }

    // 4. Find all events matching the filter and sort them by date
    const events = await Event.find(filter).sort({ startDate: 1 });
    
    res.status(200).json({ success: true, data: events });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});


// === POST ROUTE (No changes needed here) ===
// This route is used to manually add events, for example with Postman.
router.post('/', async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

export default router;