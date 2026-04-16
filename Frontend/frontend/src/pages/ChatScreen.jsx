import { useEffect, useState } from "react";
import { postChatMessage, getChatSession, postPredict } from "../api/client";
import { useNavigate } from "react-router-dom";

const parseSymptoms = (text) => {
  if (!text) return [];
  return text
    .split(/[,\n]/)
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
};

export default function ChatScreen({ userContext, activeProfile, onResult }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [symptomsInput, setSymptomsInput] = useState("");
  const [goal, setGoal] = useState("general wellness");
  const [behaviors, setBehaviors] = useState({
    screenTime: "",
    sleepQuality: "",
    focusLevel: "",
    exerciseFrequency: "",
    dietQuality: "",
    stressLevel: ""
  });

  useEffect(() => {
    const loadChat = async () => {
      if (!userContext?.userId || !activeProfile?.id) return;
      const res = await getChatSession({ userId: userContext.userId, profileId: activeProfile.id });
      if (res.success) {
        setMessages(res.data.messages || []);
      }
    };
    loadChat();
  }, [userContext, activeProfile]);

  const sendMessage = async () => {
    if (!text.trim() || !userContext?.userId || !activeProfile?.id) return;
    setLoading(true);
    try {
      const res = await postChatMessage({
        userId: userContext.userId,
        profileId: activeProfile.id,
        text
      });
      if (res.success) {
        setMessages((prev) => [
          ...prev,
          { role: "user", text },
          { role: "assistant", text: res.data.reply }
        ]);
      }
      setText("");
    } finally {
      setLoading(false);
    }
  };

  const runPrediction = async () => {
    const symptoms = parseSymptoms(symptomsInput);
    if (!symptoms.length || !userContext?.userId || !activeProfile?.id) return;
    setLoading(true);
    try {
      const cleanBehaviors = Object.fromEntries(Object.entries(behaviors).filter(([, v]) => v));
      const res = await postPredict({
        userId: userContext.userId,
        profileId: activeProfile.id,
        symptoms,
        behaviors: cleanBehaviors,
        goal
      });
      if (res.success) {
        onResult(res.data, cleanBehaviors);
        navigate("/results");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">AI Health Chat</h1>
        <p className="text-[var(--color-text-secondary)] text-sm">
          Conversational onboarding and ongoing context for {activeProfile?.displayName || "profile"}.
        </p>
      </div>

      <div className="glass-card p-4 h-[360px] overflow-y-auto space-y-3">
        {messages.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)]">
            Start by sharing health history, current symptoms, lifestyle, and goals.
          </p>
        ) : (
          messages.map((m, idx) => (
            <div key={idx} className={`p-3 rounded-xl text-sm ${m.role === "user" ? "bg-[var(--color-bg-surface-alt)]" : "bg-[rgba(108,92,231,0.12)]"}`}>
              <span className="font-semibold mr-2">{m.role === "user" ? "You:" : "Assistant:"}</span>
              {m.text}
            </div>
          ))
        )}
      </div>

      <div className="glass-card p-4 space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
          className="w-full bg-[var(--color-bg-surface-alt)] border border-[var(--color-border)] rounded-xl p-3 text-sm"
          rows={3}
        />
        <button className="btn-primary" onClick={sendMessage} disabled={loading || !text.trim()}>
          Send message
        </button>
      </div>

      <div className="glass-card p-4 space-y-3">
        <h2 className="font-semibold">Generate prediction from chat context</h2>
        <textarea
          value={symptomsInput}
          onChange={(e) => setSymptomsInput(e.target.value)}
          placeholder="Symptoms (comma separated): e.g. fatigue, insomnia, anxiety"
          className="w-full bg-[var(--color-bg-surface-alt)] border border-[var(--color-border)] rounded-xl p-3 text-sm"
          rows={2}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <select value={behaviors.screenTime} onChange={(e) => setBehaviors((b) => ({ ...b, screenTime: e.target.value }))} className="bg-[var(--color-bg-surface-alt)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-sm">
            <option value="">Screen time</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select value={behaviors.sleepQuality} onChange={(e) => setBehaviors((b) => ({ ...b, sleepQuality: e.target.value }))} className="bg-[var(--color-bg-surface-alt)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-sm">
            <option value="">Sleep quality</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
          <select value={behaviors.stressLevel} onChange={(e) => setBehaviors((b) => ({ ...b, stressLevel: e.target.value }))} className="bg-[var(--color-bg-surface-alt)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-sm">
            <option value="">Stress level</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <select value={goal} onChange={(e) => setGoal(e.target.value)} className="bg-[var(--color-bg-surface-alt)] border border-[var(--color-border)] rounded-xl px-3 py-2 text-sm">
          <option value="general wellness">General wellness</option>
          <option value="study focus">Study focus</option>
          <option value="fitness">Fitness</option>
          <option value="stress relief">Stress relief</option>
          <option value="better sleep">Better sleep</option>
        </select>
        <button className="btn-primary" onClick={runPrediction} disabled={loading || !symptomsInput.trim()}>
          Analyze now
        </button>
      </div>
    </div>
  );
}

