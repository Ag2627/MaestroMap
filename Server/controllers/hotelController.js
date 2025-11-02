// // import { fetchHotelPrices } from "../agents/hotelService.js";

// // export const getHotelEstimate = async (req, res) => {
// //   const { city, hotel_name, checkin, checkout, adults } = req.body;

// //   if (!city || !hotel_name || !checkin || !checkout || !adults) {
// //     return res.status(400).json({ error: "Missing required fields in body" });
// //   }

// //   try {
// //     const hotels = await fetchHotelPrices(city, hotel_name,checkin, checkout, adults);

// //     if (!hotels || hotels.length === 0) {
// //       return res.json({ price: 0, info: "No hotels found" });
// //     }

// //     // cheapest hotel
// //     const cheapest = hotels.reduce((prev, curr) =>
// //       prev.price < curr.price ? prev : curr
// //     );

// //     res.json({
// //       price: cheapest.price,
// //       currency: cheapest.currency || "INR",
// //       hotel: cheapest.hotel_name,
// //       stars: cheapest.stars || "N/A",
// //       address: cheapest.address || "N/A",
// //       checkin,
// //       checkout
// //     });
// //   } catch (err) {
// //     console.error("Hotel Controller error:", err.response?.data || err.message);
// //     res.status(500).json({ error: "Failed to fetch hotels" });
// //   }
// // };

// // controllers/hotelController.js
// // import { fetchHotelPrices } from "../agents/hotelService.js";

// // export const getHotelEstimate = async (req, res) => {
// //   const { hotel_name } = req.body;

// //   if (!hotel_name) {
// //     return res.status(400).json({ error: "hotel_name is required" });
// //   }

// //   try {
// //     const hotels = await fetchHotelPrices(hotel_name);

// //     if (!hotels || hotels.length === 0) {
// //       return res.json({ price: 0, info: "No hotels found" });
// //     }

// //     // Pick the cheapest option from booking links
// //     const cheapest = hotels.reduce((prev, curr) =>
// //       prev.price < curr.price ? prev : curr
// //     );

// //     res.json({
// //       price: cheapest.price,
// //       currency: cheapest.currency || "INR",
// //       platform: cheapest.platform || "Unknown",
// //       link: cheapest.url || "N/A",
// //       hotel: hotel_name,
// //     });
// //   } catch (err) {
// //     console.error("Hotel Controller error:", err.response?.data || err.message);
// //     res.status(500).json({ error: "Failed to fetch hotels" });
// //   }
// // };


// // // controllers/hotelController.js
// // // import { getHotelSummary } from "../agents/hotelService.js";

// // // export const fetchHotelSummary = async (req, res) => {
// // //   try {
// // //     const { propertyId } = req.params; // from URL
// // //     const hotelData = await getHotelSummary(propertyId);
// // //     res.json(hotelData);
// // //   } catch (error) {
// // //     res.status(500).json({ error: error.message });
// // //   }
// // // };

// import axios from "axios";

// const STAYAPI_KEY = "sk_live_ea7d619f6311c69346095179f6dee8781dc2ff5b0b02155d475325c66429c962";

// // 🔎 Search hotel prices by name
// export const searchHotels = async (req, res) => {
//   try {
//     const { hotel_name } = req.query;

//     if (!hotel_name) {
//       return res.status(400).json({ error: "hotel_name is required" });
//     }

//     const response = await axios.get("https://api.stayapi.com/v1/meta/search", {
//       headers: { "x-api-key": STAYAPI_KEY },
//       params: { hotel_name },
//     });

//     res.json(response.data);
//   } catch (error) {
//     console.error("❌ Error searching hotels:", error.response?.data || error.message);
//     res.status(500).json({ error: "Failed to search hotels" });
//   }
// };


// controllers/hotelController.js
// controllers/hotelController.js
// controllers/hotelController.js
// import { getHotelsByCity, getHotelOffers } from "../agents/hotelService.js";

// export async function searchHotels(req, res) {
//   try {
//     const { cityCode, checkInDate, checkOutDate, adults, currency } = req.body;

//     if (!cityCode || !checkInDate || !checkOutDate) {
//       return res.status(400).json({ error: "cityCode, checkInDate, and checkOutDate are required" });
//     }

//     // Step 1: Get hotels in the city
//     const hotelIds = await getHotelsByCity(cityCode);
//     if (hotelIds.length === 0) {
//       return res.json({ price: 0, info: "No hotels found in this city" });
//     }

//     // Step 2: Batch hotelIds to avoid long URLs
//     const batchSize = 20;
//     let allOffers = [];

//     for (let i = 0; i < hotelIds.length; i += batchSize) {
//       const batch = hotelIds.slice(i, i + batchSize).join(",");
//       try {
//         const offers = await getHotelOffers(batch, checkInDate, checkOutDate, adults, currency);
//         if (offers?.data) {
//           allOffers = allOffers.concat(offers.data);
//         }
//       } catch (err) {
//         console.error("Batch error:", err.response?.data || err.message);
//       }
//     }

//     if (allOffers.length === 0) {
//       return res.json({ totalHotels: 0, info: "No offers found" });
//     }

//     // Step 3: Format results
//     const results = allOffers.map(h => {
//       const hotelData = h.hotel;
//       const offer = h.offers[0]; // take cheapest per hotel

