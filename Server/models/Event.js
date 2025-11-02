import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  venue: {
    name: String,
    address: String,
    city: String,
    state: String,
    country: { type: String, default: "India" },
    lat: Number,
    lon: Number,
  },
  startDate: Date,
  endDate: Date,
  organizer: {
    name: String,
    contact: String,
  },
  url: String,
  source: String, // scraped/manual
}, { timestamps: true });

export default mongoose.model("Event", EventSchema);
