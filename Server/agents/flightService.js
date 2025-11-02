import axios from "axios";

const TRAVELPAYOUTS_TOKEN = "58f6883b4d1abb7c8c61effeda62bebe"; // put the token you got from dashboard

export const getFlightCost = async (origin, destination, currency = "INR") => {
  try {
    const response = await axios.get(
      "https://api.travelpayouts.com/v1/prices/cheap",
      {
        params: {
          origin,        // e.g. "DEL"
          destination,   // e.g. "BOM"
          currency,      // INR, USD etc.
          token: TRAVELPAYOUTS_TOKEN, // 👈 required
        },
      }
    );

    const data = response.data.data;

    if (!data || !data[destination]) {
      return { price: 0, info: "No flights found" };
    }

    const flights = Object.values(data[destination]);
    const cheapest = flights.reduce((prev, curr) =>
      prev.price < curr.price ? prev : curr
    );

    return {
      price: cheapest.price,
      origin,
      destination,
      airline: cheapest.airline || "Unknown",
      departureDate: cheapest.departure_at || "Unknown",
    };
  } catch (err) {
    console.error("Error fetching flights:", err.response?.data || err.message);
    return { price: 0, info: "Error fetching flights" };
  }
};
