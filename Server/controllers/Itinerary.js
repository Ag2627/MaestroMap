// controllers/itineraryController.js
import Itinerary from '../models/Itinerary.js';
import mongoose from 'mongoose';
/**
 * @desc    Save a new itinerary for the logged-in user
 * @route   POST /api/itinerary/save
 * @access  Private
 */
export const saveItinerary = async (req, res) => {
  try {
    const { destinationName, itineraryData } = req.body;

    // CHANGE HERE: Access `req.user.userid` to match the key in your JWT payload.
    const userId = req.user.userid;

    if (!userId) {
      return res.status(400).json({ message: 'Could not identify user from token.' });
    }

    if (!destinationName || !itineraryData) {
      return res.status(400).json({ message: 'Missing destination or itinerary data' });
    }

    const newItinerary = new Itinerary({
      user: userId,
      destinationName,
      itineraryData,
    });

    await newItinerary.save();

    res.status(201).json({ message: 'Itinerary saved successfully!' });
  } catch (error) {
    console.error('Error saving itinerary:', error);
    res.status(500).json({ message: 'Server error while saving itinerary' });
  }
};

/**
 * @desc    Get all saved itineraries for the logged-in user
 * @route   GET /api/itinerary/my-trips
 * @access  Private
 */
export const getMyTrips = async (req, res) => {
  try {
    // CHANGE HERE: Access `req.user.userid` here as well for consistency.
    const userId = req.user.userid;

    if (!userId) {
      return res.status(400).json({ message: 'Could not identify user from token.' });
    }
    
    const itineraries = await Itinerary.find({ user: userId })
                                       .sort({ createdAt: -1 });

    res.status(200).json({ itineraries });
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({ message: 'Server error while fetching trips' });
  }
};


// --- ADD THIS NEW FUNCTION ---
/**
 * @desc    Get a single trip by its ID
 * @route   GET /api/itinerary/:id
 * @access  Private
 */
export const getTripById = async (req, res) => {
  try {
    const userId = req.user.userid;
    const tripId = req.params.id;

    // Optional: Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(tripId)) {
      return res.status(400).json({ message: 'Invalid trip ID format' });
    }

    // SECURITY: Find the itinerary that BOTH matches the ID AND belongs to the logged-in user.
    // This prevents one user from accessing another user's trips by guessing the ID.
    const itinerary = await Itinerary.findOne({ _id: tripId, user: userId });

    if (!itinerary) {
      // If no trip is found, it's either the wrong ID or it doesn't belong to this user.
      return res.status(404).json({ message: 'Trip not found or you do not have permission to view it.' });
    }

    res.status(200).json(itinerary);

  } catch (error) {
    console.error('Error fetching single trip:', error);
    res.status(500).json({ message: 'Server error while fetching trip' });
  }
};


/**
 * @desc    Delete a trip by its ID
 * @route   DELETE /api/itinerary/:id
 * @access  Private
 */
export const deleteTrip = async (req, res) => {
  try {
    const userId = req.user.userid;
    const tripId = req.params.id;

    // SECURITY: Atomically finds a document that matches BOTH the trip ID
    // and the logged-in user's ID, and then deletes it.
    const deletedTrip = await Itinerary.findOneAndDelete({ _id: tripId, user: userId });

    // If no trip was found/deleted, it means it either didn't exist
    // or the user didn't have permission to delete it.
    if (!deletedTrip) {
      return res.status(404).json({ message: 'Trip not found or you do not have permission to delete it.' });
    }

    res.status(200).json({ message: 'Trip deleted successfully.' });

  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ message: 'Server error while deleting trip' });
  }
};