const Sprint = require('../models/sprintModel');

/**
 * Helper to generate initial daily remaining values
 */
const generateDailyRemaining = (totalEffort, durationDays) => {
  const daily = [];
  // Day 0 is the starting day with the initial effort
  daily.push({ day: 0, remaining: totalEffort });
  for (let i = 1; i <= durationDays; i++) {
    daily.push({ day: i, remaining: null });
  }
  return daily;
};

/**
 * Fetch all sprints from the database.
 * If no sprints exist, seed default sample sprints.
 */
const getSprints = async (req, res, next) => {
  try {
    let sprints = await Sprint.find().sort({ createdAt: -1 });

    if (sprints.length === 0) {
      console.log('No sprints found in MongoDB. Seeding default demo sprints...');
      
      const seedSprints = [
        {
          name: 'Sprint 1: Core Portal Setup',
          durationDays: 10,
          totalEffort: 50,
          dailyRemaining: [
            { day: 0, remaining: 50 },
            { day: 1, remaining: 48 },
            { day: 2, remaining: 42 },
            { day: 3, remaining: 35 },
            { day: 4, remaining: 28 },
            { day: 5, remaining: 22 },
            { day: 6, remaining: null },
            { day: 7, remaining: null },
            { day: 8, remaining: null },
            { day: 9, remaining: null },
            { day: 10, remaining: null }
          ]
        },
        {
          name: 'Sprint 2: Premium Visual Dashboards',
          durationDays: 10,
          totalEffort: 80,
          dailyRemaining: [
            { day: 0, remaining: 80 },
            { day: 1, remaining: 75 },
            { day: 2, remaining: 78 }, // scope creep
            { day: 3, remaining: 65 },
            { day: 4, remaining: 52 },
            { day: 5, remaining: 45 },
            { day: 6, remaining: 38 },
            { day: 7, remaining: 25 },
            { day: 8, remaining: 18 },
            { day: 9, remaining: 8 },
            { day: 10, remaining: 0 }
          ]
        }
      ];

      sprints = await Sprint.insertMany(seedSprints);
    }

    res.status(200).json({
      success: true,
      count: sprints.length,
      data: sprints
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new Sprint
 */
const createSprint = async (req, res, next) => {
  try {
    const { name, durationDays, totalEffort } = req.body;

    if (!name) {
      res.status(400);
      throw new Error('Sprint name is required');
    }

    const duration = parseInt(durationDays) || 10;
    const effort = parseInt(totalEffort) || 50;

    const dailyRemaining = generateDailyRemaining(effort, duration);

    const sprint = await Sprint.create({
      name,
      durationDays: duration,
      totalEffort: effort,
      dailyRemaining
    });

    res.status(201).json({
      success: true,
      data: sprint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update an existing Sprint (e.g. log daily remaining values or change metadata)
 */
const updateSprint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, durationDays, totalEffort, dailyRemaining } = req.body;

    let sprint = await Sprint.findById(id);

    if (!sprint) {
      res.status(404);
      throw new Error(`Sprint with ID ${id} not found`);
    }

    // If changing duration or effort, regenerate daily list or adjust accordingly
    if (totalEffort !== undefined || durationDays !== undefined) {
      const newEffort = totalEffort !== undefined ? parseInt(totalEffort) : sprint.totalEffort;
      const newDuration = durationDays !== undefined ? parseInt(durationDays) : sprint.durationDays;
      
      // Only regenerate if they actually changed
      if (newEffort !== sprint.totalEffort || newDuration !== sprint.durationDays) {
        sprint.totalEffort = newEffort;
        sprint.durationDays = newDuration;
        sprint.dailyRemaining = generateDailyRemaining(newEffort, newDuration);
      }
    }

    if (name) {
      sprint.name = name;
    }

    if (dailyRemaining) {
      sprint.dailyRemaining = dailyRemaining;
    }

    await sprint.save();

    res.status(200).json({
      success: true,
      data: sprint
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a Sprint
 */
const deleteSprint = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sprint = await Sprint.findById(id);

    if (!sprint) {
      res.status(404);
      throw new Error(`Sprint with ID ${id} not found`);
    }

    await sprint.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Sprint deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSprints,
  createSprint,
  updateSprint,
  deleteSprint
};
