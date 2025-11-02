import axios from "axios";

export const findBestRoutes = async (req, res) => {
    const { origin, destination, travelMode } = req.body;

    if (!origin || !destination || !travelMode) {
        return res.status(400).json({ msg: "Origin, destination, and travelMode are required" });
    }

    try {
        const response = await axios.post(
            "https://routes.googleapis.com/directions/v2:computeRoutes",
            {
                origin: { address: origin },
                destination: { address: destination },
                travelMode: travelMode,
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
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Google API Error:", error.response?.data || error.message);
        res.status(500).json({ msg: "Server error while fetching routes" });
    }
};