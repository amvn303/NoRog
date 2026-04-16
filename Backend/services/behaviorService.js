// ============================================================
// Behavior Intelligence Engine
// Analyzes user behavior inputs and infers behavioral patterns
// ============================================================

import { behaviorPatternMap } from "./knowledgeBase.js";

/**
 * Analyze behavior inputs and infer patterns.
 * @param {Object} behaviors - { screenTime, sleepQuality, focusLevel, exerciseFrequency, dietQuality, stressLevel }
 * @returns {Object} - inferred patterns and risk factors
 */
export const analyzeBehavior = (behaviors) => {
  if (!behaviors || typeof behaviors !== "object") {
    return { patterns: [], riskFactors: [], summary: "No behavior data provided" };
  }

  const patterns = [];
  const riskFactors = [];
  const details = [];

  // Analyze each behavior dimension
  for (const [key, value] of Object.entries(behaviors)) {
    if (!behaviorPatternMap[key] || !value) continue;

    const normalizedValue = value.toLowerCase().trim();
    const mapping = behaviorPatternMap[key][normalizedValue];

    if (!mapping) continue;

    details.push({
      behavior: key,
      value: normalizedValue,
      pattern: mapping.pattern,
      detail: mapping.detail
    });

    // Identify risk factors (negative patterns)
    const isRisk = ["high", "poor", "low", "none"].includes(normalizedValue) &&
                   !["exerciseFrequency"].includes(key) ||
                   (key === "exerciseFrequency" && ["none", "low"].includes(normalizedValue));

    // Special handling: high exercise is good, high screen time is bad
    if (key === "screenTime" && normalizedValue === "high") {
      riskFactors.push({ behavior: key, level: normalizedValue, pattern: mapping.pattern });
    } else if (key === "sleepQuality" && normalizedValue === "poor") {
      riskFactors.push({ behavior: key, level: normalizedValue, pattern: mapping.pattern });
    } else if (key === "focusLevel" && normalizedValue === "low") {
      riskFactors.push({ behavior: key, level: normalizedValue, pattern: mapping.pattern });
    } else if (key === "exerciseFrequency" && ["none", "low"].includes(normalizedValue)) {
      riskFactors.push({ behavior: key, level: normalizedValue, pattern: mapping.pattern });
    } else if (key === "dietQuality" && normalizedValue === "poor") {
      riskFactors.push({ behavior: key, level: normalizedValue, pattern: mapping.pattern });
    } else if (key === "stressLevel" && normalizedValue === "high") {
      riskFactors.push({ behavior: key, level: normalizedValue, pattern: mapping.pattern });
    }

    patterns.push(mapping.pattern);
  }

  // Deduplicate patterns
  const uniquePatterns = [...new Set(patterns)];

  // Generate summary
  let summary;
  if (riskFactors.length === 0) {
    summary = "Behavior patterns suggest a generally healthy lifestyle with no significant risk indicators detected.";
  } else if (riskFactors.length <= 2) {
    summary = `System infers ${riskFactors.length} area(s) of concern: ${riskFactors.map(r => r.pattern).join(", ")}. Targeted interventions may help.`;
  } else {
    summary = `Multiple behavior risk factors detected (${riskFactors.length} areas). Patterns suggest a compound effect that may amplify health risks. Comprehensive lifestyle changes recommended.`;
  }

  return {
    patterns: uniquePatterns,
    riskFactors,
    details,
    summary,
    riskLevel: riskFactors.length === 0 ? "low" : riskFactors.length <= 2 ? "moderate" : "high"
  };
};
