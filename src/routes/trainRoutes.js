// filepath: /D:/projects/railwaySystemServer/src/routes/trainRoutes.js
import {
    createTrain,
    deleteTrain,

    fetchTrainById,
  } from "../controllers/trainController.js";
  
  export const trainRoutes = async (fastify, options) => {
    // Train routes
    fastify.post("/trains", createTrain);

    fastify.get("/trains/:id", fetchTrainById);
    fastify.delete("/trains/:id", deleteTrain);
  };
  