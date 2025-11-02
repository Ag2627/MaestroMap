// // import weatherAgent from "../agents/Weather.js";
// // import eventAgent from "../agents/Events.js";
// // //import {findBestRoutes} from "../agents/Routes.js";
// // import  {mapAgent}  from "../agents/MapAgent.js";
// // // run promise with timeout; fallback should be an MCP-shaped object
// // const withTimeout = (p, ms, fallback) => new Promise((resolve) => {
// //   let done = false;
// //   const timer = setTimeout(() => {
// //     if (!done) { done = true; resolve(fallback); }
// //   }, ms);
// //   p.then((r) => { if (!done) { done = true; clearTimeout(timer); resolve(r); }}).catch((err) => {
// //     if (!done) { done = true; clearTimeout(timer); resolve({ agent: fallback.agent || "Unknown", status: "error", error_message: err.message || String(err) }); }
// //   });
// // });

// // const normalize = (res, agentName) => {
// //   if (!res) return { agent: agentName, status: "error", error_message: "No response" };
// //   if (res.status === "error") return { agent: res.agent || agentName, status: "error", error_message: res.error_message || res.message || "Agent error" };
// //   return { agent: res.agent || agentName, status: "success", data: res.data || {} };
// // };

// // function buildSummary({ weather, events, map }) {
// //   const parts = [];
// //   if (weather.status === "success") {
// //     const f = weather.data?.forecast?.[0];
// //     if (f) parts.push(`Weather: ${f.description} ${f.tempMin}–${f.tempMax}°C.`);
// //     else parts.push("Weather: forecast available.");
// //   } else parts.push(`Weather: ${weather.error_message || "not available"}.`);

// //   if (events.status === "success") {
// //     const n = events.data?.events?.length || 0;
// //     parts.push(n > 0 ? `Events: ${n} found.` : "Events: none found.");
// //   } else parts.push(`Events: ${events.error_message || "not available"}.`);

// //   if (map.status === "success") {
// //     const r = (map.data?.routes?.length ?? 0);
// //     parts.push(`Routes: ${r} route(s) computed.`);
// //   } else parts.push(`Routes: ${map.error_message || "not available"}.`);

// //   return parts.join(" ");
// // }

// // export const orchestrateTrip = async (req, res) => {
// //   try {
// //     // Accept multiple common field names just in case frontends differ
// //     const { origin, destination, startDate, endDate, date } = req.body || {};
// //     const sd = startDate || date;
// //     const ed = endDate || date;

// //     if (!destination || !sd || !ed) {
// //       return res.status(400).json({ success: false, error: "destination, startDate and endDate are required" });
// //     }

// //     // timeouts in ms
// //     const TIMEOUTS = { weather: 7000, events: 6000, maps: 7000 };

// //     const weatherP = withTimeout(weatherAgent(destination, sd, ed), TIMEOUTS.weather, { agent: "WeatherAgent", status: "error", error_message: "Weather timed out" });
// //     const eventsP = withTimeout(eventAgent(destination, sd, ed), TIMEOUTS.events, { agent: "EventAgent", status: "error", error_message: "Events timed out" });
// //     const mapsP = withTimeout(mapAgent(origin || "", destination, "DRIVE"), TIMEOUTS.maps, { agent: "findBestRoutes", status: "error", error_message: "Maps timed out" });

// //     const [wRes, eRes, mRes] = await Promise.all([weatherP, eventsP, mapsP]);

// //     const weather = normalize(wRes, "WeatherAgent");
// //     const events = normalize(eRes, "EventAgent");
// //     const map = normalize(mRes, "findBestRoutes");

// //     const tripPlan = {
// //       destination,
// //       startDate: sd,
// //       endDate: ed,
// //       createdAt: new Date().toISOString(),
// //       agents: { weather, events, map },
// //       summary: buildSummary({ weather, events, map })
// //     };

// //     return res.json({ success: true, tripPlan });
// //   } catch (err) {
// //     console.error("Orchestration Error:", err.message || err);
// //     return res.status(500).json({ success: false, error: "Trip orchestration failed" });
// //   }
// // };


// import weatherAgent from "../agents/Weather.js";
// import eventAgent from "../agents/Events.js";
// import { mapAgent } from "../agents/MapAgent.js";

// // run promise with timeout; fallback returns MCP-shaped object
// const withTimeout = (p, ms, fallback) => new Promise((resolve) => {
//   let done = false;
//   const timer = setTimeout(() => {
//     if (!done) { done = true; resolve(fallback); }
//   }, ms);
//   p.then((r) => { if (!done) { done = true; clearTimeout(timer); resolve(r); }}).catch((err) => {
//     if (!done) { done = true; clearTimeout(timer); resolve({ agent: fallback.agent || "Unknown", status: "error", error_message: err.message || String(err) }); }
//   });
// });

