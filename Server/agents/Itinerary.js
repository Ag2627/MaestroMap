import axios from "axios";
import { cheap } from "../prompts/cheap.js";
import { intermediate } from "../prompts/intermediate.js";
import { luxury } from "../prompts/luxury.js";

// =================================================================================
// CHANGE #1: Modify getPlaces to accept and use price level filters
// =================================================================================
async function getPlaces({ lat, lng, radius, types, apiKey, minprice, maxprice }) { // <-- MODIFIED LINE
  let allPlaces = [];
  const promises = types.map(async (type) => {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
    
    // Base parameters
    const params = { // <-- MODIFIED BLOCK
      location: `${lat},${lng}`,
      radius,
      type,
      key: apiKey
    };

    // Conditionally add price parameters if they are provided
    if (minprice !== undefined) params.minprice = minprice;
    if (maxprice !== undefined) params.maxprice = maxprice;

    try {
      const res = await axios.get(url, { params });
      return res.data.results;
    } catch (error) {
      console.error(`Error fetching type ${type}:`, error.response?.data?.error_message || error.message);
      return [];
    }
  });

  const results = await Promise.all(promises);
  results.forEach(places => allPlaces = allPlaces.concat(places));
  
  return allPlaces;
}

/**
 * 🔹 Sorts an array of places by rating or popularity. (NO CHANGES HERE)
 */
function sortPlaces(places, sortType) {
  // ... (this function is correct, no changes needed)
  if (sortType === "popularity") {
    return places.sort((a, b) => (b.user_ratings_total || 0) - (a.user_ratings_total || 0));
  }
  if (sortType === "rating") {
    return places.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }
  return places.sort((a, b) => {
    const scoreA = (a.rating || 0) * Math.log((a.user_ratings_total || 0) + 1);
    const scoreB = (b.rating || 0) * Math.log((b.user_ratings_total || 0) + 1);
    return scoreB - scoreA;
  });
}


