import {Feedback} from "../models/feedback.js";

// Get all feedbacks
export  async function getAllFeedback(request, reply) {
  try {
    const feedbacks = await Feedback.find()
      .populate("customerId", "name email")  // optional, to include customer info
      .sort({ createdAt: -1 });

    return reply.send({
      message: "Feedbacks fetched successfully",
      feedbacks,
    });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ message: "Server error" });
  }
}

// Post new feedback
 export  async function postFeedback(request, reply) {
  try {
    const { customerId, message } = request.body;

    if (!customerId || !message) {
      return reply.status(400).send({ message: "customerId and message are required" });
    }

    const feedback = new Feedback({ customerId, message });
    await feedback.save();

    return reply.status(201).send({ message: "Feedback submitted successfully", feedback });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ message: "Server error" });
  }
}