// // normalize agent response
// const normalize = (res, agentName) => {
//   if (!res) return { agent: agentName, status: "error", error_message: "No response" };
//   if (res.status === "error") return { agent: res.agent || agentName, status: "error", error_message: res.error_message || res.message || "Agent error" };
//   return { agent: res.agent || agentName, status: "success", data: res.data || {} };
// };

// // build short human-readable summary
// function buildSummary({ weather, events, map }) {
//   const parts = [];
//   if (weather.status === "success") {
//     const f = weather.data?.forecast?.[0];
//     if (f) parts.push(`Weather: ${f.description} ${f.tempMin}–${f.tempMax}°C.`);
//     else parts.push("Weather: forecast available.");
//   } else parts.push(`Weather: ${weather.error_message || "not available"}.`);

//   if (events.status === "success") {
//     const n = events.data?.events?.length || 0;
//     parts.push(n > 0 ? `Events: ${n} found.` : "Events: none found.");
//   } else parts.push(`Events: ${events.error_message || "not available"}.`);

//   if (map.status === "success") {
//     const r = (map.data?.routes?.length ?? 0);
//     parts.push(`Routes: ${r} route(s) computed.`);
//   } else parts.push(`Routes: ${map.error_message || "not available"}.`);

//   return parts.join(" ");
// }

// // frontend-ready version of tripPlan
// const cleanTripPlan = ({ destination, sd, ed, weather, events, map }) => {
//   // Weather summary (just first day or general)
//   const weatherSummary = weather.status === "success" && weather.data?.forecast?.length
//     ? { summary: `${weather.data.forecast[0].description} ${weather.data.forecast[0].tempMin}–${weather.data.forecast[0].tempMax}°C` }
//     : { summary: "Not available" };

//   // Events array simplified
//   const eventsList = events.status === "success" && events.data?.events?.length
//     ? events.data.events.map(e => ({
//         name: e.name,
//         date: e.date,
//         venue: e.venue,
//         url: e.url
//       }))
//     : [];

//   // Routes simplified
//   const routesList = map.status === "success" && map.data?.routes?.length
//     ? map.data.routes.map(r => ({
//         distance: r.distanceMeters ? `${Math.round(r.distanceMeters/1000)} km` : "",
//         duration: r.duration ? `${Math.ceil(r.duration/60)} min` : "",
//         polyline: r.polyline?.encodedPolyline || ""
//       }))
//     : [];

//   return {
//     destination,
//     startDate: sd,
//     endDate: ed,
//     summary: buildSummary({ weather, events, map }),
//     agents: {
//       weather: weatherSummary,
//       events: eventsList,
//       map: routesList
//     },
//     createdAt: new Date().toISOString()
//   };
// };

// // orchestrator endpoint
// export const orchestrateTrip = async (req, res) => {
//   try {
//     const { origin, destination, startDate, endDate, date } = req.body || {};
//     const sd = startDate || date;
//     const ed = endDate || date;

//     if (!destination || !sd || !ed) {
//       return res.status(400).json({ success: false, error: "destination, startDate and endDate are required" });
//     }

//     // set timeouts
//     const TIMEOUTS = { weather: 7000, events: 6000, maps: 7000 };

//     const weatherP = withTimeout(weatherAgent(destination, sd, ed), TIMEOUTS.weather, { agent: "WeatherAgent", status: "error", error_message: "Weather timed out" });
//     const eventsP = withTimeout(eventAgent(destination, sd, ed), TIMEOUTS.events, { agent: "EventAgent", status: "error", error_message: "Events timed out" });
//     const mapsP = withTimeout(mapAgent(origin || "", destination, "DRIVE"), TIMEOUTS.maps, { agent: "MapsAgent", status: "error", error_message: "Maps timed out" });

//     const [wRes, eRes, mRes] = await Promise.all([weatherP, eventsP, mapsP]);

//     const weather = normalize(wRes, "WeatherAgent");
//     const events = normalize(eRes, "EventAgent");
//     const map = normalize(mRes, "MapsAgent");

//     const tripPlan = cleanTripPlan({ destination, sd, ed, weather, events, map });

//     return res.json({ success: true, tripPlan });
//   } catch (err) {
//     console.error("Orchestration Error:", err.message || err);
//     return res.status(500).json({ success: false, error: "Trip orchestration failed" });
//   }
// };


import weatherAgent from "../agents/Weather.js";
import eventAgent from "../agents/Events.js";
import { mapAgent } from "../agents/MapAgent.js";

