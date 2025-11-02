import axios from "axios";

// Cache token to avoid requesting every time
let cachedToken = null;
let tokenExpiry = null;

// Function to get a valid Amadeus token
async function getAmadeusToken() {
  if (cachedToken && tokenExpiry && new Date() < tokenExpiry) {
    return cachedToken;
  }

  const clientId ="CWWZGQRaM18Ky5KDATo6a8GN4GI5Xmke";      // Set in .env
  const clientSecret = "ArxE4SrrG5KpWpdV";
  try {
    const res = await axios.post(
      "https://test.api.amadeus.com/v1/security/oauth2/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: clientSecret,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    cachedToken = res.data.access_token;
    tokenExpiry = new Date(new Date().getTime() + res.data.expires_in * 1000 - 60000); // refresh 1 min early
    return cachedToken;
  } catch (err) {
    console.error("Error fetching Amadeus token:", err.response?.data || err.message);
    return null;
  }
}

// Get city code by city name
export async function getCityCode(cityName) {
  if (!cityName) return null;

  const token = await getAmadeusToken();
  if (!token) return null;

  try {
    const res = await axios.get("https://test.api.amadeus.com/v1/reference-data/locations", {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        keyword: cityName,
        subType: "CITY",
      },
    });

    if (res.data.data && res.data.data.length > 0) {
      const city = res.data.data[0];
      return {
        cityCode: city.iataCode || city.cityCode,
        name: city.name,
        country: city.countryCode,
      };
    }

    return null;
  } catch (err) {
    console.error("Error fetching city code:", err.response?.data || err.message);
    return null;
  }
}
