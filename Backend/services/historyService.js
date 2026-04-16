import PredictionRecord from "../models/PredictionRecord.js";
import SimulationRecord from "../models/SimulationRecord.js";
import ChatSession from "../models/ChatSession.js";

export const addPredictionHistory = async ({
  userId,
  profileId,
  symptoms,
  source,
  normalizedConditions,
  confidence,
  behaviorAnalysis,
  causeEffectChain,
  recommendations,
  rawApiResponse
}) => {
  return PredictionRecord.create({
    userId,
    profileId,
    symptoms,
    source,
    normalizedConditions,
    confidence,
    behaviorAnalysis,
    causeEffectChain,
    recommendations,
    rawApiResponse
  });
};

export const addSimulationHistory = async ({ userId, profileId, condition, toggles, result }) => {
  return SimulationRecord.create({ userId, profileId, condition, toggles, result });
};

export const getPredictionHistory = async ({ userId, profileId, limit = 50 }) => {
  return PredictionRecord.find({ userId, profileId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
};

export const getLatestPrediction = async ({ userId, profileId }) => {
  return PredictionRecord.findOne({ userId, profileId }).sort({ createdAt: -1 }).lean();
};

export const getChatHistory = async ({ userId, profileId }) => {
  const session = await ChatSession.findOne({ userId, profileId }).lean();
  return session?.messages || [];
};
