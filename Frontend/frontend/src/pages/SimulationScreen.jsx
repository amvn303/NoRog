import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { postSimulate } from '../api/client'

const timeframeLabels = {
  '1m': '1 Month',
  '1yr': '1 Year',
  '5yr': '5 Years',
  '10yr': '10 Years'
}

const timeframeIcons = {
  '1m': '📅',
  '1yr': '📆',
  '5yr': '🗓️',
  '10yr': '🏛️'
}

export default function SimulationScreen({ result, behaviors, userContext, activeProfile }) {
  const navigate = useNavigate()
  const [simulation, setSimulation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTimeframe, setActiveTimeframe] = useState('1m')
  const [error, setError] = useState('')
  const [toggles, setToggles] = useState({
    meditation: true,
    reduceScreenTime: true,
    improveSleep: true
  })

  const condition = result?.prediction?.primary

  const fetchSimulation = async () => {
      if (!condition) return
      setLoading(true)
      try {
        const res = await postSimulate({
          userId: userContext?.userId,
          profileId: activeProfile?.id,
          condition,
          behaviors: behaviors || {},
          toggles
        })
        if (res.success) {
          setSimulation(res.data)
        } else {
          setError('Failed to generate simulation.')
        }
      } catch (e) {
        setError('Failed to connect to server.')
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    if (!condition) return
    fetchSimulation()
  }, [condition, behaviors, userContext, activeProfile, toggles])

  if (!condition) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="text-6xl mb-4">🔮</div>
        <h2 className="text-xl font-semibold mb-2">No Condition to Simulate</h2>
        <p className="text-[var(--color-text-secondary)] mb-6">Run an analysis first to simulate outcomes.</p>
        <button onClick={() => navigate('/analyze')} className="btn-primary">Go to Analysis</button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="w-12 h-12 border-3 border-[var(--color-border)] border-t-[var(--color-brand)] rounded-full animate-spin mb-4"></div>
        <p className="text-[var(--color-text-secondary)]">Generating simulation for <span className="text-[var(--color-brand-light)] font-semibold">{condition}</span>...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="text-4xl mb-4">⚠️</div>
        <p className="text-[var(--color-danger)]">{error}</p>
        <button onClick={() => navigate('/analyze')} className="btn-primary mt-4">Try Again</button>
      </div>
    )
  }

  if (!simulation) return null

  const sim = {
    withChange: simulation.withChange,
    withoutChange: simulation.withoutChange
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div>
        <h1 className="text-2xl font-bold mb-1">Future Simulation</h1>
        <p className="text-[var(--color-text-secondary)] text-sm">
          Projected outcomes for <span className="text-[var(--color-brand-light)] font-semibold">{condition}</span>
        </p>
      </div>

      {/* Timeframe Selector */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Object.entries(timeframeLabels).map(([key, label]) => (
          <button key={key} onClick={() => setActiveTimeframe(key)}
                  className={`flex-shrink-0 px-5 py-3 rounded-xl text-sm font-medium border transition-all duration-300 ${
                    activeTimeframe === key
                      ? 'border-[var(--color-brand)] bg-[rgba(108,92,231,0.15)] text-[var(--color-brand-light)] glow-brand'
                      : 'border-[var(--color-border)] bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-light)]'
                  }`}>
            {timeframeIcons[key]} {label}
          </button>
        ))}
      </div>

      {/* Comparison Cards */}
      <div className="glass-card p-4">
        <h3 className="font-semibold mb-3">Try lifestyle changes</h3>
        <div className="flex flex-wrap gap-2">
          <button className={`symptom-chip text-xs ${toggles.meditation ? 'selected' : ''}`} onClick={() => setToggles((t) => ({ ...t, meditation: !t.meditation }))}>Meditation</button>
          <button className={`symptom-chip text-xs ${toggles.reduceScreenTime ? 'selected' : ''}`} onClick={() => setToggles((t) => ({ ...t, reduceScreenTime: !t.reduceScreenTime }))}>Reduce screen time</button>
          <button className={`symptom-chip text-xs ${toggles.improveSleep ? 'selected' : ''}`} onClick={() => setToggles((t) => ({ ...t, improveSleep: !t.improveSleep }))}>Improve sleep</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {/* With Intervention */}
        <div className="glass-card p-6 border-t-4 border-t-[var(--color-success)] animate-fade-in-up stagger-1" style={{ opacity: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(0,184,148,0.15)]">
              <span className="text-xl">✅</span>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-success)]">With Intervention</h3>
              <p className="text-xs text-[var(--color-text-muted)]">Following recommended changes</p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(sim.withChange).map(([tf, text]) => (
              <div key={tf} className={`p-4 rounded-xl transition-all duration-300 ${
                tf === activeTimeframe
                  ? 'bg-[rgba(0,184,148,0.1)] border border-[var(--color-success)] glow-success scale-[1.02]'
                  : 'bg-[var(--color-bg-surface-alt)] border border-transparent opacity-60'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">{timeframeIcons[tf]}</span>
                  <span className="text-xs font-semibold uppercase text-[var(--color-text-muted)]">{timeframeLabels[tf]}</span>
                </div>
                <p className="text-sm text-[var(--color-text-primary)]">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Without Intervention */}
        <div className="glass-card p-6 border-t-4 border-t-[var(--color-danger)] animate-fade-in-up stagger-2" style={{ opacity: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[rgba(225,112,85,0.15)]">
              <span className="text-xl">⚠️</span>
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-danger)]">Without Intervention</h3>
              <p className="text-xs text-[var(--color-text-muted)]">If no changes are made</p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(sim.withoutChange).map(([tf, text]) => (
              <div key={tf} className={`p-4 rounded-xl transition-all duration-300 ${
                tf === activeTimeframe
                  ? 'bg-[rgba(225,112,85,0.1)] border border-[var(--color-danger)] glow-danger scale-[1.02]'
                  : 'bg-[var(--color-bg-surface-alt)] border border-transparent opacity-60'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">{timeframeIcons[tf]}</span>
                  <span className="text-xs font-semibold uppercase text-[var(--color-text-muted)]">{timeframeLabels[tf]}</span>
                </div>
                <p className="text-sm text-[var(--color-text-primary)]">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Behavior Context */}
      {simulation.behaviorContext && (
        <div className="glass-card p-5 border-l-4 border-l-[var(--color-warning)] animate-fade-in-up stagger-3" style={{ opacity: 0 }}>
          <p className="text-sm text-[var(--color-text-secondary)]">
            <span className="text-[var(--color-warning)] font-semibold">📋 Context:</span> {simulation.behaviorContext}
          </p>
          <p className="text-sm text-[var(--color-brand-light)] mt-2">
            <span className="font-semibold">Comparison:</span> {simulation.comparison}
          </p>
        </div>
      )}

      {/* Disclaimer */}
      <div className="text-center text-xs text-[var(--color-text-muted)] py-4">
        ⚕️ {simulation.disclaimer}
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4">
        <button onClick={() => navigate('/results')} className="btn-secondary text-sm">
          ← Back to Results
        </button>
        <button onClick={() => navigate('/profile')} className="btn-primary text-sm">
          📊 View Health Profile
        </button>
      </div>
    </div>
  )
}
