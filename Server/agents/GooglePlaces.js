import axios from "axios";

// 🔹 Fetch places nearby
async function getPlaces({ lat, lng, radius = 5000, types = ["tourist_attraction"], apiKey }) {
  let allPlaces = [];

  for (const type of types) {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
    const params = { location: `${lat},${lng}`, radius, type, key: apiKey };
    const res = await axios.get(url, { params });
    allPlaces = allPlaces.concat(res.data.results);
  }

  return allPlaces;
}

// 🔹 Sort results
function sortPlaces(places, sortBy) {
  if (sortBy === "rating") return places.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (sortBy === "popularity") return places.sort((a, b) => (b.user_ratings_total || 0) - (a.user_ratings_total || 0));
  return places;
}

// 🔹 Main controller
export const GooglePlaces = async (req, res) => {
  try {
    const { destination, radius = 5000, types = "tourist_attraction", sort = "rating", limit = 100 } = req.body;

    if (!destination || !destination.lat || !destination.lon) {
      return res.status(400).json({ error: "Destination with lat & lon required from frontend" });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const typeArray = types.split(",");

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
      .filter(p => p.reviews >= 20); // only 10+ reviews

    // ✅ Remove duplicates based on name + lat/lng
    const uniquePlaces = [];
    const seen = new Set();

    for (const p of formatted) {
      const key = `${p.name}-${p.location.lat}-${p.location.lng}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniquePlaces.push(p);
      }
    }

    res.json(uniquePlaces);

  } catch (error) {
    console.error("Google Places API error:", error.response?.data || error.message);
    res.status(500).json({ error: "Google Places fetch error" });
  }
};
