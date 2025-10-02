import axios from "axios";

const BASE = "https://api.opentripmap.com/0.1/en";

// Fetch places around lat/lon
async function getPlaces({ lat, lon, kinds = "interesting_places", radius = 5000, limit = 50 }) {
  const API_KEY = process.env.OPENTRIP_API_KEY;
  if (!API_KEY) throw new Error("OpenTripMap API key missing");

  const url = `${BASE}/places/radius`;
  const params = { lat, lon, kinds, radius, limit, apikey: API_KEY };
  console.log("DEBUG: OpenTripMap request params:", params);

  const resp = await axios.get(url, { params });
  return resp.data.features || [];
}

// Fetch details for a place by XID
async function getPlaceDetails(xid) {
  const API_KEY = process.env.OPENTRIP_API_KEY;
  const url = `${BASE}/places/xid/${xid}`;
  const params = { apikey: API_KEY };

  try {
    const resp = await axios.get(url, { params });
    return resp.data;
  } catch (e) {
    console.warn("Failed to fetch details for XID:", xid);
    return {};
  }
}

// Main controller
export async function OpenTripPlaces(req, res) {
  try {
    const { destination, radius = 5000, kinds = "interesting_places", limit = 100 } = req.body;

    if (!destination || !destination.lat || !destination.lon) {
      return res.status(400).json({ error: "Destination with lat & lon required from frontend" });
    }

    const { lat, lon } = destination;

    const places = await getPlaces({
      lat: Number(lat),
      lon: Number(lon),
      kinds,
      radius: Number(radius),
      limit: Number(limit)
    });

    // Filter out empty names
    const filtered = places.filter(f => f.properties.name && f.properties.name.trim() !== "");

    // Map & fetch details
    const formatted = await Promise.all(
      filtered.map(async feat => {
        const props = feat.properties;
        const geom = feat.geometry;
        const basic = {
          name: props.name,
          kinds: props.kinds,
          location: { lat: geom.coordinates[1], lon: geom.coordinates[0] },
          xid: props.xid,
          dist: props.dist
        };

        const detail = await getPlaceDetails(props.xid);
        basic.wikipedia = detail.wikipedia;
        basic.address = detail.address;
        basic.description = detail.description;
        if (detail.preview && detail.preview.source) basic.image = detail.preview.source;

        return basic;
      })
    );

    formatted.sort((a, b) => (a.dist || 0) - (b.dist || 0));
    res.json(formatted.slice(0, Number(limit)));

  } catch (err) {
    console.error("OpenTripMap error:", err.message || err);
    res.status(500).json({ error: "OpenTripMap fetch error" });
  }
}
