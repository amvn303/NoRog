// ============================================================
// NoRog Knowledge Base — The Brain of the System
// Central intelligence: symptom→condition, behavior→pattern,
// condition→solution (with cause-effect-outcome), simulation templates
// ============================================================

// --- Symptom → Condition Mappings ---
export const symptomConditionMap = {
  // Respiratory
  "cough":            ["Flu", "Cold", "Bronchitis", "Allergies", "COVID-like Illness"],
  "sore throat":      ["Cold", "Flu", "Strep Throat", "Tonsillitis"],
  "runny nose":       ["Cold", "Allergies", "Sinusitis"],
  "sneezing":         ["Cold", "Allergies"],
  "shortness of breath": ["Asthma", "Bronchitis", "Anxiety", "COVID-like Illness"],
  "chest tightness":  ["Asthma", "Anxiety", "GERD"],
  "wheezing":         ["Asthma", "Bronchitis"],

  // Head / Neuro
  "headache":         ["Migraine", "Tension Headache", "Sinusitis", "Stress-Related Disorder", "Dehydration"],
  "dizziness":        ["Dehydration", "Anemia", "Anxiety", "Low Blood Pressure"],
  "brain fog":        ["Stress-Related Disorder", "Sleep Deprivation", "Attention-Related Pattern", "Dehydration"],
  "difficulty concentrating": ["Attention-Related Pattern", "Stress-Related Disorder", "Sleep Deprivation"],
  "memory issues":    ["Stress-Related Disorder", "Sleep Deprivation", "Attention-Related Pattern"],

  // Digestive
  "nausea":           ["GERD", "Food Intolerance", "Migraine", "Anxiety"],
  "stomach pain":     ["GERD", "Gastritis", "Food Intolerance", "IBS"],
  "bloating":         ["IBS", "Food Intolerance", "GERD"],
  "diarrhea":         ["IBS", "Food Intolerance", "Gastritis"],
  "loss of appetite": ["Stress-Related Disorder", "Gastritis", "Depression-Like Pattern"],

  // Musculoskeletal
  "body aches":       ["Flu", "Fibromyalgia", "Stress-Related Disorder"],
  "back pain":        ["Poor Posture Syndrome", "Stress-Related Disorder", "Sedentary Lifestyle Effects"],
  "neck pain":        ["Poor Posture Syndrome", "Tension Headache", "Stress-Related Disorder"],
  "joint pain":       ["Arthritis", "Flu", "Fibromyalgia"],

  // Mental / Behavioral
  "fatigue":          ["Sleep Deprivation", "Anemia", "Depression-Like Pattern", "Stress-Related Disorder", "Sedentary Lifestyle Effects"],
  "insomnia":         ["Sleep Deprivation", "Anxiety", "Stress-Related Disorder"],
  "anxiety":          ["Anxiety", "Stress-Related Disorder"],
  "mood swings":      ["Stress-Related Disorder", "Depression-Like Pattern", "Hormonal Imbalance"],
  "irritability":     ["Stress-Related Disorder", "Sleep Deprivation", "Attention-Related Pattern"],
  "low motivation":   ["Depression-Like Pattern", "Sedentary Lifestyle Effects", "Stress-Related Disorder"],

  // Skin
  "skin rash":        ["Allergies", "Eczema", "Stress-Related Disorder"],
  "acne":             ["Hormonal Imbalance", "Stress-Related Disorder"],
  "dry skin":         ["Dehydration", "Eczema"],

  // General
  "fever":            ["Flu", "COVID-like Illness", "Strep Throat", "Tonsillitis"],
  "chills":           ["Flu", "COVID-like Illness"],
  "sweating":         ["Anxiety", "Hormonal Imbalance", "Flu"],
  "weight gain":      ["Sedentary Lifestyle Effects", "Hormonal Imbalance", "Depression-Like Pattern"],
  "weight loss":      ["Stress-Related Disorder", "Gastritis", "Hyperthyroidism"],
  "frequent urination": ["Dehydration", "Diabetes-Like Pattern"],
  "excessive thirst":  ["Dehydration", "Diabetes-Like Pattern"],
  "eye strain":       ["Digital Eye Strain", "Poor Posture Syndrome", "Attention-Related Pattern"],
  "blurred vision":   ["Digital Eye Strain", "Migraine", "Dehydration"],
};

// All unique symptoms for frontend chip display
export const allSymptoms = Object.keys(symptomConditionMap).sort();

