// filepath: /D:/projects/railwaySystemServer/src/routes/userRoutes.js
import {

  fetchCustomer,
  fetchUser,
  loginAdmin,
  loginCustomer

  } from "../controllers/userController.js";
  
  export const userRoutes = async (fastify, options) => {
    // User routes

    fastify.get("/users/:id", fetchCustomer);
    fastify.post("/users/login", loginCustomer);
    fastify.post("/users/login/admin", loginAdmin);
    fastify.put("/users/:id", fetchUser);

  };
  