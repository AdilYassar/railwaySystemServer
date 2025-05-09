import mongoose from 'mongoose';


const ticketSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trainId: { type: mongoose.Schema.Types.ObjectId, ref: 'Train', required: true },
  scheduleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Schedule', required: true },
  seatNumber: { type: String, required: true },
  classType: { type: String, required: true }, // e.g., 'Economy', 'Business'
  price: { type: Number, required: true },
  status: { type: String, enum: ['Confirmed', 'Cancelled'], default: 'Confirmed' },
  bookingDate: { type: Date, default: Date.now },
});

export const Ticket = mongoose.model('Ticket', ticketSchema);