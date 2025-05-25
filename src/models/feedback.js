
import mongoose from 'mongoose';
const feedbackSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",  // Assuming you have a Customer model
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


export const Feedback = mongoose.model('Feedback', feedbackSchema);