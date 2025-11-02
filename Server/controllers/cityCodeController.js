import { getCityCode } from "../agents/cityCodeService.js";

export async function fetchCityCode(req, res) {
  const { city } = req.body;
  if (!city) return res.status(400).json({ error: "City name is required" });

  try {
    const cityData = await getCityCode(city); // <-- matches the export
    if (!cityData) return res.status(404).json({ error: "City not found" });

    res.json(cityData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch city code" });
  }
}

