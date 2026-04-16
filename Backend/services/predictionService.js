import axios from "axios";
import { symptomConditionMap } from "./knowledgeBase.js";

const getLocalPrediction = (symptoms) => {
  const normalizedSymptoms = symptoms.map((s) => s.toLowerCase().trim());
  const conditionScores = {};
  const conditionMatchedSymptoms = {};

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

  const sorted = Object.entries(conditionScores).sort((a, b) => b[1] - a[1]);
  if (sorted.length === 0) {
    return {
      primary: null,
      secondary: [],
      confidence: "Low",
      explanation:
        "Reported symptoms do not map strongly to known local patterns. Provide additional context for better inference."
    };
  }

  const topScore = sorted[0][1];
  const totalSymptoms = normalizedSymptoms.length;
  const matchRatio = topScore / totalSymptoms;

  let confidence;
  if (matchRatio >= 0.7 && topScore >= 3) confidence = "High";
  else if (matchRatio >= 0.4 && topScore >= 2) confidence = "Moderate";
  else confidence = "Low";

  const primary = sorted[0][0];
  const secondary = sorted.slice(1, 4).map(([condition]) => condition);

  return {
    primary,
    secondary,
    confidence,
    explanation: `Pattern overlap suggests ${primary}. Confidence is ${confidence.toLowerCase()} based on local symptom-matching coverage.`
  };
};

const getConfidenceFromProbability = (probability) => {
  if (probability >= 0.65) return "High";
  if (probability >= 0.35) return "Moderate";
  return "Low";
};

const normalizeInfermedicaResponse = (payload) => {
  const conditions = Array.isArray(payload?.conditions) ? payload.conditions : [];
  if (conditions.length === 0) {
    return {
      source: "infermedica",
      primary: null,
      secondary: [],
      confidence: "Low",
      normalizedConditions: [],
      explanation: "External medical API returned no condition matches.",
      rawApiResponse: payload
    };
  }

  const normalizedConditions = conditions
    .map((c, idx) => ({
      name: c?.name || "Unknown Pattern",
      probability: Number(c?.probability || 0),
      rank: idx + 1
    }))
    .sort((a, b) => b.probability - a.probability);

  const primary = normalizedConditions[0];
  return {
    source: "infermedica",
    primary: primary.name,
    secondary: normalizedConditions.slice(1, 4).map((c) => c.name),
    confidence: getConfidenceFromProbability(primary.probability),
    normalizedConditions,
    explanation: `External medical API suggests ${primary.name} (${Math.round(
      primary.probability * 100
    )}% probability).`,
    rawApiResponse: payload
  };
};

const fetchInfermedicaPrediction = async (symptoms) => {
  const appId = process.env.INFERMEDICA_APP_ID;
  const appKey = process.env.INFERMEDICA_APP_KEY;
  if (!appId || !appKey) return null;

  const evidence = symptoms.map((symptom) => ({
    id: symptom.toLowerCase().replace(/\s+/g, "_"),
    choice_id: "present"
  }));

  const response = await axios.post(
    "https://api.infermedica.com/v3/diagnosis",
    {
      sex: "unknown",
      age: { value: 30 },
      evidence
    },
    {
      headers: {
        "App-Id": appId,
        "App-Key": appKey,
        "Content-Type": "application/json"
      },
      timeout: 10000
    }
  );

  return normalizeInfermedicaResponse(response.data);
};

export const getPrediction = async (symptoms) => {
  try {
    const apiPrediction = await fetchInfermedicaPrediction(symptoms);
    if (apiPrediction) return apiPrediction;
  } catch (error) {
    console.warn("Infermedica unavailable, using fallback prediction:", error.message);
  }

  const local = getLocalPrediction(symptoms);
  return {
    source: "local-fallback",
    primary: local.primary,
    secondary: local.secondary,
    confidence: local.confidence,
    normalizedConditions: [
      ...(local.primary
        ? [
            {
              name: local.primary,
              probability:
                local.confidence === "High" ? 0.75 : local.confidence === "Moderate" ? 0.5 : 0.25,
              rank: 1
            }
          ]
        : []),
      ...local.secondary.map((name, idx) => ({
        name,
        probability: Math.max(0.15, 0.4 - idx * 0.1),
        rank: idx + 2
      }))
    ],
    explanation: `Fallback engine infers ${local.primary || "no clear pattern"}. ${local.explanation}`,
    rawApiResponse: null
  };
};

