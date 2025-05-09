import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
  trainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Train', required: true },
  route: [{ 
    station: { type: mongoose.Schema.Types.ObjectId, ref: 'Station' },
    arrivalTime: { type: Date },
    departureTime: { type: Date },
  }],
  daysOfOperation: [{ type: String }], // e.g., ['Monday', 'Wednesday']
  createdAt: { type: Date, default: Date.now },
});

export const Schedule = mongoose.model('Schedule', scheduleSchema);

