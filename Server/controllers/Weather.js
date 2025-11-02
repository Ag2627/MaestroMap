import weatherAgent from "../agents/Weather.js";

export const TripWeather = async (req, res) => {
  try {
    const { destination, startDate,endDate } = req.body;

    const weather = await weatherAgent(destination, startDate,endDate);
    const tripPlan = {
      destination,
      startDate,
      endDate,
      weather,
    };

    res.json({ success: true, tripPlan });
  } catch (error) {
    console.error("Weather Agent error:", error.message);
    res.status(500).json({ success: false, error: "Trip planning failed" });
  }
};
