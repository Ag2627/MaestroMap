// models/Itinerary.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const itinerarySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  destinationName: {
    type: String,
    required: true,
  },
  itineraryData: {
    type: Schema.Types.Mixed,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Itinerary = mongoose.model('Itinerary', itinerarySchema);

export default Itinerary;