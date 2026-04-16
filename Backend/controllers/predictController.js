// ============================================================
// Predict Controller — Orchestrates all engines for /predict
// ============================================================

import { getPrediction } from "../services/predictionService.js";
import { analyzeBehavior } from "../services/behaviorService.js";
import { getCauseEffectChain } from "../services/causeEffectService.js";
import { getRecommendations } from "../services/recommendationService.js";
import { addHistory } from "../services/historyService.js";

export const predictDisease = async (req, res) => {
  const { symptoms, behaviors, goal } = req.body;

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
    const prediction = getPrediction(symptoms);

    // 2. Behavior Intelligence Engine
    const behaviorAnalysis = analyzeBehavior(behaviors || {});

    // 3. Cause-Effect-Outcome Engine
    const causeEffectChain = getCauseEffectChain(prediction.primary);

    // 4. Context-Aware Recommendations
    const recommendations = getRecommendations(
      prediction.primary,
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
      explanation: `Analysis based on ${symptoms.length} symptom(s)${behaviors ? " and behavioral data" : ""}. ${prediction.explanation}`
    };

    // Save to history
    addHistory({
      symptoms,
      behaviors: behaviors || {},
      goal: goal || "general wellness",
      result,
      time: new Date()
    });

    console.log("POST /api/predict — primary:", prediction.primary, "confidence:", prediction.confidence);

    return res.status(200).json({
      success: true,
      data: result,
      disclaimer: "This is not a medical diagnosis. Results are based on pattern matching and behavioral analysis. Please consult a healthcare professional for medical advice."
    });

  } catch (error) {
    console.error("POST /api/predict error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Something went wrong while generating prediction."
    });
  }
};