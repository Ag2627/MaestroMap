import axios from "axios";

// Helper 1: getPlaces (No change here)
export async function getPlaces({ lat, lng, radius = 5000, types = ["tourist_attraction"], apiKey }) {
  let allPlaces = [];
  for (const type of types) {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
    const params = { location: `${lat},${lng}`, radius, type, key: apiKey };
    const res = await axios.get(url, { params });
    allPlaces = allPlaces.concat(res.data.results);
  }
  return allPlaces;
}

// Helper 2: sortPlaces (No change here)
export function sortPlaces(places, sortType) {
  // ... your existing sort logic here ...
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



export const fetchAndProcessPlaces = async ({ destination, radius = 10000, types = "tourist_attraction", sort = "rating", limit = 100 }) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY; 
  const typeArray = Array.isArray(types) ? types : types.split(",");

  let places = await getPlaces({ lat: destination.lat, lng: destination.lon, radius, types: typeArray, apiKey });

  places = sortPlaces(places, sort).slice(0, Number(limit));

  const formatted = places
    .map(p => ({
      name: p.name,
      rating: p.rating || "N/A",
      reviews: p.user_ratings_total || 0,
      address: p.vicinity || "",
      location: p.geometry?.location || {},
      photo: p.photos?.[0]
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photos[0].photo_reference}&key=${apiKey}`
        : null
    }))
    .filter(p => p.reviews >= 20);

  const uniquePlaces = [];
  const seen = new Set();
  for (const p of formatted) {
    const key = `${p.name}-${p.location.lat}-${p.location.lng}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniquePlaces.push(p);
    }
  }

  return uniquePlaces;
};



export const GooglePlaces = async (req, res) => {
  try {
    const { destination, radius, types, sort, limit } = req.body;

    if (!destination || !destination.lat || !destination.lon) {
      return res.status(400).json({ error: "Destination with lat & lon required from frontend" });
    }

    // Call the reusable function
    const uniquePlaces = await fetchAndProcessPlaces({ destination, radius, types, sort, limit });

    res.json(uniquePlaces);

  } catch (error) {
    console.error("Google Places API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Google Places fetch error" });
  }
};