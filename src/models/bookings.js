import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }],
  totalCost: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
  bookingDate: { type: Date, default: Date.now },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'Station', required: true }, // Reference to Station model
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'Station', required: true },   // Reference to Station model
});

export const Bookings = mongoose.model('Bookings', bookingSchema);
