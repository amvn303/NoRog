import { simulationTemplates } from "./knowledgeBase.js";

const applyToggleAdjustments = ({ toggles, withChange, withoutChange }) => {
  const active = {
    meditation: !!toggles.meditation,
    reduceScreenTime: !!toggles.reduceScreenTime,
    improveSleep: !!toggles.improveSleep
  };
  const enabled = Object.values(active).filter(Boolean).length;

  const compareText =
    enabled === 0
      ? "Risk increased: no protective lifestyle toggles enabled."
      : enabled === 1
      ? "Risk reduced slightly with one lifestyle change."
      : enabled === 2
      ? "Risk reduced meaningfully through combined behavior changes."
      : "Risk reduced strongly through consistent multi-change behavior plan.";

  const withAdjusted = { ...withChange };
  const withoutAdjusted = { ...withoutChange };

  Object.keys(withAdjusted).forEach((key) => {
    if (active.improveSleep) {
      withAdjusted[key] = `${withAdjusted[key]}. Better sleep indicates improved cognitive recovery.`;
      withoutAdjusted[key] = `${withoutAdjusted[key]}. Poor sleep suggests compounding fatigue and stress load.`;
    }
    if (active.reduceScreenTime) {
      withAdjusted[key] = `${withAdjusted[key]}. Lower screen load suggests better attention stability.`;
    }
    if (active.meditation) {
      withAdjusted[key] = `${withAdjusted[key]}. Meditation indicates improved stress regulation.`;
    }
  });

  return { withAdjusted, withoutAdjusted, compareText };
};

export const getSimulation = (condition, behaviors = {}, toggles = {}) => {
  const template = simulationTemplates[condition] || simulationTemplates.default;
  const withChange = { ...template.withChange };
  const withoutChange = { ...template.withoutChange };

  const behaviorRisks = [];
  if (behaviors.screenTime === "high") behaviorRisks.push("high screen exposure");
  if (behaviors.sleepQuality === "poor") behaviorRisks.push("poor sleep");
  if (behaviors.stressLevel === "high") behaviorRisks.push("elevated stress");
  if (behaviors.exerciseFrequency === "none") behaviorRisks.push("low activity");

  const { withAdjusted, withoutAdjusted, compareText } = applyToggleAdjustments({
    toggles,
    withChange,
    withoutChange
  });

  const behaviorContext =
    behaviorRisks.length > 0
      ? `Current behavior context suggests risk amplifiers: ${behaviorRisks.join(", ")}.`
      : "Current behavior context indicates no major accelerators from tracked habits.";

  return {
    condition,
    withChange: {
      "1m": withAdjusted["1m"],
      "1yr": withAdjusted["1yr"],
      "5yr": withAdjusted["5yr"]
    },
    withoutChange: {
      "1m": withoutAdjusted["1m"],
      "1yr": withoutAdjusted["1yr"],
      "5yr": withoutAdjusted["5yr"]
    },
    comparison: compareText,
    behaviorContext,
    disclaimer:
      "This simulation indicates likely trajectories and is not a diagnosis or guaranteed medical outcome."
  };
};

