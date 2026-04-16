// ============================================================
// Simulate Controller — Generates future simulations
// ============================================================

import { getSimulation } from "../services/simulationService.js";

export const simulateChange = (req, res) => {
  const { condition, behaviors } = req.body;

  console.log("POST /api/simulate request:", JSON.stringify(req.body));

  if (!condition || typeof condition !== "string") {
    return res.status(400).json({
      success: false,
      error: "Condition is required and must be a string."
    });
  }

  try {
    const simulation = getSimulation(condition, behaviors || {});

    return res.json({
      success: true,
      data: simulation,
      disclaimer: "Simulations are generalised projections based on health patterns, not individual medical predictions."
    });
  } catch (error) {
    console.error("POST /api/simulate error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Something went wrong while generating simulation."
    });
  }
};