// --- Behavior → Pattern Mappings ---
export const behaviorPatternMap = {
  screenTime: {
    high:   { pattern: "attention-related pattern", detail: "Excessive screen exposure suggests digital overstimulation, which patterns indicate may reduce sustained attention capacity" },
    medium: { pattern: "moderate digital exposure", detail: "Screen usage is within a manageable range but could benefit from periodic breaks" },
    low:    { pattern: "healthy digital habits", detail: "Controlled screen exposure suggests good digital-life balance" }
  },
  sleepQuality: {
    poor:   { pattern: "sleep deprivation pattern", detail: "Poor sleep quality patterns suggest impaired cognitive function, weakened immune response, and elevated stress hormones" },
    fair:   { pattern: "irregular sleep pattern", detail: "Inconsistent sleep suggests room for improvement in sleep hygiene" },
    good:   { pattern: "healthy sleep pattern", detail: "Good sleep quality supports immune function and cognitive performance" }
  },
  focusLevel: {
    low:    { pattern: "attention-related pattern", detail: "Low focus patterns suggest possible overstimulation, stress, or sleep debt affecting executive function" },
    medium: { pattern: "moderate attention pattern", detail: "Focus capacity is variable — may benefit from structured attention exercises" },
    high:   { pattern: "strong attention pattern", detail: "Sustained focus ability suggests good cognitive health" }
  },
  exerciseFrequency: {
    none:   { pattern: "sedentary lifestyle pattern", detail: "No physical activity patterns suggest increased risk of cardiovascular and metabolic concerns" },
    low:    { pattern: "low-activity pattern", detail: "Minimal exercise suggests insufficient physical stimulus for optimal health" },
    moderate: { pattern: "active lifestyle pattern", detail: "Regular exercise supports cardiovascular health and stress management" },
    high:   { pattern: "highly active pattern", detail: "Consistent exercise suggests strong physical health foundation" }
  },
  dietQuality: {
    poor:   { pattern: "poor nutrition pattern", detail: "Low diet quality patterns suggest potential nutrient deficiencies affecting energy and immunity" },
    fair:   { pattern: "inconsistent nutrition", detail: "Diet quality is variable — system infers occasional nutrient gaps" },
    good:   { pattern: "balanced nutrition pattern", detail: "Good dietary habits support overall health maintenance" }
  },
  stressLevel: {
    high:   { pattern: "chronic stress pattern", detail: "Elevated stress patterns suggest cortisol dysregulation, which may affect sleep, immunity, and focus" },
    medium: { pattern: "moderate stress pattern", detail: "Manageable stress levels — system infers coping mechanisms are partially effective" },
    low:    { pattern: "low stress pattern", detail: "Well-managed stress suggests good emotional regulation" }
  }
};

