import axios from 'axios';
// Assume fetchAndProcessPlaces is correctly imported and can accept a 'types' array.
import { fetchAndProcessPlaces } from './GooglePlaces.js'; 
import { generateComparisonPrompt } from '../prompts/comparision.js';

// --- CONSTANTS for better place filtering ---
const PLACES_TYPES = [,"tourist_attraction","museum", "art_gallery", "park", "zoo", "aquarium", "landmark",];
const UNWANTED_PLACE_KEYWORDS = ["school", "bank", "atm", "college", "university", "post office", "hotel","bar"];

// =================================================================
// SECTION 1: AI SERVICE LOGIC (INTERNAL HELPER)
// =================================================================
const getAiComparison = async (dest1Name, places1, dest2Name, places2, travelType) => {
    // This function remains the same.
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        // NOTE: Make sure the model name is correct for your key. 'gemini-pro' is more common.
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        const prompt = generateComparisonPrompt(dest1Name, places1, dest2Name, places2, travelType);
        
        const requestBody = { contents: [{ parts: [{ text: prompt }] }] };
        const response = await axios.post(url, requestBody);

        const aiResponseText = response.data.candidates[0].content.parts[0].text;
        const cleanedResponse = aiResponseText.replace(/```json/g, '').replace(/```/g, '').trim();
        
        return JSON.parse(cleanedResponse);

    } catch (error) {
        console.error('Error with Gemini API:', error.response ? error.response.data : error.message);
        throw new Error('Could not get comparison from Gemini API.');
    }
};

// =================================================================
// SECTION 2: NEW HELPER FUNCTION FOR FILTERING
// =================================================================

/**
 * Filters out unwanted places based on keywords from the fetched list.
 * @param {Array} places - The array of place objects from fetchAndProcessPlaces.
 * @returns {Array} - A cleaner, filtered array of places.
 */
const filterPlaces = (places) => {
    return places.filter(place => {
        const placeNameLower = place.name.toLowerCase();
        // Return true (keep the place) if NO unwanted keyword is found in its name.
        return !UNWANTED_PLACE_KEYWORDS.some(keyword => placeNameLower.includes(keyword));
    });
};


// =================================================================
// SECTION 3: MAIN CONTROLLER (UPDATED)
// =================================================================

export const planTrip = async (req, res) => {
  try {
    const { destination1, destination2, travelType } = req.body;

    if (!destination1?.lat || !destination2?.lat || !travelType) {
      return res.status(400).json({ error: 'Requires two destinations (with lat, lon, name) and a travel type.' });
    }

    // UPDATED: Pass the PLACES_TYPES to get a wider variety of interesting places.
    const [places1, places2] = await Promise.all([
      fetchAndProcessPlaces({ 
          destination: destination1, 
          limit: 100, // Get more initially to have enough after filtering
          sort: 'combined',
          types: PLACES_TYPES // <-- Using your constant here
      }),
      fetchAndProcessPlaces({ 
          destination: destination2, 
          limit: 100,
          sort: 'combined',
          types: PLACES_TYPES // <-- Using your constant here
      })
    ]);

    // NEW: Filter the results to remove noise.
    const filteredPlaces1 = filterPlaces(places1);
    const filteredPlaces2 = filterPlaces(places2);

    // NEW: Take the top 7 best places AFTER filtering. This is the "best of the best".
    const topPlaces1 = filteredPlaces1.slice(0, 7);
    const topPlaces2 = filteredPlaces2.slice(0, 7);

    // UPDATED: Check the length of the *final* lists.
    if (topPlaces1.length < 3 || topPlaces2.length < 3) { // Ensure we have at least a few places
      return res.status(404).json({ error: 'Could not find enough relevant attractions for one or both destinations.' });
    }

    // UPDATED: Send the clean, high-quality lists to the AI.
    const aiAnalysis = await getAiComparison(destination1.name, topPlaces1, destination2.name, topPlaces2, travelType);

    res.status(200).json({ plan: aiAnalysis });

  } catch (error) {
    console.error("Trip planning error:", error.message);
    res.status(500).json({ error: error.message || 'An internal server error occurred.' });
  }
};