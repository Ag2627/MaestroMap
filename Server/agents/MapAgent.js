import axios from "axios";

export const mapAgent = async (origin, destination, travelMode = "DRIVE") => {
    if (!origin || !destination) {
        return { agent: "MapsAgent", status: "error", error_message: "Origin and destination required" };
    }

    try {
        const response = await axios.post(
            "https://routes.googleapis.com/directions/v2:computeRoutes",
            {
                origin: { address: origin },
                destination: { address: destination },
                travelMode,
                computeAlternativeRoutes: true,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY,
                    "X-Goog-FieldMask": "routes.duration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.description",
                },
            }
        );

        // Return MCP-style object
        return { agent: "MapsAgent", status: "success", data: { routes: response.data.routes || [] } };
    } catch (error) {
        return { agent: "MapsAgent", status: "error", error_message: error.response?.data || error.message };
    }
};