// --- Condition → Solution with Cause-Effect-Outcome ---
export const conditionSolutions = {
  "Flu": {
    solutions: [
      {
        solution: "Rest and Hydration",
        why: ["Allows immune system to focus energy on fighting viral infection", "Prevents dehydration from fever and sweating"],
        effect: ["Reduced symptom severity", "Faster recovery timeline"],
        outcome: ["Full recovery within 7-10 days", "Strengthened immune memory"]
      },
      {
        solution: "Warm fluids and vitamin C intake",
        why: ["Soothes inflamed airways", "Vitamin C supports white blood cell function"],
        effect: ["Reduced throat irritation", "Enhanced immune response"],
        outcome: ["Prevention of secondary infections", "Improved overall resilience"]
      }
    ]
  },
  "Cold": {
    solutions: [
      {
        solution: "Steam inhalation and rest",
        why: ["Loosens mucus in nasal passages", "Rest conserves energy for immune function"],
        effect: ["Clearer breathing", "Reduced congestion"],
        outcome: ["Faster symptom resolution", "Reduced chance of sinusitis"]
      }
    ]
  },
  "Stress-Related Disorder": {
    solutions: [
      {
        solution: "Meditation and mindfulness practice",
        why: ["Activates parasympathetic nervous system", "Reduces cortisol production", "Improves emotional regulation"],
        effect: ["Lower perceived stress", "Improved sleep onset", "Reduced muscle tension"],
        outcome: ["Sustainable stress management", "Improved cognitive function", "Better interpersonal relationships"]
      },
      {
        solution: "Structured daily routine",
        why: ["Reduces decision fatigue", "Creates predictability that calms the nervous system"],
        effect: ["Improved time management", "Reduced overwhelm"],
        outcome: ["Long-term productivity gains", "Reduced anxiety episodes"]
      },
      {
        solution: "Physical exercise (30 min/day)",
        why: ["Releases endorphins and serotonin", "Burns excess cortisol and adrenaline"],
        effect: ["Immediate mood improvement", "Better sleep quality"],
        outcome: ["Chronic stress resilience", "Reduced risk of stress-related illness"]
      }
    ]
  },
  "Attention-Related Pattern": {
    solutions: [
      {
        solution: "Digital detox periods",
        why: ["Reduces dopamine desensitization from constant stimulation", "Allows prefrontal cortex recovery"],
        effect: ["Improved sustained attention", "Reduced urge for constant stimulation"],
        outcome: ["Restored natural attention span", "Better academic/work performance"]
      },
      {
        solution: "Pomodoro technique (focused work intervals)",
        why: ["Trains attention muscle through structured intervals", "Provides regular cognitive breaks"],
        effect: ["Incremental focus improvement", "Reduced mental fatigue"],
        outcome: ["Habitual deep work capacity", "Improved task completion rate"]
      },
      {
        solution: "Reduce short-form content consumption",
        why: ["Short-form content trains brain for rapid context switching", "Erodes capacity for sustained engagement"],
        effect: ["Gradual attention restoration", "Reduced digital dependency"],
        outcome: ["Improved reading comprehension", "Better long-term focus"]
      }
    ]
  },
  "Sleep Deprivation": {
    solutions: [
      {
        solution: "Sleep hygiene protocol",
        why: ["Consistent sleep schedule aligns circadian rhythm", "Dark environment stimulates melatonin production"],
        effect: ["Faster sleep onset", "Deeper sleep cycles"],
        outcome: ["Restored cognitive function", "Improved immune health", "Better emotional regulation"]
      },
      {
        solution: "No screens 1 hour before bed",
        why: ["Blue light suppresses melatonin production", "Stimulating content activates the sympathetic nervous system"],
        effect: ["Improved melatonin release", "Calmer pre-sleep state"],
        outcome: ["Higher quality REM sleep", "Better memory consolidation"]
      }
    ]
  },
  "Anxiety": {
    solutions: [
      {
        solution: "Deep breathing exercises (4-7-8 technique)",
        why: ["Activates vagus nerve", "Shifts from fight-or-flight to rest-and-digest"],
        effect: ["Immediate heart rate reduction", "Reduced panic sensations"],
        outcome: ["Long-term anxiety management skill", "Reduced frequency of anxiety episodes"]
      },
      {
        solution: "Journaling and cognitive reframing",
        why: ["Externalizes anxious thoughts", "Creates distance between self and worries"],
        effect: ["Reduced rumination", "Clearer thought patterns"],
        outcome: ["Improved emotional intelligence", "Better decision making under stress"]
      }
    ]
  },
  "Depression-Like Pattern": {
    solutions: [
      {
        solution: "Regular physical activity",
        why: ["Exercise increases BDNF and serotonin", "Provides sense of accomplishment"],
        effect: ["Improved mood baseline", "Increased energy levels"],
        outcome: ["Reduced depressive symptom intensity", "Improved social engagement"]
      },
      {
        solution: "Social connection and support",
        why: ["Social isolation worsens depressive patterns", "Oxytocin from social bonding improves mood"],
        effect: ["Reduced loneliness", "Increased motivation"],
        outcome: ["Stronger support network", "Improved resilience"]
      }
    ]
  },
  "Sedentary Lifestyle Effects": {
    solutions: [
      {
        solution: "Progressive exercise program",
        why: ["Gradual increase prevents injury", "Builds sustainable habit"],
        effect: ["Improved cardiovascular fitness", "Better posture"],
        outcome: ["Reduced chronic disease risk", "Improved energy and longevity"]
      }
    ]
  },
  "Migraine": {
    solutions: [
      {
        solution: "Identify and avoid triggers",
        why: ["Migraines often have specific triggers (food, light, stress)", "Avoidance reduces episode frequency"],
        effect: ["Fewer migraine episodes", "Reduced reliance on medication"],
        outcome: ["Improved quality of life", "Better daily functioning"]
      }
    ]
  },
  "GERD": {
    solutions: [
      {
        solution: "Dietary modifications and meal timing",
        why: ["Certain foods relax the lower esophageal sphincter", "Eating late increases reflux risk"],
        effect: ["Reduced acid reflux episodes", "Less throat irritation"],
        outcome: ["Improved digestive comfort", "Reduced esophageal damage risk"]
      }
    ]
  },
  "IBS": {
    solutions: [
      {
        solution: "Low-FODMAP diet trial",
        why: ["Reduces fermentable carbohydrates that trigger IBS symptoms", "Identifies specific food sensitivities"],
        effect: ["Reduced bloating and pain", "More predictable digestion"],
        outcome: ["Personalized dietary plan", "Improved digestive health"]
      }
    ]
  },
  "Digital Eye Strain": {
    solutions: [
      {
        solution: "20-20-20 rule",
        why: ["Regular focal distance changes prevent ciliary muscle fatigue", "Reduces tear evaporation from reduced blinking"],
        effect: ["Less eye fatigue", "Reduced headaches"],
        outcome: ["Sustained visual comfort during screen work", "Prevention of chronic eye issues"]
      }
    ]
  },
  "Poor Posture Syndrome": {
    solutions: [
      {
        solution: "Ergonomic workspace setup and stretching",
        why: ["Proper alignment reduces muscle strain", "Regular stretching prevents muscle shortening"],
        effect: ["Reduced neck and back pain", "Improved breathing capacity"],
        outcome: ["Long-term musculoskeletal health", "Improved work endurance"]
      }
    ]
  },
  "Dehydration": {
    solutions: [
      {
        solution: "Structured hydration schedule",
        why: ["Consistent fluid intake prevents dehydration cycles", "Pre-emptive hydration is more effective than reactive"],
        effect: ["Improved cognitive clarity", "Better skin and digestion"],
        outcome: ["Stable energy levels", "Reduced headache frequency"]
      }
    ]
  },
  "Allergies": {
    solutions: [
      {
        solution: "Allergen avoidance and environment control",
        why: ["Reducing exposure limits immune overreaction", "Clean environments reduce trigger concentration"],
        effect: ["Fewer allergic episodes", "Reduced medication need"],
        outcome: ["Better respiratory health", "Improved daily comfort"]
      }
    ]
  },
  "Hormonal Imbalance": {
    solutions: [
      {
        solution: "Lifestyle regulation and stress management",
        why: ["Stress directly impacts hormonal axes", "Sleep and nutrition are key hormone regulators"],
        effect: ["More stable mood and energy", "Improved skin and weight management"],
        outcome: ["Restored hormonal balance over time", "Improved overall well-being"]
      }
    ]
  }
};

