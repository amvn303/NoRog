import ChatSession from "../models/ChatSession.js";
import HealthProfile from "../models/HealthProfile.js";
import { analyzeBehavior } from "./behaviorService.js";

const ONBOARDING_QUESTIONS = [
  "Please share past health history relevant to this profile.",
  "What symptoms are most frequent recently?",
  "How would you describe daily sleep, stress, screen-time, exercise, and diet patterns?",
  "What is your main health goal right now?"
];

const extractSimpleContext = (text) => {
  const lower = text.toLowerCase();
  const habits = {};
  if (lower.includes("sleep")) habits.sleepQuality = lower.includes("poor") ? "poor" : "fair";
  if (lower.includes("stress")) habits.stressLevel = lower.includes("high") ? "high" : "medium";
  if (lower.includes("screen")) habits.screenTime = lower.includes("high") ? "high" : "medium";
  return habits;
};

export const processChatMessage = async ({ userId, profileId, text }) => {
  let session = await ChatSession.findOne({ userId, profileId });
  if (!session) {
    session = await ChatSession.create({
      userId,
      profileId,
      onboardingState: "not_started",
      messages: []
    });
  }

  session.messages.push({ role: "user", text });
  const extractedHabits = extractSimpleContext(text);
  session.extractedContext.habits = {
    ...session.extractedContext.habits,
    ...extractedHabits
  };

  if (session.onboardingState === "not_started") {
    session.onboardingState = "in_progress";
  }

  const askedCount = session.messages.filter((m) => m.role === "assistant" && m.metadata?.kind === "onboarding")
    .length;
  const nextQuestion = askedCount < ONBOARDING_QUESTIONS.length ? ONBOARDING_QUESTIONS[askedCount] : null;

  let reply;
  if (nextQuestion) {
    reply = {
      text: `Thanks, that helps. ${nextQuestion}`,
      metadata: { kind: "onboarding", asksFollowUp: true }
    };
  } else {
    session.onboardingState = "completed";
    session.isOnboardingComplete = true;
    const behavior = analyzeBehavior(session.extractedContext.habits || {});
    reply = {
      text: `System infers these behavior patterns: ${
        behavior.patterns.length ? behavior.patterns.join(", ") : "insufficient behavior detail"
      }. Ask anything and I will refine this profile context over time.`,
      metadata: { kind: "summary", asksFollowUp: false }
    };
  }

  session.messages.push({ role: "assistant", text: reply.text, metadata: reply.metadata });
  await session.save();

  const profile = await HealthProfile.findOne({ _id: profileId, userId });
  if (profile) {
    profile.habits = {
      ...profile.habits,
      ...(session.extractedContext.habits || {})
    };
    profile.chatSummary = reply.text;
    await profile.save();
  }

  return {
    sessionId: String(session._id),
    reply: reply.text,
    onboardingState: session.onboardingState,
    asksFollowUp: !!reply.metadata.asksFollowUp
  };
};

export const getChatSession = async ({ userId, profileId }) => {
  const session = await ChatSession.findOne({ userId, profileId }).lean();
  if (!session) {
    return {
      onboardingState: "not_started",
      messages: []
    };
  }
  return {
    onboardingState: session.onboardingState,
    messages: session.messages || []
  };
};

