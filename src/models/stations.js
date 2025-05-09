import mongoose from 'mongoose';


const stationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  location: { 
    city: { type: String, required: true },
    state: { type: String },
    coordinates: { type: { lat: Number, lng: Number }, default: null }
  },
  createdAt: { type: Date, default: Date.now },
});

export const Station = mongoose.model('Station', stationSchema);