// --- Simulation Templates ---
export const simulationTemplates = {
  "Flu": {
    withChange: {
      "1m": "Symptoms fully resolved with proper rest and hydration",
      "1yr": "Strong immune response established, reduced susceptibility",
      "5yr": "Healthy respiratory baseline maintained",
      "10yr": "Robust immune system with good health practices"
    },
    withoutChange: {
      "1m": "Lingering symptoms, possible secondary infection",
      "1yr": "Recurring seasonal illness episodes",
      "5yr": "Weakened immune baseline from repeated illness",
      "10yr": "Chronic susceptibility to respiratory infections"
    }
  },
  "Stress-Related Disorder": {
    withChange: {
      "1m": "Slight reduction in stress indicators, early coping skill development",
      "1yr": "Noticeably improved emotional regulation and sleep quality",
      "5yr": "Stable mental health baseline, resilient stress response",
      "10yr": "Strong psychological resilience, healthy coping as second nature"
    },
    withoutChange: {
      "1m": "No change or slight worsening",
      "1yr": "Chronic stress symptoms, potential burnout indicators",
      "5yr": "Risk of anxiety disorder, cardiovascular strain",
      "10yr": "Significant mental and physical health deterioration"
    }
  },
  "Attention-Related Pattern": {
    withChange: {
      "1m": "Slight improvement in sustained attention tasks",
      "1yr": "Measurably better focus and task completion",
      "5yr": "Stable attention capacity, strong work habits",
      "10yr": "Healthy cognitive baseline, excellent executive function"
    },
    withoutChange: {
      "1m": "No change in attention difficulties",
      "1yr": "Reduced academic/work performance",
      "5yr": "Worsening attention habits, dependency on stimulation",
      "10yr": "Chronic distraction patterns, impaired deep work ability"
    }
  },
  "Sleep Deprivation": {
    withChange: {
      "1m": "Improved sleep onset and duration",
      "1yr": "Restored energy levels and cognitive clarity",
      "5yr": "Healthy circadian rhythm, improved immunity",
      "10yr": "Reduced risk of sleep-related chronic conditions"
    },
    withoutChange: {
      "1m": "Continuing fatigue and cognitive fog",
      "1yr": "Chronic exhaustion, impaired immune function",
      "5yr": "Elevated risk of metabolic and cardiovascular issues",
      "10yr": "Significant health impact from chronic sleep debt"
    }
  },
  "Anxiety": {
    withChange: {
      "1m": "Reduced frequency of anxiety episodes",
      "1yr": "Effective self-management of anxious thoughts",
      "5yr": "Resilient emotional baseline, rare anxiety episodes",
      "10yr": "Strong mental health with robust coping mechanisms"
    },
    withoutChange: {
      "1m": "Persistent anxiety with possible escalation",
      "1yr": "Anxiety interfering with daily functioning",
      "5yr": "Potential development of panic disorder or avoidance behaviors",
      "10yr": "Chronic anxiety with significant quality of life impact"
    }
  },
  "Depression-Like Pattern": {
    withChange: {
      "1m": "Gradual mood improvement, increased engagement",
      "1yr": "Stable mood baseline, restored motivation",
      "5yr": "Strong emotional health, active lifestyle",
      "10yr": "Sustained well-being, purpose-driven life"
    },
    withoutChange: {
      "1m": "Deepening low mood and withdrawal",
      "1yr": "Persistent depressive patterns affecting all life areas",
      "5yr": "Chronic depression risk, social isolation",
      "10yr": "Severe mental health impact requiring intervention"
    }
  },
  "Sedentary Lifestyle Effects": {
    withChange: {
      "1m": "Increased daily movement, slight energy boost",
      "1yr": "Improved cardiovascular fitness and weight management",
      "5yr": "Significantly reduced chronic disease risk",
      "10yr": "Active, healthy lifestyle with strong physical function"
    },
    withoutChange: {
      "1m": "Unchanged low energy and stiffness",
      "1yr": "Weight gain, reduced physical capacity",
      "5yr": "Elevated risk of diabetes, heart disease",
      "10yr": "Chronic health issues from prolonged inactivity"
    }
  },
  "default": {
    withChange: {
      "1m": "Early improvements with consistent intervention",
      "1yr": "Significant symptom reduction and better habits",
      "5yr": "Stable health baseline with sustained practices",
      "10yr": "Long-term health optimization achieved"
    },
    withoutChange: {
      "1m": "Minimal change, symptoms persist",
      "1yr": "Gradual worsening of condition indicators",
      "5yr": "Noticeable health decline in affected areas",
      "10yr": "Chronic patterns with compounding effects"
    }
  }
};