// run promise with timeout
const withTimeout = (p, ms, fallback) => new Promise(resolve => {
  let done = false;
  const timer = setTimeout(() => { if (!done) { done = true; resolve(fallback); } }, ms);
  p.then(r => { if (!done) { done = true; clearTimeout(timer); resolve(r); } })
   .catch(err => { if (!done) { done = true; clearTimeout(timer); resolve({ agent: fallback.agent || "Unknown", status: "error", error_message: err.message || String(err) }); } });
});

// normalize agent response
const normalize = (res, agentName) => {
  if (!res) return { agent: agentName, status: "error", error_message: "No response" };
  if (res.status === "error") return { agent: res.agent || agentName, status: "error", error_message: res.error_message || res.message || "Agent error" };
  return { agent: res.agent || agentName, status: "success", data: res.data || {} };
};

// build summary text
function buildSummary({ weather, events, map, cost }) {
  const parts = [];
  parts.push(`Estimated Cost: ₹${cost}`);
  
  if (weather.status === "success") {
    const f = weather.data?.forecast?.[0];
    if (f) parts.push(`Weather: ${f.description} ${f.tempMin}–${f.tempMax}°C`);
    else parts.push("Weather: forecast available.");
  } else parts.push(`Weather: ${weather.error_message || "not available"}`);

  if (events.status === "success") {
    const n = events.data?.events?.length || 0;
    parts.push(n > 0 ? `Events: ${n} found` : "Events: none found");
  } else parts.push(`Events: ${events.error_message || "not available"}`);

  if (map.status === "success") {
    const r = map.data?.routes?.length ?? 0;
    parts.push(`Routes: ${r} route(s)`);
  } else parts.push(`Routes: ${map.error_message || "not available"}`);
  
  return parts.join(" • ");
}

// frontend-ready trip plan
const cleanTripPlan = ({ origin, destination, sd, ed, weather, events, map }) => {
  const routesList =
    map.status === "success" && map.data?.routes?.length
      ? map.data.routes.map((r) => {
          // Distance in km
          const distKm = r.distanceMeters ? Math.round(r.distanceMeters / 1000) : 0;

          // Duration comes like "12345s" → convert to hours/minutes
          let durMin = 0;
          if (r.duration) {
            const match = r.duration.match(/(\d+)/); // extract number part
            if (match) durMin = Math.round(parseInt(match[1]) / 60); // convert seconds → minutes
          }

          return {
            distance: distKm ? `${distKm} km` : "N/A",
            duration: durMin ? `${durMin} min` : "N/A",
          };
        })
      : [];

  // Calculate total cost (₹12 per km)
  const totalDistanceKm = routesList.reduce(
    (sum, r) => sum + (parseInt(r.distance) || 0),
    0
  );
  const costEstimate = totalDistanceKm * 12;

  return {
    origin,
    destination,
    startDate: sd,
    endDate: ed,
    summary: buildSummary({ weather, events, map, cost: costEstimate }),
    estimatedCost: costEstimate,
    agents: {
      weather:
        weather.status === "success"
          ? weather.data.forecast?.[0]
          : null,
      events:
        events.status === "success" && events.data?.events?.length
          ? events.data.events
          : [],
      map: routesList,
    },
    createdAt: new Date().toISOString(),
  };
};


// orchestrator endpoint
export const orchestrateTrip = async (req, res) => {
  try {
    const { origin, destination, startDate, endDate, date } = req.body || {};
    const sd = startDate || date;
    const ed = endDate || date;

    if (!destination || !sd || !ed) {
      return res.status(400).json({ success: false, error: "destination, startDate and endDate are required" });
    }

    const TIMEOUTS = { weather: 7000, events: 6000, maps: 7000 };
    const weatherP = withTimeout(weatherAgent(destination, sd, ed), TIMEOUTS.weather, { agent: "WeatherAgent", status: "error", error_message: "Weather timed out" });
    const eventsP = withTimeout(eventAgent(destination, sd, ed), TIMEOUTS.events, { agent: "EventAgent", status: "error", error_message: "Events timed out" });
    const mapsP = withTimeout(mapAgent(origin || "", destination, "DRIVE"), TIMEOUTS.maps, { agent: "MapsAgent", status: "error", error_message: "Maps timed out" });

    const [wRes, eRes, mRes] = await Promise.all([weatherP, eventsP, mapsP]);

    const weather = normalize(wRes, "WeatherAgent");
    const events = normalize(eRes, "EventAgent");
    const map = normalize(mRes, "MapsAgent");

    const tripPlan = cleanTripPlan({ origin, destination, sd, ed, weather, events, map });

    return res.json({ success: true, tripPlan });
  } catch (err) {
    console.error("Orchestration Error:", err.message || err);
    return res.status(500).json({ success: false, error: "Trip orchestration failed" });
  }
};
