// filepath: /D:/projects/railwaySystemServer/src/routes/ticketRoutes.js
import {
    createTicket,
    deleteTicket,
    fetchAllTickets,
    fetchTicketById,
   
  } from "../controllers/ticketController.js";
  
  export const ticketRoutes = async (fastify, options) => {
    // Ticket routes
    fastify.post("/tickets", createTicket);
    fastify.get("/tickets", fetchAllTickets);
    fastify.get("/tickets/:bookingId", fetchTicketById);
    fastify.delete("/tickets/:id", deleteTicket);
  };
  