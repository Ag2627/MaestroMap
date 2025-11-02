import axios from "axios";

export default async function eventAgent(destination, startDate, endDate) {
  const TICKETMASTER_API_KEY = process.env.TICKETMASTER_API_KEY || "";

  destination = destination ? destination.trim() : "";
  startDate = startDate ? startDate.trim() : "";
  endDate = endDate ? endDate.trim() : "";

  try {
    let eventData = [];

    // -------------------------------
    // 1️⃣ Try Ticketmaster First (No changes here)
    // -------------------------------
    if (TICKETMASTER_API_KEY) {
      try {
        const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(destination)}&limit=1&appid=${process.env.OPENWEATHER_API_KEY}`;
        const geoRes = await axios.get(geoUrl);
        if (!geoRes.data || geoRes.data.length === 0) {
          throw new Error("Destination not found by OpenWeatherMap");
        }
        const { lat, lon } = geoRes.data[0];

        const tmUrl = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${TICKETMASTER_API_KEY}&latlong=${lat},${lon}&radius=50&startDateTime=${startDate}T00:00:00Z&endDateTime=${endDate}T23:59:59Z`;
        const tmRes = await axios.get(tmUrl);
        const events = tmRes.data._embedded?.events || [];

        eventData = events.map((e) => ({
          name: e.name,
          date: e.dates.start.localDate,
          time: e.dates.start.localTime || "Not specified",
          venue: e._embedded?.venues?.[0]?.name || "Unknown Venue",
          city: e._embedded?.venues?.[0]?.city?.name || "",
          country: e._embedded?.venues?.[0]?.country?.name || "",
          url: e.url,
          source: "Ticketmaster",
        }));
      } catch (err) {
        console.log("Ticketmaster failed:", err.message);
      }
    }

    // ----------------------------------------------------
    // 2️⃣ Fallback to Custom DB if Ticketmaster finds nothing
    // --- THIS IS THE NEW CODE ---
    // ----------------------------------------------------
    if (eventData.length === 0) {
      console.log("No events from Ticketmaster. Falling back to custom DB...");
      try {
        // IMPORTANT: Make sure this URL points to your scraper's backend server
        const customApiUrl = `http://localhost:5000/api/myApi/events?city=${destination}&startDate=${startDate}&endDate=${endDate}`;
        
        const customRes = await axios.get(customApiUrl);

        if (customRes.data.success && customRes.data.data.length > 0) {
          const dbEvents = customRes.data.data;
          
          // Map the data from your database to the standard event format
          eventData = dbEvents.map(e => ({
            name: e.name,
            // Format the date to YYYY-MM-DD
            date: new Date(e.startDate).toISOString().split('T')[0],
            time: e.description.split(' at ')[1] || "Not specified", // Try to get time from description
            venue: e.venue.name || "Unknown Venue",
            city: e.venue.city || "",
            country: "India",
            url: e.url,
            source: e.source, // This will be "AllEvents.in (Scraped)"
          }));
        }
      } catch (err) {
        console.error("Custom DB fallback failed:", err.message);
      }
    }

    // -------------------------------
    // 3️⃣ Return MCP format (No changes here)
    // -------------------------------
    if (eventData.length === 0) {
      return {
        agent: "EventAgent",
        status: "success",
        data: { events: [] },
        message: "No events found for this location/date range from any source.",
      };
    }

    return {
      agent: "EventAgent",
      status: "success",
      data: { events: eventData },
    };
    
  } catch (error) {
    return {
      agent: "EventAgent",
      status: "error",
      error_message: error.message,
    };
  }
}