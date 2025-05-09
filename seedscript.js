import mongoose from 'mongoose';
import { Bookings } from './src/models/bookings.js';
import { Schedule } from './src/models/schedules.js';
import { Station } from './src/models/stations.js';
import { Ticket } from './src/models/tickets.js';
import { Train } from './src/models/trains.js';
import { Customer, Admin } from './src/models/user.js';

// MongoDB connection URI
const uri =
  'mongodb+srv://adilyassar9898:adilyassar98A@cluster0.dfqzdvc.mongodb.net/railwaySystemServer?retryWrites=true&w=majority';

const connectDB = async () => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 50000, // Increased timeout
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1); // Exit process on connection failure
  }
};

mongoose.connection.on('connected', () => console.log('Mongoose connected to DB'));
mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));
mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

// Clear all collections
const clearCollections = async () => {
  try {
    await Bookings.deleteMany();
    await Schedule.deleteMany();
    await Station.deleteMany();
    await Ticket.deleteMany();
    await Train.deleteMany();
    await Customer.deleteMany();
    await Admin.deleteMany();
    console.log('Cleared all collections');
  } catch (error) {
    console.error('Error clearing collections:', error);
  }
};

// Seed data functions
const seedCustomers = async () => {
  const customers = [
    { name: 'John Doe', age: 28, email: 'john@example.com', password: 'password123', photo: 'john.jpg' },
    { name: 'Jane Smith', age: 32, email: 'jane@example.com', password: 'password123', photo: 'jane.jpg' },
    { name: 'Bob Wilson', age: 45, email: 'bob@example.com', password: 'password123', photo: 'bob.jpg' },
    { name: 'Alice Brown', age: 22, email: 'alice@example.com', password: 'password123', photo: 'alice.jpg' },
    { name: 'Charlie Davis', age: 38, email: 'charlie@example.com', password: 'password123', photo: 'charlie.jpg' },
  ];
  return await Customer.insertMany(customers);
};

const seedAdmins = async () => {
  const admins = [
    { name: 'Admin One', email: 'admin1@example.com', password: 'adminpass123', phone: '123-456-7890' },
    { name: 'Admin Two', email: 'admin2@example.com', password: 'adminpass456', phone: '987-654-3210' },
  ];
  return await Admin.insertMany(admins);
};

const seedTrains = async () => {
  const trains = [
    { name: 'Express 2000', trainNumber: 'T123', capacity: 300, classTypes: ['Economy', 'Business'] },
    { name: 'Super Fast', trainNumber: 'T456', capacity: 250, classTypes: ['Economy', 'Premium'] },
    { name: 'Night Rider', trainNumber: 'T789', capacity: 400, classTypes: ['Economy'] },
    { name: 'City Hopper', trainNumber: 'T101', capacity: 200, classTypes: ['Business', 'First'] },
    { name: 'Mountain Express', trainNumber: 'T202', capacity: 350, classTypes: ['Economy', 'Business'] },
  ];
  return await Train.insertMany(trains);
};

const seedStations = async () => {
  const stations = [
    { name: 'Central Station', code: 'CTR', location: { city: 'Metropolis', state: 'NY', coordinates: { lat: 40.7128, lng: -74.0060 } } },
    { name: 'West Terminal', code: 'WST', location: { city: 'Springfield', state: 'IL', coordinates: { lat: 39.7817, lng: -89.6501 } } },
    { name: 'North Junction', code: 'NRTH', location: { city: 'Lakeside', state: 'CA', coordinates: { lat: 34.0522, lng: -118.2437 } } },
    { name: 'South Hub', code: 'STH', location: { city: 'Riverside', state: 'TX', coordinates: { lat: 29.7604, lng: -95.3698 } } },
    { name: 'East Depot', code: 'EST', location: { city: 'Hill Valley', state: 'NV', coordinates: { lat: 36.1699, lng: -115.1398 } } },
  ];
  return await Station.insertMany(stations);
};

const seedSchedules = async (trains, stations) => {
  const schedules = [
    { 
      trainId: trains[0]._id,
      route: [
        { station: stations[0]._id, arrivalTime: new Date('2023-08-01T08:00'), departureTime: new Date('2023-08-01T08:30') },
        { station: stations[1]._id, arrivalTime: new Date('2023-08-01T12:00'), departureTime: new Date('2023-08-01T12:15') }
      ],
      daysOfOperation: ['Monday', 'Wednesday', 'Friday']
    },
  ];
  return await Schedule.insertMany(schedules);
};

const seedTickets = async (customers, trains, schedules) => {
  const tickets = customers.map((customer, index) => ({
    customerId: customer._id,
    trainId: trains[index % trains.length]._id,
    scheduleId: schedules[index % schedules.length]._id,
    seatNumber: `A${index + 1}`,
    classType: index % 2 === 0 ? 'Economy' : 'Business',
    price: 50 + index * 10,
  }));
  return await Ticket.insertMany(tickets);
};

const seedBookings = async (customers, tickets) => {
  const bookings = customers.map((customer, index) => {
    const customerTickets = tickets.slice(index * 2, (index + 1) * 2);
    return {
      customerId: customer._id,
      tickets: customerTickets.map((t) => t._id),
      totalCost: customerTickets.reduce((sum, t) => sum + t.price, 0),
      paymentMethod: ['Credit Card', 'Debit Card', 'PayPal'][index % 3],
      status: 'Confirmed',
    };
  });
  return await Bookings.insertMany(bookings);
};

const seedData = async () => {
  try {
    await connectDB();
    await clearCollections();

    const customers = await seedCustomers();
    console.log('Seeded Customers');
    const admins = await seedAdmins();
    console.log('Seeded Admins');
    const trains = await seedTrains();
    console.log('Seeded Trains');
    const stations = await seedStations();
    console.log('Seeded Stations');
    const schedules = await seedSchedules(trains, stations);
    console.log('Seeded Schedules');
    const tickets = await seedTickets(customers, trains, schedules);
    console.log('Seeded Tickets');
    const bookings = await seedBookings(customers, tickets);
    console.log('Seeded Bookings');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();
