import axios from "axios";

async function getPlaces({ lat, lng, radius, types, apiKey }) {
  let allPlaces = [];
  // Use Promise.all to fetch types in parallel for speed
  const promises = types.map(async (type) => {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
    const params = { location: `${lat},${lng}`, radius, type, key: apiKey };
    try {
      const res = await axios.get(url, { params });
      return res.data.results;
    } catch (error) {
      console.error(`Error fetching type ${type}:`, error.response?.data?.error_message || error.message);
      return []; // Return empty array on error for a specific type
    }
  });

  const results = await Promise.all(promises);
  results.forEach(places => allPlaces = allPlaces.concat(places));
  
  return allPlaces;
}

/**
 * 🔹 Sorts an array of places by rating or popularity.
 */
function sortPlaces(places, sortBy) {
  if (sortBy === "rating") return places.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (sortBy === "popularity") return places.sort((a, b) => (b.user_ratings_total || 0) - (a.user_ratings_total || 0));
  return places;
}

/**
 * 🔹 A reusable function to fetch, process, and format places.
 * This is the refactored core logic from your original controller.
 */
async function fetchAndProcessPlaces({ lat, lon, radius, types, sort, limit }) {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const typeArray = types.split(",");

    let places = await getPlaces({ lat, lng: lon, radius, types: typeArray, apiKey });

    // Filter out places with very few reviews before sorting
    let filteredPlaces = places.filter(p => (p.user_ratings_total || 0) >= 20);

    // Sort and limit the results
    let processedPlaces = sortPlaces(filteredPlaces, sort).slice(0, Number(limit));

    // Format the data
    const formatted = processedPlaces.map(p => ({
        name: p.name,
        rating: p.rating || "N/A",
        reviews: p.user_ratings_total || 0,
        address: p.vicinity || "",
        location: p.geometry?.location || {},
        // The 'photo' property has been removed to avoid fetching images.
    }));

    // Remove duplicates based on a unique key (name + address)
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
 * 🔹 Calls the Generative AI (Google Gemini) with a specific prompt.
 */
async function callGenerativeAI(prompt) {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    // NOTE: We are using 'gemini-pro' which is a stable alias.
    // The version is 'v1'.
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`;

    try {
        const response = await axios.post(url, {
            contents: [{ parts: [{ text: prompt }] }],
        });
        
        if (!response.data.candidates || response.data.candidates.length === 0) {
            console.error("Gemini API Response blocked or empty:", response.data);
            throw new Error("AI response was blocked or empty. Check safety settings or prompt.");
        }

        return response.data.candidates[0].content.parts[0].text;

    } catch (error) {
        console.error("Gemini API call failed:", error.response?.data?.error || error.message);
        throw new Error("Failed to communicate with the generative AI.");
    }
}


export const GooglePlaces = async (req, res) => {
  try {
    const { destination, radius = 5000, types = "tourist_attraction", sort = "rating", limit = 50 } = req.body;

    if (!destination || !destination.lat || !destination.lon) {
      return res.status(400).json({ error: "Destination with lat & lon is required." });
    }

    const uniquePlaces = await fetchAndProcessPlaces({
        lat: destination.lat,
        lon: destination.lon,
        radius,
        types,
        sort,
        limit
    });

    res.json(uniquePlaces);

  } catch (error) {
    console.error("Google Places API error:", error.message);
    res.status(500).json({ error: "An error occurred while fetching Google Places data." });
  }
};


/**
 * 🚀 New AI Itinerary Generator Controller
 */
export const generateItinerary = async (req, res) => {
    try {
        const { destination, days } = req.body;
        const radius = 10000; // 10km radius as requested

        if (!destination || !destination.name || !destination.lat || !destination.lng) {
            return res.status(400).json({ error: "A valid destination object (name, lat, lng) and number of days are required." });
        }

        // 1. Fetch Top Places, Hotels, and Restaurants in Parallel
        const [topAttractions, topHotels, topRestaurants] = await Promise.all([
            fetchAndProcessPlaces({ lat: destination.lat, lon: destination.lng, radius, types: "tourist_attraction,zoo,art_gallery,temple,landmark", sort: "popularity", limit: 20 }),
            fetchAndProcessPlaces({ lat: destination.lat, lon: destination.lng, radius, types: "hotel,motel,lodging", sort: "rating", limit: 5 }),
            fetchAndProcessPlaces({ lat: destination.lat, lon: destination.lng, radius, types: "restaurant,cafe,bar", sort: "rating", limit: 20 }),
        ]);

        if (topAttractions.length === 0) {
            return res.status(404).json({ error: `Could not find enough attractions in ${destination.name} to generate a plan. Try a larger city or radius.` });
        }

        // 2. Engineer a Powerful Prompt for the Generative AI
        const prompt = `
            You are an expert travel planner. Your task is to create a detailed and practical ${days}-day itinerary for a trip to "${destination.name}".

Here are the lists of places to use for building the itinerary:
-   **Top Tourist Attractions:** ${topAttractions.map(p => p.name).join(", ")}.
-   **Highly-Rated Hotels:** ${topHotels.map(h => h.name).join(", ")}.
-   **Excellent Restaurants, Cafes, and Bars:** ${topRestaurants.map(f => f.name).join(", ")}.

Please follow these instructions carefully:

1.  Select one hotel from the 'Highly-Rated Hotels' list for the entire duration of the stay.
2.  The final output **MUST** be a valid JSON array. Each object in the array represents a day.
3.  For each day, populate the JSON object with the exact structure and keys as specified below.
4.  Group attractions that are geographically close to each other to minimize travel time.
5.  Provide a brief, one-sentence engaging description for each attraction.
6.  Assign a suitable restaurant from the provided list for breakfast, lunch, and dinner each day.
7.  Do not include any introductory text, closing remarks, or any other text outside of the JSON array. The response must start with '[' and end with ']'.

**Required JSON Structure for each day object:**

{
  "day_number": <Day Number>,
  "stay_at": "<Name of Hotel>",
  "meals": {
    "breakfast": {
      "time": "9:00 AM",
      "name": "<Name of Breakfast Restaurant>"
    },
    "lunch": {
      "time": "2:00 PM",
      "name": "<Name of Lunch Restaurant>"
    },
    "dinner": {
      "time": "8:00 PM",
      "name": "<Name of Dinner Restaurant>"
    }
  },
  "morning_visits": [
    {
      "name": "<Name of First Attraction>",
      "description": "<Brief, engaging description>"
    },
    {
      "name": "<Name of Second Attraction>",
      "description": "<Brief, engaging description>"
    }
  ],
  "afternoon_visits": [
    {
      "name": "<Name of Third Attraction>",
      "description": "<Brief, engaging description>"
    },
    {
      "name": "<Name of Fourth Attraction>",
      "description": "<Brief, engaging description>"
    }
  ],
  "evening_activity": "<Name of Cafe or Bar , write something in brief for visit>."
  }   
   6.  Do not include any introductory text, closing remarks, or any other text outside of the JSON array. The response should start with '[' and end with ']'.
        `;
        
        // 3. Call the Generative AI and Get the Response
        const aiResponseText = await callGenerativeAI(prompt);

        // 4. Clean, Parse, and Send the Response
        // The AI might wrap its response in markdown, so we clean it.
        const cleanedResponse = aiResponseText.replace(/```json/g, "").replace(/```/g, "").trim();
        
        const itinerary = JSON.parse(cleanedResponse);

        res.status(200).json({ itinerary });

    } catch (error) {
        console.error("Itinerary generation failed:", error.message);
        res.status(500).json({ error: "Failed to generate the itinerary. Please try again later." });
    }
};