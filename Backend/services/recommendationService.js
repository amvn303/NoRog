// ============================================================
// Context-Aware Recommendation Engine
// Adapts solutions based on detected issues AND user goals
// ============================================================

import { goalModifiers } from "./knowledgeBase.js";
import { getCauseEffectChain } from "./causeEffectService.js";

/**
 * Generate context-aware recommendations.
 * @param {string} condition - Detected primary condition
 * @param {Object} behaviorAnalysis - Output from behavior engine
 * @param {string} goal - User goal (e.g., "study focus", "fitness")
 * @returns {Object} - Prioritized recommendations with context
 */
export const getRecommendations = (condition, behaviorAnalysis, goal) => {
  // Get base solutions from cause-effect engine
  const baseSolutions = getCauseEffectChain(condition);

  // Get goal-specific modifiers
  const normalizedGoal = (goal || "general wellness").toLowerCase().trim();
  const modifier = goalModifiers[normalizedGoal] || goalModifiers["general wellness"];

  // Prioritize solutions based on goal
  let prioritizedSolutions = [...baseSolutions];

  if (modifier.prioritize && modifier.prioritize.length > 0) {
    prioritizedSolutions.sort((a, b) => {
      const aIndex = modifier.prioritize.indexOf(a.solution);
      const bIndex = modifier.prioritize.indexOf(b.solution);
      // Prioritized items come first (-1 means not in priority list)
      if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex;
      if (aIndex >= 0) return -1;
      if (bIndex >= 0) return 1;
      return 0;
    });
  }

  // Build behavior-specific recommendations
  const behaviorRecommendations = [];
  if (behaviorAnalysis && behaviorAnalysis.riskFactors) {
    for (const risk of behaviorAnalysis.riskFactors) {
      switch (risk.behavior) {
        case "screenTime":
          behaviorRecommendations.push({
            recommendation: "Reduce screen time to under 4 hours of non-essential use daily",
            reason: "High screen exposure is linked to attention fragmentation and sleep disruption",
            priority: "high"
          });
          break;
        case "sleepQuality":
          behaviorRecommendations.push({
            recommendation: "Implement a consistent sleep schedule with 7-9 hours target",
            reason: "Poor sleep quality compounds most health issues and impairs recovery",
            priority: "high"
          });
          break;
        case "exerciseFrequency":
          behaviorRecommendations.push({
            recommendation: "Start with 15-minute daily walks, gradually increasing to 30 minutes",
            reason: "Physical inactivity is a modifiable risk factor for numerous chronic conditions",
            priority: "moderate"
          });
          break;
        case "stressLevel":
          behaviorRecommendations.push({
            recommendation: "Practice 5-minute breathing exercises twice daily",
            reason: "Chronic stress elevates cortisol, affecting immunity, sleep, and cognition",
            priority: "high"
          });
          break;
        case "dietQuality":
          behaviorRecommendations.push({
            recommendation: "Add one serving of vegetables and one of fruit to each meal",
            reason: "Nutritional gaps can exacerbate fatigue, mood issues, and immune weakness",
            priority: "moderate"
          });
          break;
        case "focusLevel":
          behaviorRecommendations.push({
            recommendation: "Try the Pomodoro technique: 25 minutes focused work, 5 minutes break",
            reason: "Structured attention training can rebuild focus capacity over time",
            priority: "moderate"
          });
          break;
      }
    }
  }

  return {
    goal: normalizedGoal,
    conditionSolutions: prioritizedSolutions,
    behaviorRecommendations,
    goalSpecificTips: modifier.additionalTips || [],
    confidence: prioritizedSolutions.length > 0 ? "Moderate" : "Low",
    explanation: `Recommendations tailored for "${normalizedGoal}" goal, addressing ${condition || "general health"} with ${behaviorRecommendations.length} behavior-specific adjustments.`
  };
};
