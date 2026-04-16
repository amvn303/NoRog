// ============================================================
// Cause → Effect → Outcome Engine
// Returns structured solutions with causal chain explanations
// ============================================================

import { conditionSolutions } from "./knowledgeBase.js";

/**
 * Get cause-effect-outcome chains for a condition.
 * @param {string} condition - The identified condition
 * @returns {Array} - Solutions with why/effect/outcome chains
 */
export const getCauseEffectChain = (condition) => {
  if (!condition) return [];

  const entry = conditionSolutions[condition];

  if (!entry) {
    // Return a generic solution chain
    return [
      {
        solution: "Consult a healthcare professional",
        why: [
          "Professional evaluation can identify specific underlying causes",
          "Personalized treatment plans are more effective than generic advice"
        ],
        effect: [
          "Accurate understanding of the condition",
          "Targeted intervention strategies"
        ],
        outcome: [
          "Faster resolution of symptoms",
          "Prevention of potential complications"
        ]
      },
      {
        solution: "Maintain healthy lifestyle basics",
        why: [
          "Good nutrition, sleep, and exercise support all bodily systems",
          "A strong baseline health makes recovery easier"
        ],
        effect: [
          "Improved energy and immune function",
          "Better stress management"
        ],
        outcome: [
          "Improved overall health resilience",
          "Reduced severity of most conditions"
        ]
      }
    ];
  }

  return entry.solutions;
};
