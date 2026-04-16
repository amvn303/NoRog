import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function ResultScreen({ result }) {
  const navigate = useNavigate()
  const [expandedSolution, setExpandedSolution] = useState(null)

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="text-6xl mb-4">🩺</div>
        <h2 className="text-xl font-semibold mb-2">No Analysis Results</h2>
        <p className="text-[var(--color-text-secondary)] mb-6">Run an analysis first to see results here.</p>
        <button onClick={() => navigate('/analyze')} className="btn-primary">Go to Analysis</button>
      </div>
    )
  }

  const { prediction, behaviorAnalysis, causeEffectChain, recommendations } = result

  const confidenceColor = prediction.confidence === 'High' ? 'var(--color-success)' :
    prediction.confidence === 'Moderate' ? 'var(--color-warning)' : 'var(--color-danger)'

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analysis Results</h1>
          <p className="text-[var(--color-text-secondary)] text-sm">Based on your symptoms and behavior patterns</p>
        </div>
        <button onClick={() => navigate('/simulation')} className="btn-primary text-sm">
          🔮 Run Simulation
        </button>
      </div>

      {/* Primary Condition Card */}
      <div className="glass-card p-6 glow-brand animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
              Primary Pattern Detected
            </p>
            <h2 className="text-3xl font-bold gradient-text mb-2">{prediction.primary || 'None identified'}</h2>
            {prediction.secondary && prediction.secondary.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="text-xs text-[var(--color-text-muted)]">Also suggests:</span>
                {prediction.secondary.map(s => (
                  <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-bg-surface-alt)] text-[var(--color-text-secondary)] border border-[var(--color-border)]">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-sm font-bold"
                 style={{ background: `rgba(${confidenceColor === 'var(--color-success)' ? '0,184,148' : confidenceColor === 'var(--color-warning)' ? '253,203,110' : '225,112,85'}, 0.15)`,
                          color: confidenceColor }}>
              {prediction.confidence === 'High' ? '🟢' : prediction.confidence === 'Moderate' ? '🟡' : '🔴'}
            </div>
            <span className="mt-2 text-xs font-semibold" style={{ color: confidenceColor }}>
              {prediction.confidence}
            </span>
          </div>
        </div>
        <p className="mt-4 text-sm text-[var(--color-text-secondary)] leading-relaxed">
          {prediction.explanation}
        </p>
      </div>

      {/* Behavior Insights */}
      {behaviorAnalysis && behaviorAnalysis.patterns && behaviorAnalysis.patterns.length > 0 && (
        <div className="glass-card p-6 animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🧠</span> Behavior Insights
          </h3>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4">{behaviorAnalysis.summary}</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {behaviorAnalysis.details?.map((d, i) => (
              <div key={i} className="p-4 rounded-xl bg-[var(--color-bg-surface-alt)] border border-[var(--color-border)]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold uppercase text-[var(--color-text-muted)]">{d.behavior}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    ['high', 'poor', 'none'].includes(d.value) && d.behavior !== 'exerciseFrequency'
                      ? 'bg-[rgba(225,112,85,0.15)] text-[var(--color-danger)]'
                      : d.behavior === 'exerciseFrequency' && ['none', 'low'].includes(d.value)
                      ? 'bg-[rgba(225,112,85,0.15)] text-[var(--color-danger)]'
                      : 'bg-[rgba(0,184,148,0.15)] text-[var(--color-success)]'
                  }`}>{d.value}</span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] capitalize">{d.pattern}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Solutions with Cause-Effect-Outcome */}
      {causeEffectChain && causeEffectChain.length > 0 && (
        <div className="glass-card p-6 animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>💡</span> Solutions & Explanations
          </h3>
          <div className="space-y-3">
            {causeEffectChain.map((item, idx) => (
              <div key={idx} className="rounded-xl border border-[var(--color-border)] overflow-hidden transition-all duration-300">
                <button onClick={() => setExpandedSolution(expandedSolution === idx ? null : idx)}
                        className="w-full px-5 py-4 flex items-center justify-between bg-[var(--color-bg-surface-alt)] hover:bg-[var(--color-bg-surface-hover)] transition-colors text-left">
                  <span className="font-medium">{item.solution}</span>
                  <span className={`text-lg transition-transform duration-200 ${expandedSolution === idx ? 'rotate-180' : ''}`}>
                    ▾
                  </span>
                </button>
                {expandedSolution === idx && (
                  <div className="px-5 py-4 space-y-4 bg-[var(--color-bg-surface)] animate-fade-in">
                    <div>
                      <h4 className="text-xs font-semibold uppercase text-[var(--color-brand-light)] mb-2">🔗 Why This Works</h4>
                      <ul className="space-y-1">
                        {item.why.map((w, i) => (
                          <li key={i} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                            <span className="text-[var(--color-brand)] mt-0.5">•</span> {w}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase text-[var(--color-accent)] mb-2">⚡ Expected Effect</h4>
                      <ul className="space-y-1">
                        {item.effect.map((e, i) => (
                          <li key={i} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                            <span className="text-[var(--color-accent)] mt-0.5">•</span> {e}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold uppercase text-[var(--color-success)] mb-2">🎯 Long-Term Outcome</h4>
                      <ul className="space-y-1">
                        {item.outcome.map((o, i) => (
                          <li key={i} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                            <span className="text-[var(--color-success)] mt-0.5">•</span> {o}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Context-Aware Recommendations */}
      {recommendations && (
        <div className="glass-card p-6 animate-fade-in-up stagger-4" style={{ opacity: 0 }}>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>🧾</span> Personalized Recommendations
            <span className="text-xs px-2 py-1 rounded-full bg-[rgba(108,92,231,0.15)] text-[var(--color-brand-light)]">
              Goal: {recommendations.goal}
            </span>
          </h3>

          {/* Behavior-specific recommendations */}
          {recommendations.behaviorRecommendations?.length > 0 && (
            <div className="mb-4">
              <h4 className="text-xs font-semibold uppercase text-[var(--color-text-muted)] mb-3">Based on Your Behaviors</h4>
              <div className="space-y-2">
                {recommendations.behaviorRecommendations.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-[var(--color-bg-surface-alt)]">
                    <span className={`mt-0.5 text-xs px-2 py-0.5 rounded-full font-semibold ${
                      r.priority === 'high' ? 'bg-[rgba(225,112,85,0.15)] text-[var(--color-danger)]' : 'bg-[rgba(253,203,110,0.15)] text-[var(--color-warning)]'
                    }`}>{r.priority}</span>
                    <div>
                      <p className="text-sm font-medium">{r.recommendation}</p>
                      <p className="text-xs text-[var(--color-text-muted)] mt-1">{r.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Goal-specific tips */}
          {recommendations.goalSpecificTips?.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase text-[var(--color-text-muted)] mb-3">Tips for Your Goal</h4>
              <ul className="space-y-2">
                {recommendations.goalSpecificTips.map((tip, i) => (
                  <li key={i} className="text-sm text-[var(--color-text-secondary)] flex items-start gap-2">
                    <span className="text-[var(--color-accent)]">💡</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Confidence Footer */}
      <div className="glass-card p-4 text-center animate-fade-in-up stagger-5" style={{ opacity: 0 }}>
        <p className="text-xs text-[var(--color-text-muted)]">
          ⚕️ {result.explanation}
        </p>
      </div>
    </div>
  )
}
