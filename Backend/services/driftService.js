import { getPredictionHistory } from "./historyService.js";

/**
 * Detect drift (trend) in recent health history.
 * Analyzes symptom recurrence, condition stability, and risk trajectory.
 * @returns {Object} - Drift analysis with direction, severity, and message
 */
export const detectDrift = async ({ userId, profileId }) => {
  const history = await getPredictionHistory({ userId, profileId, limit: 5 });

  if (history.length < 2) {
    return {
      drift: "insufficient_data",
      severity: "none",
      message: "Not enough records to detect trends. Continue logging symptoms to enable drift detection.",
      recordCount: history.length,
      details: null
    };
  }

  // Analyze last 3-5 records
  const recentRecords = history.slice(-5);
  const recordCount = recentRecords.length;

  // Track symptom frequency across records
  const symptomFrequency = {};
  const conditionHistory = [];
  const riskLevels = [];

  for (const record of recentRecords) {
    // Count symptoms
    if (record.symptoms) {
      for (const symptom of record.symptoms) {
        symptomFrequency[symptom] = (symptomFrequency[symptom] || 0) + 1;
      }
    }

    // Track conditions
    if (record.normalizedConditions?.length) {
      conditionHistory.push(record.normalizedConditions[0].name);
    }

    // Track risk levels
    if (record.behaviorAnalysis) {
      riskLevels.push(record.behaviorAnalysis.riskLevel);
    }
  }

  // Identify recurring symptoms (appear in >50% of records)
  const recurringSymptoms = Object.entries(symptomFrequency)
    .filter(([, count]) => count >= Math.ceil(recordCount / 2))
    .map(([symptom, count]) => ({ symptom, frequency: count, percentage: Math.round((count / recordCount) * 100) }));

  // Determine condition stability
  const uniqueConditions = [...new Set(conditionHistory)];
  const isConditionStable = uniqueConditions.length === 1;
  const dominantCondition = conditionHistory.length > 0
    ? conditionHistory.sort((a, b) =>
        conditionHistory.filter(v => v === b).length - conditionHistory.filter(v => v === a).length
      )[0]
    : null;

  // Determine risk trend
  const riskMap = { low: 1, moderate: 2, high: 3 };
  const numericRisks = riskLevels.map(r => riskMap[r] || 0).filter(r => r > 0);

  let drift = "stable";
  let severity = "none";
  let message = "";

  if (numericRisks.length >= 2) {
    const firstHalf = numericRisks.slice(0, Math.floor(numericRisks.length / 2));
    const secondHalf = numericRisks.slice(Math.floor(numericRisks.length / 2));
    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    if (avgSecond > avgFirst + 0.3) {
      drift = "increasing";
      severity = avgSecond >= 2.5 ? "high" : "moderate";
      message = "Your condition patterns suggest a gradual worsening trend. Consider implementing recommended interventions.";
    } else if (avgSecond < avgFirst - 0.3) {
      drift = "decreasing";
      severity = "low";
      message = "Positive trend detected — your condition patterns suggest improvement. Keep up the good practices!";
    } else {
      drift = "stable";
      severity = avgSecond >= 2.5 ? "moderate" : "low";
      message = "Your condition patterns are relatively stable. Continue monitoring for any changes.";
    }
  } else if (recurringSymptoms.length > 0) {
    drift = "recurring";
    severity = recurringSymptoms.length >= 3 ? "moderate" : "low";
    message = `${recurringSymptoms.length} symptom(s) appear frequently across your records, suggesting a recurring pattern.`;
  } else {
    message = "No significant trend detected. Continue logging symptoms for better pattern recognition.";
  }

  return {
    drift,
    severity,
    message,
    recordCount,
    details: {
      recurringSymptoms,
      dominantCondition,
      isConditionStable,
      uniqueConditions,
      riskTrend: numericRisks
    }
  };
};
