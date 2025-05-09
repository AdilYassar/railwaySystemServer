import { Bookings } from "../models/bookings.js";
import { Ticket } from "../models/tickets.js";
import { User } from "../models/user.js"; // Assuming User is a model

// Create a new Booking
export const createBooking = async (req, reply) => {
  try {
    const { customerId, tickets, totalCost, paymentMethod } = req.body;

    // Validate user
    const customer = await User.findById(customerId);
    if (!customer) {
      return reply.status(404).send({ message: "Customer not found" });
    }

    // Validate tickets
    const validTickets = await Ticket.find({ _id: { $in: tickets } });
    if (validTickets.length !== tickets.length) {
      return reply.status(400).send({ message: "One or more tickets are invalid" });
    }

    // Create a new booking
    const booking = new Bookings({
      customerId,
      tickets,
      totalCost,
      paymentMethod,
    });
    await booking.save();

    return reply.status(201).send({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Fetch all Bookings
export const fetchAllBookings = async (req, reply) => {
  try {
    const bookings = await Bookings.find()
      .populate("customerId", "name email") // Populate customer details
      .populate("tickets"); // Populate ticket details

    return reply.send({
      message: "Bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Fetch Bookings for a specific Customer
export const fetchBookingsByCustomer = async (req, reply) => {
  try {
    const { customerId } = req.params;

    const bookings = await Bookings.find({ customerId })
      .populate("tickets")
      .populate("customerId", "name email");

    if (bookings.length === 0) {
      return reply.status(404).send({ message: "No bookings found for this customer" });
    }

    return reply.send({
      message: "Customer bookings fetched successfully",
      bookings,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Update Booking Status
export const updateBookingStatus = async (req, reply) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

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
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Delete a Booking
export const deleteBooking = async (req, reply) => {
  try {
    const { id } = req.params;

    const booking = await Bookings.findById(id);
    if (!booking) {
      return reply.status(404).send({ message: "Booking not found" });
    }

    await booking.remove();

    return reply.send({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};
