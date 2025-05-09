import { Schedule } from "../models/schedules.js";

// Create a new Schedule
export const createSchedule = async (req, reply) => {
  try {
    const { trainId, route, daysOfOperation } = req.body;

    const schedule = new Schedule({
      trainId,
      route,
      daysOfOperation,
    });

    await schedule.save();

    return reply.status(201).send({
      message: "Schedule created successfully",
      schedule,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Fetch all Schedules
export const fetchAllSchedules = async (req, reply) => {
  try {
    const schedules = await Schedule.find()
      .populate("trainId", "name trainNumber")
      .populate("route.station", "name code");

    return reply.send({
      message: "Schedules fetched successfully",
      schedules,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Fetch a Schedule by ID
export const fetchScheduleById = async (req, reply) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findById(id)
      .populate("trainId", "name trainNumber")
      .populate("route.station", "name code");

    if (!schedule) {
      return reply.status(404).send({ message: "Schedule not found" });
    }

    return reply.send({
      message: "Schedule fetched successfully",
      schedule,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Update a Schedule
export const updateSchedule = async (req, reply) => {
  try {
    const { id } = req.params;
    const { trainId, route, daysOfOperation } = req.body;

    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return reply.status(404).send({ message: "Schedule not found" });
    }

    schedule.trainId = trainId || schedule.trainId;
    schedule.route = route || schedule.route;
    schedule.daysOfOperation = daysOfOperation || schedule.daysOfOperation;

    await schedule.save();

    return reply.send({
      message: "Schedule updated successfully",
      schedule,
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};

// Delete a Schedule
export const deleteSchedule = async (req, reply) => {
  try {
    const { id } = req.params;

    const schedule = await Schedule.findById(id);
    if (!schedule) {
      return reply.status(404).send({ message: "Schedule not found" });
    }

    await schedule.remove();

    return reply.send({
      message: "Schedule deleted successfully",
    });
  } catch (error) {
    return reply.status(500).send({ message: "An error occurred", error });
  }
};
