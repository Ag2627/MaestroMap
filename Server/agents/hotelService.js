// // import axios from "axios";

// // const STAYAPI_KEY = "sk_live_ea7d619f6311c69346095179f6dee8781dc2ff5b0b02155d475325c66429c962";

// // export const fetchHotelPrices = async (city, hotel_name, checkin, checkout, adults = 1, currency = "INR") => {
// //   try {
// //     const response = await axios.get("https://api.stayapi.com/v1/meta/search", {
// //       headers: { "x-api-key": STAYAPI_KEY },
// //       params: {
// //         hotel_name,   // required field
// //         city,
// //         checkin,
// //         checkout,
// //         adults,
// //         currency
// //       }
// //     });

// //     return response.data.data || [];
// //   } catch (err) {
// //     console.error("Hotel API error:", err.response?.data || err.message);
// //     return [];
// //   }
// // };

// // services/hotelService.js
// import axios from "axios";

// const STAYAPI_KEY = "sk_live_ea7d619f6311c69346095179f6dee8781dc2ff5b0b02155d475325c66429c962";

// export const fetchHotelPrices = async (hotel_name) => {
//   try {
//     const response = await axios.get("https://api.stayapi.com/v1/meta/search", {
//       headers: { "x-api-key": STAYAPI_KEY },
//       params: { hotel_name }, // ✅ only hotel_name supported
//     });

//     console.log("StayAPI raw response:", JSON.stringify(response.data, null, 2));

//     // API returns an array of booking links across multiple platforms
//     return response.data?.data || [];
//   } catch (err) {
//     console.error("Hotel API error:", err.response?.data || err.message);
//     return [];
//   }
// };


// // services/hotelService.js
// // import axios from "axios";

// // const RAPID_API_KEY = process.env.RAPID_API_KEY; // put your key in .env
// // const RAPID_API_HOST = "hotels4.p.rapidapi.com";

// // export const getHotelSummary = async (propertyId) => {
// //   try {
// //     const response = await axios.post(
// //       `https://${RAPID_API_HOST}/reviews/v3/get-summary`,
// //       {
// //         currency: "INR",        // INR for India
// //         eapid: 1,
// //         locale: "en_IN",        // Indian locale
// //         siteId: 300000001,
// //         propertyId: propertyId, // pass dynamically
// //       },
// //       {
// //         headers: {
// //           "content-type": "application/json",
// //           "X-RapidAPI-Key": RAPID_API_KEY,
// //           "X-RapidAPI-Host": RAPID_API_HOST,
// //         },
// //       }
// //     );
// //     return response.data;
// //   } catch (error) {
// //     console.error("Error fetching hotel summary:", error.response?.data || error.message);
// //     throw new Error("Failed to fetch hotel summary");
// //   }
// // };


// services/hotelService.js
// import axios from "axios";

// const AMADEUS_AUTH_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
// const AMADEUS_BASE_URL = "https://test.api.amadeus.com/v1";
// const CLIENT_ID = "CWWZGQRaM18Ky5KDATo6a8GN4GI5Xmke";
// const CLIENT_SECRET = "ArxE4SrrG5KpWpdV";

// let accessToken = null;

// // Get new token
// async function getAccessToken() {
//   const res = await axios.post(AMADEUS_AUTH_URL, new URLSearchParams({
//     grant_type: "client_credentials",
//     client_id: CLIENT_ID,
//     client_secret: CLIENT_SECRET,
//   }), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });

//   accessToken = res.data.access_token;
//   return accessToken;
// }

// // Ensure token exists
// async function ensureToken() {
//   if (!accessToken) {
//     accessToken = await getAccessToken();
//   }
//   return accessToken;
// }

// // Get hotel IDs by city
// export async function getHotelsByCity(cityCode) {
//   const token = await ensureToken();
//   const res = await axios.get(`${AMADEUS_BASE_URL}/reference-data/locations/hotels/by-city`, {
//     headers: { Authorization: `Bearer ${token}` },
//     params: { cityCode }
//   });
//   return res.data.data.map(h => h.hotelId);
// }

// // Get hotel offers (prices)
// export async function getHotelOffers(hotelId, checkIn, checkOut, adults = 1, currency = "USD") {
//   const token = await ensureToken();
//   const res = await axios.get("https://test.api.amadeus.com/v3/shopping/hotel-offers", {
//     headers: { Authorization: `Bearer ${token}` },
//     params: {
//       hotelIds: hotelId,
//       checkInDate: checkIn,
//       checkOutDate: checkOut,
//       adults,
//       currency
//     }
//   });
//   return res.data;
// }

import axios from "axios";

const AMADEUS_AUTH_URL = "https://test.api.amadeus.com/v1/security/oauth2/token";
const AMADEUS_BASE_URL = "https://test.api.amadeus.com/v1";
const CLIENT_ID = "CWWZGQRaM18Ky5KDATo6a8GN4GI5Xmke";
const CLIENT_SECRET = "ArxE4SrrG5KpWpdV";

let accessToken = null;
let tokenExpiry = 0;

// Get new token
async function getAccessToken() {
  const res = await axios.post(
    AMADEUS_AUTH_URL,
    new URLSearchParams({
      grant_type: "client_credentials",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  accessToken = res.data.access_token;
  // token lifetime in seconds
  tokenExpiry = Date.now() + res.data.expires_in * 1000 - 60000; // refresh 1 min early
  return accessToken;
}

// Ensure token exists and not expired
async function ensureToken() {
  if (!accessToken || Date.now() >= tokenExpiry) {
    return await getAccessToken();
  }
  return accessToken;
}

// Get hotel IDs by city
export async function getHotelsByCity(cityCode) {
  const token = await ensureToken();
  const res = await axios.get(`${AMADEUS_BASE_URL}/reference-data/locations/hotels/by-city`, {
    headers: { Authorization: `Bearer ${token}` },
    params: { cityCode }
  });
  return res.data.data.map(h => h.hotelId);
}

// Get hotel offers (prices)
export async function getHotelOffers(hotelIds, checkIn, checkOut, adults = 1, currency = "USD") {
  const token = await ensureToken();
  const res = await axios.get("https://test.api.amadeus.com/v3/shopping/hotel-offers", {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      hotelIds,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      adults,
      currency
    }
  });
  return res.data;
}

