import {bookingRoutes} from "./bookingRoutes.js";
import {scheduleRoutes} from "./scheduleRoutes.js";
import {stationRoutes} from "./stationRoutes.js";
import {ticketRoutes} from "./ticketRoutes.js";
import {trainRoutes} from "./trainRoutes.js";
import {userRoutes} from "./userRoutes.js";


const prefix = "/api";

export const registerRoutes = async (fastify) => {
    fastify.register(bookingRoutes, { prefix: prefix });
    fastify.register(scheduleRoutes, { prefix: prefix });
    fastify.register(stationRoutes, { prefix: prefix });
    fastify.register(ticketRoutes, { prefix: prefix });
    fastify.register(trainRoutes, { prefix: prefix });
    fastify.register(userRoutes, { prefix: prefix });

};