//       return {
//         hotelId: hotelData.hotelId,
//         name: hotelData.name,
//         city: hotelData.cityCode,
//         address: hotelData.address?.lines?.join(", ") || "N/A",
//         checkInDate: offer.checkInDate,
//         checkOutDate: offer.checkOutDate,
//         price: offer.price.total,
//         currency: offer.price.currency,
//         room: offer.room?.typeEstimated?.category || "N/A"
//       };
//     });

//     // Optional: sort by price
//     results.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));

//     return res.json({ totalHotels: results.length, hotels: results });
//   } catch (err) {
//     console.error("Hotel API error:", err.response?.data || err.message);
//     res.status(500).json({ error: "Failed to fetch hotel prices" });
//   }
// }

// import { getHotelsByCity, getHotelOffers } from "../agents/hotelService.js";

// export async function getTopHotelPriceRange(req, res) {
//   try {
//     const { cityCode, checkInDate, checkOutDate, adults = 1, currency = "USD" } = req.body;

//     if (!cityCode || !checkInDate || !checkOutDate) {
//       return res.status(400).json({ error: "cityCode, checkInDate, and checkOutDate are required" });
//     }

//     // Step 1: Get all hotels in city
//     const hotelIds = await getHotelsByCity(cityCode);
//     if (!hotelIds.length) {
//       return res.json({ totalHotels: 0, info: "No hotels found" });
//     }

//     // Step 2: Batch hotelIds (20 per batch)
//     const batchSize = 20;
//     let allOffers = [];

//     for (let i = 0; i < hotelIds.length; i += batchSize) {
//       const batch = hotelIds.slice(i, i + batchSize).join(",");
//       try {
//         const offers = await getHotelOffers(batch, checkInDate, checkOutDate, adults, currency);
//         if (offers?.data) allOffers = allOffers.concat(offers.data);
//       } catch (err) {
//         console.error("Batch error:", err.response?.data || err.message);
//       }
//     }

//     if (!allOffers.length) {
//       return res.json({ totalHotels: 0, info: "No offers found" });
//     }

//     // Step 3: Extract and sort by price
//     const results = allOffers.map(h => {
//       const hotelData = h.hotel;
//       const offer = h.offers[0];
//       return {
//         hotelId: hotelData.hotelId,
//         name: hotelData.name,
//         price: parseFloat(offer.price.total),
//         currency: offer.price.currency
//       };
//     });

//     results.sort((a, b) => a.price - b.price);

//     // Step 4: Take top 10 cheapest
//     const top10 = results.slice(0, 10);

//     const prices = top10.map(h => h.price);
//     const minPrice = Math.min(...prices);
//     const maxPrice = Math.max(...prices);

//     return res.json({
//       totalHotelsFound: allOffers.length,
//       topHotels: top10,
//       priceRange: { min: minPrice, max: maxPrice },
//     });

//   } catch (err) {
//     console.error("Hotel API error:", err.response?.data || err.message);
//     res.status(500).json({ error: "Failed to fetch hotel prices" });
//   }
// }


import { getHotelsByCity, getHotelOffers } from "../agents/hotelService.js";

export async function getTopHotelPriceRange(req, res) {
  try {
    const { cityCode, checkInDate, checkOutDate, adults = 1, currency = "USD" } = req.body;

    if (!cityCode || !checkInDate || !checkOutDate) {
      return res.status(400).json({ error: "cityCode, checkInDate, and checkOutDate are required" });
    }

    // Step 1: Get all hotel IDs in city
    const hotelIds = await getHotelsByCity(cityCode);
    if (!hotelIds.length) return res.json({ totalHotels: 0, info: "No hotels found" });

    // Step 2: Batch hotelIds to avoid too long URLs
    const batchSize = 20;
    const batchPromises = [];

    for (let i = 0; i < hotelIds.length; i += batchSize) {
      const batch = hotelIds.slice(i, i + batchSize).join(",");
      batchPromises.push(getHotelOffers(batch, checkInDate, checkOutDate, adults, currency));
    }

    // Step 3: Fetch all batches in parallel
    const allResponses = await Promise.allSettled(batchPromises);
    let allOffers = [];
    allResponses.forEach(r => {
      if (r.status === "fulfilled" && r.value?.data) allOffers = allOffers.concat(r.value.data);
    });

    if (!allOffers.length) return res.json({ totalHotels: 0, info: "No offers found" });

    // Step 4: Map and sort by price
    const hotelsWithPrice = allOffers.map(h => {
      const hotelData = h.hotel;
      const offer = h.offers[0]; // take cheapest per hotel
      return {
        hotelId: hotelData.hotelId,
        name: hotelData.name,
        city: hotelData.cityCode,
        price: parseFloat(offer.price.total),
        currency: offer.price.currency,
        checkInDate: offer.checkInDate,
        checkOutDate: offer.checkOutDate,
        room: offer.room?.typeEstimated?.category || "N/A"
      };
    });

    hotelsWithPrice.sort((a, b) => a.price - b.price);

    // Step 5: Return top 10
    const top10 = hotelsWithPrice.slice(0, 10);
    const prices = top10.map(h => h.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    return res.json({
      totalHotelsFound: allOffers.length,
      topHotels: top10,
      priceRange: { min: minPrice, max: maxPrice }
    });

  } catch (err) {
    console.error("Hotel API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch hotel prices" });
  }
}
