import { Station } from "../models/stations.js";

// Create a new Station
export const createStation = async (req, reply) => {
  try {
    const { name, code, location } = req.body;

    // Ensure the station code is unique
    const existingStation = await Station.findOne({ code });
    if (existingStation) {
      return reply.status(400).send({ message: "Station code must be unique" });
    }

    const station = new Station({
      name,
      code,
      location,
    });

    await station.save();

    return reply.status(201).send({
      message: "Station created successfully",
      station,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Fetch all Stations
export const fetchAllStations = async (req, reply) => {
  try {
    const stations = await Station.find();
    return reply.send({
      message: "Stations fetched successfully",
      stations,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Fetch a single Station by ID
export const fetchStationById = async (req, reply) => {
  try {
    const { id } = req.params;

    const station = await Station.findById(id);
    if (!station) {
      return reply.status(404).send({ message: "Station not found" });
    }

    return reply.send({
      message: "Station fetched successfully",
      station,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Update a Station
export const updateStation = async (req, reply) => {
  try {
    const { id } = req.params;
    const { name, code, location } = req.body;

    const station = await Station.findById(id);
    if (!station) {
      return reply.status(404).send({ message: "Station not found" });
    }

    // Ensure the new station code is unique if being updated
    if (code && code !== station.code) {
      const existingStation = await Station.findOne({ code });
      if (existingStation) {
        return reply.status(400).send({ message: "Station code must be unique" });
      }
    }

    station.name = name || station.name;
    station.code = code || station.code;
    station.location = location || station.location;

    await station.save();

    return reply.send({
      message: "Station updated successfully",
      station,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Delete a Station
export const deleteStation = async (req, reply) => {
  try {
    const { id } = req.params;

    const station = await Station.findById(id);
    if (!station) {
      return reply.status(404).send({ message: "Station not found" });
    }

    await station.remove();

    return reply.send({
      message: "Station deleted successfully",
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};
