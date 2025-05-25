// filepath: /D:/projects/railwaySystemServer/src/routes/bookingRoutes.js
import {
    createBooking,
    deleteBooking,
    fetchAllBookings,
    fetchBookingsByCustomer,
    updateBookingStatus,
  } from "../controllers/bookingController.js";
  
  export const bookingRoutes = async (fastify, options) => {
    // Booking routes
    fastify.post("/bookings", createBooking);
    fastify.get("/bookings", fetchAllBookings);
fastify.get("/bookings/customer/:customerId", fetchBookingsByCustomer);

    fastify.put("/bookings/:id", updateBookingStatus);
    fastify.delete("/bookings/:id", deleteBooking);
  };
  