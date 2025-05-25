import {getAllFeedback} from "../controllers/feedbackController.js";
import {postFeedback} from "../controllers/feedbackController.js";

export  async function feedbackRoutes(fastify, options) {
  fastify.get("/feedback", getAllFeedback);

  fastify.post("/feedback", {
    schema: {
      body: {
        type: "object",
        required: ["customerId", "message"],
        properties: {
          customerId: { type: "string" },
          message: { type: "string" },
        },
      },
    },
  }, postFeedback);
}

