// ============================================================
// Simulate Controller — Generates future simulations
// ============================================================

import { getSimulation } from "../services/simulationService.js";
import { addSimulationHistory } from "../services/historyService.js";

export const simulateChange = async (req, res) => {
  const { userId, profileId, condition, behaviors, toggles } = req.body;

  console.log("POST /api/simulate request:", JSON.stringify(req.body));

  if (!condition || typeof condition !== "string") {
    return res.status(400).json({
      success: false,
      error: "Condition is required and must be a string."
    });
  }

  try {
    const simulation = getSimulation(condition, behaviors || {}, toggles || {});

    if (userId && profileId) {
      await addSimulationHistory({
        userId,
        profileId,
        condition,
        toggles: toggles || {},
        result: simulation
      });
    }

    return res.json({
      success: true,
      data: simulation,
      disclaimer: "Simulations indicate possible trajectories and inferred changes, not individual medical predictions."
    });
  } catch (error) {
    console.error("POST /api/simulate error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Something went wrong while generating simulation."
    });
  }
};
