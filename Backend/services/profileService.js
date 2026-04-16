import HealthProfile from "../models/HealthProfile.js";
import { getPredictionHistory } from "./historyService.js";

/**
 * Generate a user health profile from history.
 * @returns {Object} - Aggregated health profile
 */
export const getProfile = async ({ userId, profileId }) => {
  const [profileDoc, history] = await Promise.all([
    HealthProfile.findOne({ _id: profileId, userId }).lean(),
    getPredictionHistory({ userId, profileId, limit: 50 })
  ]);

  if (!profileDoc) {
    return {
      profile: null,
      recurring_symptoms: [],
      condition_history: [],
      confidence: "Low",
      explanation: "Profile not found."
    };
  }

  if (!history || history.length === 0) {
    return {
      profile: {
        profileId: String(profileDoc._id),
        displayName: profileDoc.displayName,
        relation: profileDoc.label,
        age: profileDoc.age ?? null,
        habits: profileDoc.habits || {},
        lifestyle: profileDoc.lifestyle || [],
        pastConditions: profileDoc.pastConditions || [],
        dominant_issue: "No data available",
        trend: "unknown",
        risk_level: "unknown",
        totalSessions: 0
      },
      recurring_symptoms: [],
      condition_history: [],
      confidence: "Low",
      explanation: "No health records found. Start by submitting symptoms and behaviors to build your health profile."
    };
  }

  // Aggregate all symptoms
  const symptomFrequency = {};
  const conditionFrequency = {};
  const riskLevels = [];

  for (const record of history) {
    // Count symptoms
    if (record.symptoms) {
      for (const symptom of record.symptoms) {
        symptomFrequency[symptom] = (symptomFrequency[symptom] || 0) + 1;
      }
    }

    // Count conditions
    if (record.normalizedConditions?.length) {
      const cond = record.normalizedConditions[0].name;
      conditionFrequency[cond] = (conditionFrequency[cond] || 0) + 1;
    }

    // Collect risk levels
    if (record.behaviorAnalysis) {
      riskLevels.push(record.behaviorAnalysis.riskLevel);
    }
  }

  // Find dominant condition
  const sortedConditions = Object.entries(conditionFrequency)
    .sort((a, b) => b[1] - a[1]);
  const dominantCondition = sortedConditions.length > 0 ? sortedConditions[0][0] : "None identified";

  // Find recurring symptoms (top 5)
  const sortedSymptoms = Object.entries(symptomFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([symptom, count]) => ({
      symptom,
      occurrences: count,
      percentage: Math.round((count / history.length) * 100)
    }));

  // Determine trend
  const riskMap = { low: 1, moderate: 2, high: 3 };
  const numericRisks = riskLevels.map(r => riskMap[r] || 0).filter(r => r > 0);
  let trend = "stable";

  if (numericRisks.length >= 3) {
    const recentAvg = numericRisks.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const olderAvg = numericRisks.slice(0, -3).length > 0
      ? numericRisks.slice(0, -3).reduce((a, b) => a + b, 0) / numericRisks.slice(0, -3).length
      : recentAvg;

    if (recentAvg > olderAvg + 0.3) trend = "worsening";
    else if (recentAvg < olderAvg - 0.3) trend = "improving";
    else trend = "fluctuating";
  }

  // Overall risk level
  const avgRisk = numericRisks.length > 0
    ? numericRisks.reduce((a, b) => a + b, 0) / numericRisks.length
    : 0;
  const overallRisk = avgRisk >= 2.5 ? "high" : avgRisk >= 1.5 ? "moderate" : "low";

  return {
    profile: {
      profileId: String(profileDoc._id),
      displayName: profileDoc.displayName,
      relation: profileDoc.label,
      age: profileDoc.age ?? null,
      habits: profileDoc.habits || {},
      lifestyle: profileDoc.lifestyle || [],
      pastConditions: profileDoc.pastConditions || [],
      dominant_issue: dominantCondition,
      trend,
      risk_level: overallRisk,
      totalSessions: history.length
    },
    recurring_symptoms: sortedSymptoms,
    condition_history: sortedConditions.map(([condition, count]) => ({
      condition,
      occurrences: count
    })),
    confidence: history.length >= 5 ? "High" : history.length >= 3 ? "Moderate" : "Low",
    explanation: `Profile based on ${history.length} recorded session(s). ${history.length < 3 ? "More data needed for accurate trend detection." : `Dominant pattern: ${dominantCondition} (${trend} trend).`}`
  };
};
