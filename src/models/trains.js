import mongoose from 'mongoose';

const trainSchema = new mongoose.Schema({
  name: { type: String, required: true },
  trainNumber: { type: String, required: true, unique: true },
  capacity: { type: Number, required: true },
  classTypes: [{ type: String }], // e.g., ['Economy', 'Business']
  createdAt: { type: Date, default: Date.now },
});

export const Train = mongoose.model('Train', trainSchema);
