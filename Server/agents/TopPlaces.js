import axios from "axios";

// ---------------- Google Places ----------------
async function fetchGooglePlaces({ lat, lon, radius = 5000, types = ["tourist_attraction"], sort = "rating", limit = 100, apiKey }) {
  let allPlaces = [];

  for (const type of types) {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`;
    const params = { location: `${lat},${lon}`, radius, type, key: apiKey };
    const res = await axios.get(url, { params });
    allPlaces = allPlaces.concat(res.data.results);
  }

  // Sort
  if (sort === "rating") allPlaces.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  if (sort === "popularity") allPlaces.sort((a, b) => (b.user_ratings_total || 0) - (a.user_ratings_total || 0));

  // Limit & format
  return allPlaces.slice(0, limit).map(p => ({
    name: p.name,
    rating: p.rating || "N/A",
    reviews: p.user_ratings_total || 0,
    address: p.vicinity || "",
    location: p.geometry?.location || {},
    photo: p.photos?.[0]
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photos[0].photo_reference}&key=${apiKey}`
      : null
  }));
}

// ---------------- OpenTripMap ----------------
const OTM_BASE = "https://api.opentripmap.com/0.1/en";

async function fetchOTMPlaces({ lat, lon, kinds = "interesting_places", radius = 5000, limit = 20, apiKey }) {
  const radiusUrl = `${OTM_BASE}/places/radius`;
  const params = { lat, lon, kinds, radius, limit, apikey: apiKey };
  const resp = await axios.get(radiusUrl, { params });
  const features = resp.data.features || [];

  const formatted = await Promise.all(
    features.filter(f => f.properties.name && f.properties.name.trim() !== "").map(async feat => {
      const { properties: props, geometry: geom } = feat;
      const basic = {
        name: props.name,
        kinds: props.kinds,
        location: { lat: geom.coordinates[1], lon: geom.coordinates[0] },
        xid: props.xid,
        dist: props.dist
      };
      // Fetch details
      try {
        const detailResp = await axios.get(`${OTM_BASE}/places/xid/${props.xid}`, { params: { apikey: apiKey } });
        const detail = detailResp.data;
        basic.wikipedia = detail.wikipedia;
        basic.address = detail.address;
        basic.description = detail.description;
        if (detail.preview && detail.preview.source) basic.image = detail.preview.source;
      } catch (e) {
        console.warn("Failed to fetch details for XID:", props.xid);
      }
      return basic;
    })
  );

  return formatted.slice(0, limit);
}

// ---------------- Main Controller ----------------
export const TopPlaces = async (req, res) => {
  try {
    const { provider = "google", destination, radius = 5000, types = "tourist_attraction", sort = "rating", limit = 50 } = req.body;

    if (!destination || !destination.lat || !destination.lon) {
      return res.status(400).json({ error: "Destination with lat & lon required" });
    }

    if (provider === "google") {
      const apiKey = process.env.GOOGLE_MAPS_API_KEY;
      const typeArray = types.split(",");
      const places = await fetchGooglePlaces({ lat: destination.lat, lon: destination.lon, radius, types: typeArray, sort, limit, apiKey });
      return res.json(places);
    }

    if (provider === "opentripmap") {
      const apiKey = process.env.OPENTRIP_API_KEY;
      const places = await fetchOTMPlaces({ lat: destination.lat, lon: destination.lon, radius, kinds: types, limit, apiKey });
      return res.json(places);
    }

    return res.status(400).json({ error: "Invalid provider" });
  } catch (err) {
    console.error("Fetch places error:", err.message || err);
    return res.status(500).json({ error: "Failed to fetch places" });
  }
};
