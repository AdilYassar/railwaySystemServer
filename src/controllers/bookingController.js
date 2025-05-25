import mongoose from "mongoose";
import { Bookings } from "../models/bookings.js";
import { Customer } from "../models/user.js";
import { Station } from "../models/stations.js";

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create a new Booking
export const createBooking = async (req, reply) => {
  try {
    const { customerId, from, to, paymentMethod, totalCost } = req.body;

    // Check required fields
    if (!customerId || !from || !to || !paymentMethod || totalCost === undefined) {
      return reply.status(400).send({ 
        message: "Missing required fields: customerId, from, to, paymentMethod, or totalCost" 
      });
    }

    // Validate ObjectId formats
    if (!isValidObjectId(customerId) || !isValidObjectId(from) || !isValidObjectId(to)) {
      return reply.status(400).send({ message: "Invalid ID format for customerId, from, or to" });
    }

    // Check that from and to are different
    if (from === to) {
      return reply.status(400).send({ message: "From and To stations cannot be the same" });
    }

    // Validate customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return reply.status(404).send({ message: "Customer not found" });
    }

    // Validate stations exist
    const fromStation = await Station.findById(from);
    const toStation = await Station.findById(to);
    if (!fromStation || !toStation) {
      return reply.status(400).send({ message: "Invalid from or to station" });
    }

    // Create and save booking
    const booking = new Bookings({
      customerId,
      from: fromStation._id,
      to: toStation._id,
      paymentMethod,
      totalCost,
      status: "Pending",
    });

    await booking.save();

    return reply.status(201).send({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Fetch all bookings with customer and station info
export const fetchAllBookings = async (req, reply) => {
  try {
    const bookings = await Bookings.find()
      .populate("customerId", "name email")
      .populate("from", "name")
      .populate("to", "name")
      .lean();

    return reply.send({
      message: "Bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Fetch bookings by customer with station info
export const fetchBookingsByCustomer = async (req, reply) => {
  try {
    const { customerId } = req.params;

    // Validate ObjectId format
    if (!isValidObjectId(customerId)) {
      return reply.status(400).send({ message: "Invalid customerId format" });
    }

    const bookings = await Bookings.find({ customerId })
      .populate("customerId", "name email")
      .populate("from", "name")
      .populate("to", "name")
      .lean();

    if (!bookings.length) {
      return reply.status(404).send({ message: "No bookings found for this customer" });
    }

    return reply.send({
      message: "Customer bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Update booking status
export const updateBookingStatus = async (req, reply) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return reply.status(400).send({ message: "Invalid booking ID" });
    }

    if (!["Pending", "Confirmed", "Cancelled"].includes(status)) {
      return reply.status(400).send({ message: "Invalid status value" });
    }

    const booking = await Bookings.findById(id);
    if (!booking) {
      return reply.status(404).send({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    return reply.send({
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Delete a booking
export const deleteBooking = async (req, reply) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return reply.status(400).send({ message: "Invalid booking ID" });
    }

    const booking = await Bookings.findById(id);
    if (!booking) {
      return reply.status(404).send({ message: "Booking not found" });
    }

    await Bookings.deleteOne({ _id: id });

    return reply.send({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return reply.status(500).send({ message: "An error occurred", error });
  }
};