// =================================================================================
// CHANGE #2: Modify fetchAndProcessPlaces to accept and pass down price filters
// =================================================================================
async function fetchAndProcessPlaces({ lat, lon, radius, types, sort = "combined", limit = 50, minprice, maxprice }) { // <-- MODIFIED LINE
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const typeArray = types.split(",");

  // Pass the price parameters down to getPlaces
  let places = await getPlaces({ // <-- MODIFIED BLOCK
    lat,
    lng: lon,
    radius,
    types: typeArray,
    apiKey,
    minprice,
    maxprice
  });

  // ... (the rest of this function is correct, no changes needed)
  const bannedKeywords = [ "bank", "atm", "school", "hospital", "pharmacy", "university", "office", "store", "supermarket", "government", "insurance", "clinic" ];
  let filteredPlaces = places.filter((p) => (p.user_ratings_total || 0) >= 20 && !bannedKeywords.some((kw) => p.name?.toLowerCase().includes(kw) || p.vicinity?.toLowerCase().includes(kw)));
  const processedPlaces = sortPlaces(filteredPlaces, sort).slice(0, Number(limit));
  const formatted = processedPlaces.map((p) => ({ name: p.name, rating: p.rating || "N/A", reviews: p.user_ratings_total || 0, address: p.vicinity || "", location: p.geometry?.location || {} }));
  const uniquePlaces = [];
  const seen = new Set();
  for (const p of formatted) {
    const key = `${p.name}-${p.address}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniquePlaces.push(p);
    }
  }
  return uniquePlaces;
}


/**
 * 🔹 Calls the Generative AI (Google Gemini) with a specific prompt. (NO CHANGES HERE)
 */
async function callGenerativeAI(prompt) {
  // ... (this function is correct, no changes needed)
  const geminiApiKey = process.env.GEMINI_API_KEY;
  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`;
  try {
      const response = await axios.post(url, { contents: [{ parts: [{ text: prompt }] }], });
      if (!response.data.candidates || response.data.candidates.length === 0) {
          throw new Error("AI response was blocked or empty.");
      }
      return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
      console.error("Gemini API call failed:", error.response?.data?.error || error.message);
      throw new Error("Failed to communicate with the generative AI.");
  }
}


/**
 * Controller for getting Google Places (NO CHANGES HERE)
 */
export const GooglePlaces = async (req, res) => {
  // ... (this function is correct, no changes needed)
  try {
    const { destination, radius = 5000, types = "tourist_attraction", sort = "rating", limit = 50 } = req.body;
    if (!destination || !destination.lat || !destination.lon) {
      return res.status(400).json({ error: "Destination with lat & lon is required." });
    }
    const uniquePlaces = await fetchAndProcessPlaces({ lat: destination.lat, lon: destination.lon, radius, types, sort, limit });
    res.json(uniquePlaces);
  } catch (error) {
    console.error("Google Places API error:", error.message);
    res.status(500).json({ error: "An error occurred while fetching Google Places data." });
  }
};


// =================================================================================
// CHANGE #3: Main logic update in the generateItinerary controller
// =================================================================================
export const generateItinerary = async (req, res) => {
    try {
        const { destination, days, importType } = req.body;
        const radius = 10000;

        if (!destination || !destination.name || !destination.lat || !destination.lng) {
            return res.status(400).json({ error: "A valid destination object (name, lat, lng) and number of days are required." });
        }

        const hotelFetchParams = {
            lat: destination.lat,
            lon: destination.lng,
            radius,
            types: "hotel,motel,lodging,resort,guest_house",
            sort: "combined",
            limit: 30, // Fetch a few more to have options after slicing
        };

        switch (importType) {
            case "cheap":
                hotelFetchParams.maxprice = 2;
                break;
            case "intermediate":
                hotelFetchParams.minprice = 2;
                hotelFetchParams.maxprice = 3;
                break;
            case "luxury":
                hotelFetchParams.minprice = 4;
                break;
        }

        // Fetch the initial sorted lists
        let [topAttractions, topHotels, topRestaurants] = await Promise.all([
            fetchAndProcessPlaces({
                lat: destination.lat,
                lon: destination.lng,
                radius,
                types: "tourist_attraction,zoo,art_gallery,temple,landmark,park,museum",
                sort: "combined",
                limit: 50,
            }),
            fetchAndProcessPlaces(hotelFetchParams),
            fetchAndProcessPlaces({
                lat: destination.lat,
                lon: destination.lng,
                radius,
                types: "restaurant,cafe,bar,bakery",
                sort: "combined",
                limit: 50, // Fetch more restaurants to have options after slicing
            }),
        ]);

        // =========================================================================
        // --- NEW LOGIC BLOCK TO REFINE THE LISTS ---
        // =========================================================================
        // These will hold the final lists we send to the AI.
        let processedHotels = topHotels;
        let processedRestaurants = topRestaurants;

        if (importType === 'intermediate') {
            // For a balanced trip, remove the top 5 most premium/popular options.
            // .slice(5) creates a new array starting from the 6th element (index 5).
            processedHotels = topHotels.slice(5);
            processedRestaurants = topRestaurants.slice(5);
            console.log(`Intermediate style: Removed top 5 hotels/restaurants.`);

        } else if (importType === 'cheap') {
            // For a budget trip, remove the top 10 to dig deeper for hidden gems.
            // .slice(10) creates a new array starting from the 11th element (index 10).
            processedHotels = topHotels.slice(10);
            processedRestaurants = topRestaurants.slice(10);
            console.log(`Budget style: Removed top 10 hotels/restaurants.`);
        }
        // For 'luxury', we do nothing and use the original top-rated lists.
        // =========================================================================


        if (topAttractions.length === 0) {
            return res.status(404).json({ error: `Could not find enough attractions in ${destination.name} to generate a plan.` });
        }
        
        let prompt;
        // IMPORTANT: Use the NEW `processedHotels` and `processedRestaurants` variables here.
        if (importType === "cheap") {
          prompt = cheap(days, destination, topAttractions, processedHotels, processedRestaurants);
        } else if (importType === "intermediate") {
          prompt = intermediate(days, destination, topAttractions, processedHotels, processedRestaurants);
        } else if (importType === "luxury") {
          prompt = luxury(days, destination, topAttractions, processedHotels, processedRestaurants);
        } else {
          console.warn(`Invalid or missing itinerary type received: '${importType}'. Defaulting to intermediate.`);
          prompt = intermediate(days, destination, topAttractions, processedHotels, processedRestaurants);
        }
        
        const aiResponseText = await callGenerativeAI(prompt);
        const cleanedResponse = aiResponseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const itinerary = JSON.parse(cleanedResponse);

        res.status(200).json({ itinerary });

    } catch (error) {
        console.error("Itinerary generation failed:", error.message);
        res.status(500).json({ error: "Failed to generate the itinerary. Please try again later." });
    }
};