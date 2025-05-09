// filepath: /D:/projects/railwaySystemServer/src/routes/scheduleRoutes.js
import {
    createSchedule,
    deleteSchedule,
    fetchAllSchedules,
    
  } from "../controllers/scheduleController.js";
  
  export const scheduleRoutes = async (fastify, options) => {
    // Schedule routes
    fastify.post("/schedule", createSchedule);
    fastify.get("/schedule", fetchAllSchedules);
    fastify.get("/schedule/:trainId",fetchAllSchedules);
    fastify.delete("/schedule/:id", deleteSchedule);
  };
  