import eventAgent from "../agents/Events.js";

export const EventsController = async (req, res) => {
  try {
    const { destination, startDate,endDate } = req.body;

    const event=await eventAgent(destination,startDate,endDate);
    const tripPlan = {
      destination,
      startDate,
      endDate,
      event
    };

    res.json({ success: true, tripPlan });
  } catch (error) {
    console.error("Event Agent error:", error.message);
    res.status(500).json({ success: false, error: "Trip planning failed" });
  }
};
