// ============================================================
// Prediction Engine
// Scores conditions by symptom overlap, returns primary/secondary
// with confidence levels
// ============================================================

import { symptomConditionMap } from "./knowledgeBase.js";

export const getPrediction = (symptoms) => {
  const normalizedSymptoms = symptoms.map(s => s.toLowerCase().trim());
  const conditionScores = {};
  const conditionMatchedSymptoms = {};

  // Score each condition by how many input symptoms point to it
  for (const symptom of normalizedSymptoms) {
    const conditions = symptomConditionMap[symptom];
    if (!conditions) continue;

    for (const condition of conditions) {
      conditionScores[condition] = (conditionScores[condition] || 0) + 1;
      if (!conditionMatchedSymptoms[condition]) {
        conditionMatchedSymptoms[condition] = [];
      }
      conditionMatchedSymptoms[condition].push(symptom);
    }
  }

  // Sort conditions by score (descending)
  const sorted = Object.entries(conditionScores)
    .sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    return {
      primary: null,
      secondary: [],
      confidence: "Low",
      explanation: "The reported symptoms did not match any known patterns in our knowledge base. Consider providing more specific symptoms.",
      matchedSymptoms: {},
      unmatchedSymptoms: normalizedSymptoms
    };
  }

  const topScore = sorted[0][1];
  const totalSymptoms = normalizedSymptoms.length;
  const matchRatio = topScore / totalSymptoms;

  // Determine confidence based on match quality
  let confidence;
  if (matchRatio >= 0.7 && topScore >= 3) {
    confidence = "High";
  } else if (matchRatio >= 0.4 && topScore >= 2) {
    confidence = "Moderate";
  } else {
    confidence = "Low";
  }

  const primary = sorted[0][0];
  const secondary = sorted.slice(1, 4).map(([cond, score]) => ({
    condition: cond,
    matchCount: score,
    matchedSymptoms: conditionMatchedSymptoms[cond]
  }));

  // Identify unmatched symptoms
  const allMatched = new Set();
  for (const symptom of normalizedSymptoms) {
    if (symptomConditionMap[symptom]) {
      allMatched.add(symptom);
    }
  }
  const unmatched = normalizedSymptoms.filter(s => !allMatched.has(s));

  return {
    primary,
    secondary: secondary.map(s => s.condition),
    confidence,
    explanation: `Based on ${topScore} of ${totalSymptoms} reported symptoms matching patterns for ${primary}. ${secondary.length > 0 ? `Secondary patterns also suggest ${secondary.map(s => s.condition).join(", ")}.` : ""}`,
    matchDetails: {
      primaryMatchCount: topScore,
      primaryMatchedSymptoms: conditionMatchedSymptoms[primary],
      secondaryDetails: secondary
    },
    unmatchedSymptoms: unmatched
  };
};
