import { Ticket } from "../models/tickets.js";

// Create a new Ticket
export const createTicket = async (req, reply) => {
  try {
    const { customerId, trainId, scheduleId, seatNumber, classType, price } = req.body;

    // Check if the seat is already booked for the given train and schedule
    const existingTicket = await Ticket.findOne({ trainId, scheduleId, seatNumber });
    if (existingTicket) {
      return reply.status(400).send({ message: "Seat is already booked" });
    }

    const ticket = new Ticket({
      customerId,
      trainId,
      scheduleId,
      seatNumber,
      classType,
      price,
    });

    await ticket.save();

    return reply.status(201).send({
      message: "Ticket created successfully",
      ticket,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Fetch all Tickets
export const fetchAllTickets = async (req, reply) => {
  try {
    const tickets = await Ticket.find()
      .populate("customerId", "name email") // Populate customer details
      .populate("trainId", "name trainNumber") // Populate train details
      .populate("scheduleId", "departureTime arrivalTime"); // Populate schedule details

    return reply.send({
      message: "Tickets fetched successfully",
      tickets,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Fetch a Ticket by ID
export const fetchTicketById = async (req, reply) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id)
      .populate("customerId", "name email")
      .populate("trainId", "name trainNumber")
      .populate("scheduleId", "departureTime arrivalTime");

    if (!ticket) {
      return reply.status(404).send({ message: "Ticket not found" });
    }

    return reply.send({
      message: "Ticket fetched successfully",
      ticket,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Update a Ticket
export const updateTicket = async (req, reply) => {
  try {
    const { id } = req.params;
    const { seatNumber, classType, price, status } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return reply.status(404).send({ message: "Ticket not found" });
    }

    // If updating seatNumber, ensure it isn't already booked
    if (seatNumber && seatNumber !== ticket.seatNumber) {
      const existingTicket = await Ticket.findOne({
        trainId: ticket.trainId,
        scheduleId: ticket.scheduleId,
        seatNumber,
      });
      if (existingTicket) {
        return reply.status(400).send({ message: "Seat is already booked" });
      }
    }

    ticket.seatNumber = seatNumber || ticket.seatNumber;
    ticket.classType = classType || ticket.classType;
    ticket.price = price || ticket.price;
    ticket.status = status || ticket.status;

    await ticket.save();

    return reply.send({
      message: "Ticket updated successfully",
      ticket,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Delete a Ticket
export const deleteTicket = async (req, reply) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return reply.status(404).send({ message: "Ticket not found" });
    }

    await ticket.remove();

    return reply.send({
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};