// --- Goal-Based Recommendation Modifiers ---
export const goalModifiers = {
  "study focus": {
    prioritize: ["Digital detox periods", "Pomodoro technique (focused work intervals)", "Reduce short-form content consumption", "Sleep hygiene protocol"],
    additionalTips: [
      "Create a dedicated distraction-free study environment",
      "Use active recall and spaced repetition for better retention",
      "Take 5-minute movement breaks every 25 minutes"
    ]
  },
  "fitness": {
    prioritize: ["Progressive exercise program", "Regular physical activity", "Structured hydration schedule"],
    additionalTips: [
      "Start with 15-minute sessions and gradually increase",
      "Focus on consistency over intensity",
      "Include both cardio and strength training"
    ]
  },
  "stress relief": {
    prioritize: ["Meditation and mindfulness practice", "Deep breathing exercises (4-7-8 technique)", "Journaling and cognitive reframing"],
    additionalTips: [
      "Practice body scan meditation before sleep",
      "Limit caffeine intake, especially after 2 PM",
      "Spend at least 20 minutes in nature daily"
    ]
  },
  "better sleep": {
    prioritize: ["Sleep hygiene protocol", "No screens 1 hour before bed", "Meditation and mindfulness practice"],
    additionalTips: [
      "Maintain consistent wake-up time, even on weekends",
      "Keep bedroom temperature between 60-68°F (15-20°C)",
      "Avoid heavy meals within 3 hours of bedtime"
    ]
  },
  "general wellness": {
    prioritize: [],
    additionalTips: [
      "Maintain a balanced diet with plenty of vegetables and whole grains",
      "Stay socially connected with friends and family",
      "Schedule regular health check-ups"
    ]
  }
};
