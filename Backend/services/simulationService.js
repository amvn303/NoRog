// ============================================================
// Multi-Layer Simulation Engine
// Simulates two paths (with/without intervention) across 4 timeframes
// ============================================================

import { simulationTemplates } from "./knowledgeBase.js";

/**
 * Generate a simulation for a given condition.
 * @param {string} condition - The identified condition
 * @param {Object} behaviors - Optional behavior context to enrich simulation
 * @returns {Object} - Two-path simulation across 4 timeframes
 */
export const getSimulation = (condition, behaviors = {}) => {
  const template = simulationTemplates[condition] || simulationTemplates["default"];

  // Enrich based on behavior context if available
  let behaviorNote = "";
  if (behaviors) {
    const risks = [];
    if (behaviors.screenTime === "high") risks.push("high screen exposure");
    if (behaviors.sleepQuality === "poor") risks.push("poor sleep");
    if (behaviors.stressLevel === "high") risks.push("elevated stress");
    if (behaviors.exerciseFrequency === "none") risks.push("no physical activity");

    if (risks.length > 0) {
      behaviorNote = ` Current behavior factors (${risks.join(", ")}) may accelerate negative outcomes if unchanged.`;
    }
  }

  return {
    condition,
    simulation: {
      withChange: { ...template.withChange },
      withoutChange: { ...template.withoutChange }
    },
    behaviorContext: behaviorNote || "No additional behavior risk factors detected.",
    disclaimer: "This simulation is based on general health patterns and is not a medical prediction. Individual outcomes may vary significantly."
  };
};
