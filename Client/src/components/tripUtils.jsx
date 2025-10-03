import polyline from "@mapbox/polyline";

/**
 * Returns an emoji/icon for each travel sub-mode
 */
export const getModeIcon = (subMode) => {
  switch (subMode) {
    case "4W":
      return "🚗";
    case "BIKE":
      return "🏍";
    case "BUS":
      return "🚌";
    case "SLEEPER":
      return "🛌";
    case "3AC":
      return "🛫";
    case "CAR_BOOKING":
      return "🚖";
    default:
      return "❓";
  }
};

/**
 * Calculates estimated travel cost based on mode, subMode, and distance
 */
export const calculateCost = (distanceMeters, mode, subMode) => {
  const distanceKm = distanceMeters / 1000;
  let baseCost = 0;
  let costPerKm = 0;
  let baseFare = 0;
  let tollCost = 0;

  if (mode === "PERSONAL") {
    if (subMode === "4W") {
      const mileage = 12; // kmpl
      const fuelCostPerLitre = 105;
      tollCost = Math.max(50, Math.floor(distanceKm / 60) * 120);
      baseCost = (distanceKm / mileage) * fuelCostPerLitre + tollCost;
    } else if (subMode === "BIKE") {
      const mileage = 45;
      const fuelCostPerLitre = 105;
      baseCost = (distanceKm / mileage) * fuelCostPerLitre;
    }
  } else if (mode === "TRANSIT") {
    baseFare = subMode === "BUS" ? 20 : subMode === "SLEEPER" ? 80 : 150;
    costPerKm = subMode === "BUS" ? 2.5 : subMode === "SLEEPER" ? 0.45 : 2.1;
    baseCost = baseFare + distanceKm * costPerKm;
  } else if (mode === "CAR_BOOKING") {
    baseFare = 80;
    costPerKm = 15;
    tollCost = Math.max(30, Math.floor(distanceKm / 50) * 80);
    baseCost = baseFare + distanceKm * costPerKm + tollCost;
  }

  const timeMultiplier = distanceKm > 500 ? 1.2 : distanceKm > 200 ? 1.1 : 1;
  const finalCost = baseCost * timeMultiplier;

  return {
    minCost: Math.round(finalCost * 0.85),
    maxCost: Math.round(finalCost * 1.15),
    baseCost: Math.round(finalCost),
    tollCost: Math.round(tollCost),
  };
};

/**
 * Fetches routes from your API, decodes polylines, and ensures duration is numeric (seconds)
 */
export const fetchRoutes = async (origin, destination) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/trip/find`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ origin, destination, travelMode: "DRIVE" }),
    });

    const data = await res.json();

    if (!data.routes || data.routes.length === 0) return [];

    return data.routes
      .filter((r) => r.polyline?.encodedPolyline)
      .slice(0, 3)
      .map((r, idx) => {
        // Normalize duration
        let durationSeconds = 0;
        if (r.duration) {
          if (typeof r.duration === "object" && r.duration.value) durationSeconds = r.duration.value;
          else if (!isNaN(parseInt(r.duration))) durationSeconds = parseInt(r.duration);
        }

        return {
          id: idx,
          path: polyline.decode(r.polyline.encodedPolyline).map(([lat, lng]) => ({ lat, lng })),
          distance: r.distanceMeters,
          duration: durationSeconds,
        };
      });
  } catch (err) {
    console.error("Error fetching routes:", err);
    return [];
  }
};
