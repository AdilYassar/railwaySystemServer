// filepath: /D:/projects/railwaySystemServer/src/routes/stationRoutes.js
import {
    createStation,
    deleteStation,
    fetchAllStations,
    fetchStationById,
  } from "../controllers/stationController.js";
  
  export const stationRoutes = async (fastify, options) => {
    // Station routes
    fastify.post("/stations", createStation);
    fastify.get("/stations", fetchAllStations);
    fastify.get("/stations/:id", fetchStationById);
    fastify.delete("/stations/:id", deleteStation);
  };
  