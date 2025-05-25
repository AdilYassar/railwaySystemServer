// Filepath: /D:/projects/railwaySystemServer/src/routes/userRoutes.js
import {
  fetchCustomer,
  fetchUser,
  loginAdmin,
  loginCustomer,
} from "../controllers/userController.js";
import { verifyToken } from "../middleware/auth.js";

export const userRoutes = async (fastify, options) => {
  // User routes

  // Route for fetching a customer (requires authentication)
  fastify.get("/users/customer", { preHandler: verifyToken }, fetchCustomer);

  // Route for logging in a customer
  fastify.post("/users/login", loginCustomer);

  // Route for logging in an admin
  fastify.post("/users/login/admin", loginAdmin);

  // Route for fetching a user (admin or customer, requires authentication)
  fastify.get("/users/me", { preHandler: verifyToken }, fetchUser);
};
