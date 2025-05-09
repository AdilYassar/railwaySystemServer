import { Train } from "../models/trains.js";

// Create a new Train
export const createTrain = async (req, reply) => {
  try {
    const { name, trainNumber, capacity, classTypes } = req.body;

    // Check if trainNumber already exists
    const existingTrain = await Train.findOne({ trainNumber });
    if (existingTrain) {
      return reply.status(400).send({ message: "Train number already exists" });
    }

    // Create new train
    const train = new Train({
      name,
      trainNumber,
      capacity,
      classTypes,
    });
    await train.save();

    return reply.status(201).send({
      message: "Train created successfully",
      train,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Fetch all Trains
export const fetchTrains = async (req, reply) => {
  try {
    const trains = await Train.find();
    return reply.send({
      message: "Trains fetched successfully",
      trains,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Fetch a single Train by ID
export const fetchTrainById = async (req, reply) => {
  try {
    const { id } = req.params;
    const train = await Train.findById(id);

    if (!train) {
      return reply.status(404).send({ message: "Train not found" });
    }

    return reply.send({
      message: "Train fetched successfully",
      train,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Update a Train
export const updateTrain = async (req, reply) => {
  try {
    const { id } = req.params;
    const { name, trainNumber, capacity, classTypes } = req.body;

    const train = await Train.findById(id);
    if (!train) {
      return reply.status(404).send({ message: "Train not found" });
    }

    // Update train details
    train.name = name || train.name;
    train.trainNumber = trainNumber || train.trainNumber;
    train.capacity = capacity || train.capacity;
    train.classTypes = classTypes || train.classTypes;

    await train.save();

    return reply.send({
      message: "Train updated successfully",
      train,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Delete a Train
export const deleteTrain = async (req, reply) => {
  try {
    const { id } = req.params;

    const train = await Train.findById(id);
    if (!train) {
      return reply.status(404).send({ message: "Train not found" });
    }

    await train.remove();

    return reply.send({
      message: "Train deleted successfully",
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};
