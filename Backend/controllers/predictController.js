// ============================================================
// Predict Controller — Orchestrates all engines for /predict
// ============================================================

import { getPrediction } from "../services/predictionService.js";
import { analyzeBehavior } from "../services/behaviorService.js";
import { getCauseEffectChain } from "../services/causeEffectService.js";
import { getRecommendations } from "../services/recommendationService.js";
import { addPredictionHistory } from "../services/historyService.js";

export const predictDisease = async (req, res) => {
  const { userId, profileId, symptoms, behaviors, goal } = req.body;

  console.log("POST /api/predict request:", JSON.stringify(req.body));

  // Validate symptoms
  if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
    return res.status(400).json({
      success: false,
      error: "Symptoms array is required and must not be empty."
    });
  }

  if (!symptoms.every(s => typeof s === "string" && s.trim() !== "")) {
    return res.status(400).json({
      success: false,
      error: "Each symptom must be a non-empty string."
    });
  }

  try {
    // 1. Prediction Engine
    const prediction = await getPrediction(symptoms);

    // 2. Behavior Intelligence Engine
    const behaviorAnalysis = analyzeBehavior(behaviors || {});

    // 3. Cause-Effect-Outcome Engine
    const causeEffectChain = getCauseEffectChain(prediction.primary || "default");

    // 4. Context-Aware Recommendations
    const recommendations = getRecommendations(
      prediction.primary || "general wellness pattern",
      behaviorAnalysis,
      goal || "general wellness"
    );

    // Build unified result
    const result = {
      prediction,
      behaviorAnalysis,
      causeEffectChain,
      recommendations,
      confidence: prediction.confidence,
      explanation: `Analysis based on ${symptoms.length} symptom(s)${behaviors ? " and behavior context" : ""}. ${prediction.explanation}`
    };

    if (userId && profileId) {
      await addPredictionHistory({
        userId,
        profileId,
        symptoms,
        source: prediction.source,
        normalizedConditions: prediction.normalizedConditions || [],
        confidence: prediction.confidence,
        behaviorAnalysis,
        causeEffectChain,
        recommendations,
        rawApiResponse: prediction.rawApiResponse
      });
    }

    console.log("POST /api/predict — primary:", prediction.primary, "confidence:", prediction.confidence);

    return res.status(200).json({
      success: true,
      data: result,
      disclaimer: "This is not a medical diagnosis. It suggests likely patterns and inferred behavior risks. Please consult a healthcare professional for clinical advice."
    });

  } catch (error) {
    console.error("POST /api/predict error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Something went wrong while generating prediction."
    });
  }
};
