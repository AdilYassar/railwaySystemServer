// filepath: /D:/projects/quizServer/src/config/setup.js
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import * as AdminJSMongoose from '@adminjs/mongoose';
import AdminJSFastify from "@adminjs/fastify";
import { authenticate, COOKIE_PASSWORD, sessionStore } from "./config.js";
import { Admin, Customer } from '../models/user.js';
import { Bookings } from '../models/bookings.js';
import { Schedule } from '../models/schedules.js';
import { Station } from '../models/stations.js';
import { Ticket } from '../models/tickets.js';
import { Train } from '../models/trains.js';
import { Feedback } from '../models/feedback.js';





AdminJS.registerAdapter(AdminJSMongoose);

const adminJs = new AdminJS({
    resources: [
        { resource: Admin, options: { listProperties: ['email', 'role', 'isActivated'], filterProperties: ['email', 'role'] } },
        { resource: Customer, options: { listProperties: ['email', 'role', 'isActivated'], filterProperties: ['email', 'role'] } },

        { 
            resource: Ticket, 
            options: { 
                listProperties: ['customerId', 'trainId', 'seatNumber', 'classType', 'price', 'status'], 
                properties: {
                    customerId: { reference: 'User' },
                    trainId: { reference: 'Train' },
                    scheduleId: { reference: 'Schedule' },
                },
            } 
        },
        { resource: Bookings,},
        { resource: Schedule },
        { resource: Station },
        { resource: Feedback },
       
        { resource: Train },

      
    ],
    branding:{
        companyName: "Railway Reservation System",
        withMadeWithLove:false,
        favicon:"https://i.pinimg.com/736x/54/89/10/5489102e76d782aa93ee0768906c1960.jpg",
        
      
    },
 
    rootPath: '/admin',
});

const router = AdminJSExpress.buildRouter(adminJs);

export const buildAdminRouter = async (app) => {
    await AdminJSFastify.buildAuthenticatedRouter(
        adminJs, // Use the correct instance of AdminJS
        {
            authenticate,
            cookiePassword: COOKIE_PASSWORD,
            cookieName: "adminjs",
        },
        app,
        {
            store: sessionStore,
            saveUninitialized: true,
            secret: COOKIE_PASSWORD,
            cookie: {
                httpOnly: process.env.NODE_ENV === "production",
                secure: process.env.NODE_ENV === "production",
            },
        }
    );
};
