import axios from "axios";

export default async function weatherAgent(destination, startDate, endDate) {
  const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;  
  try {
    if (!OPENWEATHER_API_KEY) {
      return {
        agent: "WeatherAgent",
        status: "error",
        error_message: "OpenWeatherMap API key not configured",
      };
    }

    // 1️⃣ Geocode destination
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
      destination+" ,IN"
    )}&limit=1&appid=${OPENWEATHER_API_KEY}`;
    const geoRes = await axios.get(geoUrl);

    if (!geoRes.data || geoRes.data.length === 0) {
      return {
        agent: "WeatherAgent",
        status: "error",
        error_message: "Destination not found",
      };
    }

    const { lat, lon, name, country } = geoRes.data[0];

    // Convert dates
    const startDay = new Date(startDate);
    const todayDay = new Date();


    startDay.setHours(0,0,0,0);
    todayDay.setHours(0,0,0,0);

    const diffDays = Math.ceil((startDay - todayDay) / (1000*60*60*24));
    let forecastData = [];

    if (diffDays >= 0 && diffDays <= 16) {
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast/daily?lat=${lat}&lon=${lon}&cnt=16&appid=${OPENWEATHER_API_KEY}&units=metric`;
      const forecastRes = await axios.get(forecastUrl);      
    
      forecastData = forecastRes.data.list
  .map(day => ({
    date: new Date(day.dt * 1000).toISOString().split("T")[0],
    tempMin: day.temp.min,
    tempMax: day.temp.max,
    description: day.weather[0].description
  }))
  .filter(d => d.date >= startDate && d.date <= endDate);

    } else {
      const climateUrl = `http://api.openweathermap.org/data/2.5/climate/month?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      const climateRes = await axios.get(climateUrl);

      const endDay = new Date(endDate);
      const tripLength = Math.round((endDay - startDay) / (1000 * 60 * 60 * 24)) + 1;

      if (tripLength > 0 && climateRes.data?.list?.length > 0) {
        const requestedMonthIndex = startDay.getMonth();
        const historicalMonthData = climateRes.data.list[requestedMonthIndex];

        if (historicalMonthData) {
            const tempMin = historicalMonthData.temp.average_min;
            const tempMax = historicalMonthData.temp.average_max;
            
            // Round the temperatures for a cleaner display
            const roundedMin = Math.round(tempMin);
            const roundedMax = Math.round(tempMax);

            let climateSummary = `Historically, the average temperature is between ${roundedMin}°C and ${roundedMax}°C.`;
            let climateDescription = "";

            if (tempMax > 30) {
              climateDescription = `Expect hot, summer-like weather. ${climateSummary}`;
            } else if (tempMax >= 20 && tempMax <= 30) {
              climateDescription = `Expect pleasant and mild weather. ${climateSummary}`;
            } else if (tempMax >= 10 && tempMax < 20) {
              climateDescription = `Expect cool weather. ${climateSummary}`;
            } else {
              climateDescription = `Expect cold, winter-like weather. ${climateSummary}`;
            }

            forecastData = Array.from({ length: tripLength }).map((_, idx) => ({
              date: `Day ${idx + 1} (historical estimate)`,
              tempMin: tempMin,
              tempMax: tempMax,
              description: climateDescription,
            }));
        }
      }
    }

    if (forecastData.length === 0) {
      return {
        agent: "WeatherAgent",
        status: "error",
        error_message: "No forecast data available for the selected dates.",
      };
    }


  
    //   const climateUrl = `http://api.openweathermap.org/data/2.5/climate/month?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`;
    //   const climateRes = await axios.get(climateUrl);
     
    //   const tripLength = Math.ceil((startDay - todayDay) / (1000*60*60*24)); + 1;

    //   forecastData = Array.from({ length: tripLength }).map((_, idx) => ({
    //      date: `Day ${idx + 1} (historical avg)`,
    //      tempMin: climateRes.data.list[0].temp.average_min, 
    //      tempMax: climateRes.data.list[0].temp.average_max,
    //      description: "Typical weather (historical average)",
    //   }));
    // }

    return {
      agent: "WeatherAgent",
      status: "success",
      data: {
        location: { name, country, lat, lon },
        forecast: forecastData,
      },
    };
  } catch (error) {
    return {
      agent: "WeatherAgent",
      status: "error",
      error_message: error.message,
    };
  }
}